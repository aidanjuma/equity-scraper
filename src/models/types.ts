export interface IProviderInfo {
  name: string;
  baseUrl: string;
  logo: string;
  classPath: string;
}

export interface IAsset {
  assetType?: AssetType;
  ticker: string;
  baseAsset?: string;
  quoteAsset?: string;
}

export interface IGoogleFinanceAsset extends IAsset {
  market?: string;
  label?: string;
  marketCurrency?: Currency;
  price?: number;
  marketSummary?: IMarketSummary;
  about?: string;
  news?: INewsArticle[];
}

export interface IPriceRange {
  low: number;
  high: number;
}

export interface IMarketSummary {
  previousClosePrice?: number;
  dayRange?: IPriceRange;
  volume?: number;
  primaryExchange?: Market;
  marketSegment?: string;
  openInterest?: number;
  settlementPrice?: number;
  yearRange?: IPriceRange;
  marketCap?: number;
  avgVolume?: number;
  pteRatio?: string;
  dividendYield?: number;
}

export interface INewsArticle {
  title: string;
  link: string;
  source?: string;
  published?: string;
  thumbnail?: string;
}

export interface IBinanceAsset extends IAsset {
  // Provided @ */exchangeInfo endpoint.
  status?: string;
  baseAssetPrecision?: number;
  quotePrecision?: number;
  quoteAssetPrecision?: number;
  // Provided @ avg. price, curr. price endpoints.
  price?: number;
}

export enum AssetType {
  Stock = "Stock",
  Index = "Index",
  Future = "Future",
  Currency = "Currency",
  Cryptocurrency = "Cryptocurrency",
}

export enum Market {
  NYSE = "NYSE",
  NASDAQ = "NASDAQ",
  TPE = "TPE",
  KPX = "KPX",
  BVMF = "BVMF",
  SHA = "SHA",
  IDX = "IDX",
  WSE = "WSE",
  ETR = "ETR",
  IST = "IST",
  NZE = "NZE",
  LON = "LON",
  TYO = "TYO",
  HKG = "HKG",
  NSE = "NSE",
  KLSE = "KLSE",
  SHE = "SHE",
  ASX = "ASX",
  BIT = "BIT",
  BKK = "BKK",
  TSE = "TSE",
  TADAWUL = "TADAWUL",
  TLV = "TLV",
  STO = "STO",
  CVE = "CVE",
  CPH = "CPH",
  SGX = "SGX",
  CNSX = "CNSX",
  AMS = "AMS",
  FRA = "FRA",
  EPA = "EPA",
  SWX = "SWX",
  HEL = "HEL",
  KOSDAQ = "KOSDAQ",
  BOM = "BOM",
  BME = "BME",
  JSE = "JSE",
  BMV = "BMV",
  BCBA = "BCBA",
  VIE = "VIE",
  EBR = "EBR",
  ELI = "ELI",
  ICE = "ICE",
  TAL = "TAL",
  VSE = "VSE",
  OTCMKTS = "OTCMKTS",
  NYSEARCA = "NYSEARCA",
  NYSEAMERICAN = "NYSEAMERICAN",
  MUTF = "MUTF",
  MUTF_IN = "MUTF_IN",
  BATS = "BATS",
  CBOT = "CBOT",
  CME_EMINIS = "CME_EMINIS",
  NYMEX = "NYMEX",
}

