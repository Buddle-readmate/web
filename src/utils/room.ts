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
