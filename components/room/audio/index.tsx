import React, { FC, SyntheticEvent, useEffect, useRef, useState } from 'react'
import { HomeProps } from 'types/home'
import AudioPlayer from './player';
import { secToMin } from 'helpers';
import { useSelector } from 'react-redux';
import { onChangeNextSongFromQueue, onSetPause, onSetPlay, onUpdateTime, selectCurrentSongId, selectPaused, selectSongsQueue } from 'redux/slice/roomSlice';
import { useDispatch } from 'react-redux';
import { SaavnSongObjectTypes } from 'types';

const AudioProvider : FC<HomeProps> = ({socket, audioElement}) => {

  const songsQueue = useSelector(selectSongsQueue);
  const currentSongId = useSelector(selectCurrentSongId);
  const paused = useSelector(selectPaused);

  const dispatch = useDispatch();

  const [currentTrack, setCurrentTrack] = useState<SaavnSongObjectTypes|null>(null);

  useEffect(() => {
    if(audioElement.current && !paused) {
      audioElement.current.play();
    }
    if(currentSongId !== "")
      setCurrentTrack(songsQueue.find((item: SaavnSongObjectTypes) => item.id === currentSongId))

    return () => {
      if(audioElement.current)
        audioElement.current.load();
    }

  }, [audioElement, currentTrack, currentSongId])

  const loadedMetaDataHandler = (element: any) => {
    // const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
    dispatch(onUpdateTime(element.target.currentTime));
    socket.emit("create-room", {
      trackURL: element.target.src,
      currentTime: element.target.currentTime, 
    })
  }
  const seekedHandler = (element: any) => {
    console.log(element.target.currentTime, "seeked Hndler")
    socket.emit("update-current-time", element.target.currentTime)
  }
  const playingHandler = () => {
    dispatch(onSetPlay());

  }
  const pauseHandler = (element: any) => {
    if(element.target.currentTime !== element.target.duration)
    dispatch(onSetPause());
  }
  const endedHandler = () => {
    dispatch(onChangeNextSongFromQueue());
  }
  const timeUpdateHandler = (element: any) => {
    // shows realtime currentTime for the Audio used for redis
    dispatch(onUpdateTime(Math.floor(element.target.currentTime)));
  }
  
    return (
      <div className='w-full h-full'>
        {currentTrack && (
          <>
            <AudioPlayer 
              currentTrack={currentTrack} 
              audioElement={audioElement}
            />
            <audio 
              id="audio" 
              className='invisible'
              controls
              autoPlay={!paused}
              onLoadedMetadata={loadedMetaDataHandler} 
              // onSeeked={seekedHandler} 
              onPlaying={playingHandler}
              onPause={pauseHandler}
              onEnded={endedHandler}
              onTimeUpdate={timeUpdateHandler}
              ref={audioElement}
            >
              <source src={currentTrack.downloadUrl[3].link} type="audio/mp4" />
              {/* {songsQueue.map((song: SaavnSongObjectTypes) => (
                <>
                  <source src={song.downloadUrl[3].link} type="audio/mp4" />
                </>
              ))} */}
            </audio>
          </>
        )}
      </div>
    )
}

export default AudioProvider