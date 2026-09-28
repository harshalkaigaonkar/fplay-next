import type { Profile } from 'next-auth';
import 'utils/connect-db';
import User from 'models/User';
import Room from 'models/Room';
import 'models/Genre';

// getServerSideProps props must be plain JSON, not mongoose documents.
const toPlain = <T>(doc: T): T => JSON.parse(JSON.stringify(doc));

type GoogleProfile = Profile & {
	given_name?: string;
	family_name?: string;
	picture?: string;
};

export const findOrCreateUser = async (profile: GoogleProfile) => {
	const { email, name, given_name, family_name, picture } = profile;

	if (!email) return null;

	const existingUser = await User.findOne({ email });

	if (existingUser) return existingUser;

	const usernameBase = [given_name, family_name]
		.filter(Boolean)
		.join('')
		.toLowerCase();

	return User.create({
		name: name ?? usernameBase,
		username: `@${usernameBase || email.split('@')[0]}${Math.floor(Math.random() * 50)}`,
		email,
		profile_pic: picture,
	});
};

export const getUserByEmail = async (email: string) => {
	const user = await User.findOne({ email });
	return user ? toPlain(user) : null;
};

export const getRoomBySlug = async (roomSlug: string) => {
	const room = await Room.findOne({ room_slug: roomSlug }).populate(
		'owned_by upvotes genres',
	);
	return room ? toPlain(room) : null;
};
