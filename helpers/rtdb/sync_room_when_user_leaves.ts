// using fetch here for API call with keepalive flag as this will be called when closing roomPage
export default async function (props: { userId: string }) {
	try {
		const { data } = await fetch(
			`${process.env.NEXTAUTH_URL ?? ''}/api/rtdb/sync_room_when_user_leaves`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(props),
				keepalive: true,
			},
		).then((data) => data.json());
		return data;
	} catch (error: any) {
		return error.response;
	}
}
