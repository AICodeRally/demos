// Register BroadcastChannel — Manager Console / Comp Admin → Rep POS Tablet

const CHANNEL_NAME = 'register-pos';

export type BroadcastMessage =
  | { type: 'coaching'; data: CoachingPush }
  | { type: 'comp-update'; data: CompUpdatePush }
  | { type: 'alert'; data: AlertPush }
  | { type: 'pos-sync'; data: PosSyncPush }
  | { type: 'ack'; data: { id: string } };

export interface CoachingPush {
  id: string;
  repId: string;
  repName: string;
  message: string;
  action: string;
  commissionDelta?: number;
  timestamp: string;
}

export interface CompUpdatePush {
  id: string;
  planId: string;
  planName: string;
  changeType: 'tier_rate' | 'spiff_toggle' | 'accelerator' | 'full_plan';
  summary: string;
  pushedBy: string;
  timestamp: string;
}

export interface AlertPush {
  id: string;
  severity: 'info' | 'warning' | 'urgent';
  message: string;
  timestamp: string;
}

export interface PosSyncPush {
  id: string;
  reason: string;
  planIds: string[];
  timestamp: string;
}

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
  return channel;
}

export function broadcastCoaching(data: CoachingPush): void {
  getChannel().postMessage({ type: 'coaching', data } satisfies BroadcastMessage);
}

export function broadcastCompUpdate(data: CompUpdatePush): void {
  getChannel().postMessage({ type: 'comp-update', data } satisfies BroadcastMessage);
}

export function broadcastAlert(data: AlertPush): void {
  getChannel().postMessage({ type: 'alert', data } satisfies BroadcastMessage);
}

export function broadcastPosSync(data: PosSyncPush): void {
  getChannel().postMessage({ type: 'pos-sync', data } satisfies BroadcastMessage);
}

export function broadcastAck(id: string): void {
  getChannel().postMessage({ type: 'ack', data: { id } } satisfies BroadcastMessage);
}

export function onRegisterBroadcast(callback: (msg: BroadcastMessage) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent<BroadcastMessage>) => callback(event.data);
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}
