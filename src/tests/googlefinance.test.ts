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

  test("Test: Convert $120 to Japanese Yen.", async () => {
    const googleFinance = new GoogleFinance();
    const conversion = await googleFinance.convertCurrency("USD", 120, "JPY");
    console.log(conversion);
    expect(conversion).toBeDefined();
  });

  test("Test: Get the top stories from Google Finance's home page.", async () => {
    const googleFinance = new GoogleFinance();
    const stories = await googleFinance.getTopStories();
    console.log(stories);
    expect(stories).toBeDefined();
  });
});
