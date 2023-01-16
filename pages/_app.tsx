import 'styles/globals.css'
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { Session } from 'next-auth';
import { Provider } from 'react-redux';
import { store } from 'redux/store/configureStore';

function MyApp({ 
  Component,
  pageProps: {session, ...pageProps},
 }: AppProps<{session: Session}>): JSX.Element {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp
