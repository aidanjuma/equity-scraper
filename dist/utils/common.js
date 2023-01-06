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
const floatFilter = RegExp(/\d+\.\d+/gm);
const makeStringFloatCompatible = (string) => {
    if (string)
        return parseFloat(string.replace(",", "").match(floatFilter)[0]);
};
exports.makeStringFloatCompatible = makeStringFloatCompatible;
const paginateList = (list, limit, offset) => {
    let result;
    // If both limit & offset, offset first and limit count.
    limit && offset
        ? (result = list.slice(offset, limit))
            ? // If just limit, start from 0 and limit count.
                limit
            : (result = list.slice(0, limit))
                ? // If just offset, start from offset without count limit.
                    offset
                : (result = list.slice(offset, 0))
        : // Else, select all list.
            (result = list);
    return result;
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