// Formatter utilities

// Format to Rupiah
export const formatRupiah = (value) => {
  if (value === undefined || value === null) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Short format to Rupiah (e.g. Rp 245,0 M or Rp 78,5 Jt)
export const formatRupiahShort = (value) => {
  if (!value) return "Rp 0";
  if (value >= 1e12) {
    return `Rp ${(value / 1e12).toFixed(1).replace(".", ",")} T`;
  }
  if (value >= 1e9) {
    return `Rp ${(value / 1e9).toFixed(1).replace(".", ",")} M`;
  }
  if (value >= 1e6) {
    return `Rp ${(value / 1e6).toFixed(1).replace(".", ",")} Jt`;
  }
  return formatRupiah(value);
};

// Format Date
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
};
