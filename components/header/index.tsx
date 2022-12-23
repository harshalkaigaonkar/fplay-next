import axios from 'axios'
import { signIn, signOut } from 'next-auth/react'
import React, { FC } from 'react'
import { UseSession } from 'types'

interface HeaderProps {
 session: UseSession
}

const Header: FC<HeaderProps> = ({session}) => {
 
 const onClick = async () => {
   signOut()
 }

 // const handler = async () => {
 //   const {data} = await axios.post('/api/user', {profile:session.data?.user})
 //   console.log(data)
 // }
  return (
   <>
   Header
   {!session ? (
          <button onClick={() => signIn()}>
          Signin wth Google
         </button>
        ): (
          <>
          <p>{session.data?.user.name}</p>
            <button onClick={onClick}>
              SignOut
            </button>
          </>
        )}
   </>  
  )
}

export default Header