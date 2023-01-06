declare const _default: {
    expandNumberAbbreviation: (abbreviation: string) => number;
    makeStringFloatCompatible: (string: string) => number | undefined;
    paginateList: (list: any[], limit?: number | undefined, offset?: number | undefined) => any[];
    unescapeHtml: (raw: string) => string;
    googleCookies: {
        name: string;
        value: string;
        domain: string;
    }[];
    marketCurrencies: {
        [market: string]: import("../models").Currency;
    };
    selectors: {
        [selector: string]: string;
    };
};
export default _default;
