import type { StreakLevel } from '@/types/home'
import type { MonthlyReading, MyPageData, YearStats } from '@/types/my'

// TODO: 마이페이지 API 나오면 교체 (피그마 "마이페이지_기록있음" 기준 더미 데이터)

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

type MonthlyInput = { pages: number[]; days: number[]; finished: number[] }

/** end가 있는 달까지 6개월 */
function createMonthly(end: Date, { pages, days, finished }: MonthlyInput): MonthlyReading[] {
  return pages.map((value, index) => {
    const date = new Date(end.getFullYear(), end.getMonth() - (pages.length - 1 - index), 1)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      pages: value,
      recordDays: value > 0 ? days[index] : 0,
      finishedBooks: value > 0 ? finished[index] : 0,
    }
  })
}

/**
 * end까지 26주 잔디를 날짜마다 일정한 규칙으로 채우기 (새로고침해도 같은 모양)
 * skipBelow: 0~9 중 이 값보다 작으면 기록 없는 날 (클수록 듬성듬성)
 */
function createGrass(end: Date, skipBelow: number): Record<string, StreakLevel> {
  const grass: Record<string, StreakLevel> = {}
  for (let offset = 0; offset < 26 * 7; offset++) {
    const date = new Date(end.getFullYear(), end.getMonth(), end.getDate() - offset)
    const seed = (date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate()) * 2654435761
    const value = (seed >>> 0) % 10
    if (value < skipBelow) continue
    grass[toKey(date)] = Math.min(4, Math.ceil((value - skipBelow + 1) / 2)) as StreakLevel
  }
  return grass
}

const today = new Date()
const thisYear = today.getFullYear()
const lastYearEnd = new Date(thisYear - 1, 11, 31)
const twoYearsAgoEnd = new Date(thisYear - 2, 11, 31)

function emptyYear(end: Date, isCurrentYear: boolean): YearStats {
  return {
    year: end.getFullYear(),
    endDate: toKey(end),
    isCurrentYear,
    stats: { finished: 0, pages: 0, days: 0, thoughts: 0 },
    monthly: createMonthly(end, { pages: [0, 0, 0, 0, 0, 0], days: [], finished: [] }),
    grass: {},
    dailyPagePace: 0,
  }
}

// 올해: 최근 6개월 쪽수 (시안: 6월 419 · 7월 641 · 8월 520 · 9월 780 · 10월 520 · 11월 168)
const THIS_YEAR: YearStats = {
  year: thisYear,
  endDate: toKey(today),
  isCurrentYear: true,
  stats: { finished: 23, pages: 5420, days: 142, thoughts: 31 },
  monthly: createMonthly(today, {
    pages: [419, 641, 520, 780, 520, 168],
    days: [11, 16, 14, 20, 12, 7],
    finished: [2, 3, 2, 3, 2, 0],
  }),
  grass: createGrass(today, 3),
  dailyPagePace: 20,
}

// 작년: 7~12월
const LAST_YEAR: YearStats = {
  year: thisYear - 1,
  endDate: toKey(lastYearEnd),
  isCurrentYear: false,
  stats: { finished: 18, pages: 4210, days: 121, thoughts: 24 },
  monthly: createMonthly(lastYearEnd, {
    pages: [380, 455, 610, 300, 520, 690],
    days: [10, 12, 15, 8, 13, 17],
    finished: [1, 2, 2, 1, 2, 3],
  }),
  grass: createGrass(lastYearEnd, 4),
  dailyPagePace: 0,
}

export const MY_PAGE_MOCK: MyPageData = {
  nickname: '김버들',
  yearlyGoal: 30,
  years: [
    { year: thisYear, hasRecords: true },
    { year: thisYear - 1, hasRecords: true },
    { year: thisYear - 2, hasRecords: false },
  ],
  byYear: {
    [thisYear]: THIS_YEAR,
    [thisYear - 1]: LAST_YEAR,
    [thisYear - 2]: emptyYear(twoYearsAgoEnd, false),
  },
}

export const MY_PAGE_MOCK_EMPTY: MyPageData = {
  ...MY_PAGE_MOCK,
  years: MY_PAGE_MOCK.years.map((item) => ({ ...item, hasRecords: false })),
  byYear: {
    [thisYear]: emptyYear(today, true),
    [thisYear - 1]: emptyYear(lastYearEnd, false),
    [thisYear - 2]: emptyYear(twoYearsAgoEnd, false),
  },
}
