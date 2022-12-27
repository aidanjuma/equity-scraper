import BaseProvider from "./base-provider";
import { IBinanceAsset, IGoogleFinanceAsset } from "./types";

abstract class BaseParser extends BaseProvider {
  constructor() {
    super();
  }

  public abstract getAvailableAssets(): Promise<
    IBinanceAsset[] | IGoogleFinanceAsset[]
  >;
}

export default BaseParser;
