import { MutableRefObject } from 'react';
import { AuthUserType, MongooseUserTypes, SocketClientType } from 'types';

export type HomeProps = {
	session?: AuthUserType | any;
	audioElement: MutableRefObject<HTMLAudioElement | null>;
	user?: MongooseUserTypes;
};
