import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "types"
import redisManager, {client} from 'cache'

type ConnectedUser = {user_id: string, socket_id: string}


const socketManager = async (_res: any) => {
  if(_res.socket.server.io) {
   console.log("Socket already initialised.");
   return;
  }
  
  const _io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
     _res.socket.server,
     {
      cors:{
        origin: `${process.env.NODE_ENV === 'production' ? `/` : `http://localhost:3000`}`,
      }
     }
   );
  
    _res.socket.server.io = _io

    _io.on('connection', (_socket) => {
      console.log("new Socket Client Connected", _socket.id)
      _socket.on("connect-to-join-room", async (res: any) => {
        const {user, room, player} = res;
        // client joins the room.
        _socket.join(`room:${room.room_slug}`);
        console.log(`user ${_socket.id} has joined ${room.room_slug}`)
        // socketClient - roomId relation
        await client.json.set(`user:${_socket.id}`, "$", `room:${room.room_slug}`)
        let roomCache = await client.json.get(`room:${room.room_slug}`);
        if(!roomCache) {
          // if no rrom exists, create one.
          roomCache = await client.json.set(`room:${room.room_slug}`, "$", {
            // active: true, - as anyone joins, room automatically gets active.
            ...player,
            users_connected: [],
            room: {
              ...Object.fromEntries(Object.entries(room).filter(([item]) => ["_id", "room_slug"].includes(item))),
              owned_by: room.owned_by._id
            }
          })
        }
        // append user's connection in the room.
        await client.json.arrAppend(`room:${room.room_slug}`, ".users_connected", {
          socket_id: _socket.id,
          user_id: user._id
        })
        // getting updated room cache.
        roomCache = await client.json.get(`room:${room.room_slug}`);
        _socket.emit("sync-room-with-redis", roomCache)
      })

      _socket.on("disconnect", async () => {
        console.log(_socket.id + " left")
        const room: string|null|any = await client.json.get(`user:${_socket.id}`);
        let left_user: string|ConnectedUser|any = _socket.id;
        if(room) {
          const {users_connected}: any = await client.json.get(room);
          left_user = await client.json.arrPop(room, ".users_connected", users_connected.findIndex((item: ConnectedUser) => item.socket_id === _socket.id))
          await client.json.del(`user:${_socket.id}`);
        }
        // console.log("left_user", left_user)
        _socket.emit("leaves-room", left_user)
      })
    })

}

export default socketManager 