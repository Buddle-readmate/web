import type { StreakLevel } from '@/types/home'

export type GrassCell = {
  /** 'YYYY-MM-DD' */
  date: string
  level: StreakLevel
  /** 오늘 이후 (점선 빈칸) */
  isFuture: boolean
}

export type GrassWeek = {
  cells: GrassCell[]
  /** 이 주에 1일이 있으면 그 달 (위쪽 월 표시용) */
  monthStart?: number
}

function toKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * endDate('YYYY-MM-DD')가 들어 있는 주까지 n주 잔디 (일요일 시작, 한 주 = 한 열)
 * endDate 이후 날짜(올해는 오늘 이후, 지난 해는 다음 해)는 점선 빈칸
 */
export function getGrassWeeks(
  grass: Record<string, StreakLevel>,
  weekCount: number,
  endDate: string,
): GrassWeek[] {
  const [year, month, day] = endDate.split('-').map(Number)
  const end = new Date(year, month - 1, day)
  const start = new Date(end)
  start.setDate(end.getDate() - end.getDay() - (weekCount - 1) * 7)
  const todayKey = toKey(new Date())
  const lastKey = endDate < todayKey ? endDate : todayKey

  return Array.from({ length: weekCount }, (_, weekIndex) => {
    let monthStart: number | undefined
    const cells = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start)
      date.setDate(start.getDate() + weekIndex * 7 + dayIndex)
      const key = toKey(date)
      if (date.getDate() === 1 && key <= lastKey) monthStart = date.getMonth() + 1
      return { date: key, level: grass[key] ?? 0, isFuture: key > lastKey }
    })
    return { cells, monthStart }
  })
}

/** 잔디가 이어진 가장 긴 날 수 */
export function getLongestStreak(grass: Record<string, StreakLevel>) {
  const keys = Object.keys(grass)
    .filter((key) => grass[key] > 0)
    .sort()
  let longest = 0
  let current = 0
  let prev: Date | null = null
  for (const key of keys) {
    const [year, month, day] = key.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const isNext = prev && date.getTime() - prev.getTime() === 24 * 60 * 60 * 1000
    current = isNext ? current + 1 : 1
    longest = Math.max(longest, current)
    prev = date
  }
  return longest
}
