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

/**
 * Standard D365 Business Events envelope.
 *
 * Every event published by D365 Finance & Operations wraps its payload
 * in this header. The `BusinessEventId` identifies the event catalog entry,
 * while `ControlNumber` provides an incrementing sequence for ordering.
 *
 * @see https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/business-events/home-page
 */
export interface D365BusinessEvent {
  /** Catalog identifier for this business event type (e.g. "RetailTransactionCreated") */
  BusinessEventId: string;
  /** Monotonically increasing sequence number for ordering */
  ControlNumber: number;
  /** Unique event instance identifier (GUID) */
  EventId: string;
  /** ISO 8601 timestamp of when the event was raised */
  EventTime: string;
  /** Major version of the event schema */
  MajorVersion: number;
  /** Minor version of the event schema */
  MinorVersion: number;
  /** Legal entity (company) that originated the event (e.g. "USRT") */
  LegalEntity: string;
  /** Event category for routing (e.g. "Retail", "Sales") */
  Category: string;
}

/* ══════════════════════════════════════════════════════════
   2. D365TransactionHeader — RetailTransactionTable
   ══════════════════════════════════════════════════════════ */

/**
 * Maps to the D365 `RetailTransactionTable` entity.
 *
 * This is the header record for every POS transaction. It contains
 * store/terminal context, customer info, financial totals, and
 * shift metadata. One header can have many sales lines and tender lines.
 *
 * @see https://learn.microsoft.com/en-us/dynamics365/commerce/dev-itpro/retail-store-system-data
 */
export interface D365TransactionHeader {
  /* ── Identity ────────────────────────────────────────── */

  /** Unique transaction identifier (store + terminal + sequence) */
  transactionId: string;
  /** Printed receipt number shown to customer */
  receiptId: string;
  /** Store number (e.g. "HOUSTON-01") */
  store: string;
  /** POS terminal/register number */
  terminal: string;
  /** Operating unit / channel number in D365 */
  channel: number;
  /** Staff ID of the cashier who processed the transaction */
  staffId: string;

  /* ── Customer (optional) ─────────────────────────────── */

  /** Customer account number (if identified) */
  custAccount?: string;
  /** Loyalty card scanned at POS (if any) */
  loyaltyCardId?: string;

  /* ── Timestamps ──────────────────────────────────────── */

  /** Transaction date (YYYY-MM-DD) */
  transDate: string;
  /** Transaction time (HH:mm:ss) */
  transTime: string;
  /** Fiscal business date (may differ from transDate for late-night sales) */
  businessDate: string;
  /** ISO 8601 datetime when the transaction was started */
  beginDateTime: string;
  /** ISO 8601 datetime when the transaction was closed/tendered */
  timeWhenTransClosed: string;

  /* ── Classification ──────────────────────────────────── */

  /**
   * D365 transaction type enum.
   * 2 = Sales, 3 = Payment, 5 = BankDrop, 9 = IncomeExpense, etc.
   */
  transactionType: number;
  /**
   * Entry status enum.
   * 0 = Created, 1 = Posted, 2 = Voided
   */
  entryStatus: number;
  /** True if this transaction is a return/refund */
  saleIsReturnSale: boolean;
  /** ISO 4217 currency code (e.g. "USD") */
  currency: string;

  /* ── Financial Totals ────────────────────────────────── */

  /** Gross amount before discounts */
  grossAmount: number;
  /** Net amount after discounts, before tax */
  netAmount: number;
  /** Total discount amount applied */
  totalDiscAmount: number;
  /** Total tax amount */
  taxAmount: number;
  /** Total payment collected */
  paymentAmount: number;
  /** Amount after rounding (cash rounding rules) */
  roundedAmount: number;

  /* ── Line Counts ─────────────────────────────────────── */

  /** Number of distinct sale line entries */
  numberOfItemLines: number;
  /** Total item quantity across all lines */
  numberOfItems: number;
  /** Number of tender/payment lines */
  numberOfPaymentLines: number;

  /* ── Tax ──────────────────────────────────────────────── */

  /** Whether item prices already include tax (tax-inclusive pricing) */
  isTaxIncludedInPrice: boolean;

  /* ── Shift / Sales Group ─────────────────────────────── */

  /** Shift identifier */
  shift: string;
  /** Date the shift was opened (YYYY-MM-DD) */
  shiftDate: string;
  /** Sales group for commission attribution (optional) */
  salesGroup?: string;
}

