export function formatDate(date: Date, locale = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00")
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return getDateString(date1) === getDateString(date2)
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  const start = new Date(startDate)

  for (let i = 0; i < 7; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    days.push(day)
  }

  return days
}

export function getStartOfWeek(date: Date, startOfWeek: 0 | 1 = 1): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? (startOfWeek === 1 ? -6 : 0) : day - startOfWeek
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getWeekdayShort(date: Date, locale = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date)
}

export function getDayOfMonth(date: Date): number {
  return date.getDate()
}

export function isPastDay(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  return compareDate < today
}
