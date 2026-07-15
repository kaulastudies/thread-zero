import './index.css';

import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useCounter } from './hooks/useCounter';

type Tab = 'case' | 'vote' | 'timeline';

type Evidence = {
  id: string;
  code: string;
  title: string;
  summary: string;
  detail: string;
  status: 'available' | 'corrupted' | 'locked';
};

const evidenceItems: Evidence[] = [
  {
    id: 'notification',
    code: 'E-01',
    title: 'Deleted Notification',
    summary: 'Received by every member at exactly 02:17.',
    detail:
      'The notification has no sender, no post ID, and no record in the moderator log. Its final four characters decode to LOOP.',
    status: 'available',
  },
  {
    id: 'mod-log',
    code: 'E-02',
    title: 'Moderator Log',
    summary: 'One action appears to have happened tomorrow.',
    detail:
      'A moderator action is timestamped 18 hours in the future. It removed a post titled “Do not choose the archive.”',
    status: 'available',
  },
  {
    id: 'account',
    code: 'E-03',
    title: 'Missing Account',
    summary: 'The only witness no longer exists.',
    detail:
      'The account left 47 comments, but every comment now belongs to a different user. One deleted reply mentions a red door.',
    status: 'corrupted',
  },
  {
    id: 'image',
    code: 'E-04',
    title: 'Recovered Image',
    summary: 'An image contains a timestamp hidden in its noise.',
    detail:
      'The recovered timestamp matches the next reset. A shape resembling the subreddit icon appears behind the static.',
    status: 'available',
  },
  {
    id: 'message',
    code: 'E-05',
    title: 'Encrypted Message',
    summary: 'Decoder access required.',
    detail:
      'This evidence is locked to another investigator role. Share findings in the comments to reconstruct the full message.',
    status: 'locked',
  },
  {
    id: 'archive',
    code: 'E-06',
    title: 'Old Timeline',
    summary: 'A previous community already attempted this choice.',
    detail:
      'The archive records three failed loops. Each one ended immediately after the community restored the deleted post.',
    status: 'available',
  },
];

const decisions = [
  {
    id: 'restore',
    title: 'Restore the deleted post',
    description: 'Recover the post removed before the current loop began.',
    votes: 38,
    risk: 'High risk',
  },
  {
    id: 'account',
    title: 'Trace the missing account',
    description: 'Follow the witness through archived comments and user records.',
    votes: 51,
    risk: 'Unknown',
  },
  {
    id: 'bot',
    title: 'Interrogate the moderator bot',
    description: 'Compare its memory against the corrupted moderator log.',
    votes: 27,
    risk: 'Moderate risk',
  },
];

