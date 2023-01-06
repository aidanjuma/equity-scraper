"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("../../src/providers/crypto/binance"));
jest.setTimeout(120000);
// run: yarn test --watch --verbose false binance.test.ts
describe("Binance Class", () => {
    test("Test: Get all available assets from Binance.", async () => {
        const binance = new binance_1.default();
        const assets = await binance.getAvailableAssets();
        expect(assets).toBeDefined();
    });
    test("Test: Get asset price for ETHBUSD from Binance.", async () => {
        const binance = new binance_1.default();
        const ETHBUSD = await binance.getAssetPrice("ETHBUSD");
        console.log(ETHBUSD);
        expect(ETHBUSD).toBeDefined();
    });
});
//# sourceMappingURL=binance.test.js.map