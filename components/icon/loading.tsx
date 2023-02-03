import { ArrowPathIcon } from '@heroicons/react/20/solid'
import React, { FC } from 'react'

const LoadingIcon: FC<{className: string}> = ({className: classname}) => {
  return (
    <span className='w-full h-full flex items-center justify-center'>
     <ArrowPathIcon 
      className={`${classname} 
      animate-spin text-white`}
    />
    </span>
  )
}

export default LoadingIcon