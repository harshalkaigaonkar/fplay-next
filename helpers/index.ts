import axios from 'axios';

export const axiosGet = async (url: string) => {
	// majorly used for Saavn APIs
	const res = await axios.get(url);
	if (res.data) return res.data;
	return 'Failed';
};

export const ramdomEmojiText = (): string => {
	const emojis: string[] = [':fire:', ':wave:'];
	const index = Math.floor(Math.random() * emojis.length);
	return emojis[index];
};

export const genrateCustomId = (): string => {
	const characters = 'abcdefghijklmnopqrstuvwxyz-0123456789';
	let uniqueString = '';

	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		uniqueString += characters[randomIndex];
	}

	return uniqueString;
};

export const secToMin = (sec: number): string => {
	return `${Math.floor(sec / 60)}:${Math.ceil(sec % 60).toLocaleString(
		'en-US',
		{
			minimumIntegerDigits: 2,
			useGrouping: false,
		},
	)}`;
};
// DOMParser documents never run scripts or load images, unlike innerHTML on a live element.
export const decodeHTMLContent = (htmlText: string) =>
	new DOMParser().parseFromString(htmlText, 'text/html').body.textContent ??
	'';
