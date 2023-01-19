import { AuthUserType, SocketClientType } from "types";

export type HomeProps = {
    socket?: SocketClientType,
    session?: AuthUserType|any
    currentIndex?: number // should be removed when redux state is introduced
    setCurrentIndex?: any // should be removed when redux state is introduced
    paused?: boolean // should be removed when redux state is introduced
    setPaused?: any // should be removed when redux state is introduced
  };