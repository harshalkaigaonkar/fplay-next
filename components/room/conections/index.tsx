import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { FC } from 'react'
import { UseSession } from 'types';
import { HomeProps } from 'types/home';

const UsersConnectedRoom: FC<{session:UseSession}> = ({session}) => {

  return (
    <>
        <h3 className='mt-20 text-center'>Connected Users (1)</h3>
        <div className='flex flex-row flex-wrap justify-center my-10'>
            <section className='w-40 py-5 flex flex-col justify-center items-center gap-3'>
                <div className='inline-flex items-center rounded-full border-solid border-white'>
                    <Image
                        src={session && session.user.image}
                        alt={session && session.user && session.user.name}
                        width={75}
                        height={75}
                        className='rounded-full'
                    />
                </div>
                <span className='w-full'>
                    <h5 className='font-semibold text-center'>Harshal Kaigaonkar</h5>
                    <p className='mt-1 font-normal text-[12px] text-center'>Admin</p>
                </span>
            </section>
        </div>
    </>
  )
}

export default UsersConnectedRoom