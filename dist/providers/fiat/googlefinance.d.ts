import BaseParser from "../../models/base-parser";
import { IGoogleFinanceAsset, INewsArticle, IExchangeRate } from "../../models/types";
declare class GoogleFinance extends BaseParser {
    readonly name = "GoogleFinance";
    protected baseUrl: string;
    protected logo: string;
    protected classPath: string;
    private browser;
    private isInitialized;
    private initialize;
    destroyBrowserInstance: () => Promise<void>;
    getAvailableAssets: (limit?: number, offset?: number) => Promise<IGoogleFinanceAsset[]>;
    getAssetData: (assetId: string) => Promise<IGoogleFinanceAsset>;
    getLatestNews: () => Promise<{
        topStories?: INewsArticle[];
        localMarket?: INewsArticle[];
        worldMarkets?: INewsArticle[];
    }>;
    convertCurrency: (baseAsset: string, basePrice: number, quoteAsset: string) => Promise<IExchangeRate | undefined>;
    private parseAssetFromFinanceUrl;
    private parseMarketSummary;
    private parseNews;
    private createBrowserInstance;
}
export default GoogleFinance;
