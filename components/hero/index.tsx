import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { NextRouter, useRouter } from 'next/router';
import React, { useState } from 'react'

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
    <div className="mt-10 flex flex-row flex-wrap justify-around items-center">
     <div className='p-4 flex flex-col justify-center items-center'>
      
      <h2 className="m-3 font-extrabold text-5xl">Connect And Jam with Friends on the go,
      <br /><span>One Song at a time.</span></h2>
      
      <h5 className="m-3 font-semibold text-xl">Create or Join Any Public Room According to Your Favourite Genre 
      <br /> and Listen to Songs in Real-time.</h5>
      
      <form 
       className="mx-3 my-6 flex flex-row gap-6 font-bold text-white"
       onSubmit={onRoomRedirect}
       >
      
       <input 
        type="text"
        placeholder="Enter Room Code" 
        value={roomId}
        onChange={onChangeRoomId}
        className="bg-inherit border-white border-1 text-white placeholder-slate-300 font-semibold rounded-md focus:border-white focus:shadow-md"
        />

       <input 
         type="submit" 
         value="Join" 
         className="w-24 text-inherit text-lg text-white font-bold rounded-md bg-[#333333] border-none border-[#343434] hover:bg-[#232323] hover:cursor-pointer hover:shadow-xl hover:shadow-gray-800 hover:border-none" 
        />
       
       <button 
        className="w-24 rounded-md shadow-xl border-none bg-[#232323] hover:shadow-gray-800 hover:bg-[#333333]"
        > 

        <p 
         className="text-lg font-bold"
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