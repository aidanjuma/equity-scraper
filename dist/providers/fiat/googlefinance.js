"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const puppeteer_1 = __importDefault(require("puppeteer"));
const base_parser_1 = __importDefault(require("../../models/base-parser"));
const google_1 = require("../../utils/google");
const common_1 = require("../../utils/common");
const types_1 = require("../../models/types");
class GoogleFinance extends base_parser_1.default {
    constructor() {
        super(...arguments);
        this.name = "GoogleFinance";
        this.baseUrl = "https://google.com/finance";
        this.logo = "https://ssl.gstatic.com/finance/favicon/finance_496x496.png";
        this.classPath = "FIAT.GoogleFinance";
        this.isInitialized = false;
        this.initialize = async () => {
            this.browser = await this.createBrowserInstance();
            if (this.browser)
                this.isInitialized = true;
        };
        this.destroyBrowserInstance = async () => {
            var _a;
            await ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
        };
        this.getAvailableAssets = async (limit, offset) => {
            let assets = [];
            const url = `${this.baseUrl}/sitemap.xml`;
            try {
                const { data } = await axios_1.default.get(url);
                const $ = (0, cheerio_1.load)(data);
                const locList = $("loc").get();
                for (let i = 0; i < locList.length; i++) {
                    const loc = locList[i];
                    const locUrl = $(loc).text();
                    if (locUrl.includes("quote"))
                        assets.push(this.parseAssetFromFinanceUrl(locUrl));
                }
                if (limit || offset)
                    assets = (0, common_1.paginateList)(assets, limit, offset);
            }
            catch (err) {
                throw new Error(err.message);
            }
            return assets;
        };
        this.getAssetData = async (ticker) => {
            let asset = { ticker: ticker };
            if (!this.isInitialized)
                await this.initialize();
            // For safety: only proceed if browser not undefined.
            if (this.browser) {
                const page = await this.browser.newPage();
                // Add consent cookie(s) & load page.
                await page.setCookie(...google_1.googleCookies);
                await page.goto(`${this.baseUrl}/quote/${ticker}`);
                // Await the creation of <c-wiz> tag on asset page.
                await page.waitForSelector(google_1.selectors.cwiz);
                asset.market = ticker.split(":")[1];
                asset.label = (0, common_1.unescapeHtml)(await page.$eval(google_1.selectors.label, (el) => el.innerHTML));
                asset.marketCurrency = google_1.marketCurrencies[asset.market];
                // First to return from this the current price; the second is the pre-market price.
                const prices = await page.$$eval(google_1.selectors.prices, (els) => {
                    return els.map((el) => el.innerHTML);
                });
                asset.currentPrice = (0, common_1.makeStringFloatCompatible)(prices[0]);
                const preMarketPrice = (0, common_1.makeStringFloatCompatible)(prices[1]);
                !Number.isNaN(preMarketPrice)
                    ? (asset.preMarketPrice = preMarketPrice)
                    : null;
                // i.e. The pills that house strings such as 'Stock' or 'US listed security'
                const assetProperties = await page.$$eval(google_1.selectors.properties, (els) => {
                    return els.map((el) => {
                        return el.innerHTML;
                    });
                });
                // Assign asset type by looping through properties until a type is found.
                for (let i = 0; i < assetProperties.length; i++) {
                    const property = assetProperties[i];
                    // Remove space - only required in the case of "Futures Contract" to ensure a successful cast.
                    if (property.replace(" ", "") in types_1.AssetType) {
                        asset.assetType = property;
                        break;
                    }
                }
                const marketSummaryData = await page.$$eval(google_1.selectors.tableItemsData, (els) => {
                    return els.map((el) => {
                        return el.innerHTML;
                    });
                });
                asset.marketSummary = this.parseMarketSummary(asset.assetType, marketSummaryData);
                if ((await page.$(google_1.selectors.description)) != null)
                    asset.description = await page.$eval(google_1.selectors.description, (el) => {
                        return el.innerHTML;
                    });
                const newsList = await page.$$(google_1.selectors.news);
                asset.news = await this.parseNews(newsList);
                await page.close();
            }
            return asset;
        };
        this.getLatestNews = async () => {
            let stories = {};
            if (!this.isInitialized)
                await this.initialize();
            // For safety: only proceed if browser not undefined.
            if (this.browser) {
                const page = await this.browser.newPage();
                // Add consent cookie(s) & load page.
                await page.setCookie(...google_1.googleCookies);
                await page.goto(this.baseUrl);
                for (let i = 0; i < 3; i++) {
                    switch (i) {
                        case 0:
                            // Await the creation of news list's CSS class.
                            await page.waitForSelector(google_1.selectors.news);
                            stories.topStories = await this.parseNews(await page.$$(google_1.selectors.news));
                        case 1:
                            await page.waitForSelector(google_1.selectors.localMarketNews);
                            await page.click(google_1.selectors.localMarketNews);
                            // Await the creation of news list's CSS class.
                            await page.waitForSelector(google_1.selectors.news);
                            stories.localMarket = await this.parseNews(await page.$$(google_1.selectors.news));
                        case 2:
                            await page.waitForSelector(google_1.selectors.worldMarketNews);
                            await page.click(google_1.selectors.worldMarketNews);
                            // Await the creation of news list's CSS class.
                            await page.waitForSelector(google_1.selectors.news);
                            stories.worldMarkets = await this.parseNews(await page.$$(google_1.selectors.news));
                    }
                }
                await page.close();
            }
            return stories;
        };
        this.convertCurrency = async (baseAsset, basePrice, quoteAsset) => {
            const ticker = `${baseAsset}-${quoteAsset}`;
            const quoted = (await this.getAssetData(ticker))
                .currentPrice;
            if (quoted)
                return {
                    assetType: types_1.AssetType.ExchangeRate,
                    baseAsset: baseAsset,
                    quoteAsset: quoteAsset,
                    ticker: ticker,
                    basePrice: basePrice,
                    quotePrice: Number(basePrice * quoted).toFixed(2), // Casting to satisfy TypeScript linter...
                };
        };
        this.parseAssetFromFinanceUrl = (url) => {
            // https://google.com/finance/quote/GME:NYSE => [..., "quote", "GME:NYSE"]
            const chunckedUrl = url.split("/");
            // "GME:NYSE"
            const symbol = chunckedUrl[chunckedUrl.length - 1].split(":");
            // "GME"
            const ticker = symbol[0];
            // "NYSE"
            const market = symbol[1];
            return { ticker: ticker, market: market };
        };
        this.parseMarketSummary = (assetType, data) => {
            let marketSummary = {};
            // Previous Close: consistent across all asset types. Only metric provided for currencies.
            marketSummary.previousClosePrice = (0, common_1.makeStringFloatCompatible)(data[0]);
            if (assetType === types_1.AssetType.ExchangeRate)
                return marketSummary;
            // Everything else contains a day range:
            const splitDayRange = data[1].split(" - ");
            marketSummary.dayRange = {
                low: (0, common_1.makeStringFloatCompatible)(splitDayRange[0]),
                high: (0, common_1.makeStringFloatCompatible)(splitDayRange[1]),
            };
            // Within the below clause is futures-exclusive data:
            if (assetType === types_1.AssetType.FuturesContract) {
                marketSummary.volume = (0, common_1.expandNumberAbbreviation)(data[2]);
                marketSummary.primaryExchange = data[3];
                marketSummary.marketSegment = data[4];
                marketSummary.openInterest = (0, common_1.expandNumberAbbreviation)(data[5]);
                marketSummary.settlementPrice = (0, common_1.makeStringFloatCompatible)(data[6]);
                return marketSummary;
            }
            // Everything else beyond this point contains a year range:
            const splitYearRange = data[2].split(" - ");
            marketSummary.yearRange = {
                low: (0, common_1.makeStringFloatCompatible)(splitYearRange[0]),
                high: (0, common_1.makeStringFloatCompatible)(splitYearRange[1]),
            };
            if (assetType === types_1.AssetType.Index)
                return marketSummary;
            // Onwards from here must be a stock. Contains the following data:
            marketSummary.marketCap = (0, common_1.expandNumberAbbreviation)(data[3]);
            marketSummary.avgVolume = (0, common_1.expandNumberAbbreviation)(data[4]);
            marketSummary.pteRatio = data[5] != "-" ? parseFloat(data[5]) : undefined;
            marketSummary.dividendYield =
                data[6] != "-" ? parseFloat(data[6]) : undefined;
            return marketSummary;
        };
        this.parseNews = async (newsList) => {
            const news = [];
            for (let i = 0; i < newsList.length; i++) {
                const article = newsList[i];
                // Each individual component for a news article is parsed below:
                const title = await article.$eval(google_1.selectors.articleTitle, (el) => {
                    return el.innerHTML;
                });
                const link = await article.$eval(google_1.selectors.articleHyperlink, (el) => {
                    var _a;
                    return (_a = el.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.toString();
                });
                const publisher = await article.$eval(google_1.selectors.articlePublisher, (el) => {
                    return el.innerHTML;
                });
                const whenPublished = await article.$eval(google_1.selectors.articlePublishTime, (el) => {
                    return el.innerHTML;
                });
                const thumbnail = await article.$eval(google_1.selectors.articlePreviewImage, (el) => {
                    var _a;
                    return (_a = el.getAttribute("src")) === null || _a === void 0 ? void 0 : _a.toString();
                });
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
        this.createBrowserInstance = async () => {
            let browser;
            try {
                browser = await puppeteer_1.default.launch({
                    args: ["--disable-setuid-sandbox"],
                    ignoreHTTPSErrors: true,
                });
            }
            catch (err) {
                throw new Error(err.message);
            }
            return browser;
        };
    }
}
exports.default = GoogleFinance;
//# sourceMappingURL=googlefinance.js.map