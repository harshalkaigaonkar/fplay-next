import React, {
	FC,
	SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { HomeProps } from 'types/home';
import AudioPlayer from './player';
import { secToMin } from 'helpers';
import { useSelector } from 'react-redux';
import {
	onChangeNextSongFromQueue,
	onSetPause,
	onSetPlay,
	onUpdateTime,
	selectCurrentSongId,
	selectPaused,
	selectSongsQueue,
	selectTime,
} from 'redux/slice/playerSlice';
import { useDispatch } from 'react-redux';
import { SaavnSongObjectTypes } from 'types';
import { selectRoomInfo } from 'redux/slice/roomSlice';
import { debounce } from 'lodash';

const AudioProvider: FC<HomeProps> = ({ audioElement, user }) => {
	const songsQueue = useSelector(selectSongsQueue);
	const currentSongId = useSelector(selectCurrentSongId);
	const paused = useSelector(selectPaused);
	const room = useSelector(selectRoomInfo);
	const time = useSelector(selectTime);

	const dispatch = useDispatch();

	const [currentTrack, setCurrentTrack] =
		useState<SaavnSongObjectTypes | null>(null);
	const isSeeking = useRef<boolean>(false);

	useEffect(() => {
		if (audioElement.current && !paused) {
			audioElement.current.play();
		}
		if (currentSongId !== '')
			setCurrentTrack(
				songsQueue.find(
					(item: SaavnSongObjectTypes) => item.id === currentSongId,
				),
			);

		return () => {
			if (audioElement.current)
				// eslint-disable-next-line react-hooks/exhaustive-deps
				audioElement.current.load();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioElement, currentTrack, currentSongId]);

	const loadedMetaDataHandler = (element: any) => {
		// const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
		dispatch(onUpdateTime(element.target.currentTime));
		element.target.currentTime = time;
		console.log('loggedd here too', time);
	};

	const endedHandler = () => {
		dispatch(onChangeNextSongFromQueue());
		// socket.emit('on-current-song-change-next', {
		// 	room_id: room.room_slug,
		// });
	};

	const timeUpdateHandler = (element: any) => {
		// shows realtime currentTime for the Audio used for redis, will not broadcast every change
		dispatch(onUpdateTime(Math.floor(element.target.currentTime)));
		debounceUpdateTime(element.target.currentTime, isSeeking.current);
	};
	const setDebounceSeekingFalse = useCallback(
		debounce(() => {
			isSeeking.current = false;
		}, 300),
		[],
	);
	const seekedHandler = () => {
		isSeeking.current = true;
		setDebounceSeekingFalse();
	};

	const debounceUpdateTime = useCallback(
		debounce((time, broadcast = false) => {
			// socket.emit('on-seek-current-song', {
			// 	room_id: room.room_slug,
			// 	time,
			// 	user_id: user?._id ?? '',
			// 	broadcast,
			// });
		}, 200),
		[],
	);

	const playingHandler = useCallback(
		debounce(() => {
			// socket.emit('on-play-current-song', {
			// 	room_id: room.room_slug,
			// 	user_id: user?._id ?? '',
			// });
			dispatch(onSetPlay());
		}, 300),
		[],
	);

	const pauseHandler = useCallback(
		debounce((element: any) => {
			if (element.target.currentTime !== element.target.duration) {
				dispatch(onSetPause());
				// socket.emit('on-pause-current-song', {
				// 	room_id: room.room_slug,
				// 	user_id: user?._id ?? '',
				// });
			}
		}, 300),
		[],
	);

	return (
		<div className='w-full h-full'>
			{currentTrack ? (
				<>
					<AudioPlayer
						currentTrack={currentTrack}
						audioElement={audioElement}
					/>
					<audio
						id='audio'
						className='invisible'
						controls
						autoPlay={!paused}
						onLoadedMetadata={loadedMetaDataHandler}
						onSeeked={seekedHandler}
						onPlaying={playingHandler}
						onPause={pauseHandler}
						onEnded={endedHandler}
						onTimeUpdate={timeUpdateHandler}
						ref={audioElement}>
						<source
							src={currentTrack.downloadUrl[3].link}
							type='audio/mp4'
						/>
						{/* {songsQueue.map((song: SaavnSongObjectTypes) => (
                <>
                  <source src={song.downloadUrl[3].link} type="audio/mp4" />
                </>
              ))} */}
					</audio>
				</>
			) : (
				<AudioPlayer />
			)}
		</div>
	);
};

export default AudioProvider;
