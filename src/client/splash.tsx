import './index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const roleSignals = [
  {
    icon: '🗃️',
    name: 'Archivist',
    clue: 'Remembers earlier loops',
  },
  {
    icon: '👁️',
    name: 'Observer',
    clue: 'Sees hidden changes',
  },
  {
    icon: '⌁',
    name: 'Decoder',
    clue: 'Reads encrypted evidence',
  },
  {
    icon: '◉',
    name: 'Witness',
    clue: 'Remembers deleted words',
  },
];

export const Splash = () => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030407] px-4 py-6 text-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 8%, #47111d 0%, #151a2a 32%, #06080d 65%, #020305 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full border border-red-400/20" />
        <div className="absolute left-1/2 top-10 h-52 w-52 -translate-x-1/2 rounded-full border border-red-400/15" />
        <div className="absolute left-1/2 top-20 h-32 w-32 -translate-x-1/2 rounded-full border border-red-400/10" />
      </div>

      <div className="absolute left-0 right-0 top-0 h-px bg-red-400/70" />

      <main className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-red-400/20 bg-black/45 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/10 bg-red-500/5 px-5 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.32em] text-red-300">
              THREAD ZERO
            </p>

            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 font-mono text-[9px] font-semibold text-red-300">
              LOOP 04 / 07
            </span>
          </div>
        </div>

        <div className="px-5 pb-5 pt-6">
          <div className="flex justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-full border border-red-400/20 bg-red-500/5" />

              <div className="absolute inset-3 rounded-full border border-red-300/20" />

              <div className="absolute inset-7 rounded-full border border-red-300/20 bg-black/40" />

              <div className="relative text-center">
                <p className="font-mono text-2xl font-black text-red-300">
                  02:17
                </p>

                <p className="mt-1 text-[8px] font-semibold tracking-[0.18em] text-red-200/60">
                  RESET SIGNAL
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[10px] font-bold tracking-[0.24em] text-red-300">
            TIMELINE INSTABILITY DETECTED
          </p>

          <h1 className="mt-3 text-center text-3xl font-black leading-tight tracking-tight">
            The post that
            <br />
            never existed
          </h1>

          <p className="mx-auto mt-4 max-w-xs text-center text-sm leading-6 text-slate-300">
            Every member received the same deleted notification. One account
            remembered what it said. That account no longer exists.
          </p>

          <section className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] text-cyan-300">
                  INVESTIGATOR DETECTED
                </p>

                <p className="mt-1 text-sm font-bold">
                  u/{context.username ?? 'unknown'}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                ◉
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-cyan-100/70">
              Reddit will assign your investigation role when you enter the
              timeline. Your private clue may differ from everyone else’s.
            </p>
          </section>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {roleSignals.map((role) => (
              <div
                key={role.name}
                className="rounded-xl border border-white/10 bg-white/[0.035] p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{role.icon}</span>

                  <p className="text-[11px] font-bold">{role.name}</p>
                </div>

                <p className="mt-1 text-[9px] leading-4 text-slate-500">
                  {role.clue}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-red-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-red-950/40 transition hover:bg-red-400 active:scale-[0.99]"
            onClick={(event) => requestExpandedMode(event.nativeEvent, 'game')}
          >
            Enter the current timeline
          </button>

          <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Shared community memory online</span>
          </div>
        </div>
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
