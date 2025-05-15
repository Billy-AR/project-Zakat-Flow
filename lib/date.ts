export const formatTanggal = (tanggal: string | Date) => {
  const date = new Date(tanggal);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return formatter.format(date);
};
