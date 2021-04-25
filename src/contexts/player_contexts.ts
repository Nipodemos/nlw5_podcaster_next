import { createContext } from 'react';

export type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

export type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  // eslint-disable-next-line no-unused-vars
  play: (episode: Episode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
};

const PlayerContext = createContext({} as PlayerContextData);

export default PlayerContext;
