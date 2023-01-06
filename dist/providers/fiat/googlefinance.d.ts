import BaseParser from "../../models/base-parser";
import { IGoogleFinanceAsset, INewsArticle, IExchangeRate } from "../../models/types";
declare class GoogleFinance extends BaseParser {
    readonly name = "GoogleFinance";
    protected baseUrl: string;
    protected logo: string;
    protected classPath: string;
    getAvailableAssets: (limit?: number, offset?: number) => Promise<IGoogleFinanceAsset[]>;
    getAssetData: (ticker: string) => Promise<IGoogleFinanceAsset>;
    getTopStories: () => Promise<INewsArticle[]>;
    convertCurrency: (baseAsset: string, basePrice: number, quoteAsset: string) => Promise<IExchangeRate | undefined>;
    private parseAssetFromFinanceUrl;
    private createBrowserInstance;
    private parseMarketSummary;
    private parseNews;
}
export default GoogleFinance;
