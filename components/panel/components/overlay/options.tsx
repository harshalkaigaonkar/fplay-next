import React, { MutableRefObject, FC } from 'react'
import { SaavnAlbumObjectTypes, SaavnSongObjectTypes } from 'types'
import InfoOverlay from '.'
import PanelAlbumResult from '../cards/album'
import PanelArtistResult from '../cards/artist'
import PanelSongResult from '../cards/song'

type MoreOptionsProps = {
  type?: "options|song"|"options|album"|"options|artist"|"album"|"artist"|null,
  results: any,
  backHandler: () => void,
  audioElement?: MutableRefObject<HTMLAudioElement|null>,
  onArtistClickHandler: (id: string) => void,
  onAlbumClickHandler: (id: string) => void,
}

const MoreOptions: FC<MoreOptionsProps> = ({type, results, backHandler, audioElement, onAlbumClickHandler, onArtistClickHandler}) => {

  return (
    <InfoOverlay
      backHandler={backHandler}
      overlayType={type}
    >
      <div className='-mt-10 pt-10 pb-2 w-full flex justify-start items-center flex-wrap overflow-y-auto overflow-x-hidden'>
        {/* <span className='mt-20'></span> */}
        {type?.includes('song') ? (
          <>
            {
              results.map((item: SaavnSongObjectTypes, index: number) => (
                <PanelSongResult data={item} key={index} audioElement={audioElement} />
              ))
            }
          </>
        ) : 
        type?.includes('album') ? (
          <>
            {
              results.map((item: any, index: number) => (
                <PanelAlbumResult data={item} key={index} audioElement={audioElement} onClickHandler={onAlbumClickHandler} />
              ))
            }
          </>
        ) :
        type?.includes('artist') ? (
          <>
            {
              results.map((item: any, index: number) => (
                <PanelArtistResult data={item} key={index} audioElement={audioElement} onClickHandler={onArtistClickHandler} />
              ))
            }
          </>
        ) : (
          <>
            <p>No Results Found!!</p>
          </>
        )}
      </div>
    </InfoOverlay>
  )
}

export default MoreOptions