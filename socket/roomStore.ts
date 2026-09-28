import { WatchError } from 'redis';
import { client } from 'cache';
import { RoomState } from 'types';

const roomKey = (slug: string) => `fplay:room:${slug}`;

export const getRoomState = async (slug: string) => {
	const raw = await client.get(roomKey(slug));
	return raw ? (JSON.parse(raw) as RoomState) : null;
};

/**
 * Read-change-write in one Redis transaction (WATCH/MULTI), retried if another
 * handler wrote the room in between. `change` returns undefined for "no change".
 */
export const updateRoomState = async (
	slug: string,
	change: (state: RoomState | null) => RoomState | undefined,
): Promise<{ state: RoomState | null; changed: boolean }> => {
	const key = roomKey(slug);
	for (let attempt = 0; attempt < 8; attempt++) {
		try {
			return await client.executeIsolated(async (isolated) => {
				await isolated.watch(key);
				const raw = await isolated.get(key);
				const current = raw ? (JSON.parse(raw) as RoomState) : null;
				const next = change(current);
				if (!next) {
					await isolated.unwatch();
					return { state: current, changed: false };
				}
				await isolated.multi().set(key, JSON.stringify(next)).exec();
				return { state: next, changed: true };
			});
		} catch (error) {
			if (!(error instanceof WatchError)) throw error;
		}
	}
	throw new Error(`Room ${slug} is busy, please try again.`);
};
