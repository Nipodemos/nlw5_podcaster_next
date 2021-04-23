/* eslint-disable camelcase */
import { GetStaticProps } from 'next';
import ptbr, { format, parseISO } from 'date-fns';
import Image from 'next/image';
import styles from './home.module.scss';
import api from '../services/api';
import convertDurationToTimeString from '../utils/convert_duration_to_timestring';

type HomeProps = {
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
};

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                objectFit="cover"
                src={episode.thumbnail}
                alt={episode.title}
              />
              <div className={styles.episodeDetails}>
                <a href="/">{episode.title} </a>
                <p>{episode.members} </p>
                <span>{episode.publishedAt} </span>
                <span>{episode.durationAsString} </span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

type IRequest = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get<IRequest[]>('/episodes', {
    params: {
      limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const allEpisodes = data.map((episode) => ({
    id: episode.id,
    title: episode.title,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
      locale: ptbr,
    }),
    thumbnail: episode.thumbnail,
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episode.file.duration),
    ),
    description: episode.description,
    url: episode.file.url,
  }));

  const latestEpisodes = allEpisodes.splice(0, 2);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
