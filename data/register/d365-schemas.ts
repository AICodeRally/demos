/**
 * D365 Commerce Schema Types
 *
 * TypeScript interfaces mirroring Microsoft Dynamics 365 Commerce CDM entities.
 * Field names match the actual D365 RetailTransactionTable,
 * RetailTransactionSalesTrans, and RetailTransactionPaymentTrans schemas
 * so anyone familiar with D365 will recognize them immediately.
 *
 * Used by the D365 mock adapter and POS/Manager dashboard components.
 */

/* ══════════════════════════════════════════════════════════
   1. D365BusinessEvent — Business Event envelope
   ══════════════════════════════════════════════════════════ */

export interface D365BusinessEvent {
  BusinessEventId: string;
  ControlNumber: number;
  EventId: string;
  EventTime: string;
  MajorVersion: number;
  MinorVersion: number;
  LegalEntity: string;
  Category: string;
}

/* ══════════════════════════════════════════════════════════
   2. D365TransactionHeader — RetailTransactionTable
   ══════════════════════════════════════════════════════════ */

export interface D365TransactionHeader {
  transactionId: string;
  receiptId: string;
  store: string;
  terminal: string;
  channel: number;
  staffId: string;
  custAccount?: string;
  loyaltyCardId?: string;
  transDate: string;
  transTime: string;
  businessDate: string;
  beginDateTime: string;
  timeWhenTransClosed: string;
  transactionType: number;
  entryStatus: number;
  saleIsReturnSale: boolean;
  currency: string;
  grossAmount: number;
  netAmount: number;
  totalDiscAmount: number;
  taxAmount: number;
  paymentAmount: number;
  roundedAmount: number;
  numberOfItemLines: number;
  numberOfItems: number;
  numberOfPaymentLines: number;
  isTaxIncludedInPrice: boolean;
  shift: string;
  shiftDate: string;
  salesGroup?: string;
}

/* ══════════════════════════════════════════════════════════
   3. D365SalesLine — RetailTransactionSalesTrans
   ══════════════════════════════════════════════════════════ */

export interface D365SalesLine {
  lineNum: number;
  itemId: string;
  barcode?: string;
  variantId?: string;
  description: string;
  categoryId: number;
  qty: number;
  unit: string;
  price: number;
  originalPrice: number;
  netPrice: number;
  netAmount: number;
  netAmountInclTax: number;
  costAmount: number;
  discAmount: number;
  periodicDiscAmount: number;
  periodicDiscType: number;
  lineManualDiscountAmount: number;
  lineManualDiscountPercentage: number;
  discOfferId?: string;
  taxAmount: number;
  taxGroup: string;
  taxItemGroup: string;
  taxRatePercent: number;
  staffId: string;
  inventLocationId: string;
  inventSiteId: string;
  lineType: number;
  fulfillmentStoreId?: string;
  dlvMode?: string;
  returnTransactionId?: string;
  returnLineNum?: number;
}

/* ══════════════════════════════════════════════════════════
   4. D365TenderLine — RetailTransactionPaymentTrans
   ══════════════════════════════════════════════════════════ */

export interface D365TenderLine {
  tenderLineId: string;
  tenderTypeId: string;
  amount: number;
  amountInCompanyCurrency: number;
  currency: string;
  exchangeRate: number;
  cardTypeId?: string;
  maskedCardNumber?: string;
  cashBackAmount: number;
  lineNumber: number;
  tenderDate: string;
  isVoided: boolean;
  isChangeLine: boolean;
  authorization?: string;
}

/* ══════════════════════════════════════════════════════════
   5. D365TransactionEvent — Full transaction payload
   ══════════════════════════════════════════════════════════ */

export interface D365TransactionEvent
  extends D365BusinessEvent,
    D365TransactionHeader {
  salesLines: D365SalesLine[];
  tenderLines: D365TenderLine[];
}

/* ══════════════════════════════════════════════════════════
   6. D365StoreContext — Store configuration for dashboards
   ══════════════════════════════════════════════════════════ */

export interface D365StoreContext {
  storeId: string;
  storeName: string;
  address: string;
  taxGroup: string;
  taxRate: number;
  commissionBudget: number;
  shiftStart: string;
}

/* ══════════════════════════════════════════════════════════
   7. ClosedSale — POS → Manager broadcast message
   ══════════════════════════════════════════════════════════ */

export interface ClosedSale {
  event: D365TransactionEvent;
  commission: {
    total: number;
    components: {
      id: string;
      label: string;
      amount: number;
    }[];
  };
  rep: {
    id: string;
    name: string;
    storeId: string;
  };
  timestamp: string;
}
