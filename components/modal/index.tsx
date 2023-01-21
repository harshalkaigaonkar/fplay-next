import React, { FC } from 'react'

const Modal: FC<{children: JSX.Element}> = ({children}) => {
  return (
    <>
        <span className='fixed inset-0 h-full z-30 bg-white overflow-y-hidden opacity-60 ' />
        <span></span>
        <section className='fixed inset-16 bg-black z-40 rounded-xl border-solid border-white/50' >
            {children}
        </section>
    </>
  )
}

export default Modal