import { SaavnSongObjectTypes } from "types"

type TrackQueueProps = {
    socket: any,
    audioElement: MutableRefObject<HTMLAudioElement|null>
}
type DraggableListItemProps = {
    song: SaavnSongObjectTypes|any,
    index: number,
    audioElement?: MutableRefObject<HTMLAudioElement|null>
}