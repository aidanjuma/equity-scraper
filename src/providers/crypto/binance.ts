import axios from "axios";
import BaseParser from "../../models/base-parser";
import { AssetType, IBinanceAsset } from "../../models/types";

class Binance extends BaseParser {
  readonly name = "Binance";
  protected baseUrl = "https://api.binance.com/api/v3";
  protected logo =
    "https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png";
  protected classPath = "CRYPTO.Binance";

  // TODO: Pagination...
  override getAvailableAssets = async (
    limit?: number,
    offset?: number
  ): Promise<IBinanceAsset[]> => {
    const assets: IBinanceAsset[] = [];
    const url = `${this.baseUrl}/exchangeInfo`;

    try {
      const { data } = await axios.get(url);

      for (let i = 0; i < data.symbols.length; i++) {
        const assetItem = data.symbols[i];
        assets.push(this.parseIBinanceAsset(assetItem));
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return assets;
  };

  public getAssetPrice = async (ticker: string): Promise<IBinanceAsset> => {
    let asset: IBinanceAsset;
    const url = `${this.baseUrl}/ticker/price?symbol=${ticker}`;

    try {
      const { data } = await axios.get(url);
      asset = {
        assetType: AssetType.Cryptocurrency,
        ticker: ticker,
        price: parseFloat(data.price),
      };
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return asset;
  };

  private parseIBinanceAsset = (assetItem: any): IBinanceAsset => {
    const asset: IBinanceAsset = {
      assetType: AssetType.Cryptocurrency,
      ticker: assetItem["assetItem"],
      status: assetItem["status"],
      baseAsset: assetItem["baseAsset"],
      baseAssetPrecision: assetItem["baseAssetPrecision"],
      quoteAsset: assetItem["quoteAsset"],
      quotePrecision: assetItem["quoteAsset"],
      quoteAssetPrecision: assetItem["quoteAssetPrecision"],
      price: parseFloat(assetItem["price"]),
    };

    return asset;
  };
}

export default Binance;
