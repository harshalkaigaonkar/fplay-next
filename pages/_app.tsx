import 'styles/globals.css'
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { Session } from 'next-auth';

function MyApp({ 
  Component,
  pageProps: {session, ...pageProps},
 }: AppProps<{session: Session}>): JSX.Element {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp
