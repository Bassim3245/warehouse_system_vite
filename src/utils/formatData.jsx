import moment from "moment";

// export const FormatDataNumber = (number) => {
//     return new Intl.NumberFormat('ar-SA', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(number);
//   };
export const FormatDataNumber = (number) => {
  return new Intl.NumberFormat({
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatCurrency = (value, lang = "en") => {
  const number = Number(value);
  const locale = lang === "en" ? "en-US" : "ar-IQ";

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: Number.isInteger(number) ? 0 : 3,
    maximumFractionDigits: 3,
  }).format(number);
};
export const formatDateAr = (dateString) => {
  if (!dateString) return "---"; // Return empty string for null/undefined/falsy value
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Return empty string if invalid date
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
export const formatTimeAr = (dateString) => {
  if (!dateString) return "---"; // Return empty string for null/undefined/falsy value
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Return empty string if invalid date
  return date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDate = (date) => {
  return moment(date).format("YYYY/MM/DD HH:mm"); // Return the formatted date
};
export const formatDateOnly = (date) => {
  return moment(date).format("YYYY/MM/DD");
};
export const formatDateYearsMonth = (date) => {
  return moment(date).format("YYYY/MM/DD");
};
