import { SocketClientType } from 'types';

let serverOffsetMs = 0;

const measureOnce = (socket: SocketClientType) =>
	new Promise<{ offset: number; roundTrip: number } | null>((resolve) => {
		const sentAt = Date.now();
		socket.timeout(3000).emit('time-sync', ((
			error: Error | null,
			serverNow: number,
		) => {
			if (error || typeof serverNow !== 'number') return resolve(null);
			const receivedAt = Date.now();
			const roundTrip = receivedAt - sentAt;
			resolve({
				roundTrip,
				offset: serverNow + roundTrip / 2 - receivedAt,
			});
		}) as any);
	});

// NTP-style: the sample with the shortest round trip gives the most accurate offset.
export const syncClock = async (socket: SocketClientType) => {
	const samples = [];
	for (let i = 0; i < 5; i++) {
		const sample = await measureOnce(socket);
		if (sample) samples.push(sample);
	}
	if (samples.length === 0) return;
	samples.sort((a, b) => a.roundTrip - b.roundTrip);
	serverOffsetMs = samples[0].offset;
};

export const serverNow = () => Date.now() + serverOffsetMs;
