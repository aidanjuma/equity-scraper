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
