import almond from '@/assets/mocks/covers/almond.jpg'
import contradiction from '@/assets/mocks/covers/contradiction.jpg'
import convenienceStore from '@/assets/mocks/covers/convenience-store.jpg'
import dallergut from '@/assets/mocks/covers/dallergut.jpg'
import demian from '@/assets/mocks/covers/demian.jpg'
import farewell from '@/assets/mocks/covers/farewell.jpg'
import liveAsMyself from '@/assets/mocks/covers/live-as-myself.jpg'
import type { ExchangeBook, ReadingRecord, RecordBook } from '@/types/calendar'
import { getDaysInMonth, toDateKey } from '@/utils/calendar'

// TODO: 독서 기록 API 나오면 교체 (피그마 "M_독서 캘린더" 9월 시안 기준 더미 데이터)
const BOOKS = {
  D: { id: 1, title: '데미안', coverUrl: demian },
  B: { id: 2, title: '불편한 편의점', coverUrl: convenienceStore },
  M: { id: 3, title: '모순', coverUrl: contradiction },
  A: { id: 4, title: '아몬드', coverUrl: almond },
  J: { id: 5, title: '작별하지 않는다', coverUrl: farewell },
  G: { id: 6, title: '달러구트 꿈 백화점', coverUrl: dallergut },
  L: { id: 7, title: '나는 나로 살기로 했다', coverUrl: liveAsMyself },
} satisfies Record<string, RecordBook>

type BookKey = keyof typeof BOOKS

const MEMOS: Record<BookKey, string> = {
  D: 'p.72의 선택을 다시 읽어보기.',
  B: '오늘은 짧게 읽었다.',
  M: '안진진의 선택이 마음에 걸린다.',
  A: '감정을 배우는 과정이 따뜻하다.',
  J: '눈 내리는 장면이 오래 남는다.',
  G: '꿈을 사고판다는 설정이 재밌다.',
  L: '나를 아끼는 연습이 필요하다.',
}

// 시안 9월 달력: 날짜 → 그날 읽은 책
const DAY_PATTERN: Record<number, BookKey[]> = {
  1: ['D'],
  2: ['D', 'B'],
  4: ['B'],
  5: ['D'],
  6: ['D', 'B', 'M'],
  8: ['A'],
  9: ['D'],
  10: ['D', 'B', 'M', 'A'],
  13: ['B'],
  15: ['M', 'J'],
  16: ['B'],
  17: ['D', 'B', 'M', 'A'],
  19: ['B', 'G'],
  20: ['D'],
  22: ['A'],
  23: ['D', 'B', 'M'],
  24: ['D'],
  26: ['J', 'L'],
  27: ['D'],
  29: ['D', 'B'],
}

const PAGES_PER_DAY = 12

/** 지난달 전체 + 이번 달 오늘까지 시안 패턴으로 기록 채우기 */
function createMockRecords(): ReadingRecord[] {
  const today = new Date()
  const thisYear = today.getFullYear()
  const thisMonth = today.getMonth() + 1
  const prev =
    thisMonth === 1 ? { year: thisYear - 1, month: 12 } : { year: thisYear, month: thisMonth - 1 }
  const months = [
    { ...prev, lastDay: getDaysInMonth(prev.year, prev.month) },
    { year: thisYear, month: thisMonth, lastDay: today.getDate() },
  ]

  const nextPage: Partial<Record<BookKey, number>> = {}
  const records: ReadingRecord[] = []
  for (const { year, month, lastDay } of months) {
    for (let day = 1; day <= lastDay; day++) {
      for (const key of DAY_PATTERN[day] ?? []) {
        const startPage = nextPage[key] ?? 1
        nextPage[key] = startPage + PAGES_PER_DAY
        records.push({
          id: records.length + 1,
          date: toDateKey(year, month, day),
          book: BOOKS[key],
          startPage,
          endPage: startPage + PAGES_PER_DAY,
          memo: MEMOS[key],
        })
      }
    }
  }
  return records
}

export const CALENDAR_RECORDS_MOCK: ReadingRecord[] = createMockRecords()

export const EXCHANGE_BOOKS_MOCK: ExchangeBook[] = [
  { ...BOOKS.D, roomName: '수요일 데미안 클럽', totalPages: 345 },
  { ...BOOKS.B, roomName: '편의점 앞 북클럽', totalPages: 268 },
  { ...BOOKS.M, roomName: '모순 같이 읽기', totalPages: 300 },
  { ...BOOKS.A, roomName: '아몬드 읽는 밤', totalPages: 264 },
  { ...BOOKS.J, roomName: '한강 읽기 모임', totalPages: 332 },
]
