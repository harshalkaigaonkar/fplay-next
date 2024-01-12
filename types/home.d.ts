import { MutableRefObject } from "react";
import { AuthUserType, SocketClientType } from "types";

export type HomeProps = {
    session?: AuthUserType|any,
    audioElement: MutableRefObject<HTMLAudioElement|null>
  };