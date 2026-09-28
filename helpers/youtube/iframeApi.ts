let apiReady: Promise<typeof YT> | null = null;

export const loadYouTubeIframeApi = (): Promise<typeof YT> => {
	if (apiReady) return apiReady;
	apiReady = new Promise((resolve) => {
		if (window.YT?.Player) return resolve(window.YT);
		const previousCallback = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = () => {
			previousCallback?.();
			resolve(window.YT as typeof YT);
		};
		const script = document.createElement('script');
		script.src = 'https://www.youtube.com/iframe_api';
		script.async = true;
		document.head.appendChild(script);
	});
	return apiReady;
};
