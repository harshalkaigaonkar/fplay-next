import { Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { axiosGet } from 'helpers';
import fetchRoom from 'helpers/fetchRoom';
import { NextRouter, useRouter } from 'next/router';
import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux';
import { onJoiningRoom } from 'redux/slice/roomSlice';

const Hero = () => {

 const router : NextRouter = useRouter();
 const dispatch = useDispatch();

 const [error, setError] = useState<{
  type: string,
  message: string,
 }|null>(null);

 // replaced by global state
 const [roomId, setRoomId] = useState("");

 const onRoomRedirect = async (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  if(roomId !== "" ) {
    const data: string|any = await fetchRoom(roomId)
    console.log(data)
    // if(data === "Failed") 
    //   setError({
    //     type: "warning",
    //     message: "Room Id is Not Valid!"
    //   })
    // else {
    //   dispatch(onJoiningRoom(data));
    //   router.push(`/${roomId}`);
    // }
  }
  else
  setError({
   type: "warning",
   message: "Room Id is Empty!"
  })
  setTimeout(() => {
    setError(null);
  }, 4000)
 }

 const onChangeRoomId = (e: { target: { value: React.SetStateAction<string>; }; }) => {
  setRoomId(e.target.value);
 }

  return (
    <div>
      <div className='w-full mt-20 p-4 pb-0 flex flex-col justify-center items-center gap-8 bg-gradient-to-b from-gray-300 via-gray-900 to-black bg-clip-text animate-enter-div'>
        
        <h1 className="text-center text-3xl font-extrabold text-transparent sm:text-5xl">
            Group Sessions are now Public.
            <strong className="font-extrabold text-transparent sm:block">
              Enjoy your Music with others.
            </strong>
        </h1>
        
        <h5 className="m-3 font-semibold text-xl text-center">
        Connect And Jam with Friends on the go,
        <br />One Song at a time.
        </h5>
        
        <form 
        className="w-full mx-3 my-6 flex flex-row justify-center gap-6 font-bold text-white"
        onSubmit={onRoomRedirect}
        >
        <span className='w-1/3'>
          <input 
            type="text"
            placeholder="Enter Room Code" 
            value={roomId}
            onChange={onChangeRoomId}
            className="w-full h-16 appearance-none p-4 bg-inherit border-white border-1 text-white text-lg placeholder-slate-300 font-semibold rounded-lg focus:outline-none"
            />
            <p className='m-0 p-2 font-semibold text-xs w-inherit text-ellipsis'>
              {error?.message ?? ""}
            </p>
        </span>

        <input 
          type="submit" 
          value="Join" 
          className="w-36 h-16 appearance-none min-w-60 text-inherit text-lg text-white font-bold rounded-md transition duration-300 bg-[#434343] border-none border-[#343434] hover:cursor-pointer hover:bg-[#343434] active:shadow active:bg-[#222222]" 
          />
        
        <button 
          className="w-36 h-16 appearance-none px-5 rounded-md inline-flex items-center shadow-xl border-[2px] border-solid border-white cursor-pointer bg-inherit transition duration-300 hover:bg-[#343434] hover:border-opacity-20 active:bg-[#222222]"
          > 

          <p 
          className="w-full text-lg font-bold text-center cursor-pointer"
          >
            Create
          </p>

        </button>
        
        </form>


      </div>
      

    </div>
  )
}

export default Hero