/* ══════════════════════════════════════════════════════════
   3. D365SalesLine — RetailTransactionSalesTrans
   ══════════════════════════════════════════════════════════ */

/**
 * Maps to the D365 `RetailTransactionSalesTrans` entity.
 *
 * Each line represents one product sold (or returned) within a transaction.
 * Includes item identity, pricing, discount breakdown, tax detail, and
 * per-line rep attribution for commission calculations.
 *
 * @see https://learn.microsoft.com/en-us/dynamics365/commerce/dev-itpro/retail-store-system-data
 */
export interface D365SalesLine {
  /* ── Line Identity ───────────────────────────────────── */

  /** Sequential line number within the transaction */
  lineNum: number;
  /** Product item ID (SKU) */
  itemId: string;
  /** Barcode scanned (if available) */
  barcode?: string;
  /** Product variant ID for size/color/style variants */
  variantId?: string;
  /** Product description / display name */
  description: string;
  /** Product category hierarchy ID */
  categoryId: number;

  /* ── Quantity & Pricing ──────────────────────────────── */

  /** Quantity sold (negative for returns) */
  qty: number;
  /** Unit of measure (e.g. "ea", "pair") */
  unit: string;
  /** Selling price per unit */
  price: number;
  /** Original list price before any discounts */
  originalPrice: number;
  /** Effective price per unit after all discounts */
  netPrice: number;
  /** Line net amount (qty x netPrice), excluding tax */
  netAmount: number;
  /** Line net amount including tax */
  netAmountInclTax: number;
  /** Cost amount for margin calculations */
  costAmount: number;

  /* ── Discounts ───────────────────────────────────────── */

  /** Total discount amount on this line */
  discAmount: number;
  /** Periodic (promotional) discount amount */
  periodicDiscAmount: number;
  /**
   * Periodic discount type enum.
   * 0 = None, 1 = MultiBuy, 2 = MixAndMatch, 3 = OfferPrice, 4 = Quantity
   */
  periodicDiscType: number;
  /** Manual discount amount applied by cashier */
  lineManualDiscountAmount: number;
  /** Manual discount percentage applied by cashier */
  lineManualDiscountPercentage: number;
  /** Discount offer ID that applied (if periodic) */
  discOfferId?: string;

  /* ── Tax ──────────────────────────────────────────────── */

  /** Tax amount for this line */
  taxAmount: number;
  /** Tax group (e.g. "FullTax", "ReducedTax") */
  taxGroup: string;
  /** Item tax group (product-level tax classification) */
  taxItemGroup: string;
  /** Effective tax rate percentage (e.g. 8.25) */
  taxRatePercent: number;

  /* ── Rep Attribution ─────────────────────────────────── */

  /** Staff ID of the sales rep credited for this line (commission attribution) */
  staffId: string;

  /* ── Inventory ───────────────────────────────────────── */

  /** Inventory warehouse location ID */
  inventLocationId: string;
  /** Inventory site ID */
  inventSiteId: string;

  /* ── Line Classification ─────────────────────────────── */

  /**
   * Line type enum.
   * 0 = Sale, 1 = VoidedLine, 2 = DiscountVoucher, 3 = Payment
   */
  lineType: number;
  /** Fulfillment store ID for ship-from-store orders */
  fulfillmentStoreId?: string;
  /** Delivery mode (e.g. "pickup", "ship", "carryout") */
  dlvMode?: string;

  /* ── Return Reference ────────────────────────────────── */

  /** Original transaction ID being returned against */
  returnTransactionId?: string;
  /** Original line number being returned */
  returnLineNum?: number;
}

/* ══════════════════════════════════════════════════════════
   4. D365TenderLine — RetailTransactionPaymentTrans
   ══════════════════════════════════════════════════════════ */

/**
 * Maps to the D365 `RetailTransactionPaymentTrans` entity.
 *
 * Each tender line represents one payment method applied to a transaction.
 * D365 supports split-tender (multiple payment methods per transaction).
 * Tender type IDs follow the D365 convention: "1" = Cash, "2" = Card, "3" = Check.
 *
 * @see https://learn.microsoft.com/en-us/dynamics365/commerce/payment-methods
 */
export interface D365TenderLine {
  /* ── Identity ────────────────────────────────────────── */

