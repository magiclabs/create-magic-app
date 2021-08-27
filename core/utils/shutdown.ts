export const ShutdownSignals = [
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGSEGV',
  'SIGUSR1',
  'SIGUSR2',
  'SIGTERM',
] as const;
export type ShutdownSignal = typeof ShutdownSignals[number];

type ShutdownTask = (signal: ShutdownSignal) => void | Promise<void>;

interface ShutdownState {
  tasks: Set<ShutdownTask>;
  isShuttingDown: boolean;
}

const state: ShutdownState = {
  tasks: new Set(),
  isShuttingDown: false,
};

/**
 * Attach the given `task` to `process`
 * events for known shutdown signals.
 */
export function addShutdownTask(task: ShutdownTask) {
  state.tasks.add(task);
}

/**
 * Remove the given `task` from `process`
 * events for known shutdown signals.
 */
export function removeShutdownTask(task: ShutdownTask) {
  state.tasks.delete(task);
}

/**
 * Create process listeners for
 * each registered shutdown signal.
 */
export function useGracefulShutdown() {
  process.stdin.resume();

  ShutdownSignals.forEach((signal) => {
    const onShutdown = async () => {
      if (state.isShuttingDown) return;
      state.isShuttingDown = true;

      const shutdownPromises = [...state.tasks.values()].map((task) => Promise.resolve(task(signal)));
      await Promise.all(shutdownPromises);

      process.exit();
    };

    process.on(signal, onShutdown as any);
  });
}
