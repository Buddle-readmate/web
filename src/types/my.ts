import type { StreakLevel } from '@/types/home'

export type MonthlyReading = {
  year: number
  /** 1~12 */
  month: number
  pages: number
  recordDays: number
  finishedBooks: number
}

export type YearOption = {
  year: number
  hasRecords: boolean
}

export type MyPageData = {
  nickname: string
  /** 연간 독서 목표 (권) */
  yearlyGoal: number
  years: YearOption[]
  stats: {
    finished: number
    pages: number
    days: number
    thoughts: number
  }
  /** 오래된 달 → 이번 달 순서, 최근 6개월 */
  monthly: MonthlyReading[]
  /** 'YYYY-MM-DD' → 잔디 단계. 없는 날짜는 0 */
  grass: Record<string, StreakLevel>
  /** 이번 달 목표 페이스 (하루 n쪽) */
  dailyPagePace: number
}
