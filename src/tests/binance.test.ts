import Binance from "../../src/providers/crypto/binance";

jest.setTimeout(120000);

// run: yarn test --watch --verbose false binance.test.ts

describe("Binance Class", () => {
  test("Test: Get all available assets from Binance.", async () => {
    const binance = new Binance();
    const assets = await binance.getAvailableAssets();
    expect(assets).toBeDefined();
  });

  test("Test: Get asset price for ETHBUSD from Binance.", async () => {
    const binance = new Binance();
    const ETHBUSD = await binance.getAssetPrice("ETHBUSD");
    console.log(ETHBUSD);
    expect(ETHBUSD).toBeDefined();
  });
});
