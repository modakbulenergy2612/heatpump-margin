export function formatW(v) {
  const abs = Math.abs(v), sign = v < 0 ? "-" : "";
  return abs >= 10000
    ? `${sign}${(abs / 10000).toFixed(1)}억`
    : `${sign}${abs.toLocaleString()}만`;
}

export function formatWon(v) {
  return `${Math.round(v).toLocaleString()}원`;
}

export function exVatMan(vatIncluded) {
  return Math.round(vatIncluded / 1.1 / 10000);
}
