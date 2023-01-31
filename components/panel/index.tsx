import BottomSheet from 'components/sheet'
import React, { FC, MutableRefObject } from 'react'
import PanelDraggableQueue from './components/queue'
import PanelSearch from './components/search'

const MediaPanel: FC<{audioElement ?: MutableRefObject<HTMLAudioElement|null>}> = ({audioElement}) => {

  return (
    <>
        <BottomSheet>
            <section className='flex flex-row w-full h-full'>
              <PanelSearch audioElement={audioElement} />
              <PanelDraggableQueue audioElement={audioElement} />
            </section>
        </BottomSheet>
    </>
  )
}

export default MediaPanel