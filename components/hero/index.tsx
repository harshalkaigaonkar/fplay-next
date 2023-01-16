import { Transition } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { NextRouter, useRouter } from 'next/router';
import React, { Fragment, useState } from 'react'

const Hero = () => {

 const router : NextRouter = useRouter();

 const [error, setError] = useState<{
  type: string,
  message: string,
 }|{}>({});

 // replaced by global state
 const [roomId, setRoomId] = useState("");

 const onRoomRedirect = (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  if(roomId !== "")
  router.push(`/${roomId}`)
  else
  setError({
   type: "warning",
   message: "Room Id is Empty!"
  })
 }

 const onChangeRoomId = (e: { target: { value: React.SetStateAction<string>; }; }) => {
  setRoomId(e.target.value);
 }

  return (
    <div className='w-full my-20 p-4 flex flex-col justify-center items-center gap-8 bg-gradient-to-b from-gray-300 via-gray-900 to-black bg-clip-text animate-enter-div'>
      
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
      
      <input 
        type="text"
        placeholder="Enter Room Code" 
        value={roomId}
        onChange={onChangeRoomId}
        className="w-1/3 appearance-none min-w-[200px] p-4 bg-inherit border-white border-1 text-white text-lg placeholder-slate-300 font-semibold rounded-lg focus:outline-none"
        />

      <input 
        type="submit" 
        value="Join" 
        className="w-36 appearance-none min-w-60 text-inherit text-lg text-white font-bold rounded-md transition duration-300 bg-[#434343] border-none border-[#343434] hover:cursor-pointer hover:bg-[#343434] active:shadow active:bg-[#222222]" 
        />
      
      <button 
        className="w-36 appearance-none px-5 rounded-md inline-flex items-center shadow-xl border-[2px] border-solid border-white cursor-pointer bg-inherit transition duration-300 hover:bg-[#343434] hover:border-opacity-20 active:bg-[#222222]"
        > 

        <p 
        className="w-full text-lg font-bold text-center cursor-pointer"
        >
          Create
        </p>

      </button>
      
      </form>

    </div>
  )
}

export default Hero