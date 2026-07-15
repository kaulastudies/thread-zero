# THREAD ZERO: The Reddit Time Loop

THREAD ZERO is a collaborative mystery game built natively for Reddit with Devvit.

A subreddit is trapped in a repeating timeline. At exactly 02:17, every member receives the same deleted notification. The only account that remembers what it said disappears.

Players receive different evidence, compare discoveries in Reddit comments, and cast one permanent community vote that determines what becomes canon.

## Play the game

- Playable Reddit post: https://www.reddit.com/r/ThreadZeroGame/comments/1ux3064/threadzero/
- Devvit app: https://developers.reddit.com/apps/thread-zero
- Source code: https://github.com/kaulastudies/thread-zero

## The hook

No player can solve the mystery alone.

Every Reddit username is deterministically assigned one of four investigator roles:

- **Archivist** — recognizes records that survived earlier loops
- **Observer** — notices visual changes other investigators miss
- **Decoder** — can access encrypted evidence
- **Witness** — remembers words the deleted account never posted

Each role receives a private memory fragment. Some evidence, including encrypted evidence E-05, is available only to the correct role.

Players must share their fragments in the Reddit comments to reconstruct the full case.

## How to play

1. Open the playable Reddit post.
2. Select **Enter the current timeline**.
3. Receive an investigator role based on your Reddit username.
4. Read your private role-only memory.
5. Explore the evidence board.
6. Compare clues and theories in the Reddit comments.
7. Choose a community decision.
8. Commit one permanent vote for the current timeline.
9. Return later to see the shared vote totals and community direction.

## Implemented features

- Custom THREAD ZERO Reddit post splash experience
- Reddit username integration
- Four deterministic investigator roles
- Four role-only memory fragments
- Role-gated encrypted evidence
- Six interactive evidence cards
- Evidence detail overlays
- Three community decision paths
- Persistent shared voting using Devvit Redis
- One permanent vote per Reddit username per post
- Live community vote totals and percentages
- Stored vote restoration after refresh
- Previous-loop timeline history
- Live reset countdown
- Mobile-first expanded Reddit experience
- Reddit comments used as the shared investigation room

## Shared voting architecture

Vote state is stored in Devvit Redis using keys scoped to the Reddit post.

Each player receives a user-specific vote key:

```text
thread-zero:{postId}:user:{username}:vote