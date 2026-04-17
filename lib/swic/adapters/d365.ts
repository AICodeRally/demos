/**
 * D365 Commerce Mock Adapter
 *
 * Generates realistic Microsoft Dynamics 365 Commerce
 * `RetailTransactionPostedBusinessEvent` payloads. Used when the rep
 * clicks "Close Sale" on the Summit Sleep Co. POS tablet demo.
 *
 * Also provides a reverse transform (`d365LinesToSaleItems`) so the
 * existing simulator can operate in "D365 data source" mode.
 */
import type { SaleItem } from '@/lib/swic-engine';
import type {
  D365TransactionEvent,
  D365SalesLine,
  D365TenderLine,
  D365StoreContext,
} from '@/lib/swic/data/d365-schemas';

/* ══════════════════════════════════════════════════════════
   Auto-incrementing control number (D365 sequence)
   ══════════════════════════════════════════════════════════ */

let controlNumberSeq = 5637148700;

/* ══════════════════════════════════════════════════════════
   Category ↔ ID Bidirectional Mapping
   ══════════════════════════════════════════════════════════ */

const CATEGORY_TO_ID: Record<string, number> = {
  'Mattress': 68719476736,
  'Adjustable Base': 68719476737,
  'Accessory': 68719476738,
  'Protection Plan': 68719476739,
  'Delivery': 68719476740,
};

const ID_TO_CATEGORY: Record<number, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_ID).map(([k, v]) => [v, k])
);

/** Map a human-readable category string to its D365 category hierarchy ID. */
export function categoryToId(category: string): number {
  return CATEGORY_TO_ID[category] ?? 68719476750;
}

/** Map a D365 category hierarchy ID back to a human-readable category string. */
export function idToCategory(id: number): string {
  return ID_TO_CATEGORY[id] ?? 'Other';
}

/* ══════════════════════════════════════════════════════════
   Tag Inference
   ══════════════════════════════════════════════════════════ */

/** Infer SWIC tags from a D365 sales line (price tiers, category signals). */
export function inferTags(line: D365SalesLine): string[] {
  const tags: string[] = [];
  if (line.price > 2000) tags.push('premium-tier');
  const cat = idToCategory(line.categoryId);
  if (cat === 'Adjustable Base') tags.push('adjustable-base');
  if (cat === 'Mattress' || cat === 'Adjustable Base') tags.push('bundle-eligible');
  if (cat === 'Protection Plan') tags.push('protection');
  if (cat === 'Accessory') tags.push('accessory');
  return tags;
}

/* ══════════════════════════════════════════════════════════
   SaleItem → D365SalesLine
   ══════════════════════════════════════════════════════════ */

/** Convert one SWIC SaleItem to a D365 RetailTransactionSalesTrans line. */
export function saleItemToD365Line(
  item: SaleItem,
  lineNum: number,
  staffId: string,
  store: D365StoreContext
): D365SalesLine {
  const lineTotal = item.price * item.quantity;
  const taxAmount = +(lineTotal * store.taxRate).toFixed(2);

  return {
    lineNum,
    itemId: item.sku ?? item.id,
    barcode: `590${item.id.replace(/\D/g, '').padStart(10, '0')}`,
    description: item.name,
    categoryId: categoryToId(item.category),
    qty: item.quantity,
    unit: 'ea',
    price: item.price,
    originalPrice: item.price,
    netPrice: item.price,
    netAmount: lineTotal,
    netAmountInclTax: lineTotal + taxAmount,
    costAmount: item.cost * item.quantity,

    discAmount: 0,
    periodicDiscAmount: 0,
    periodicDiscType: 0,
    lineManualDiscountAmount: 0,
    lineManualDiscountPercentage: 0,

    taxAmount,
    taxGroup: store.taxGroup,
    taxItemGroup: item.category.toUpperCase().replace(/\s+/g, '_'),
    taxRatePercent: store.taxRate * 100,

    staffId,
    inventLocationId: `${store.storeId}-WH`,
    inventSiteId: store.storeId.split('-')[0],
    lineType: 0,
    fulfillmentStoreId: store.storeId,
  };
}

/* ══════════════════════════════════════════════════════════
   Generate Full Transaction Event
   ══════════════════════════════════════════════════════════ */

