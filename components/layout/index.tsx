import Footer from 'components/footer'
import Header from 'components/header'
import React, { FC, Fragment, ReactNode } from 'react'
import { UseSession } from 'types'

interface LayoutProps {
 session: UseSession,
 children: ReactNode
}

const Layout: FC<LayoutProps> = ({session, children}) => {
  return (
    <div className='bg-[#464646] min-h-screen'>
     <Header session={session} />
     <main>{children}</main>
     <Footer />
    </div>
  )
}

export default Layout