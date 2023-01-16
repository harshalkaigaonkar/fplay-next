import React, { FC } from 'react'
import { HomeProps } from 'types/home'
import AudioPlayer from './player';

const AudioProvider : FC<HomeProps> = ({socket}) => {
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
      const timeUpdateHandler = () => {
        const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
        console.log(audio.currentTime, "timeUpdateHandler")
      }
      
        return (
          <div className='w-full h-full'>
           <AudioPlayer />
           <audio 
            id="audio" 
            className='invisible'
            controls 
            onLoadedMetadata={loadedMetaDataHandler} 
            // onSeeked={seekedHandler} 
            onPlaying={playingHandler}
            onTimeUpdate={timeUpdateHandler}
            >
            <source src="https://aac.saavncdn.com/557/6785f6db3501b3ce5e3b247ec9b2cbdc_320.mp4" type="audio/mp4" />
            </audio>
          </div>
        )
}

export default AudioProvider