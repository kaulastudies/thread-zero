import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  InitResponse,
  VoteChoice,
  VoteResponse,
  VoteTotals,
} from '../../shared/api';

type ErrorResponse = {
  status: 'error';
  message: string;
};

const validChoices: VoteChoice[] = ['restore', 'account', 'bot'];

const isVoteChoice = (value: unknown): value is VoteChoice =>
  typeof value === 'string' && validChoices.includes(value as VoteChoice);

const voteCountKey = (postId: string, choice: VoteChoice): string =>
  `thread-zero:${postId}:votes:${choice}`;

const userVoteKey = (postId: string, username: string): string =>
  `thread-zero:${postId}:user:${username}:vote`;

const readVoteState = async (
  postId: string,
  username: string
): Promise<{
  votes: VoteTotals;
  userVote: VoteChoice | null;
}> => {
  const [restore, account, bot, storedVote] = await Promise.all([
    redis.get(voteCountKey(postId, 'restore')),
    redis.get(voteCountKey(postId, 'account')),
    redis.get(voteCountKey(postId, 'bot')),
    redis.get(userVoteKey(postId, username)),
  ]);

  return {
    votes: {
      restore: Number.parseInt(restore ?? '0', 10) || 0,
      account: Number.parseInt(account ?? '0', 10) || 0,
      bot: Number.parseInt(bot ?? '0', 10) || 0,
    },
    userVote: isVoteChoice(storedVote) ? storedVote : null,
  };
};

export const api = new Hono();

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'Reddit post context is missing.',
      },
      400
    );
  }

  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';

    const state = await readVoteState(postId, username);

    return c.json<InitResponse>({
      type: 'init',
      postId,
      username,
      votes: state.votes,
      userVote: state.userVote,
    });
  } catch (error) {
    console.error('THREAD ZERO initialization failed:', error);

    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'Community memory could not be loaded.',
      },
      500
    );
  }
});

api.post('/vote', async (c) => {
  const { postId } = context;

  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'Reddit post context is missing.',
      },
      400
    );
  }

  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';

    if (username === 'anonymous') {
      return c.json<ErrorResponse>(
        {
          status: 'error',
          message: 'Sign in to Reddit before voting.',
        },
        401
      );
    }

    const body = await c.req.json<{ choice?: unknown }>();

    if (!isVoteChoice(body.choice)) {
      return c.json<ErrorResponse>(
        {
          status: 'error',
          message: 'Unknown timeline decision.',
        },
        400
      );
    }

    const existingVote = await redis.get(userVoteKey(postId, username));

    if (isVoteChoice(existingVote)) {
      const state = await readVoteState(postId, username);

      return c.json<VoteResponse>({
        type: 'vote',
        postId,
        username,
        votes: state.votes,
        userVote: existingVote,
        recorded: false,
      });
    }

    const result = await redis.set(userVoteKey(postId, username), body.choice, {
      nx: true,
    });

    if (!result) {
      const state = await readVoteState(postId, username);

      if (!state.userVote) {
        throw new Error('Vote lock failed.');
      }

      return c.json<VoteResponse>({
        type: 'vote',
        postId,
        username,
        votes: state.votes,
        userVote: state.userVote,
        recorded: false,
      });
    }

    await redis.incrBy(voteCountKey(postId, body.choice), 1);

    const state = await readVoteState(postId, username);

    return c.json<VoteResponse>({
      type: 'vote',
      postId,
      username,
      votes: state.votes,
      userVote: body.choice,
      recorded: true,
    });
  } catch (error) {
    console.error('THREAD ZERO vote failed:', error);

    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'The timeline rejected this vote. Try again.',
      },
      500
    );
  }
});