  /** Unique identifier for this tender line */
  tenderLineId: string;
  /**
   * Tender type ID.
   * "1" = Cash, "2" = Card, "3" = Check, "4" = Gift Card, "5" = Loyalty
   */
  tenderTypeId: string;

  /* ── Amounts ─────────────────────────────────────────── */

  /** Payment amount in transaction currency */
  amount: number;
  /** Payment amount converted to the company's base currency */
  amountInCompanyCurrency: number;
  /** ISO 4217 currency code */
  currency: string;
  /** Exchange rate used if currency differs from company currency */
  exchangeRate: number;

  /* ── Card Details ────────────────────────────────────── */

  /** Card type identifier (e.g. "Visa", "Mastercard") — only for card tenders */
  cardTypeId?: string;
  /** Masked card number (e.g. "****1234") — only for card tenders */
  maskedCardNumber?: string;
  /** Cash back amount given to customer (debit transactions) */
  cashBackAmount: number;

  /* ── Metadata ────────────────────────────────────────── */

  /** Sequential line number within the tender lines */
  lineNumber: number;
  /** Date the tender was applied (ISO 8601) */
  tenderDate: string;
  /** True if this tender line was voided */
  isVoided: boolean;
  /** True if this is a change line (cash change given back) */
  isChangeLine: boolean;
  /** Authorization code from payment processor */
  authorization?: string;
}

/* ══════════════════════════════════════════════════════════
   5. D365TransactionEvent — Full transaction payload
   ══════════════════════════════════════════════════════════ */

/**
 * Complete D365 transaction event combining the Business Event envelope,
 * the transaction header, and all associated sales and tender lines.
 *
 * This is the shape of the payload that would arrive via a D365 Business
 * Event webhook when a retail transaction is completed. It extends both
 * the event envelope and the transaction header, then adds the line-level
 * detail arrays.
 */
export interface D365TransactionEvent
  extends D365BusinessEvent,
    D365TransactionHeader {
  /** All item/product lines in this transaction */
  salesLines: D365SalesLine[];
  /** All payment/tender lines in this transaction */
  tenderLines: D365TenderLine[];
}

/* ══════════════════════════════════════════════════════════
   6. D365StoreContext — Store configuration for dashboards
   ══════════════════════════════════════════════════════════ */

/**
 * Store-level context used by the manager dashboard.
 *
 * Provides the store identity, tax configuration, and operational
 * parameters needed to render the manager view. In a real D365 deployment
 * this would come from the RetailStoreTable and related config entities.
 *
 * @see https://learn.microsoft.com/en-us/dynamics365/commerce/channels-setup-overview
 */
export interface D365StoreContext {
  /** Store number / operating unit ID (e.g. "HOUSTON-01") */
  storeId: string;
  /** Display name of the store */
  storeName: string;
  /** Store physical address (single-line formatted) */
  address: string;
  /** Tax group assigned to this store */
  taxGroup: string;
  /** Default tax rate as a decimal (e.g. 0.0825 for 8.25%) */
  taxRate: number;
  /** Monthly commission budget allocated to this store */
  commissionBudget: number;
  /** Shift start time in HH:mm format (e.g. "09:00") */
  shiftStart: string;
}

/* ══════════════════════════════════════════════════════════
   7. ClosedSale — POS → Manager broadcast message
   ══════════════════════════════════════════════════════════ */

/**
 * Message broadcast from the POS tablet to the Manager dashboard
 * via BroadcastChannel when a sale is closed.
 *
 * Combines the raw D365 transaction event with the calculated
 * commission breakdown and rep identity, so the manager can
 * see real-time sales and commission data without re-calculating.
 */
export interface ClosedSale {
  /** The full D365 transaction event that was just closed */
  event: D365TransactionEvent;

  /** Computed commission breakdown for this sale */
  commission: {
    /** Total commission earned on this transaction */
    total: number;
    /** Individual commission components (base, bonus, spiff, etc.) */
    components: {
      /** Component rule ID (matches ClientConfig component IDs) */
      id: string;
      /** Human-readable label (e.g. "Base Comm.", "Accessory Bonus") */
      label: string;
      /** Dollar amount earned for this component */
      amount: number;
    }[];
  };

  /** Sales rep who closed the sale */
  rep: {
    /** Rep staff ID */
    id: string;
    /** Rep display name */
    name: string;
    /** Store the rep is assigned to */
    storeId: string;
  };

  /** ISO 8601 timestamp of when the sale was broadcast */
  timestamp: string;
}
