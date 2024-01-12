import Footer from 'components/footer';
import Header from 'components/header';
import React, { FC, Fragment, ReactNode } from 'react';
import { UseSession } from 'types';

interface LayoutProps {
	session: UseSession | null;
	children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ session, children }) => {
	return (
		<div className='lg:mx-20 lg:px-20 min-h-screen md:m-0 md:p-0 select-none animate-enter-opacity'>
			<Header session={session} />
			<main>{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