const timelineEvents = [
  {
    loop: 'Loop 01',
    choice: 'Opened the red door',
    result: 'Timeline collapsed after 14 minutes.',
  },
  {
    loop: 'Loop 02',
    choice: 'Restored the archive',
    result: 'The witness account disappeared.',
  },
  {
    loop: 'Loop 03',
    choice: 'Ignored the notification',
    result: 'Every comment was replaced at 02:17.',
  },
  {
    loop: 'Loop 04',
    choice: 'Decision in progress',
    result: 'Current timeline.',
  },
];

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export const App = () => {
  const { username, loading } = useCounter();

  const [activeTab, setActiveTab] = useState<Tab>('case');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(47 * 60 + 18);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const role = useMemo(() => {
    const roles = ['Archivist', 'Observer', 'Decoder', 'Witness'];
    const identity = username ?? 'investigator';
    const score = [...identity].reduce(
      (total, character) => total + character.charCodeAt(0),
      0
    );

    return roles[score % roles.length];
  }, [username]);

  const totalVotes =
    decisions.reduce((total, decision) => total + decision.votes, 0) +
    (voteSubmitted ? 1 : 0);

  const getVoteCount = (decisionId: string, votes: number) => {
    return votes + (voteSubmitted && selectedDecision === decisionId ? 1 : 0);
  };

  const submitVote = () => {
    if (!selectedDecision || voteSubmitted) return;
    setVoteSubmitted(true);
  };

  return (
    <div
      className="min-h-screen bg-[#05070b] text-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, #172039 0%, #080b12 42%, #030407 100%)',
      }}
    >
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070a10]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-red-400">
              THREAD ZERO
            </p>
            <p className="mt-1 text-sm font-semibold">The Reddit Time Loop</p>
          </div>

          <div className="text-right">
            <div className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[10px] font-semibold text-red-300">
              LOOP 04 / 07
            </div>
            <p className="mt-1 font-mono text-xs text-slate-300">
              {formatTime(secondsRemaining)}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <section className="overflow-hidden rounded-2xl border border-red-400/20 bg-black/30">
          <div className="border-b border-white/10 bg-red-500/10 px-4 py-2">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-red-300">
              TIMELINE INSTABILITY DETECTED
            </p>
          </div>

          <div className="p-4">
            <p className="text-xs text-slate-400">CASE 04-217</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight">
              The post that never existed
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              At 02:17, every member received the same deleted notification.
              One account remembered what it said. That account no longer
              exists.
            </p>
          </div>
        </section>

        <section className="mt-4 flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300">
              YOUR INVESTIGATION ROLE
            </p>
            <p className="mt-1 text-lg font-bold">
              {loading ? 'Assigning…' : role}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              u/{username ?? 'investigator'}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-2xl">
            {role === 'Archivist'
              ? '🗃️'
              : role === 'Observer'
                ? '👁️'
                : role === 'Decoder'
                  ? '⌁'
                  : '◉'}
          </div>
        </section>

        {activeTab === 'case' && (
          <section className="mt-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                  EVIDENCE BOARD
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  Reconstruct the missing event
                </h2>
              </div>
              <p className="text-xs text-slate-500">4 / 6 found</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {evidenceItems.map((evidence) => {
                const isLocked = evidence.status === 'locked';

                return (
                  <button
                    key={evidence.id}
                    type="button"
                    onClick={() => {
                      if (!isLocked) setSelectedEvidence(evidence);
                    }}
                    className={`min-h-36 rounded-2xl border p-3 text-left transition ${
                      isLocked
                        ? 'cursor-not-allowed border-white/5 bg-white/[0.025] opacity-45'
                        : evidence.status === 'corrupted'
                          ? 'border-red-400/25 bg-red-500/5 hover:border-red-300/50'
                          : 'border-white/10 bg-white/[0.045] hover:border-cyan-300/40 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">
                        {evidence.code}
                      </span>
                      <span className="text-sm">
                        {isLocked
                          ? '🔒'
                          : evidence.status === 'corrupted'
                            ? '⚠'
                            : '◆'}
                      </span>
                    </div>

                    <p className="mt-5 text-sm font-bold">{evidence.title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {evidence.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-violet-300">
                COMMUNITY SIGNAL
              </p>
              <p className="mt-2 text-sm font-semibold">
                63 investigators mentioned a red door.
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Compare your evidence with theories in the Reddit comments.
                No investigator can see the full case alone.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'vote' && (
          <section className="mt-5">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              COMMUNITY DECISION
            </p>
            <h2 className="mt-1 text-lg font-bold">What becomes canon?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The winning decision changes the next timeline for everyone.
            </p>

            <div className="mt-4 space-y-3">
              {decisions.map((decision) => {
                const votes = getVoteCount(decision.id, decision.votes);
                const percentage = Math.round((votes / totalVotes) * 100);
                const isSelected = selectedDecision === decision.id;

                return (
                  <button
                    key={decision.id}
                    type="button"
                    disabled={voteSubmitted}
                    onClick={() => setSelectedDecision(decision.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-red-400 bg-red-500/10'
                        : 'border-white/10 bg-white/[0.04] hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">{decision.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {decision.description}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-[10px] text-red-300">
                        {decision.risk}
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-red-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                      <span>{votes} votes</span>
                      <span>{percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selectedDecision || voteSubmitted}
              onClick={submitVote}
              className="mt-4 w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {voteSubmitted
                ? 'Decision recorded in this timeline'
                : 'Commit community decision'}
            </button>

            {voteSubmitted && (
              <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-center text-xs text-emerald-300">
                Your vote will survive until the timeline resolves.
              </div>
            )}
          </section>
        )}

        {activeTab === 'timeline' && (
          <section className="mt-5">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              COMMUNITY MEMORY
            </p>
            <h2 className="mt-1 text-lg font-bold">Previous timelines</h2>

            <div className="mt-4 space-y-3">
              {timelineEvents.map((event, index) => (
                <div
                  key={event.loop}
                  className={`rounded-2xl border p-4 ${
                    index === timelineEvents.length - 1
                      ? 'border-cyan-400/25 bg-cyan-400/5'
                      : 'border-white/10 bg-white/[0.035]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-slate-400">
                      {event.loop}
                    </p>
                    <span className="text-xs">
                      {index === timelineEvents.length - 1 ? '●' : '×'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold">{event.choice}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {event.result}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#070a10]/95 px-3 py-2 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {[
            { id: 'case' as Tab, label: 'Evidence', icon: '◇' },
            { id: 'vote' as Tab, label: 'Decision', icon: '◉' },
            { id: 'timeline' as Tab, label: 'Timeline', icon: '⌁' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`rounded-xl px-3 py-2 text-center transition ${
                activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="block text-base">{item.icon}</span>
              <span className="mt-1 block text-[10px] font-semibold">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d111b] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-300">
                {selectedEvidence.code}
              </span>
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm"
              >
                ×
              </button>
            </div>

            <h3 className="mt-4 text-xl font-bold">
              {selectedEvidence.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {selectedEvidence.detail}
            </p>

            <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
              <p className="text-xs font-semibold text-amber-300">
                Share this clue
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Other investigator roles may see evidence that contradicts
                yours. Compare findings in the Reddit comments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEvidence(null)}
              className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-black"
            >
              Add to evidence board
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);