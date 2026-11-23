import type { YearStats } from '@/types/my'
import { getGrassWeeks, getLongestStreak } from '@/utils/grass'

/** 마이페이지 문구에 쓰는 값 계산 (모바일 16주·4개월 / 웹 26주·6개월 기준) */
export function getMyStats(data: YearStats) {
  const mobileMonths = data.monthly.slice(-4)
  const webMonths = data.monthly.slice(-6)
  const current = data.monthly[data.monthly.length - 1]
  const best = data.monthly.reduce((max, item) => (item.pages > max.pages ? item : max))
  const hasRecords = data.monthly.some((item) => item.pages > 0)

  const countDays = (weekCount: number) =>
    getGrassWeeks(data.grass, weekCount, data.endDate)
      .flatMap((week) => week.cells)
      .filter((cell) => cell.level > 0).length

  const sumPages = (months: typeof data.monthly) =>
    months.reduce((sum, item) => sum + item.pages, 0).toLocaleString()

  return {
    hasRecords,
    mobileMonths,
    webMonths,
    current,
    best,
    longestStreak: getLongestStreak(data.grass),
    /** '2026년 8월 – 11월' */
    mobileRange: `${mobileMonths[0].year}년 ${mobileMonths[0].month}월 – ${current.month}월`,
    mobileGrassDays: countDays(16),
    webGrassDays: countDays(26),
    mobilePages: sumPages(mobileMonths),
    webPages: sumPages(webMonths),
  }
}
