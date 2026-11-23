export type RecordBook = {
  id: number
  title: string
  coverUrl?: string
}

/** 하루 독서 기록 한 건 */
export type ReadingRecord = {
  id: number
  /** 'YYYY-MM-DD' */
  date: string
  book: RecordBook
  startPage: number
  endPage: number
  memo: string
}

/** 기록 추가에서 고를 수 있는 책 (진행 중인 교환독서의 책) */
export type ExchangeBook = RecordBook & {
  roomName: string
  totalPages: number
}

export type NewReadingRecord = Omit<ReadingRecord, 'id'>
