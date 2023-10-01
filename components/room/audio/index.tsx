import React, { FC, SyntheticEvent, useEffect, useRef, useState } from 'react'
import { HomeProps } from 'types/home'
import AudioPlayer from './player';
import { secToMin } from 'helpers';
import { useSelector } from 'react-redux';
import { onChangeNextSongFromQueue, onSetPause, onSetPlay, onUpdateTime, selectCurrentSongId, selectPaused, selectSongsQueue, selectTime } from 'redux/slice/playerSlice';
import { useDispatch } from 'react-redux';
import { SaavnSongObjectTypes } from 'types';
import { selectRoomInfo } from 'redux/slice/roomSlice';
import { useSocket } from 'hooks/useSocket';
import { selectUserInfo } from 'redux/slice/userSlice';
import { Socket } from 'socket.io-client';
import { useDebounce } from 'react-use';

const AudioProvider : FC<HomeProps> = ({audioElement}) => {

  const songsQueue = useSelector(selectSongsQueue);
  const currentSongId = useSelector(selectCurrentSongId);
  const paused = useSelector(selectPaused);
  const room = useSelector(selectRoomInfo);
  const time = useSelector(selectTime);
  const user = useSelector(selectUserInfo);
  const socket = useSocket();

  useDebounce(() => {
    if(!!user && !!room && room.owned_by._id === user._id)
    {
      socket.emit("on-seek-current-song", {
        user,
        room_id : room.room_slug,
        time: audioElement.current?.currentTime ?? time,
      })
    }
  }, 1000, [user, audioElement, room.room_slug, time]);

  useDebounce(() => {
    if(!!user && !!room && room.owned_by._id === user._id)
    {
    socket.emit("on-play-current-song", {
        user,
        room_id: room.room_slug
      })
    }
  }, 1000, [user, audioElement, room.room_slug, paused]);

  useDebounce(() => {
    if(!!user && !!room && room.owned_by._id === user._id)
    {
    socket.emit("on-pause-current-song", {
      user,
      room_id: room.room_slug
    })
  }
  }, 1000, [user, audioElement, room.room_slug, paused]);


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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        audioElement.current.load();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioElement, currentTrack, currentSongId])

  const loadedMetaDataHandler = (element: any) => {
    // const audio : HTMLMediaElement | HTMLElement | any = document.getElementById('audio');
    // dispatch(onUpdateTime(element.target.currentTime));
    // element.target.currentTime = time;
    console.log("loggedd here too", time)

  }
  const seekedHandler = (element: any) => {
    console.log(element.target.currentTime, "seeked Hndler")
    // socket.emit("update-current-time", element.target.currentTime)
    // if(typeof seekDebounceFn === 'function')
    
    
  }
  const playingHandler = () => {
    dispatch(onSetPlay());
    // if(typeof playDebounceFn === 'function')
      // playDebounceFn();
      
  }
  const pauseHandler = (element: any) => {
    if(element.target.currentTime !== element.target.duration) {
      dispatch(onSetPause());
    }
  }
  const endedHandler = () => {
    dispatch(onChangeNextSongFromQueue());
    socket.emit("on-current-song-change-next", {
      user,
      room_id: room.room_slug
    })
  }
  const timeUpdateHandler = (element: any) => {
    // shows realtime currentTime for the Audio used for redis
    //TODO: Ye bacha he for time sync
      dispatch(onUpdateTime(Math.floor(element.target.currentTime)));
  }
  
    return (
      <div className='w-full h-full'>
        {currentTrack ? (
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
              onSeeked={seekedHandler} 
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
        ) : (
          <AudioPlayer />
        )}
      </div>
    )
}

export default AudioProvider