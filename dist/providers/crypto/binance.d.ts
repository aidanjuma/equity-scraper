import BaseParser from "../../models/base-parser";
import { IBinanceAsset } from "../../models/types";
declare class Binance extends BaseParser {
    readonly name = "Binance";
    protected baseUrl: string;
    protected logo: string;
    protected classPath: string;
    getAvailableAssets: (limit?: number, offset?: number) => Promise<IBinanceAsset[]>;
    getAssetPrice: (ticker: string) => Promise<IBinanceAsset>;
    private parseIBinanceAsset;
}
export default Binance;
