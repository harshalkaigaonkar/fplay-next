import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "types"
import { client } from 'cache'

const _io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
   parseInt(`${process.env.WS_PORT}`, 10),
  {
    cors:{
      origin: `${process.env.CROSS_ORIGIN}`,
      credentials: true
    }
  }
 );

const socketManager = () => {

 _io.on('connection', (_socket) => {
  
  _socket.on('connect-to-server', (data) => {
   console.log("aaya be", data)
  })
  
  _socket.emit('ser', 'hello')
  
  _socket.on('create-room', async ({
   trackURL,
   currentTime
  }) => {
    if(client)
    // await client.json.set('user:jsondata', '$', {
    //  trackURL, 
    //  currentTime
    // })
    await console.log("Added Data")
  })
  
  _socket.on('update-current-time', async (currentTime) => {
    // if(client)
    // await client.json.set('user:jsondata', '$.currentTime', currentTime);
  })

 })

}

export default socketManager 