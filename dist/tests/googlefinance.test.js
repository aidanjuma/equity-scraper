"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googlefinance_1 = __importDefault(require("../../src/providers/fiat/googlefinance"));
jest.setTimeout(120000);
// run: yarn test --watch --verbose false googlefinance.test.ts
describe("GoogleFinance Class", () => {
    const googleFinance = new googlefinance_1.default();
    let offsetTestList;
    test("Test: Pagination - limit = 20, so list length should be 20.", async () => {
        const assets = await googleFinance.getAvailableAssets(20);
        console.log(assets);
        offsetTestList = assets;
        expect(assets).toHaveLength(20);
    });
    test("Test: Pagination - offset = 5, limit = 15, so list length should be 15 and the new list's first element should be the same as the previous' 5th index.", async () => {
        const assets = await googleFinance.getAvailableAssets(15, 5);
        console.log(assets);
        expect(assets).toHaveLength(15);
        expect(assets[0]).toEqual(offsetTestList[5]);
    });
    test("Test: Get asset data from asset META:NASDAQ (stock).", async () => {
        const assetData = await googleFinance.getAssetData("META:NASDAQ");
        console.log(assetData);
        expect(assetData).toBeDefined();
    });
    test("Test: Get asset data from asset ESW00:CME_EMINIS (future).", async () => {
        const assetData = await googleFinance.getAssetData("ESW00:CME_EMINIS");
        console.log(assetData);
        expect(assetData).toBeDefined();
    });
    test("Test: Convert $120 to Japanese Yen.", async () => {
        const conversion = await googleFinance.convertCurrency("USD", 120, "JPY");
        console.log(conversion);
        expect(conversion).toBeDefined();
    });
    test("Test: Get the top stories from Google Finance's home page.", async () => {
        const stories = await googleFinance.getTopStories();
        console.log(stories);
        expect(stories).toBeDefined();
    });
});
//# sourceMappingURL=googlefinance.test.js.map