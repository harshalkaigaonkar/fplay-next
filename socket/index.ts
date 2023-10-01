import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "types"
import redisManager, {client} from 'cache'

interface ConnectedUser {
  user_id: string; 
  socket_id: string; 
  name: string;
  email: string; 
  username: string; 
  profile_pic: string;
  role: 'admin'|'listener';
}


const socketManager = async (_res: any) => {
  if(_res.socket.server.io) {
  //  console.log("Socket already initialised.");
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
      // console.log("new Socket Client Connected", _socket.id)

      // connection and disconnnect socket event handlers

      _socket.on("connect-to-join-room", async (res: any) => {
        const {user, room} = res;
        // client joins the room.
        _socket.join(`room:${room.room_slug}`);
        // socketClient - roomId relation
        await client.json.set(`user:${_socket.id}`, "$", `room:${room.room_slug}`)
        let roomCache: any = await client.json.get(`room:${room.room_slug}`);
        let new_room_created: boolean = false;
        if(!roomCache) {
          if(!!room.owned_by.id && !!user._id && room.owned_by.id !== user._id) {
            _socket.emit("error-joining-room", {
              message: "you cannot join this room, as this room hasn't been initialized",
              title: "cannot join this room!!"
            })
            return;
          }
          // if no rrom exists, create one.
          roomCache = await client.json.set(`room:${room.room_slug}`, "$", {
            // active: true, - as anyone joins, room automatically gets active.
            songsQueue: [],
            currentSongId: null,
            paused: true,
            time: 0,
            spotlight: _socket.id,
            users_connected: [
              {
                socket_id: _socket.id,
                user_id: user._id,
                role: user._id === room.owned_by._id ? 'admin': 'listener',
                ...Object.fromEntries(Object.entries(user).filter(([item]) => !["_id", "createdAt", "updatedAt", "library", "__v"].includes(item)))
              }
            ],
            room: {
              ...Object.fromEntries(Object.entries(room).filter(([item]) => ["_id", "room_slug"].includes(item))),
              owned_by: room.owned_by._id
            }
          })
          new_room_created = true;
        }
        else {
          const new_user_connection = {
            socket_id: _socket.id,
            user_id: user._id,
            role: user._id === room.owned_by._id ? 'admin': 'listener',
            ...Object.fromEntries(Object.entries(user).filter(([item]) => !["_id", "createdAt", "updatedAt", "library", "__v"].includes(item)))
          };
          // append user's connection in the room.
          await client.json.arrAppend(`room:${room.room_slug}`, ".users_connected", new_user_connection)
          if(!!roomCache && !roomCache.spotlight) {
            await client.json.set(`room:${room.room_id}`, '.spotlight', _socket.id);
          }
        }
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
        // console.log(`socket id: ${_socket.id} connected to room id: ${room.room_slug}`)
        _socket.emit("sync-player-with-redis", {
          songsQueue,
          currentSongId,
          paused,
          time,
        })
        _io.to(`room:${room.room_slug}`).emit("sync-room-users-with-redis", users_connected)
      }) 

      _socket.on("disconnect", async () => {
        const room_redis_id: string|null|any = await client.json.get(`user:${_socket.id}`);
        let left_user: string|ConnectedUser|any = _socket.id;
        if(!!room_redis_id) {
          const room: any = await client.json.get(room_redis_id);
            left_user = await client.json.arrPop(room_redis_id, ".users_connected", room?.users_connected?.findIndex((item: ConnectedUser) => item.socket_id === _socket.id));
          if(!!room?.users_connected && room.users_connected.length === 1) {
            await Promise.all([
              /**
               * persist data in the room even if all users leave room.
               * */
              // client.json.set(room, ".songsQueue", []),
              // client.json.set(room, ".currentSongId", null),
              client.json.set(room_redis_id, ".paused", true),
              client.json.set(room_redis_id, ".time", 0),
            ])
          }
          await client.json.del(`user:${_socket.id}`);
          if(!!left_user && !!room?.spotlight && left_user.role === 'admin' && room.spotlight === _socket.id) {
            const room: any = await client.json.get(room_redis_id);
            let new_spotlight_user = room?.users_connected?.find((user: ConnectedUser) => user.role === 'admin');
            if(!!new_spotlight_user) {
              await client.json.set(room_redis_id, '.spotlight', new_spotlight_user.socket_id);
              _io.to(new_spotlight_user.socket_id).emit("get-spotlight");
            } else {
              await client.json.set(room_redis_id, '.spotlight', null);
              _socket.broadcast.to(room_redis_id).emit("error-joining-room", {
                message: "room is inactive, as no admin's there to ",
                title: "Room is Inactive!!"
              })
              return;
            }
          }
        }
        // console.log(`user ${left_user.user_id} left from room id: ${room}`, left_user)
        _io.to(room_redis_id).emit("leaves-room", left_user)
      })

      // queue socket events
      
      _socket.on("on-add-song-in-queue", async (res: any) => {
        const {
          user,
          songObj: song,
          room_id,
        } = res;

        let room : any =  await client.json.get(`room:${room_id}`)
        if(!!room.spotlight && !!room?.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
          if(room?.songsQueue.length === 0)
            await client.json.set(`room:${room_id}`, ".currentSongId", song.id)
          await client.json.arrAppend(`room:${room_id}`, ".songsQueue", song);
        }
        _socket.broadcast.to(`room:${room_id}`).emit("add-song-in-queue", song);
      })

      _socket.on("on-remove-song-from-queue", async (res: any) => {
        const {
          user,
          song_id,
          room_id,
        } = res;
        let room : any = await client.json.get(`room:${room_id}`);
        if(!!room.spotlight &&  !!room?.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
          let index = room?.songsQueue?.findIndex((item: any) => item.id === song_id)
          await client.json.arrPop(`room:${room_id}`, ".songsQueue", index);
        }
        _socket.broadcast.to(`room:${room_id}`).emit("remove-song-from-queue", song_id);
      })

      _socket.on("on-replace-song-in-queue", async (res: any) => {
        const {
          user,
          replace_from,
          to_replace,
          room_id,
        } = res;
        let room : any =  await client.json.get(`room:${room_id}`);
        if(!!room?.spotlight && !!room?.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
          let replacePart: any = await client.json.arrPop(`room:${room_id}`, ".songsQueue", replace_from);
        // console.log("res", replacePart.id)
        await client.json.arrInsert(`room:${room_id}`, ".songsQueue", to_replace, replacePart);
        }
        _socket.broadcast.to(`room:${room_id}`).emit("replace-song-in-queue", {
          replace_from,
          to_replace,
        });
      })
      
      _socket.on("on-current-song-id-change", async (res : any) => {
        const {
          user,
          song_id,
          room_id
        } = res;
        let room : any =  await client.json.get(`room:${room_id}`)
        if(!!room?.spotlight && !!room?.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
          await client.json.set(`room:${room_id}`, ".currentSongId", song_id);
        }
        _socket.broadcast.to(`room:${room_id}`).emit("current-song-id-change", song_id);
      })

      _socket.on("on-current-song-change-next", async (res: any) => {
        const {
          user,
          room_id
        } = res;
        const room : any = await client.json.get(`room:${room_id}`);
        if(!!room?.spotlight &&  !!room?.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
        let index = await room?.songsQueue?.findIndex((song : any) => song.id === room?.currentSongId);
        let nextSongId;
        if(index+1 < room?.songsQueue?.length) {
          nextSongId = room?.songsQueue?.[index+1]?.id;
        } else {
          nextSongId = room?.songsQueue?.[0]?.id;
        }
        if(!!nextSongId) {
        await client.json.set(`room:${room_id}`, ".currentSongId", nextSongId);
        _socket.broadcast.to(`room:${room_id}`).emit("current-song-change-next", nextSongId);
      }
        }
      })

      _socket.on("on-current-song-change-prev", async (res: any) => {
        const {
          user,
          room_id
        } = res;
        const room : any = await client.json.get(`room:${room_id}`);
        if(!!room?.spotlight && !!room?.currentSongId && !!room?.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
        let index = await room?.songsQueue.findIndex((song : any) => song.id === room.currentSongId);
        let prevSongId;
        if(index-1 >= 0) {
          prevSongId = room?.songsQueue[index-1].id;
        } else {
          prevSongId = room?.songsQueue[room?.songsQueue.length-1].id;
        }
        if(!!prevSongId) {
          await client.json.set(`room:${room_id}`, ".currentSongId", prevSongId);
          _socket.broadcast.to(`room:${room_id}`).emit("current-song-change-prev", prevSongId);}
        }
      })

      _socket.on("on-play-current-song", async (res : any) => {
        const {
          user,
          room_id
        } = res;
        const room : any = await client.json.get(`room:${room_id}`);
        if(!!room?.spotlight && !!room?.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
          await client.json.set(`room:${room_id}`, ".paused", false);
        }
        _socket.broadcast.to(`room:${room_id}`).emit("play-current-song");
      })
      
      _socket.on("on-pause-current-song", async (res : any) => {
        const {
          user,
          room_id
        } = res;
        const room : any = await client.json.get(`room:${room_id}`);
        if(!!room?.spotlight && !!room.room && (room.room.owned_by === user._id || room.spotlight === _socket.id)) {
          await client.json.set(`room:${room_id}`, ".paused", true);
        }
        _socket.broadcast.to(`room:${room_id}`).emit("pause-current-song");
      })
      
      _socket.on("on-seek-current-song", async (res: any) => {
        const {
          user,
          room_id,
          time
        } = res;
        const room: any = await client.json.get(`room:${room_id}`); 
        console.log(_socket.id, room.users_connected?.find((user:ConnectedUser) => user.socket_id === _socket.id))
        if(!!room?.spotlight && room.spotlight === _socket.id) {
          await client.json.set(`room:${room_id}`, ".time", time);
        }
        _socket.broadcast.to(`room:${room_id}`).emit("seek-current-song", time as number);
      })

    })
}

export default socketManager 