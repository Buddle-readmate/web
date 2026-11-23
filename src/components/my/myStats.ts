import type { ExchangeBook, ReadingRecord } from '@/types/calendar'
import type { StreakLevel } from '@/types/home'
import type { MyPageData, YearStats } from '@/types/my'
import { getRecordPages } from '@/utils/calendar'
import { getGrassWeeks, getLongestStreak } from '@/utils/grass'

/**
 * 캘린더에서 추가한 기록을 마이페이지 통계에 더하기
 * TODO: 통계 API 연동되면 제거 (서버가 계산한 값을 그대로 사용)
 */
export function applyAddedRecords(
  data: MyPageData,
  records: ReadingRecord[],
  books: ExchangeBook[],
): MyPageData {
  const byYear = { ...data.byYear }
  const finishedKeys = new Set<string>()

  for (const record of [...records].sort((a, b) => a.date.localeCompare(b.date))) {
    const [year, month] = record.date.split('-').map(Number)
    const current = byYear[year]
    if (!current) continue

    const pages = getRecordPages(record)
    const level = current.grass[record.date] ?? 0
    const isNewDay = level === 0
    const finishedKey = `${year}-${record.book.id}`
    const totalPages = books.find((book) => book.id === record.book.id)?.totalPages
    const isFinished =
      totalPages !== undefined && record.endPage >= totalPages && !finishedKeys.has(finishedKey)
    if (isFinished) finishedKeys.add(finishedKey)

    byYear[year] = {
      ...current,
      stats: {
        finished: current.stats.finished + (isFinished ? 1 : 0),
        pages: current.stats.pages + pages,
        days: current.stats.days + (isNewDay ? 1 : 0),
        thoughts: current.stats.thoughts + (record.memo ? 1 : 0),
      },
      monthly: current.monthly.map((item) =>
        item.year === year && item.month === month
          ? {
              ...item,
              pages: item.pages + pages,
              recordDays: item.recordDays + (isNewDay ? 1 : 0),
              finishedBooks: item.finishedBooks + (isFinished ? 1 : 0),
            }
          : item,
      ),
      grass: { ...current.grass, [record.date]: Math.min(4, level + 1) as StreakLevel },
    }
  }

  return {
    ...data,
    byYear,
    years: data.years.map((item) => ({
      ...item,
      hasRecords: item.hasRecords || records.some((r) => r.date.startsWith(`${item.year}-`)),
    })),
  }
}

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
