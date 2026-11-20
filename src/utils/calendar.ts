/**
 * 달력 칸 만들기 (기본: 월요일 시작, weekStart='sun'이면 일요일 시작)
 * - null: 이번 달이 아닌 빈 칸
 * - number: 날짜 (1~31)
 * 항상 7의 배수로 채워서 반환
 */
export function getMonthCells(
  year: number,
  month: number,
  weekStart: 'mon' | 'sun' = 'mon',
): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0(일)~6(토)
  const leading = weekStart === 'sun' ? firstDay : (firstDay + 6) % 7 // 앞쪽 빈 칸 수
  const daysInMonth = getDaysInMonth(year, month)

  const cells: (number | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

/** 날짜 키 'YYYY-MM-DD' (month: 1~12) */
export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return { year, month, day }
}

export function getTodayKey() {
  const today = new Date()
  return toDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate())
}

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

/** '9월 17일 목요일' */
export function formatDateLabel(key: string) {
  const { year, month, day } = parseDateKey(key)
  const weekday = WEEKDAY_NAMES[new Date(year, month - 1, day).getDay()]
  return `${month}월 ${day}일 ${weekday}요일`
}
