import AddTrackPanelIcon from 'components/icon/addTrack'
import React from 'react'

const MusicPanelButton = () => {
  return (
    <div className='fixed bottom-0 right-0 z-40 m-10 p-10 bg-black border-solid border-white/50 rounded-full cursor-pointer transition duration-300 hover:border-white/75 hover:bg-white/20'>
        <AddTrackPanelIcon className="w-12 h-12 text-white" />
    </div>
  )
}

export default MusicPanelButton