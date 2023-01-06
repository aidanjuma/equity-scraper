"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const base_parser_1 = __importDefault(require("../../models/base-parser"));
const types_1 = require("../../models/types");
class Binance extends base_parser_1.default {
    constructor() {
        super(...arguments);
        this.name = "Binance";
        this.baseUrl = "https://api.binance.com/api/v3";
        this.logo = "https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png";
        this.classPath = "CRYPTO.Binance";
        // TODO: Pagination...
        this.getAvailableAssets = async (limit, offset) => {
            const assets = [];
            const url = `${this.baseUrl}/exchangeInfo`;
            try {
                const { data } = await axios_1.default.get(url);
                for (let i = 0; i < data.symbols.length; i++) {
                    const assetItem = data.symbols[i];
                    assets.push(this.parseIBinanceAsset(assetItem));
                }
            }
            catch (err) {
                throw new Error(err.message);
            }
            return assets;
        };
        this.getAssetPrice = async (ticker) => {
            let asset;
            const url = `${this.baseUrl}/ticker/price?symbol=${ticker}`;
            try {
                const { data } = await axios_1.default.get(url);
                asset = {
                    assetType: types_1.AssetType.Cryptocurrency,
                    ticker: ticker,
                    price: parseFloat(data.price),
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
            return asset;
        };
        this.parseIBinanceAsset = (assetItem) => {
            const asset = {
                assetType: types_1.AssetType.Cryptocurrency,
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
}
exports.default = Binance;
//# sourceMappingURL=binance.js.map