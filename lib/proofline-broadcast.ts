// Proofline BroadcastChannel — Manager (day planner) → Rep (tablet)

const CHANNEL_NAME = 'proofline-route';

export type BroadcastMessage =
  | { type: 'coaching'; data: CoachingPush }
  | { type: 'alert'; data: AlertPush }
  | { type: 'priority-change'; data: PriorityPush }
  | { type: 'ack'; data: { id: string } };

export interface CoachingPush {
  id: string;
  stopId: string;
  stopName: string;
  message: string;
  product?: string;
  cases?: number;
  timestamp: string;
}

export interface AlertPush {
  id: string;
  severity: 'info' | 'warning' | 'urgent';
  message: string;
  timestamp: string;
}

export interface PriorityPush {
  id: string;
  stopId: string;
  stopName: string;
  reason: string;
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

export function broadcastAlert(data: AlertPush): void {
  getChannel().postMessage({ type: 'alert', data } satisfies BroadcastMessage);
}

export function broadcastPriority(data: PriorityPush): void {
  getChannel().postMessage({ type: 'priority-change', data } satisfies BroadcastMessage);
}

export function broadcastAck(id: string): void {
  getChannel().postMessage({ type: 'ack', data: { id } } satisfies BroadcastMessage);
}

export function onBroadcast(callback: (msg: BroadcastMessage) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent<BroadcastMessage>) => callback(event.data);
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}
