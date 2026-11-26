import type { PageRange, Story } from '@/types/room'

export type SortOrder = 'desc' | 'asc'

/** 쪽 번호 세 자리 맞추기 (1 → 001) */
const pad = (page: number) => String(page).padStart(3, '0')

/** 웹: "p. 001 – 050" / 모바일: "p. 001-050" */
export function formatPageRange(range: PageRange, variant: 'web' | 'mobile') {
  return variant === 'web'
    ? `p. ${pad(range.start)} – ${pad(range.end)}`
    : `p. ${pad(range.start)}-${pad(range.end)}`
}

/** 100쪽씩 끊은 구간 (마지막 구간은 책 끝까지) */
export function toPageRanges(totalPages: number): PageRange[] {
  return Array.from({ length: Math.ceil(totalPages / 100) }, (_, index) => ({
    start: index * 100 + 1,
    end: Math.min((index + 1) * 100, totalPages),
  }))
}

export function isInRange(page: number, range: PageRange) {
  return page >= range.start && page <= range.end
}

/** 지금 읽고 있는 쪽이 들어 있는 구간 (0쪽이면 첫 구간) */
export function findCurrentRange(ranges: PageRange[], page: number) {
  return ranges.find((range) => isInRange(Math.max(page, 1), range)) ?? ranges[0]
}

export function sortRanges(ranges: PageRange[], order: SortOrder) {
  return [...ranges].sort((a, b) => (order === 'desc' ? b.start - a.start : a.start - b.start))
}

/** 구간 안 이야기를 쪽 순서대로 (같은 쪽이면 최근 글 먼저) */
export function getStoriesInRange(stories: Story[], range: PageRange, order: SortOrder) {
  return stories
    .filter((story) => isInRange(story.page, range))
    .sort((a, b) => {
      if (a.page !== b.page) return order === 'desc' ? b.page - a.page : a.page - b.page
      return b.id - a.id
    })
}

/** 오늘 날짜 "YYYY.MM.DD" */
export function formatToday() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const date = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}.${month}.${date}`
}

export const ROOM_NAME_MAX = 20
export const ROOM_PAGES_MAX = 9999
export const DAILY_GOAL_PRESETS = [10, 20, 30] as const

/** 하루 목표: 10·20·30쪽 중 하나, 또는 직접 입력 */
export type DailyGoalPreset = (typeof DAILY_GOAL_PRESETS)[number] | 'custom'

/** 숫자만 남기기 */
export const onlyDigits = (value: string) => value.replace(/\D/g, '')

/** 저장된 하루 목표 → 칩 선택값 (10·20·30이 아니면 직접 입력) */
export function toGoalPreset(dailyGoal: number): DailyGoalPreset {
  return (DAILY_GOAL_PRESETS as readonly number[]).includes(dailyGoal)
    ? (dailyGoal as DailyGoalPreset)
    : 'custom'
}

/** 방 이름·총 쪽수·하루 목표 입력값 확인 */
export function validateRoomInfo(
  name: string,
  pages: string,
  goalPreset: DailyGoalPreset | null,
  customGoal: string,
) {
  const totalPages = Number(pages)
  const isNameValid = name.trim().length > 0
  const isPagesValid =
    Number.isInteger(totalPages) && totalPages >= 1 && totalPages <= ROOM_PAGES_MAX
  const dailyGoal = goalPreset === 'custom' ? Number(customGoal) : (goalPreset ?? 0)
  const isGoalValid =
    Number.isInteger(dailyGoal) && dailyGoal >= 1 && (!isPagesValid || dailyGoal <= totalPages)
  return {
    totalPages,
    dailyGoal,
    isNameValid,
    isPagesValid,
    isGoalValid,
    isValid: isNameValid && isPagesValid && isGoalValid,
  }
}
