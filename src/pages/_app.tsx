import { AppProps } from 'next/app';
import Header from '../components/header/header';
import Player from '../components/player/player';
import styles from '../styles/app.module.scss';
import PlayerContextProvider from '../contexts/player_contexts';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp;
