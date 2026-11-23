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

/** 한 해의 독서 통계 */
export type YearStats = {
  year: number
  /** 올해면 오늘, 지난 해면 12월 31일 ('YYYY-MM-DD'). 잔디·월별 막대는 이 날짜까지 */
  endDate: string
  isCurrentYear: boolean
  stats: {
    finished: number
    pages: number
    days: number
    thoughts: number
  }
  /** 오래된 달 → 마지막 달 순서, 6개월 */
  monthly: MonthlyReading[]
  /** 6개월 차트 밖에 추가된 기록의 달 (가장 많이 읽은 달 계산용) */
  extraMonths?: MonthlyReading[]
  /** 'YYYY-MM-DD' → 잔디 단계. 없는 날짜는 0 */
  grass: Record<string, StreakLevel>
  /** 이번 달 목표 페이스 (하루 n쪽) */
  dailyPagePace: number
}

export type MyPageData = {
  nickname: string
  /** 연간 독서 목표 (권) */
  yearlyGoal: number
  years: YearOption[]
  byYear: Record<number, YearStats>
}
