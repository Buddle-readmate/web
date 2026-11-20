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
 * 오늘이 들어 있는 주까지 최근 n주 잔디 (일요일 시작, 한 주 = 한 열)
 */
export function getGrassWeeks(
  grass: Record<string, StreakLevel>,
  weekCount: number,
  today = new Date(),
): GrassWeek[] {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const start = new Date(end)
  start.setDate(end.getDate() - end.getDay() - (weekCount - 1) * 7)
  const todayKey = toKey(end)

  return Array.from({ length: weekCount }, (_, weekIndex) => {
    let monthStart: number | undefined
    const cells = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start)
      date.setDate(start.getDate() + weekIndex * 7 + dayIndex)
      if (date.getDate() === 1) monthStart = date.getMonth() + 1
      const key = toKey(date)
      return { date: key, level: grass[key] ?? 0, isFuture: key > todayKey }
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
