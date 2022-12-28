import axios from "axios";
import { Element, load } from "cheerio";
import BaseParser from "../../models/base-parser";
import { paginateList } from "../../utils/common";
import { IGoogleFinanceAsset } from "../../models/types";

class GoogleFinance extends BaseParser {
  readonly name = "GoogleFinance";
  protected baseUrl = "https://google.com/finance";
  protected logo =
    "https://ssl.gstatic.com/finance/favicon/finance_496x496.png";
  protected classPath = "FIAT.GoogleFinance";

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

  private parseAssetFromFinanceUrl = (url: string): IGoogleFinanceAsset => {
    // https://google.com/finance/quote/GME:NYSE => [..., "quote", "GME:NYSE"]
    const chunckedUrl: string[] = url.split("/");
    // "GME:NYSE"
    const symbol: string[] = chunckedUrl[chunckedUrl.length - 1].split(":");
    // "GME"
    const ticker: string = symbol[0];
    // "NYSE"
    const market: string = symbol[1];

    return { ticker: ticker, market: market };
  };
}

export default GoogleFinance;
