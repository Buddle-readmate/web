/** 독서 잔디 단계: 0 = 기록 없음(흰색), 1~4 = 많이 읽을수록 진한 초록 */
export type StreakLevel = 0 | 1 | 2 | 3 | 4

export type ReadingStreak = {
  year: number
  /** 1~12 */
  month: number
  /** 날짜(1~31) → 단계. 없는 날짜는 0 */
  levels: Record<number, StreakLevel>
  days: number
  pages: number
  thoughts: number
}

export type HomeNotification = {
  id: number
  message: string
  preview: string
  timeAgo: string
  avatarUrl?: string
}

export type ExchangeRoom = {
  id: number
  name: string
  bookTitle: string
  author: string
  coverUrl?: string
  memberAvatarUrls: (string | undefined)[]
  /** 0~100 */
  progress: number
}

export type RecentBook = {
  id: number
  title: string
  coverUrl?: string
}

export type HomeData = {
  nickname: string
  hasUnreadNotification: boolean
  streak: ReadingStreak
  notifications: HomeNotification[]
  exchanges: ExchangeRoom[]
  recentBooks: RecentBook[]
}
