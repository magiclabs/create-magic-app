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
export type ShutdownSignal = (typeof ShutdownSignals)[number];

type ShutdownTask = (reason: { signal: ShutdownSignal } | { code: number }) => void | Promise<void>;

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

      await handleShutdownTasks({ signal });

      process.exit();
    };

    process.on(signal, onShutdown as any);
  });
}

async function handleShutdownTasks(reason: { signal: ShutdownSignal } | { code: number }) {
  const shutdownPromises = [...state.tasks.values()].map((task) => Promise.resolve(task(reason)));
  await Promise.all(shutdownPromises);
}

/**
 * Shutdown process in a way that allows for cleanup
 * @param code exit status
 */
export function shutdown(code: number) {
  handleShutdownTasks({ code });
  process.exit(code);
}
