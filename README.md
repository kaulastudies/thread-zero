# THREAD ZERO: The Reddit Time Loop

THREAD ZERO is a collaborative mystery game built with Reddit Devvit.

A subreddit is trapped in a repeating timeline. At 02:17 every member receives the same deleted notification, and the only account that remembers it disappears. Players investigate clues, compare theories in Reddit comments, and decide what the community should investigate next.

## How to play

1. Open the playable Reddit post and select **Tap to Start**.
2. Receive one of four investigator roles: Archivist, Observer, Decoder, or Witness.
3. Explore six interactive evidence cards.
4. Compare discoveries and theories in the post comments.
5. Choose one of three actions in **Decision**.
6. Review earlier failed loops in **Timeline**.

## Current build

- Reddit username integration
- Four username-based investigator roles
- Six evidence cards with detail overlays
- Three interactive decision options
- Vote visualisation
- Live reset countdown
- Four recorded timeline loops
- Responsive mobile-first interface inside a Reddit post

## Why Reddit

The app provides the case; Reddit provides the investigation room. The incomplete evidence is designed to encourage discussion, competing theories, and collective decisions.

## Built with

Devvit, Reddit Developer Platform, React, TypeScript, Tailwind CSS, Hono, Vite, and Node.js.

## Development

Requires Node.js 22.2+ and Devvit access.

```bash
npm install
npx devvit login --copy-paste
npx devvit playtest ThreadZeroGame
npm run type-check
npm run lint
npm run build
npm run deploy
```

## Links

- Playable post: https://www.reddit.com/r/ThreadZeroGame/comments/1ux3064/threadzero/
- Devvit app: https://developers.reddit.com/apps/thread-zero
- Source: https://github.com/kaulastudies/thread-zero

## Next steps

Persistent community voting, role-specific clues, daily rounds, streaks, player-submitted theories, moderator-created cases, and branching consequences.

Built by Rama Chandra for Reddit's Games with a Hook Hackathon.
