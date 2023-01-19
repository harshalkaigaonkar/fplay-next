import React, { FC, useRef, useState } from 'react'
import { HomeProps } from 'types/home'
import AudioPlayer from './player';
import songs from 'songs.json';
import { secToMin } from 'helpers';

const AudioProvider : FC<HomeProps> = ({socket, currentIndex, paused, setPaused}) => {

  const audioElement = useRef(null);

      const [currentTrack, setCurrentTrack] = useState<any>(currentIndex !== undefined ? songs[currentIndex] : null);
      
      const [currentTime, setCurrentTime] = useState(0)


      const loadedMetaDataHandler = () => {
        const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
        // audio.currentTime = 10;
        setCurrentTime(audio.currentTime);
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
        setPaused(false)
      }
      const pauseHandler = () => {
        setPaused(true)
      }
      const timeUpdateHandler = (element: any) => {
        console.log(element.target.currentTime)
        // shows realtime currentTime for the Audio used for redis
        const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
        setCurrentTime(Math.floor(audio.currentTime))
      }
      
        return (
          <div className='w-full h-full'>
           <AudioPlayer currentTrack={currentTrack} audioElement={audioElement} currentTime={currentTime} paused={paused} setPaused={setPaused} />
           <audio 
            id="audio" 
            className='invisible'
            controls 
            onLoadedMetadata={loadedMetaDataHandler} 
            // onSeeked={seekedHandler} 
            onPlaying={playingHandler}
            onPause={pauseHandler}
            onTimeUpdate={timeUpdateHandler}
            ref={audioElement}
            >
              {currentTrack && (
                <source src={currentTrack.downloadUrl[currentTrack.downloadUrl.length-1].link} type="audio/mp4" />
              )} 
            </audio>
          </div>
        )
}

export default AudioProvider