/**
 * Generate a mock D365 `RetailTransactionPostedBusinessEvent`.
 *
 * Mirrors the actual D365 Commerce schema from `RetailTransactionTable`
 * and `RetailTransactionSalesTrans` CDM entities. Produces a complete
 * event envelope + transaction header + sales lines + tender line.
 *
 * @param items     - SWIC SaleItems from the POS cart
 * @param rep       - Sales rep who closed the sale
 * @param store     - Store context (tax rate, IDs, etc.)
 * @param paymentMethod - Payment type, defaults to 'card'
 * @returns A complete D365TransactionEvent ready for display or broadcast
 */
export function generateTransactionEvent(
  items: SaleItem[],
  rep: { id: string; name: string; storeId: string },
  store: D365StoreContext,
  paymentMethod: 'cash' | 'card' = 'card'
): D365TransactionEvent {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];
  const terminalId = `${store.storeId}-115`;
  const seq = String(Date.now()).slice(-10);
  const transactionId = `${store.storeId}-115-${seq}`;
  const receiptId = `${store.storeId}-115-${String(controlNumberSeq).slice(-4)}`;

  // Build sales lines
  const salesLines: D365SalesLine[] = items.map((item, idx) =>
    saleItemToD365Line(item, idx + 1, rep.id, store)
  );

  // Aggregate totals
  const grossAmount = salesLines.reduce((s, l) => s + l.price * l.qty, 0);
  const totalDiscAmount = salesLines.reduce((s, l) => s + l.discAmount, 0);
  const netAmount = grossAmount - totalDiscAmount;
  const taxAmount = salesLines.reduce((s, l) => s + l.taxAmount, 0);
  const paymentAmount = netAmount + taxAmount;
  const numberOfItems = salesLines.reduce((s, l) => s + l.qty, 0);

  // Build tender line
  const tenderLines: D365TenderLine[] = [
    {
      tenderLineId: `TL-${seq}`,
      tenderTypeId: paymentMethod === 'card' ? '2' : '1',
      amount: paymentAmount,
      amountInCompanyCurrency: paymentAmount,
      currency: 'USD',
      exchangeRate: 1.0,
      cardTypeId: paymentMethod === 'card' ? 'VISA' : undefined,
      maskedCardNumber: paymentMethod === 'card'
        ? `************${Math.floor(1000 + Math.random() * 9000)}`
        : undefined,
      cashBackAmount: 0,
      lineNumber: 1,
      tenderDate: now.toISOString(),
      isVoided: false,
      isChangeLine: false,
      authorization: paymentMethod === 'card'
        ? `AUTH-${Math.floor(100000 + Math.random() * 900000)}`
        : undefined,
    },
  ];

  controlNumberSeq++;

  return {
    // Business Event envelope
    BusinessEventId: 'RetailTransactionPostedBusinessEvent',
    ControlNumber: controlNumberSeq,
    EventId: crypto.randomUUID(),
    EventTime: now.toISOString(),
    MajorVersion: 1,
    MinorVersion: 0,
    LegalEntity: 'USRT',
    Category: 'Commerce',

    // Transaction header
    transactionId,
    receiptId,
    store: store.storeId,
    terminal: terminalId,
    channel: 5637145091,
    staffId: rep.id,

    transDate: dateStr,
    transTime: timeStr,
    businessDate: dateStr,
    beginDateTime: new Date(now.getTime() - 180000).toISOString(), // 3 min ago
    timeWhenTransClosed: timeStr,

    transactionType: 2, // Sales
    entryStatus: 0,
    saleIsReturnSale: false,
    currency: 'USD',

    grossAmount,
    netAmount,
    totalDiscAmount,
    taxAmount,
    paymentAmount,
    roundedAmount: 0,
    numberOfItemLines: salesLines.length,
    numberOfItems,
    numberOfPaymentLines: 1,
    isTaxIncludedInPrice: false,

    shift: '001',
    shiftDate: dateStr,
    salesGroup: 'COMM-RETAIL',

    salesLines,
    tenderLines,
  };
}

/* ══════════════════════════════════════════════════════════
   D365SalesLine[] → SaleItem[] (reverse transform)
   ══════════════════════════════════════════════════════════ */

/**
 * Transform D365 sales lines back to SWIC SaleItems.
 * Used when the existing simulator is in "D365" data source mode.
 */
export function d365LinesToSaleItems(lines: D365SalesLine[]): SaleItem[] {
  return lines.map((line) => ({
    id: line.itemId,
    name: line.description,
    sku: line.itemId,
    category: idToCategory(line.categoryId),
    tags: inferTags(line),
    price: line.price,
    cost: line.costAmount / Math.max(line.qty, 1),
    quantity: line.qty,
  }));
}
