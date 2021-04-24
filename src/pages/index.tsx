/* eslint-disable camelcase */
import { GetStaticProps } from 'next';
import ptbr, { format, parseISO } from 'date-fns';
import Image from 'next/image';
import styles from './home.module.scss';
import api from '../services/api';
import convertDurationToTimeString from '../utils/convert_duration_to_timestring';
import LinkTo from '../components/link_to/LinkTo';

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
                <LinkTo href={`/episodes/${episode.id}`}>
                  {episode.title}
                </LinkTo>
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

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th />
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode) => (
              <tr key={episode.id}>
                <td>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <LinkTo href={`/episodes/${episode.id}`}>
                    {episode.title}
                  </LinkTo>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { data } = await api.get<IRequest[]>('/episodes', {
    params: {
      limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const allEpisodes = data.map(
    (episode): Episode => ({
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
      url: episode.file.url,
    }),
  );

  const latestEpisodes = allEpisodes.splice(0, 2);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
