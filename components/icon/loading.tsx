import { ArrowPathIcon } from '@heroicons/react/20/solid'
import React from 'react'

const LoadingIcon = () => {
  return (
    <span className='w-full h-full flex items-center justify-center'>
     <ArrowPathIcon className='animate-spin w-10 h-10 text-white' />
    </span>
  )
}

export default LoadingIcon