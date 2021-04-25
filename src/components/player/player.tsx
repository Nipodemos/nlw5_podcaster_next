/* eslint-disable import/no-duplicates */
import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import PlayerContext from '../../contexts/player_contexts';
import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';

export default function Player() {
  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayingState,
  } = useContext(PlayerContext);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];
  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/play.svg" alt="tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            src={episode.thumbnail}
            objectFit="cover"
            width={592}
            height={592}
          />
          <strong>{episode.title}</strong>
          <span>episode.members</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f875ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {episode && (
          <audio
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            ref={audioRef}
            src={episode.url}
            autoPlay
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Aleatório" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            onClick={togglePlay}
            type="button"
            disabled={!episode}
            className={styles.playButton}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
