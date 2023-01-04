import GoogleFinance from "../../src/providers/fiat/googlefinance";

jest.setTimeout(120000);

// run: yarn test --watch --verbose false googlefinance.test.ts

describe("GoogleFinance Class", () => {
  test("Test: Get asset data from asset META:NASDAQ (stock).", async () => {
    const googleFinance = new GoogleFinance();
    const assetData = await googleFinance.getAssetData("META:NASDAQ");
    console.log(assetData);
    expect(assetData).toBeDefined();
  });
});