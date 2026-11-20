import type { StreakLevel } from '@/types/home'
import type { MonthlyReading, MyPageData } from '@/types/my'

// TODO: 마이페이지 API 나오면 교체 (피그마 "마이페이지_기록있음" 기준 더미 데이터)

// 최근 6개월 쪽수 (시안: 6월 419 · 7월 641 · 8월 520 · 9월 780 · 10월 520 · 11월 168)
const MONTHLY_PAGES = [419, 641, 520, 780, 520, 168]
const MONTHLY_DAYS = [11, 16, 14, 20, 12, 7]
const MONTHLY_FINISHED = [2, 3, 2, 3, 2, 0]

function createMonthly(pages: number[]): MonthlyReading[] {
  const today = new Date()
  return pages.map((value, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (pages.length - 1 - index), 1)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      pages: value,
      recordDays: value > 0 ? MONTHLY_DAYS[index] : 0,
      finishedBooks: value > 0 ? MONTHLY_FINISHED[index] : 0,
    }
  })
}

/** 최근 26주 잔디를 날짜마다 일정한 규칙으로 채우기 (새로고침해도 같은 모양) */
function createGrass(): Record<string, StreakLevel> {
  const today = new Date()
  const grass: Record<string, StreakLevel> = {}
  for (let offset = 0; offset < 26 * 7; offset++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset)
    const seed = (date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate()) * 2654435761
    // 대략 10일 중 7일 기록 (연속 기록이 생기도록)
    const value = (seed >>> 0) % 10
    if (value < 3) continue
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    grass[key] = Math.min(4, Math.ceil((value - 2) / 2)) as StreakLevel
  }
  return grass
}

const thisYear = new Date().getFullYear()

export const MY_PAGE_MOCK: MyPageData = {
  nickname: '김버들',
  yearlyGoal: 30,
  years: [
    { year: thisYear, hasRecords: true },
    { year: thisYear - 1, hasRecords: true },
    { year: thisYear - 2, hasRecords: false },
  ],
  stats: { finished: 23, pages: 5420, days: 142, thoughts: 31 },
  monthly: createMonthly(MONTHLY_PAGES),
  grass: createGrass(),
  dailyPagePace: 20,
}

export const MY_PAGE_MOCK_EMPTY: MyPageData = {
  ...MY_PAGE_MOCK,
  stats: { finished: 0, pages: 0, days: 0, thoughts: 0 },
  monthly: createMonthly(MONTHLY_PAGES.map(() => 0)),
  grass: {},
}
