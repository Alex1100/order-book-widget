export function formatPrice(value: number | null) {
  if (value == null) return "-";
  return `$${value.toLocaleString(undefined, {
    maximumFractionDigits: 8,
  })}`;
}

export function formatSize(value: number | null) {
  if (value == null) return "-";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}