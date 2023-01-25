import { SaavnSongObjectTypes } from "types"

type TrackQueueProps = {
    socket?: any,
    audioElement: MutableRefObject<HTMLAudioElement|null>
    fromPanel?: boolean
}
type DraggableListItemProps = {
    song: SaavnSongObjectTypes|any,
    index: number,
    audioElement?: MutableRefObject<HTMLAudioElement|null>
    fromPanel?: boolean
}