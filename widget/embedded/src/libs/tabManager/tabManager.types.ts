export type ID = number;

type PingMessage = { name: 'ping'; pingAt: number; candidateId: ID };
type PongMessage = { name: 'pong' };
type ForceClaimMessage = {
  name: 'force-claim';
  candidateId: ID;
};
type ForceReleaseMessage = { name: 'force-release'; candidateId: ID };
type ReleaseMessage = { name: 'release' };

export type Message =
  | PingMessage
  | PongMessage
  | ForceClaimMessage
  | ForceReleaseMessage
  | ReleaseMessage;

export type Events = {
  // Initially attempt to verify if the tab can be activated.
  onInit?: () => void;
  onClaim?: () => void;
  onRelease?: () => void;
};

export interface TabManagerInterface {
  init: () => void;
  forceClaim: () => void;
  isClaimed: () => boolean;
  destroy: () => void;
}
