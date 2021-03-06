import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import ptbr, { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useContext } from 'react';
import styles from './episode.module.scss';

import api from '../../services/api';
import convertDurationToTimeString from '../../utils/convert_duration_to_timestring';
import { PlayerContext, usePlayer } from '../../contexts/player_contexts';

type EpisodeProps = {
  episode: EpisodeData;
};

type EpisodeData = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  description: string;
  durationAsString: string;
  url: string;
};

const Episode = ({ episode }: EpisodeProps) => {
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title>Home | {episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />

        <button onClick={() => play(episode)} type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
};

type IRequest = {
  id: string;
  title: string;
  members: string;
  // eslint-disable-next-line camelcase
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<EpisodeProps> = async (ctx) => {
  const params = ctx?.params;
  if (!params) {
    throw new Error('This should never happen');
  }

  const { data } = await api.get<IRequest>(`/episodes/${params.slug}`);
  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptbr,
    }),
    thumbnail: data.thumbnail,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};

export default Episode;
