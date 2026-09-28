// Minimal typings for the YouTube IFrame Player API (https://developers.google.com/youtube/iframe_api_reference).
declare namespace YT {
	interface Player {
		playVideo(): void;
		pauseVideo(): void;
		stopVideo(): void;
		seekTo(seconds: number, allowSeekAhead: boolean): void;
		loadVideoById(options: {
			videoId: string;
			startSeconds?: number;
		}): void;
		cueVideoById(options: { videoId: string; startSeconds?: number }): void;
		getCurrentTime(): number;
		getPlayerState(): number;
		mute(): void;
		unMute(): void;
		destroy(): void;
	}
	interface PlayerEvent {
		target: Player;
		data: number;
	}
	interface PlayerOptions {
		width?: string | number;
		height?: string | number;
		playerVars?: Record<string, string | number>;
		events?: {
			onReady?: (event: PlayerEvent) => void;
			onStateChange?: (event: PlayerEvent) => void;
			onError?: (event: PlayerEvent) => void;
		};
	}
	const Player: new (element: HTMLElement, options: PlayerOptions) => Player;
	const PlayerState: {
		UNSTARTED: -1;
		ENDED: 0;
		PLAYING: 1;
		PAUSED: 2;
		BUFFERING: 3;
		CUED: 5;
	};
}

interface Window {
	YT?: typeof YT;
	onYouTubeIframeAPIReady?: () => void;
}
