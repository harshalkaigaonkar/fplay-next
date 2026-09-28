import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AudioPlayer from './player';
import { positionAt } from 'helpers/playback';
import { serverNow } from 'helpers/roomClock';
import { loadYouTubeIframeApi } from 'helpers/youtube/iframeApi';
import { useSocket } from 'hooks/useSocket';
import {
	onUpdateTime,
	selectCurrentTrack,
	selectPlayback,
} from 'redux/slice/playerSlice';

// A listener further than this from the room clock jumps back into place.
const MAX_DRIFT_SECONDS = 0.75;
const SYNC_INTERVAL_MS = 1000;
// Avoid seeking again while the last seek is still buffering.
const SEEK_COOLDOWN_MS = 2000;
// After this many failed play() attempts the browser is blocking autoplay.
const AUTOPLAY_BLOCKED_TICKS = 3;

const PLAYING = 1;
const BUFFERING = 3;
const ENDED = 0;

const RoomPlayer: FC = () => {
	const playback = useSelector(selectPlayback);
	const track = useSelector(selectCurrentTrack);
	const socket = useSocket();
	const dispatch = useDispatch();

	const holderRef = useRef<HTMLDivElement | null>(null);
	const playerRef = useRef<YT.Player | null>(null);
	const playbackRef = useRef(playback);
	const trackRef = useRef(track);
	const loadedVideoId = useRef<string | null>(null);
	const endedReportedFor = useRef<string | null>(null);
	const lastSeekAt = useRef(0);
	const failedPlayTicks = useRef(0);

	const [ready, setReady] = useState(false);
	const [needsTap, setNeedsTap] = useState(false);
	const [muted, setMuted] = useState(false);

	playbackRef.current = playback;
	trackRef.current = track;

	const targetPosition = useCallback(() => {
		const position = positionAt(playbackRef.current, serverNow());
		const duration = trackRef.current?.duration ?? position;
		return Math.max(0, Math.min(position, duration));
	}, []);

	const reportEnded = useCallback(() => {
		const id = loadedVideoId.current;
		if (!id || endedReportedFor.current === id) return;
		endedReportedFor.current = id;
		socket.emit('track-ended', { trackId: id });
	}, [socket]);

	useEffect(() => {
		let cancelled = false;
		loadYouTubeIframeApi().then((YTApi) => {
			if (cancelled || !holderRef.current) return;
			// The API replaces its target element with an iframe, so give it one React doesn't own.
			const target = document.createElement('div');
			holderRef.current.appendChild(target);
			playerRef.current = new YTApi.Player(target, {
				width: '100%',
				height: '100%',
				playerVars: {
					controls: 0,
					disablekb: 1,
					playsinline: 1,
					rel: 0,
					fs: 0,
					iv_load_policy: 3,
				},
				events: {
					onReady: () => setReady(true),
					onStateChange: (event) => {
						if (event.data === ENDED) reportEnded();
					},
					// Unplayable video (removed, region-locked, embedding off): move the room on.
					onError: () => reportEnded(),
				},
			});
		});
		return () => {
			cancelled = true;
			playerRef.current?.destroy();
			playerRef.current = null;
		};
	}, [reportEnded]);

	useEffect(() => {
		const player = playerRef.current;
		if (!ready || !player) return;
		const id = playback.currentSongId;
		if (!id) {
			player.stopVideo();
			loadedVideoId.current = null;
			return;
		}
		if (loadedVideoId.current === id) return;
		loadedVideoId.current = id;
		endedReportedFor.current = null;
		const startSeconds = targetPosition();
		if (playbackRef.current.paused)
			player.cueVideoById({ videoId: id, startSeconds });
		else player.loadVideoById({ videoId: id, startSeconds });
		lastSeekAt.current = Date.now();
	}, [ready, playback.currentSongId, targetPosition]);

	useEffect(() => {
		if (!ready) return;
		const tick = () => {
			const player = playerRef.current;
			const current = playbackRef.current;
			if (!player || !current.currentSongId) return;
			if (loadedVideoId.current !== current.currentSongId) return;

			const target = targetPosition();
			const state = player.getPlayerState();
			const position = player.getCurrentTime() || 0;
			const canSeek = Date.now() - lastSeekAt.current > SEEK_COOLDOWN_MS;
			const seek = () => {
				player.seekTo(target, true);
				lastSeekAt.current = Date.now();
			};

			dispatch(onUpdateTime(current.paused ? target : position));

			if (current.paused) {
				failedPlayTicks.current = 0;
				setNeedsTap(false);
				if (state === PLAYING || state === BUFFERING)
					player.pauseVideo();
				if (Math.abs(position - target) > 1 && canSeek) seek();
				return;
			}

			if (state === ENDED) return;

			if (state !== PLAYING && state !== BUFFERING) {
				player.playVideo();
				failedPlayTicks.current += 1;
				if (failedPlayTicks.current >= AUTOPLAY_BLOCKED_TICKS)
					setNeedsTap(true);
				return;
			}

			failedPlayTicks.current = 0;
			setNeedsTap(false);
			if (
				state === PLAYING &&
				Math.abs(position - target) > MAX_DRIFT_SECONDS &&
				canSeek
			)
				seek();
		};
		tick();
		const interval = setInterval(tick, SYNC_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [ready, dispatch, targetPosition]);

	const onStartListening = () => {
		const player = playerRef.current;
		if (!player) return;
		player.seekTo(targetPosition(), true);
		player.playVideo();
		failedPlayTicks.current = 0;
		setNeedsTap(false);
	};

	const onToggleMute = () => {
		const player = playerRef.current;
		if (!player) return;
		if (muted) player.unMute();
		else player.mute();
		setMuted(!muted);
	};

	return (
		<div className='w-full h-full'>
			<AudioPlayer
				currentTrack={track}
				muted={muted}
				onToggleMute={onToggleMute}
				videoSlot={
					<div className='relative w-full aspect-video max-w-[28rem] rounded-2xl overflow-hidden bg-black'>
						<div
							ref={holderRef}
							className='absolute inset-0'
						/>
						{needsTap && (
							<button
								type='button'
								onClick={onStartListening}
								className='absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-white text-lg font-bold border-none cursor-pointer'>
								Tap to start listening
							</button>
						)}
					</div>
				}
			/>
		</div>
	);
};

export default RoomPlayer;
