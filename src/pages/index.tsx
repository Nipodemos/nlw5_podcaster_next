/* eslint-disable camelcase */
import { GetStaticProps } from 'next';
import ptbr, { format, parseISO } from 'date-fns';

import api from '../services/api';
import convertDurationToTimeString from '../utils/convert_duration_to_timestring';

type HomeProps = {
  episodes: Array<Episode>;
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

export default function Home({ episodes }: HomeProps) {
  return <p>{JSON.stringify(episodes)}</p>;
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

  const episodes = data.map((episode) => ({
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

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
