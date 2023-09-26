import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { FC } from 'react'
import { useSelector } from 'react-redux';
import { selectRoomInfo, selectUsers } from 'redux/slice/roomSlice';
import { UseSession } from 'types';
import { HomeProps } from 'types/home';

const UsersConnectedRoom: FC<{session:UseSession}> = ({session}) => {
    const users = useSelector(selectUsers);
    const room = useSelector(selectRoomInfo);

  return (
    <>
        <h3 className='mt-20 text-center'>Connected Users ({users.length})</h3>
        <div className='flex flex-row flex-wrap justify-center my-10'>
            {!!users && users?.map((item: any, index: number) => (
                <section key={index} className='w-40 py-5 flex flex-col justify-center items-center gap-3'>
                <div className='inline-flex items-center rounded-full border-solid border-white'>
                    <Image
                        src={item?.profile_pic}
                        alt={item?.username}
                        width={75}
                        height={75}
                        className='rounded-full'
                    />
                </div>
                <span className='w-full'>
                    <h5 className='font-semibold text-center'>{item.name}</h5>
                    <p className='mt-1 font-normal text-[12px] text-center'>{room?.owned_by?._id === item.user_id ? "Admin": "Listener"}</p>
                </span>
            </section>
            ))}
        </div>
    </>
  )
}

export default UsersConnectedRoom