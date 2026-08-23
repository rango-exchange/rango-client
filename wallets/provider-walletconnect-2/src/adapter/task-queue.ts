/**
 * Runs tasks one at a time, in the order `run` was called.
 *
 * A task that rejects passes its rejection to its own caller and does not block
 * the tasks behind it.
 */
export class TaskQueue {
  /** Resolves once the task currently at the back of the queue has settled. */
  #tail: Promise<void> = Promise.resolve();

  async run<T>(task: () => Promise<T>): Promise<T> {
    const ourTurn = this.#tail;

    /*
     * Take our place at the back of the queue before awaiting anything, so
     * callers arriving in the same tick line up behind us rather than all
     * reading the same `#tail`. `releaseOurTurn` never rejects, which is what
     * lets the next task run even when this one throws.
     */
    let releaseOurTurn!: () => void;
    this.#tail = new Promise<void>((resolve) => {
      releaseOurTurn = resolve;
    });

    await ourTurn;
    try {
      return await task();
    } finally {
      releaseOurTurn();
    }
  }
}
