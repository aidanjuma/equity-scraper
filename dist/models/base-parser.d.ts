import BaseProvider from "./base-provider";
import { IBinanceAsset, IGoogleFinanceAsset } from "./types";
declare abstract class BaseParser extends BaseProvider {
    constructor();
    abstract getAvailableAssets(): Promise<IBinanceAsset[] | IGoogleFinanceAsset[]>;
}
export default BaseParser;
