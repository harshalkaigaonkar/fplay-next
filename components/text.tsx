import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { HomeProps } from '../pages';

const Text : React.FC<HomeProps> = ({ socket }) => {


  const loadedMetaDataHandler = () => {
  const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
  audio.currentTime = 10;
  socket.emit("create-room", {
    trackURL: audio.src,
    currentTime: audio.currentTime, 
  })
  
}
const seekedHandler = () => {
  const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
  console.log(audio.currentTime, "seeked Hndler")
  socket.emit("update-current-time", audio.currentTime)
}
const playingHandler = () => {
  const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
  console.log(audio.currentTime, "playingHandler")
}

  return (
    <div>
     <video id="audio" controls onLoadedMetadata={loadedMetaDataHandler} onSeeked={seekedHandler} onPlaying={playingHandler}>
      <source src="https://aac.saavncdn.com/557/6785f6db3501b3ce5e3b247ec9b2cbdc_320.mp4" type="audio/mp4" />
      </video>
    </div>
  )
}

export default Text