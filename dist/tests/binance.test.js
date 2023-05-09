"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("../../src/providers/crypto/binance"));
jest.setTimeout(120000);
// run: yarn test --watch --verbose false binance.test.ts
describe("Binance Class", () => {
    const binance = new binance_1.default();
    let offsetTestList;
    test("Test: Get all available assets from Binance.", async () => {
        const assets = await binance.getAvailableAssets();
        console.log(assets);
        expect(assets).toBeDefined();
    });
    test("Test: Pagination - limit = 20, so list length should be 20.", async () => {
        const assets = await binance.getAvailableAssets(20);
        console.log(assets);
        offsetTestList = assets;
        expect(assets).toHaveLength(20);
    });
    test("Test: Pagination - offset = 5, limit = 15, so list length should be 15 and the new list's first element should be the same as the previous' 5th index.", async () => {
        const assets = await binance.getAvailableAssets(15, 5);
        console.log(assets);
        expect(assets).toHaveLength(15);
        expect(assets[0]).toEqual(offsetTestList[5]);
    });
    test("Test: Get asset price for ETHBUSD from Binance.", async () => {
        const ETHBUSD = await binance.getAssetPrice("ETHBUSD");
        console.log(ETHBUSD);
        expect(ETHBUSD).toBeDefined();
    });
});
//# sourceMappingURL=binance.test.js.map