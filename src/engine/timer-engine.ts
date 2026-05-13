type TimerCallback = (remainingTime: number) => void;
type TimerCompleteCallback = () => void;

export class TimerEngine {
  private duration: number;
  private remaining: number;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastTick: number = 0;
  private onTick: TimerCallback;
  private onComplete: TimerCompleteCallback;

  constructor(
    duration: number,
    onTick: TimerCallback,
    onComplete: TimerCompleteCallback
  ) {
    this.duration = duration;
    this.remaining = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start() {
    if (this.intervalId) return;
    this.lastTick = Date.now();
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - this.lastTick) / 1000);
      if (delta >= 1) {
        this.lastTick = now;
        this.remaining = Math.max(0, this.remaining - delta);
        this.onTick(this.remaining);
        if (this.remaining <= 0) {
          this.stop();
          this.onComplete();
        }
      }
    }, 250);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.remaining = this.duration;
  }

  getRemainingTime(): number {
    return this.remaining;
  }

  reduceTime(seconds: number) {
    this.remaining = Math.max(0, this.remaining - seconds);
    this.onTick(this.remaining);
  }
}
