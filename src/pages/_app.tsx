import { AppProps } from 'next/app';
import { useState } from 'react';
import Header from '../components/header/header';
import Player from '../components/player/player';
import PlayerContext, { Episode } from '../contexts/player_contexts';
import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const [episodeList, setEpisodeList] = useState([] as Episode[]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  };

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        setPlayingState,
        togglePlay,
      }}
    >
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp;
