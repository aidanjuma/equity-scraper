"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unescapeHtml = exports.paginateList = exports.makeStringFloatCompatible = exports.expandNumberAbbreviation = void 0;
const expandNumberAbbreviation = (abbreviation) => {
    const value = (0, exports.makeStringFloatCompatible)(abbreviation);
    // Split at <space> character; only present if currency code is too. Get first item in array, and remove numbers & decimals to get multiplier.
    const multiplier = abbreviation
        .split(" ", 1)[0]
        .replace(/[\d.]/g, "");
    if (value) {
        switch (multiplier) {
            case "K":
                return value * 1000;
            case "M":
                return value * 1000000;
            case "B":
                return value * 1000000000;
            case "T":
                return value * 1000000000000;
            default:
                break;
        }
    }
    // If operation fails, return 0.
    return 0;
};
exports.expandNumberAbbreviation = expandNumberAbbreviation;
const floatFilter = RegExp(/[-+]?\d+\.\d+/gm);
const makeStringFloatCompatible = (string) => parseFloat(string.replace(",", "").match(floatFilter)[0]);
exports.makeStringFloatCompatible = makeStringFloatCompatible;
const paginateList = (list, limit, offset) => {
    if (limit && offset)
        return list.slice(offset, offset + limit);
    if (limit)
        return list.slice(0, limit);
    if (offset)
        return list.slice(offset, 0);
    return list;
};
exports.paginateList = paginateList;
const unescapeHtml = (raw) => {
    return raw
        .replace(/&amp;/gm, "&")
        .replace(/&lt;/gm, "<")
        .replace(/&gt;/gm, ">")
        .replace(/&quot;/gm, '"')
        .replace(/&apos;/gm, "'");
};
exports.unescapeHtml = unescapeHtml;
//# sourceMappingURL=common.js.map