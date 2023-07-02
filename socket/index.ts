import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "types"
import redisManager, {client} from 'cache'

type ConnectedUser = {
  user_id: string, 
  socket_id: string, 
  name: string,
  email: string, 
  username: string, 
  profile_pic: string
}


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

      // connection and disconnnect socket event handlers

      _socket.on("connect-to-join-room", async (res: any) => {
        const {user, room} = res;
        // client joins the room.
        _socket.join(`room:${room.room_slug}`);
        // socketClient - roomId relation
        await client.json.set(`user:${_socket.id}`, "$", `room:${room.room_slug}`)
        let roomCache = await client.json.get(`room:${room.room_slug}`);
        let new_room_created: boolean = false;
        if(!roomCache) {
          // if no rrom exists, create one.
          roomCache = await client.json.set(`room:${room.room_slug}`, "$", {
            // active: true, - as anyone joins, room automatically gets active.
            songsQueue: [],
            currentSongId: null,
            paused: true,
            time: 0,
            users_connected: [],
            room: {
              ...Object.fromEntries(Object.entries(room).filter(([item]) => ["_id", "room_slug"].includes(item))),
              owned_by: room.owned_by._id
            }
          })
          new_room_created = true;
        }
        const new_user_connection = {
          socket_id: _socket.id,
          user_id: user._id,
          ...Object.fromEntries(Object.entries(user).filter(([item]) => !["_id", "createdAt", "updatedAt", "library", "__v"].includes(item)))
        };
        // append user's connection in the room.
        await client.json.arrAppend(`room:${room.room_slug}`, ".users_connected", new_user_connection)
        // getting updated room cache.
        roomCache = await client.json.get(`room:${room.room_slug}`);
        const {
          songsQueue,
          currentSongId,
          paused,
          time,
          users_connected
        } = roomCache as any;

        // response emits to client
        _socket.emit("sync-player-with-redis", {
          songsQueue,
          currentSongId,
          paused,
          time,
        })
        _io.to(`room:${room.room_slug}`).emit("sync-room-users-with-redis", users_connected)
      }) 

      _socket.on("disconnect", async () => {
        const room: string|null|any = await client.json.get(`user:${_socket.id}`);
        let left_user: string|ConnectedUser|any = _socket.id;
        if(room) {
          const {users_connected}: any = await client.json.get(room);
          left_user = await client.json.arrPop(room, ".users_connected", users_connected.findIndex((item: ConnectedUser) => item.socket_id === _socket.id));
          if(users_connected.length === 1)
          await Promise.all([
            client.json.set(room, ".songsQueue", []),
            client.json.set(room, ".currentSongId", null),
            client.json.set(room, ".paused", true),
            client.json.set(room, ".time", 0),
          ])
          await client.json.del(`user:${_socket.id}`);
        }
        console.log("left_user", left_user)
        _io.to(room).emit("leaves-room", left_user)
      })

      // queue socket events
      
      _socket.on("on-add-song-in-queue", async (res: any) => {
        const {
          songObj: song,
          room_id,
        } = res;
        let room : any =  await client.json.get(`room:${room_id}`)
        if(room?.songsQueue.length === 0)
          await client.json.set(`room:${room_id}`, ".currentSongId", song.id)
        await client.json.arrAppend(`room:${room_id}`, ".songsQueue", song);
        _io.to(`room:${room_id}`).emit("add-song-in-queue", song);
      })

      _socket.on("on-remove-song-from-queue", async (res: any) => {
        const {
          song_id,
          room_id,
        } = res;
        const {songsQueue}: any = await client.json.get(`room:${room_id}`);
        await client.json.arrPop(`room:${room_id}`, ".songsQueue", songsQueue.findIndex((item: any) => item.id === song_id));
        _io.to(`room:${room_id}`).emit("remove-song-from-queue", song_id);
      })

      _socket.on("on-replace-song-in-queue", async (res: any) => {
        const {
          replace_from,
          to_replace,
          room_id,
        } = res;
        let [replacePart]: any = await client.json.arrPop(`room:${room_id}`, ".songsQueue", replace_from);
        await client.json.arrInsert(`room:${room_id}`, ".songsQueue", to_replace, replacePart);
        _io.to(`room:${room_id}`).emit("replace-song-in-queue", {
          replace_from,
          to_replace,
        });
      })
    })

}

export default socketManager 