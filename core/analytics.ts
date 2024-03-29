import os from 'os';
import { Analytics as Segment } from '@segment/analytics-node';
import { loadConfig } from './config';
import { addShutdownTask } from './utils/shutdown';

export interface Analytics {
  logEvent(event: string, data: any): void;
  identifyUser(userId: string): void;
  prepareForShutdown(): Promise<void>;
}

export class SegmentAnalytics implements Analytics {
  private segment: Segment;

  constructor() {
    this.segment = new Segment({ writeKey: 'g9GIEwAL2HOQHq6PXg9gHzSjEBuAuRLq' });
    addShutdownTask(async (reason) => {
      this.logEvent('cli-tool-shutdown', reason);
      await this.prepareForShutdown();
    });
  }

  logEvent(event: string, data: any): void {
    const config = loadConfig();
    if (config?.shouldTrackUsageData ?? false) {
      this.segment.track({ anonymousId: config?.id ?? '', event, properties: data });
    }
  }

  identifyUser(userId: string) {
    const config = loadConfig();
    if (config?.shouldTrackUsageData ?? false) {
      this.segment.identify({ userId, traits: { os: os.platform } });
    }
  }

  async prepareForShutdown(): Promise<void> {
    await this.segment.closeAndFlush();
  }
}

export const SharedAnalytics = new SegmentAnalytics();
