export type VoteChoice = 'restore' | 'account' | 'bot';

export type VoteTotals = Record<VoteChoice, number>;

export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  votes: VoteTotals;
  userVote: VoteChoice | null;
};

export type VoteResponse = {
  type: 'vote';
  postId: string;
  username: string;
  votes: VoteTotals;
  userVote: VoteChoice;
  recorded: boolean;
};
