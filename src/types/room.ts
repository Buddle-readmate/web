/** 교환독서 목록 필터: 전체 / 참여중 / 완독 */
export type RoomFilter = 'all' | 'reading' | 'done'

export type RoomSummary = {
  id: number
  name: string
  bookTitle: string
  author: string
  totalPages: number
  coverUrl?: string
  memberAvatarUrls: (string | undefined)[]
  /** 0~100 */
  progress: number
  isDone: boolean
  /** 마지막 활동 시각 표시용 문구 (예: 1시간 전) */
  lastActivity: string
}

export type RoomMember = {
  id: number
  nickname: string
  avatarUrl?: string
  /** 지금까지 읽은 쪽수 */
  readPage: number
}

export type Story = {
  id: number
  page: number
  content: string
  authorId: number
  /** 내 생각을 남긴 멤버 */
  replierIds: number[]
  /** 내가 생각을 남긴 날짜 (YYYY.MM.DD). 없으면 아직 안 남김 */
  myRepliedAt?: string
}

export type PageRange = {
  start: number
  end: number
}

export type RoomDetail = {
  id: number
  name: string
  bookTitle: string
  author: string
  totalPages: number
  coverUrl?: string
  myId: number
  members: RoomMember[]
  /** 이야기를 묶어 보여주는 쪽 구간 */
  pageRanges: PageRange[]
  stories: Story[]
}

/** 방 만들기에서 고르는 내 책장 책 */
export type ShelfBook = {
  id: number
  title: string
  author: string
  coverUrl?: string
  totalPages: number
  status: 'reading' | 'done'
  /** 0~100 (읽는 중일 때) */
  progress: number
}

/** 초대코드로 찾은 방 정보 */
export type JoinableRoom = {
  roomId: number
  /** 하이픈 없이 대문자 (예: BDL8K2Q) */
  code: string
  password: string
  name: string
  bookTitle: string
  author: string
  totalPages: number
  coverUrl?: string
  memberCount: number
  maxMembers: number
}

/** 방 만들기 입력값 */
export type NewRoomInput = {
  book: ShelfBook
  name: string
  totalPages: number
  dailyGoal: number
  password: string
}
