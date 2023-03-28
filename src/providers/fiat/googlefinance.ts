import axios from "axios";
import { Element, load } from "cheerio";
import puppeteer, { Browser, ElementHandle } from "puppeteer";
import BaseParser from "../../models/base-parser";
import { googleCookies, marketCurrencies, selectors } from "../../utils/google";
import {
  expandNumberAbbreviation,
  makeStringFloatCompatible,
  paginateList,
  unescapeHtml,
} from "../../utils/common";
import {
  IGoogleFinanceAsset,
  IMarketSummary,
  INewsArticle,
  AssetType,
  Market,
  IExchangeRate,
} from "../../models/types";

class GoogleFinance extends BaseParser {
  readonly name = "GoogleFinance";
  protected baseUrl = "https://google.com/finance";
  protected logo =
    "https://ssl.gstatic.com/finance/favicon/finance_496x496.png";
  protected classPath = "FIAT.GoogleFinance";
  private browser: Browser | undefined;
  private isInitialized = false;

  private initialize = async () => {
    this.browser = await this.createBrowserInstance();
    if (this.browser) this.isInitialized = true;
  };

  public destroyBrowserInstance = async () => {
    await this.browser?.close();
  };

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
    assetId: string
  ): Promise<IGoogleFinanceAsset> => {
    const symbol: string[] = assetId.split(":");

    let asset: IGoogleFinanceAsset = {
      ticker: symbol[0],
      market: symbol[1] as Market,
    };

    if (!this.isInitialized) await this.initialize();

    // For safety: only proceed if browser not undefined.
    if (this.browser) {
      const page = await this.browser.newPage();

      // Add consent cookie(s) & load page.
      await page.setCookie(...googleCookies);
      await page.goto(`${this.baseUrl}/quote/${assetId}`);

      // Await the creation of <c-wiz> tag on asset page.
      await page.waitForSelector(selectors.cwiz);

      asset.label = unescapeHtml(
        await page.$eval(selectors.label, (el) => el.innerHTML)
      );
      asset.marketCurrency = marketCurrencies[asset.market as string];

      // First to return from this the current price; the second is the pre-market price.
      const prices: string[] = await page.$$eval(selectors.prices, (els) => {
        return els.map((el) => el.innerHTML);
      });

      asset.currentPrice = makeStringFloatCompatible(prices[0]);

      const dailyPriceDelta: string = await page.$eval(
        selectors.dailyPriceDelta,
        (el) => {
          return el.innerHTML;
        }
      );

      asset.dailyPriceDelta = makeStringFloatCompatible(dailyPriceDelta);

      const preMarketPrice = makeStringFloatCompatible(prices[1]);

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
        // Remove space - only required in the case of "Futures Contract" to ensure a successful cast.
        if (property.replace(" ", "") in AssetType) {
          asset.assetType = <AssetType>property;
          break;
        }
      }

      const marketSummaryData: string[] = await page.$$eval(
        selectors.tableItemsData,
        (els) => {
          return els.map((el) => {
            return el.innerHTML;
          });
        }
      );

      asset.marketSummary = this.parseMarketSummary(
        asset.assetType!,
        marketSummaryData
      );

      if ((await page.$(selectors.description)) != null)
        asset.description = await page.$eval(selectors.description, (el) => {
          return el.textContent ?? undefined;
        });

      const newsList = await page.$$(selectors.news);
      asset.news = await this.parseNews(newsList);

      await page.close();
    }

    return asset;
  };

  public getLatestNews = async (): Promise<{
    topStories?: INewsArticle[];
    localMarket?: INewsArticle[];
    worldMarkets?: INewsArticle[];
  }> => {
    let stories: {
      topStories?: INewsArticle[];
      localMarket?: INewsArticle[];
      worldMarkets?: INewsArticle[];
    } = {};

    if (!this.isInitialized) await this.initialize();

    // For safety: only proceed if browser not undefined.
    if (this.browser) {
      const page = await this.browser.newPage();

      // Add consent cookie(s) & load page.
      await page.setCookie(...googleCookies);
      await page.goto(this.baseUrl);

      for (let i = 0; i < 3; i++) {
        switch (i) {
          case 0:
            // Await the creation of news list's CSS class.
            await page.waitForSelector(selectors.news);

            stories.topStories = await this.parseNews(
              await page.$$(selectors.news)
            );

          case 1:
            await page.waitForSelector(selectors.localMarketNews);
            await page.click(selectors.localMarketNews);
            // Await the creation of news list's CSS class.
            await page.waitForSelector(selectors.news);

            stories.localMarket = await this.parseNews(
              await page.$$(selectors.news)
            );

          case 2:
            await page.waitForSelector(selectors.worldMarketNews);
            await page.click(selectors.worldMarketNews);
            // Await the creation of news list's CSS class.
            await page.waitForSelector(selectors.news);

            stories.worldMarkets = await this.parseNews(
              await page.$$(selectors.news)
            );
        }
      }
      await page.close();
    }

    return stories;
  };

  public convertCurrency = async (
    baseAsset: string,
    basePrice: number,
    quoteAsset: string
  ): Promise<IExchangeRate | undefined> => {
    const ticker: string = `${baseAsset}-${quoteAsset}`;
    const quoted: number | undefined = (await this.getAssetData(ticker))
      .currentPrice;

    if (quoted)
      return {
        assetType: AssetType.ExchangeRate,
        baseAsset: baseAsset,
        quoteAsset: quoteAsset,
        ticker: ticker,
        basePrice: basePrice,
        quotePrice: Number(basePrice * quoted).toFixed(2) as unknown as number, // Casting to satisfy TypeScript linter...
      };
  };

  private parseAssetFromFinanceUrl = (url: string): IGoogleFinanceAsset => {
    // https://google.com/finance/quote/GME:NYSE => [..., "quote", "GME:NYSE"]
    const chunkedUrl: string[] = url.split("/");
    // "GME:NYSE"
    const symbol: string[] = chunkedUrl[chunkedUrl.length - 1].split(":");
    // "GME"
    const ticker: string = symbol[0];
    // "NYSE"
    const market: Market = symbol[1] as Market;

    return { ticker: ticker, market: market };
  };

  private parseMarketSummary = (
    assetType: AssetType,
    data: string[]
  ): IMarketSummary => {
    let marketSummary: IMarketSummary = {};

    // Previous Close: consistent across all asset types. Only metric provided for currencies.
    marketSummary.previousClosePrice = makeStringFloatCompatible(data[0]);
    if (assetType === AssetType.ExchangeRate) return marketSummary;

    // Everything else contains a day range:
    const splitDayRange: string[] = data[1].split(" - ");
    marketSummary.dayRange = {
      low: makeStringFloatCompatible(splitDayRange[0]),
      high: makeStringFloatCompatible(splitDayRange[1]),
    };

    // Within the below clause is futures-exclusive data:
    if (assetType === AssetType.FuturesContract) {
      marketSummary.volume = expandNumberAbbreviation(data[2]);
      marketSummary.primaryExchange = <Market>data[3];
      marketSummary.marketSegment = data[4];
      marketSummary.openInterest = expandNumberAbbreviation(data[5]);
      marketSummary.settlementPrice = makeStringFloatCompatible(data[6]);

      return marketSummary;
    }

    // Everything else beyond this point contains a year range:
    const splitYearRange: string[] = data[2].split(" - ");
    marketSummary.yearRange = {
      low: makeStringFloatCompatible(splitYearRange[0]),
      high: makeStringFloatCompatible(splitYearRange[1]),
    };

    if (assetType === AssetType.Index) return marketSummary;

    // Onwards from here must be a stock. Contains the following data:
    marketSummary.marketCap = expandNumberAbbreviation(data[3]);
    marketSummary.avgVolume = expandNumberAbbreviation(data[4]);
    marketSummary.pteRatio = data[5] != "-" ? parseFloat(data[5]) : undefined;
    marketSummary.dividendYield =
      data[6] != "-" ? parseFloat(data[6]) : undefined;

    return marketSummary;
  };

  private parseNews = async (
    newsList: ElementHandle<globalThis.Element>[]
  ): Promise<INewsArticle[]> => {
    const news: INewsArticle[] = [];

    for (let i = 0; i < newsList.length; i++) {
      const article = newsList[i];

      // Each individual component for a news article is parsed below:
      const title: string = await article.$eval(
        selectors.articleTitle,
        (el) => {
          return el.innerHTML;
        }
      );

      const link: string = await article.$eval(
        selectors.articleHyperlink,
        (el) => {
          return el.getAttribute("href")?.toString()!;
        }
      );

      const publisher: string | undefined = await article.$eval(
        selectors.articlePublisher,
        (el) => {
          return el.innerHTML;
        }
      );

      const whenPublished: string | undefined = await article.$eval(
        selectors.articlePublishTime,
        (el) => {
          return el.innerHTML;
        }
      );

      const thumbnail: string = await article.$eval(
        selectors.articlePreviewImage,
        (el) => {
          return el.getAttribute("src")?.toString()!;
        }
      );

      news.push({
        title: title,
        link: link,
        publisher: publisher,
        whenPublished: whenPublished,
        thumbnail: thumbnail,
      });
    }

    return news;
  };

  private createBrowserInstance = async (): Promise<Browser | undefined> => {
    let browser: Browser | undefined;
    try {
      browser = await puppeteer.launch({
        args: ["--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return browser;
  };
}

export default GoogleFinance;