export enum Currency {
  AED = "AED",
  AFN = "AFN",
  ALL = "ALL",
  AMD = "AMD",
  ANG = "ANG",
  AOA = "AOA",
  ARS = "ARS",
  AUD = "AUD",
  AWG = "AWG",
  AZN = "AZN",
  BAM = "BAM",
  BBD = "BBD",
  BDT = "BDT",
  BGN = "BGN",
  BHD = "BHD",
  BIF = "BIF",
  BMD = "BMD",
  BND = "BND",
  BOB = "BOB",
  BRL = "BRL",
  BSD = "BSD",
  BTN = "BTN",
  BWP = "BWP",
  BYN = "BYN",
  BZD = "BZD",
  CAD = "CAD",
  CDF = "CDF",
  CHF = "CHF",
  CLP = "CLP",
  CNY = "CNY",
  COP = "COP",
  CRC = "CRC",
  CUC = "CUC",
  CUP = "CUP",
  CVE = "CVE",
  CZK = "CZK",
  DJF = "DJF",
  DKK = "DKK",
  DOP = "DOP",
  DZD = "DZD",
  EGP = "EGP",
  ERN = "ERN",
  ETB = "ETB",
  EUR = "EUR",
  FJD = "FJD",
  FKP = "FKP",
  GBP = "GBP",
  GBX = "GBX", // Non-ISO4217
  GEL = "GEL",
  GGP = "GGP",
  GHS = "GHS",
  GIP = "GIP",
  GMD = "GMD",
  GNF = "GNF",
  GTQ = "GTQ",
  GYD = "GYD",
  HKD = "HKD",
  HNL = "HNL",
  HRK = "HRK",
  HTG = "HTG",
  HUF = "HUF",
  IDR = "IDR",
  ILA = "ILA", // Non-ISO4217
  ILS = "ILS",
  IMP = "IMP",
  INR = "INR",
  IQD = "IQD",
  IRR = "IRR",
  ISK = "ISK",
  JEP = "JEP",
  JMD = "JMD",
  JOD = "JOD",
  JPY = "JPY",
  KES = "KES",
  KGS = "KGS",
  KHR = "KHR",
  KMF = "KMF",
  KPW = "KPW",
  KRW = "KRW",
  KWD = "KWD",
  KYD = "KYD",
  KZT = "KZT",
  LAK = "LAK",
  LBP = "LBP",
  LKR = "LKR",
  LRD = "LRD",
  LSL = "LSL",
  LYD = "LYD",
  MAD = "MAD",
  MDL = "MDL",
  MGA = "MGA",
  MKD = "MKD",
  MMK = "MMK",
  MNT = "MNT",
  MOP = "MOP",
  MRU = "MRU",
  MUR = "MUR",
  MVR = "MVR",
  MWK = "MWK",
  MXN = "MXN",
  MYR = "MYR",
  MZN = "MZN",
  NAD = "NAD",
  NGN = "NGN",
  NIO = "NIO",
  NOK = "NOK",
  NPR = "NPR",
  NZD = "NZD",
  OMR = "OMR",
  PAB = "PAB",
  PEN = "PEN",
  PGK = "PGK",
  PHP = "PHP",
  PKR = "PKR",
  PLN = "PLN",
  PYG = "PYG",
  QAR = "QAR",
  RON = "RON",
  RSD = "RSD",
  RUB = "RUB",
  RWF = "RWF",
  SAR = "SAR",
  SBD = "SBD",
  SCR = "SCR",
  SDG = "SDG",
  SEK = "SEK",
  SGD = "SGD",
  SHP = "SHP",
  SLL = "SLL",
  SOS = "SOS",
  SPL = "SPL",
  SRD = "SRD",
  STN = "STN",
  SVC = "SVC",
  SYP = "SYP",
  SZL = "SZL",
  THB = "THB",
  TJS = "TJS",
  TMT = "TMT",
  TND = "TND",
  TOP = "TOP",
  TRY = "TRY",
  TTD = "TTD",
  TVD = "TVD",
  TWD = "TWD",
  TZS = "TZS",
  UAH = "UAH",
  UGX = "UGX",
  USD = "USD",
  UYU = "UYU",
  UZS = "UZS",
  VEF = "VEF",
  VND = "VND",
  VUV = "VUV",
  WST = "WST",
  XAF = "XAF",
  XCD = "XCD",
  XDR = "XDR",
  XOF = "XOF",
  XPF = "XPF",
  YER = "YER",
  ZAC = "ZAC", // Non-ISO4217
  ZAR = "ZAR",
  ZMW = "ZMW",
  ZWD = "ZWD",
}
