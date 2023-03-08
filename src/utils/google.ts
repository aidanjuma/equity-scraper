import { Currency } from "../models/types";

export const googleCookies = [
  { name: "CONSENT", value: "YES+", domain: ".google.com" },
];

export const selectors: { [selector: string]: string } = {
  cwiz: ".zQTmif.SSPGKf.u5wqUe",
  label: ".zzDege",
  prices: ".YMlKec.fxKbKc",
  dailyPriceDelta: ".P2Luy.ZYVHBb",
  properties: ".w2tnNd",
  tableItems: "div.eYanAe div.gyFHrc",
  tableItemsData: "div.eYanAe div.gyFHrc div.P6K39c",
  description: ".bLLb2d",
  news: ".yY3Lee",
  articleTitle: ".Yfwt5",
  articleHyperlink: ".z4rs2b a",
  articlePublisher: ".sfyJob",
  articlePublishTime: ".Adak",
  articlePreviewImage: ".Z4idke",
  localMarketNews: `div[data-tab-id="localMarketNews"]`,
  worldMarketNews: `div[data-tab-id="worldMarketNews"]`,
};

// An object pairing each market to its relevant currency.
export const marketCurrencies: { [market: string]: Currency } = {
  NYSE: Currency.USD, // USA
  NASDAQ: Currency.USD, // USA
  TPE: Currency.TWD, // Taiwan
  KPX: Currency.KRW, // ROK (South Korea)
  BVMF: Currency.BRL, // Brazil
  SHA: Currency.CNY, // People's Republic of China (PRC)
  IDX: Currency.IDR, // Indonesia
  WSE: Currency.PLN, // Poland
  ETR: Currency.EUR, // Germany
  IST: Currency.TRY, // Turkey
  NZE: Currency.NZD, // New Zealand
  LON: Currency.GBX, // United Kingdom (exception to ISO4217)
  TYO: Currency.JPY, // Japan
  HKG: Currency.HKD, // Hong Kong SAR
  NSE: Currency.INR, // India
  KLSE: Currency.MYR, // Malaysia
  SHE: Currency.CNY, // People's Republic of China (PRC)
  ASX: Currency.AUD, // Australia
  BIT: Currency.EUR, // Italy
  BKK: Currency.THB, // Thailand
  TSE: Currency.CAD, // Canada
  TADAWUL: Currency.SAR, // Saudi Arabia
  TLV: Currency.ILA, // Israel (exception to ISO4217)
  STO: Currency.SEK, // Sweden
  CVE: Currency.CAD, // Canada
  CPH: Currency.DKK, // Denmark
  SGX: Currency.SGD, // Singapore
  CNSX: Currency.CAD, // Canada
  AMS: Currency.EUR, // Netherlands
  FRA: Currency.EUR, // Germany
  EPA: Currency.EUR, // France
  SWX: Currency.CHF, // Switzerland
  HEL: Currency.EUR, // Finland
  KOSDAQ: Currency.KRW, // ROK (South Korea)
  BOM: Currency.INR, // India
  BME: Currency.EUR, // Spain
  JSE: Currency.ZAC, // South Africa (exception to ISO4217)
  BMV: Currency.MXN, // Mexico
  BCBA: Currency.ARS, // Argentina
  VIE: Currency.EUR, // Austria
  EBR: Currency.EUR, // Belgium
  ELI: Currency.EUR, // Portugal
  ICE: Currency.ISK, // Iceland
  TAL: Currency.EUR, // Estonia
  VSE: Currency.EUR, // Lithuania
  OTCMKTS: Currency.USD, // USA
  NYSEARCA: Currency.USD, // USA
  NYSEAMERICAN: Currency.USD, // USA
  MUTF: Currency.USD, // USA
  MUTF_IN: Currency.INR, // India
  BATS: Currency.USD, // USA
  CBOT: Currency.USD, // USA
  CME_EMINIS: Currency.USD, // USA
  NYMEX: Currency.USD, // USA
};
