import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "types"
import redisManager, {client} from 'cache'

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
      _socket.on('connect-to-join-room', async (res) => {
        const {data, admin} = res;
        let roomCache = await client.json.get(`room:${data.room_slug}`);
        if(!roomCache) 
          if(admin) {
            await client.json.set(`room:${data.room_slug}`, '$', data, )
          }
        _socket.join(`room:${data.room_slug}`);
        
      })
      
      // _socket.emit('ser', 'hello')
      
      // _socket.on('create-room', async ({
      //  trackURL,
      //  currentTime
      // }) => {
      //   if(client)
      //   await client.json.set('user:jsondata', '$', {
      //    trackURL, 
      //    currentTime
      //   })
      //   await console.log("Added Data")
      // })
      
      // _socket.on('update-current-time', async (currentTime) => {
      //   if(client)
      //   await client.json.set('user:jsondata', '$.currentTime', currentTime);
      // })

    })

}

export default socketManager 