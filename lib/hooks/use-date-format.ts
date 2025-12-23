/**
 * Hook para formatação de datas
 */
export function useDateFormatter() {
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "");
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
  };

  const formatDateLong = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  return {
    formatDate,
    formatDateLong,
    formatDateShort,
    isToday,
    isSameDay,
  };
}

