export { default } from 'next-auth/middleware';

export const config = {
	matcher: ['/api/((?!auth|room/public_rooms)*)'],
};
