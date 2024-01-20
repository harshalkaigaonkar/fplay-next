import { decodeHTMLContent } from 'helpers';
import Image from 'next/image';
import React, { FC, MutableRefObject } from 'react';
import { SaavnSongObjectTypes } from 'types';
import InfoOverlay from '.';
import PanelSongResult from '../cards/song';

const AlbumOverlay: FC<{
	backHandler: () => void;
	overlayType:
		| 'options|song'
		| 'options|album'
		| 'options|artist'
		| 'album'
		| 'artist'
		| null
		| undefined
		| null;
	audioElement: MutableRefObject<HTMLAudioElement | null>;
	result: any;
}> = ({ backHandler, overlayType, audioElement, result }) => {
	return (
		<InfoOverlay
			backHandler={backHandler}
			overlayType={overlayType}>
			<section className='mt-5 px-3'>
				<div className=' flex justify-start gap-5'>
					<Image
						src={
							result?.image?.[2]?.link ??
							result?.image?.[1]?.link ??
							result?.image?.[0]?.link ??
							'https://www.jiosaavn.com/_i/3.0/artist-default-music.png'
						}
						alt={result?.name + '_cover'}
						className='rounded-md transition duration-300 cursor-pointer'
						height={200}
						width={200}
						layout='fixed'
						loading='lazy'
					/>
					<div className='w-auto flex-1 flex flex-col items justify-center'>
						<h1 className='text-3xl'>{decodeHTMLContent(result.name)}</h1>
						<h5 className='mt-3 font-normal text-md'>
							{decodeHTMLContent(
								`${result.year} · ${result.primaryArtists}${result.featuredArtists && result.featuredArtists.length > 0 ? ` ft. ${result.featuredArtists}` : ''} · ${result.songs.length} Song${result.songs.length > 1 ? 's' : ''}`,
							)}
						</h5>
					</div>
				</div>
				<div className='mt-4 flex flex-col gap-5'>
					<p className='ml-3 px-5 text-sm bg-white/20 p-2 rounded-full w-fit'>
						Songs
					</p>
					<span className='lg:h-[15rem] flex flex-row flex-wrap overflow-y-auto overflow-x-hidden'>
						{!!result?.songs &&
							result?.songs?.map(
								(item: SaavnSongObjectTypes, index: number) => (
									<PanelSongResult
										data={item}
										key={index}
										audioElement={audioElement}
									/>
								),
							)}
					</span>
				</div>
			</section>
		</InfoOverlay>
	);
};

export default AlbumOverlay;
