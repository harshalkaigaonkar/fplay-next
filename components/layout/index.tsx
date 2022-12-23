import Header from 'components/header'
import React, { FC, Fragment, ReactNode } from 'react'
import { UseSession } from 'types'

interface LayoutProps {
 session: UseSession,
 children: ReactNode
}

const Layout: FC<LayoutProps> = ({session, children}) => {
  return (
    <Fragment>
     <Header session={session} />
     <main>{children}</main>
    </Fragment>
  )
}

export default Layout