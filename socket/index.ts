import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "types"
import { client } from 'cache'

const socketManager = (_res: any) => {
  const _io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
     _res.socket.server,
     {
      cors:{
        origin: `/`,
        credentials: true
      }
     }
   );
  
   if(_res.socket.server.io) {
    console.log("Socket already initialised.");
    return;
  }
    _res.socket.server.io = _io

 _io.on('connection', (_socket) => {
  console.log("new Socket Client Connected", _socket.id)
  // _socket.on('connect-to-server', (data) => {
  //  console.log("aaya be", data)
  // })
  
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