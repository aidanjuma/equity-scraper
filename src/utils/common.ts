export const expandNumberAbbreviation = (abbreviation: string): number => {
  const value = makeStringFloatCompatible(abbreviation);
  // Split at <space> character; only present if currency code is too. Get first item in array, and remove numbers & decimals to get multiplier.
  const multiplier: string = abbreviation
    .split(" ", 1)[0]
    .replace(/[\d.]/g, "");

  if (value) {
    switch (multiplier) {
      case "K":
        return value * 1_000;
      case "M":
        return value * 1_000_000;
      case "B":
        return value * 1_000_000_000;
      case "T":
        return value * 1_000_000_000_000;
      default:
        break;
    }
  }

  // If operation fails, return 0.
  return 0;
};

const floatFilter = RegExp(/\d+\.\d+/gm);
export const makeStringFloatCompatible = (
  string: string
): number | undefined => {
  if (string) return parseFloat(string.replace(",", "").match(floatFilter)![0]);
};

export const paginateList = (
  list: any[],
  limit?: number | undefined,
  offset?: number | undefined
): any[] => {
  let result: any[];
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

export const unescapeHtml = (raw: string): string => {
  return raw
    .replace(/&amp;/gm, "&")
    .replace(/&lt;/gm, "<")
    .replace(/&gt;/gm, ">")
    .replace(/&quot;/gm, '"')
    .replace(/&apos;/gm, "'");
};
