import { axiosGet } from 'helpers';

export const fetchSongsThroughSearchQuery = async (
	query: string,
	page: number = 1,
	entries = 50,
) => {
	try {
		const res = await axiosGet(
			`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/search/songs?query=${query.replaceAll(' ', '+')}&page=${page}&limit=${entries}`,
		);
		if (res !== 'Failed') return res.data;
		return 'Failed';
	} catch (err: any) {
		return err.message;
	}
};

export const fetchSongObj = async (id: string) => {
	try {
		if (id === '') return 'Invalid Id!!';
		const res = await axiosGet(
			`${process.env.NEXT_PUBLIC_MUSIC_BASEURL}/songs?id=${id}`,
		);
		if (res.data[0]) return res.data[0];
		return 'Something went wrong!!';
	} catch (error: any) {
		return error.message;
	}
};
