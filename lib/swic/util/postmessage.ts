import type { SaleItem, ClientConfig, CalculationResult } from '@/lib/swic/engine/types';

/* ── Inbound Messages (POS → Widget) ─────────────────── */

export interface SWICAddItemMessage {
  type: 'swic:addItem';
  item: SaleItem;
}

export interface SWICRemoveItemMessage {
  type: 'swic:removeItem';
  itemId: string;
}

export interface SWICClearSaleMessage {
  type: 'swic:clearSale';
}

export interface SWICSetItemsMessage {
  type: 'swic:setItems';
  items: SaleItem[];
}

export interface SWICSetRepMessage {
  type: 'swic:setRep';
  repId: string;
}

export interface SWICSetThemeMessage {
  type: 'swic:setTheme';
  theme: 'dark' | 'light';
}

export interface SWICSetConfigMessage {
  type: 'swic:setConfig';
  config: ClientConfig;
}

export type SWICInboundMessage =
  | SWICAddItemMessage
  | SWICRemoveItemMessage
  | SWICClearSaleMessage
  | SWICSetItemsMessage
  | SWICSetRepMessage
  | SWICSetThemeMessage
  | SWICSetConfigMessage;

/* ── Outbound Messages (Widget → POS) ────────────────── */

export interface SWICReadyMessage {
  type: 'swic:ready';
}

export interface SWICCommissionUpdateMessage {
  type: 'swic:commissionUpdate';
  total: number;
  components: { id: string; label: string; amount: number }[];
}

export type SWICOutboundMessage = SWICReadyMessage | SWICCommissionUpdateMessage;

/* ── Helpers ──────────────────────────────────────────── */

export function sendToParent(msg: SWICOutboundMessage) {
  if (typeof window !== 'undefined' && window.parent !== window) {
    window.parent.postMessage(msg, '*');
  }
}

export function isSWICMessage(data: unknown): data is SWICInboundMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    typeof (data as { type: string }).type === 'string' &&
    (data as { type: string }).type.startsWith('swic:')
  );
}
