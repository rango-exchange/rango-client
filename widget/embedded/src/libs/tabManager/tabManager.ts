import type {
  Events,
  ID,
  Message,
  TabManagerInterface,
} from './tabManager.types';

import { CHANNEL_NAME, MAXIMUM_TAB_ID, TIMEOUT } from './tabManager.constants';

export class TabManager implements TabManagerInterface {
  private tabId: ID;
  private state: 'not-initiated' | 'not-claimed' | 'claimed' = 'not-initiated';
  private lastTryClaim: number | undefined;
  private events: Events = {};
  private channel: BroadcastChannel;

  constructor(events: Events) {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.tabId = Math.trunc(Math.random() * MAXIMUM_TAB_ID);
    this.events = events;
  }

  init = () => {
    this.initEvents();
    void this.tryClaim();
  };

  /**
   * This is applicable when a user in an inactive tab seeks to activate that tab.
   */
  forceClaim = () => {
    if (!this.isClaimed()) {
      const message: Message = { name: 'force-claim', candidateId: this.tabId };
      this.channel.postMessage(message);
      setTimeout(() => {
        if (!this.isClaimed()) {
          this.claim();
        }
      }, TIMEOUT);
    }
  };

  isClaimed = () => {
    return this.state === 'claimed';
  };

  /**
   * remove event listeners
   */
  destroy = () => {
    this.channel.removeEventListener('message', this.handleMessageEvent);
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
    document.removeEventListener('resume', this.handleResume);
  };

  /**
   * Reacting to messages and window events to claim.
   */
  private initEvents() {
    this.channel.addEventListener('message', this.handleMessageEvent);

    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    /**
     * The "resume" event is currently supported only in certain browsers.
     * It is triggered when a previously frozen tab is unfrozen and resumes execution.
     * To avoid having multiple active tabs,
     * if the current tab is active after the "resume" event,
     * we send a signal to other tabs to verify if any of them currently claim to be active.
     * If this is the case, we deactivate the current tab.
     * https://developer.chrome.com/docs/web-platform/page-lifecycle-api
     */
    document.addEventListener('resume', this.handleResume);
  }

  /**
   * Runs after a `ping` message and checks if current tab is claimed the tabs,
   *    if yes, it responds with `pong`, If not, it doesn't do anything.
   *
   * Note 1: If we receive a `ping` message,
   *    it means a tab is trying to claim tabs directly, usually it's the active tab.
   *
   * Note 2: If multiple tabs are opening at once, all of them are broadcasting `ping`
   *    and eventually all of them will `claim` the queue after the TIMEOUT.
   *    For avoiding this, we will accepts the oldest broadcasted ping. (`isPingSentBefore`)
   */
  private claimedByCurrentTab(pingAt: number) {
    const isPingSentBefore = this.lastTryClaim && this.lastTryClaim < pingAt;

    if (this.isClaimed() || isPingSentBefore) {
      const message: Message = {
        name: 'pong',
      };
      this.channel.postMessage(message);
      return;
    }
  }

  private handleMessageEvent = (event: MessageEvent<Message>) => {
    const name = event.data.name;

    switch (name) {
      case 'ping':
        this.claimedByCurrentTab(event.data.pingAt);
        break;

      case 'pong':
        this.alreadyClaimedByAnotherTab();
        break;

      case 'force-claim':
        this.forceRelease(event.data.candidateId);
        break;

      case 'force-release':
        if (this.tabId === event.data.candidateId) {
          this.claim();
        }
        break;

      default:
        throw new Error(`${name} is not supported.`);
    }
  };

  private handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      await this.tryClaim();
    }
  };

  private handleResume = async () => {
    if (this.isClaimed()) {
      await this.tryClaim();
      if (!this.isClaimed()) {
        this.events.onRelease?.();
      }
    }
  };
  /**
   * Runs after receiving `pong` message, which means one of tabs already claimed the tabs.
   */
  private alreadyClaimedByAnotherTab() {
    this.resetLastCheck();
  }

  /**
   * Try to send a `ping` message to know if the tabs `claimed` or not.
   * On constructing instance, or whenever page is active we will try.
   */
  private async tryClaim() {
    /**
     * Try to ask from possible other running tabs.
     */
    this.setLastCheck();
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.check();
        resolve();
      }, TIMEOUT);
    });
  }

  /**
   * If `lastCheck` is exist, it means there is no other tabs which `claimed` the tabs.
   * And we mark the current tab as `claimed`
   */
  private check() {
    if (this.state === 'not-initiated') {
      this.events.onInit?.();
    }
    /**
     *it means we didn't get any response from other tabs, this tab can claim.
     */
    if (this.lastTryClaim) {
      this.claim();
      this.resetLastCheck();
    } else {
      this.state = 'not-claimed';
    }
  }

  private claim() {
    this.state = 'claimed';
    this.events.onClaim?.();
  }

  /**
   * Setting current time as `lastCheck` and broadcast a `ping` message event.
   */
  private setLastCheck() {
    this.lastTryClaim = Date.now();
    const message: Message = {
      name: 'ping',
      pingAt: this.lastTryClaim,
    };
    this.channel.postMessage(message);
  }

  private resetLastCheck() {
    this.lastTryClaim = undefined;
  }

  /**
   * Upon receipt of a "force-claim" message,
   * the presently active tab is expected to deactivate itself and initiate any attached callback associated with this event.
   */
  private forceRelease(nextActiveTab: ID) {
    if (this.isClaimed()) {
      this.state = 'not-claimed';

      this.events.onRelease?.();

      const message: Message = {
        name: 'force-release',
        candidateId: nextActiveTab,
      };

      this.channel.postMessage(message);
    }
  }
}
