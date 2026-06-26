type Task<T = any> = () => Promise<T>;

interface QueueItem {
  task: Task;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export class AIQueueService {
  private queue: QueueItem[] = [];
  private activeCount = 0;
  private maxConcurrency: number;

  constructor(maxConcurrency = 2) {
    this.maxConcurrency = maxConcurrency;
  }

  /**
   * Enqueues an AI task for execution under concurrency limits
   */
  public enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.next();
    });
  }

  private next(): void {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.activeCount++;
    
    item.task()
      .then((res) => {
        item.resolve(res);
      })
      .catch((err) => {
        item.reject(err);
      })
      .finally(() => {
        this.activeCount--;
        this.next();
      });
  }
}

export const aiQueueService = new AIQueueService();
