/**
 * 월요일 시작 달력 칸 만들기
 * - null: 이번 달이 아닌 빈 칸
 * - number: 날짜 (1~31)
 * 항상 7의 배수로 채워서 반환
 */
export function getMonthCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0(일)~6(토)
  const leading = (firstDay + 6) % 7 // 월요일 시작 기준 앞쪽 빈 칸 수
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (number | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
