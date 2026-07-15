import { useCallback, useEffect, useState } from 'react';
import type {
  InitResponse,
  VoteChoice,
  VoteResponse,
  VoteTotals,
} from '../../shared/api';

type GameState = {
  username: string | null;
  loading: boolean;
  submitting: boolean;
  votes: VoteTotals;
  userVote: VoteChoice | null;
  error: string | null;
};

const emptyVotes: VoteTotals = {
  restore: 0,
  account: 0,
  bot: 0,
};

export const useCounter = () => {
  const [state, setState] = useState<GameState>({
    username: null,
    loading: true,
    submitting: false,
    votes: emptyVotes,
    userVote: null,
    error: null,
  });

  useEffect(() => {
    const initialise = async () => {
      try {
        const response = await fetch('/api/init');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: InitResponse = await response.json();

        setState({
          username: data.username,
          loading: false,
          submitting: false,
          votes: data.votes,
          userVote: data.userVote,
          error: null,
        });
      } catch (error) {
        console.error('THREAD ZERO initialization failed:', error);

        setState((current) => ({
          ...current,
          loading: false,
          error: 'Community memory is temporarily unavailable.',
        }));
      }
    };

    void initialise();
  }, []);

  const submitVote = useCallback(async (choice: VoteChoice) => {
    setState((current) => ({
      ...current,
      submitting: true,
      error: null,
    }));

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
      });

      const data = (await response.json()) as
        VoteResponse | { message?: string };

      if (!response.ok || !('type' in data) || data.type !== 'vote') {
        throw new Error(
          'message' in data && data.message
            ? data.message
            : `HTTP ${response.status}`
        );
      }

      setState((current) => ({
        ...current,
        username: data.username,
        submitting: false,
        votes: data.votes,
        userVote: data.userVote,
        error: null,
      }));

      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'The timeline rejected this decision.';

      setState((current) => ({
        ...current,
        submitting: false,
        error: message,
      }));

      return null;
    }
  }, []);

  return {
    ...state,
    submitVote,
  } as const;
};
