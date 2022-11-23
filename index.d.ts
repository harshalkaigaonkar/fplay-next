export interface ServerToClientEvents {
 noArg: () => void;
 basicEmit: (a: number, b: string, c: Buffer) => void;
 withAck: (d: string, callback: (e: number) => void) => void;
 'ser': (any) => void;
}

export type ClientToServerEvents = {
 'connect-to-server': (any) => void;
 'connect-to-client': (any) => void;
 'ser': (any) => void;
}

export interface InterServerEvents {
 ping: () => void;
}

export interface SocketData {
 name: string;
 age: number;
}

export type Data = {
 name: string
}

export type ServerSocketData = Data | string 

export type SocketClientType = Socket<
ServerToClientEvents,
ClientToServerEvents
>