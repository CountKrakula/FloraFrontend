// The backend stores dates in UTC, but sometimes sends them without a "Z" at the end.
// Without the "Z" the browser would read them as local time, so we add it.
export const parseUtcDate = (value: string) =>
  new Date(/Z$|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`);