import axios from "axios";
import puppeteer, { Browser } from "puppeteer";
import { Element, load } from "cheerio";
import BaseParser from "../../models/base-parser";
import { paginateList } from "../../utils/common";
import { googleCookies, marketCurrencies, selectors } from "../../utils/google";
import {
  IGoogleFinanceAsset,
  IMarketSummary,
  AssetType,
  Market,
} from "../../models/types";

class GoogleFinance extends BaseParser {
  readonly name = "GoogleFinance";
  protected baseUrl = "https://google.com/finance";
  protected logo =
    "https://ssl.gstatic.com/finance/favicon/finance_496x496.png";
  protected classPath = "FIAT.GoogleFinance";
  private readonly floatFilter = RegExp(/\d+\.\d+/gm);

  public getAvailableAssets = async (
    limit?: number,
    offset?: number
  ): Promise<IGoogleFinanceAsset[]> => {
    let assets: IGoogleFinanceAsset[] = [];
    const url = `${this.baseUrl}/sitemap.xml`;

    try {
      const { data } = await axios.get(url);
      const $ = load(data);

      const locList: any[] = $("loc").get();
      for (let i = 0; i < locList.length; i++) {
        const loc: Element = locList[i];
        const locUrl: string = $(loc).text();

        if (locUrl.includes("quote"))
          assets.push(this.parseAssetFromFinanceUrl(locUrl));
      }

      if (limit || offset) assets = paginateList(assets, limit!, offset!);
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return assets;
  };

  public getAssetData = async (
    ticker: string
  ): Promise<IGoogleFinanceAsset> => {
    let asset: IGoogleFinanceAsset = { ticker: ticker };

    const browser = await this.createBrowserInstance();

    // For safety: only proceed if browser not undefined.
    if (browser) {
      const page = await browser.newPage();

      // Add consent cookie(s) & load page.
      await page.setCookie(...googleCookies);
      await page.goto(`${this.baseUrl}/quote/${ticker}`);

      // Await the creation of <c-wiz> tag on asset page.
      await page.waitForSelector(selectors.cwiz);

      asset.market = ticker.split(":")[1] as Market;
      asset.label = await page.$eval(selectors.label, (el) => el.innerHTML);
      asset.marketCurrency = marketCurrencies[asset.market as string];

      // First to return from this the current price; the second is the pre-market price.
      const prices: string[] = await page.$$eval(selectors.prices, (els) => {
        return els.map((el) => el.innerHTML);
      });

      asset.currentPrice = parseFloat(prices[0].match(this.floatFilter)![0]);

      const preMarketPrice: number | null = parseFloat(
        prices[1]?.match(this.floatFilter)![0]
      );

      !Number.isNaN(preMarketPrice)
        ? (asset.preMarketPrice = preMarketPrice)
        : null;

      // i.e. The pills that house strings such as 'Stock' or 'US listed security'
      const assetProperties = await page.$$eval(selectors.properties, (els) => {
        return els.map((el) => {
          return el.innerHTML;
        });
      });

      // Assign asset type by looping through properties until a type is found.
      for (let i = 0; i < assetProperties.length; i++) {
        const property: string = assetProperties[i];
        if (property in AssetType) {
          asset.assetType = <AssetType>property;
          break;
        }
      }
    }

    return asset;
  };

  private parseAssetFromFinanceUrl = (url: string): IGoogleFinanceAsset => {
    // https://google.com/finance/quote/GME:NYSE => [..., "quote", "GME:NYSE"]
    const chunckedUrl: string[] = url.split("/");
    // "GME:NYSE"
    const symbol: string[] = chunckedUrl[chunckedUrl.length - 1].split(":");
    // "GME"
    const ticker: string = symbol[0];
    // "NYSE"
    const market: Market = symbol[1] as Market;

    return { ticker: ticker, market: market };
  };

  private createBrowserInstance = async (): Promise<Browser | undefined> => {
    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return browser;
  };

  // TODO: Parse Market Summary: Table Items...
  private parseMarketSummary = (tableItems: Element[]): IMarketSummary => {
    // Previous Close: consistent across all asset types.
    return {};
  };
}

export default GoogleFinance;
