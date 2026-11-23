import type { ExchangeBook, ReadingRecord } from '@/types/calendar'
import type { StreakLevel } from '@/types/home'
import type { MonthlyReading, MyPageData, YearStats } from '@/types/my'
import { getRecordPages, getTodayKey } from '@/utils/calendar'
import { getGrassWeeks, getLongestStreak } from '@/utils/grass'

/** 웹 잔디(26주)의 첫 날짜 */
function getGrassStart(endDate: string) {
  return getGrassWeeks({}, 26, endDate)[0].cells[0].date
}

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
  // 오늘 이후 날짜는 아직 읽은 기록이 아니므로 통계에서 제외
  const todayKey = getTodayKey()
  const pastRecords = records.filter((record) => record.date <= todayKey)

  for (const record of [...pastRecords].sort((a, b) => a.date.localeCompare(b.date))) {
    const [year, month] = record.date.split('-').map(Number)
    if (!byYear[year]) continue

    const pages = getRecordPages(record)
    const finishedKey = `${year}-${record.book.id}`
    const totalPages = books.find((book) => book.id === record.book.id)?.totalPages
    const isFinished =
      totalPages !== undefined && record.endPage >= totalPages && !finishedKeys.has(finishedKey)
    if (isFinished) finishedKeys.add(finishedKey)

    // 올해 차트·잔디는 작년까지 걸칠 수 있어서, 날짜가 보이는 모든 연도에 반영 (누적 통계는 해당 연도만)
    for (const target of Object.values(byYear)) {
      const isOwnYear = target.year === year
      const isInMonthly = target.monthly.some((item) => item.year === year && item.month === month)
      const isInGrass =
        record.date <= target.endDate && record.date >= getGrassStart(target.endDate)
      if (!isOwnYear && !isInMonthly && !isInGrass) continue

      const level = target.grass[record.date] ?? 0
      const isNewDay = level === 0
      const addMonth = (item: MonthlyReading): MonthlyReading => ({
        ...item,
        pages: item.pages + pages,
        recordDays: item.recordDays + (isNewDay ? 1 : 0),
        finishedBooks: item.finishedBooks + (isFinished ? 1 : 0),
      })
      const isRecordMonth = (item: MonthlyReading) => item.year === year && item.month === month
      const extraMonths = target.extraMonths ?? []

      byYear[target.year] = {
        ...target,
        stats: isOwnYear
          ? {
              finished: target.stats.finished + (isFinished ? 1 : 0),
              pages: target.stats.pages + pages,
              days: target.stats.days + (isNewDay ? 1 : 0),
              thoughts: target.stats.thoughts + (record.memo ? 1 : 0),
            }
          : target.stats,
        monthly: target.monthly.map((item) => (isRecordMonth(item) ? addMonth(item) : item)),
        extraMonths:
          !isOwnYear || isInMonthly
            ? target.extraMonths
            : extraMonths.some(isRecordMonth)
              ? extraMonths.map((item) => (isRecordMonth(item) ? addMonth(item) : item))
              : [
                  ...extraMonths,
                  addMonth({ year, month, pages: 0, recordDays: 0, finishedBooks: 0 }),
                ],
        grass: { ...target.grass, [record.date]: Math.min(4, level + 1) as StreakLevel },
      }
    }
  }

  return {
    ...data,
    byYear,
    years: data.years.map((item) => ({
      ...item,
      hasRecords: item.hasRecords || pastRecords.some((r) => r.date.startsWith(`${item.year}-`)),
    })),
  }
}

/** 마이페이지 문구에 쓰는 값 계산 (모바일 16주·4개월 / 웹 26주·6개월 기준) */
export function getMyStats(data: YearStats) {
  const mobileMonths = data.monthly.slice(-4)
  const webMonths = data.monthly.slice(-6)
  const current = data.monthly[data.monthly.length - 1]
  // 차트·잔디는 작년까지 걸칠 수 있어서, 문구에 쓰는 값은 선택한 연도만으로 계산
  const best = [...data.monthly, ...(data.extraMonths ?? [])]
    .filter((item) => item.year === data.year)
    .reduce((max, item) => (item.pages > max.pages ? item : max))
  const yearGrass = Object.fromEntries(
    Object.entries(data.grass).filter(([date]) => date.startsWith(`${data.year}-`)),
  )
  const hasRecords = data.stats.pages > 0

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
    longestStreak: getLongestStreak(yearGrass),
    /** '2026년 8월 – 11월' */
    mobileRange: `${mobileMonths[0].year}년 ${mobileMonths[0].month}월 – ${current.month}월`,
    mobileGrassDays: countDays(16),
    webGrassDays: countDays(26),
    mobilePages: sumPages(mobileMonths),
    webPages: sumPages(webMonths),
  }
}
