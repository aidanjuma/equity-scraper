import GoogleFinance from "../../src/providers/fiat/googlefinance";

jest.setTimeout(120000);

// run: yarn test --watch --verbose false googlefinance.test.ts

// TODO: Add more and improve current tests.
describe("GoogleFinance Class", () => {
  test("Test: Get asset data from asset META:NASDAQ (stock).", async () => {
    const googleFinance = new GoogleFinance();
    const assetData = await googleFinance.getAssetData("META:NASDAQ");
    console.log(assetData);
    expect(assetData).toBeDefined();
  });

  test("Test: Get asset data from asset ESW00:CME_EMINIS (future).", async () => {
    const googleFinance = new GoogleFinance();
    const assetData = await googleFinance.getAssetData("ESW00:CME_EMINIS");
    console.log(assetData);
    expect(assetData).toBeDefined();
  });
});
