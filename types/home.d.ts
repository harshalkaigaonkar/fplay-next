import { AuthUserType, SocketClientType } from "types";

export type HomeProps = {
    socket?: SocketClientType,
    session?: AuthUserType|any
  };