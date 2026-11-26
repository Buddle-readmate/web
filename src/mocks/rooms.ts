import almond from '@/assets/mocks/covers/almond.jpg'
import contradiction from '@/assets/mocks/covers/contradiction.jpg'
import convenienceStore from '@/assets/mocks/covers/convenience-store.jpg'
import demian from '@/assets/mocks/covers/demian.jpg'
import humanActs from '@/assets/mocks/covers/human-acts.jpg'
import type { JoinableRoom, RoomDetail, RoomSummary, ShelfBook, Thought } from '@/types/room'
import { toPageRanges } from '@/utils/room'

// TODO: 교환독서 API 나오면 교체 (피그마 "교환독서_메인" / "교환독서방" 시안 기준 더미 데이터)
export const ROOMS_MOCK: RoomSummary[] = [
  {
    id: 1,
    name: '혼모노들의 교환독서',
    bookTitle: '혼모노',
    author: '성해나',
    totalPages: 268,
    memberAvatarUrls: Array(6).fill(undefined),
    progress: 64,
    isDone: false,
    lastActivity: '1시간 전',
  },
  {
    id: 2,
    name: '수요일 데미안 클럽',
    bookTitle: '데미안',
    author: '헤르만 헤세',
    totalPages: 345,
    coverUrl: demian,
    memberAvatarUrls: Array(6).fill(undefined),
    progress: 78,
    isDone: false,
    lastActivity: '3시간 전',
  },
  {
    id: 3,
    name: '한강 읽기 모임',
    bookTitle: '소년이 온다',
    author: '한강',
    totalPages: 216,
    coverUrl: humanActs,
    memberAvatarUrls: Array(3).fill(undefined),
    progress: 30,
    isDone: false,
    lastActivity: '어제',
  },
  ...Array.from({ length: 4 }, (_, index) => ({
    id: 10 + index,
    name: '혼모노들의 교환독서',
    bookTitle: '혼모노',
    author: '성해나',
    totalPages: 268,
    memberAvatarUrls: Array(6).fill(undefined),
    progress: 100,
    isDone: true,
    lastActivity: `${index + 2}주 전`,
  })),
]

/** 더미 데이터 속 내 id */
export const MY_ID = 1

const DEMIAN_ROOM: RoomDetail = {
  id: 2,
  name: '수요일 데미안 클럽',
  bookTitle: '데미안',
  author: '헤르만 헤세',
  totalPages: 345,
  coverUrl: demian,
  myId: MY_ID,
  // 데미안 방은 내가 방장 (설정: 수정·삭제·내보내기 확인용)
  hostId: MY_ID,
  inviteCode: 'BDL-8K2Q',
  password: '1234',
  dailyGoal: 20,
  members: [
    { id: 1, nickname: '김버들', readPage: 268 },
    { id: 2, nickname: '동진', readPage: 320 },
    { id: 3, nickname: '예진', readPage: 120 },
    { id: 4, nickname: '효정', readPage: 90 },
    { id: 5, nickname: '정원', readPage: 30 },
    { id: 6, nickname: '지원', readPage: 200 },
  ],
  pageRanges: [
    { start: 1, end: 50 },
    { start: 51, end: 100 },
    { start: 101, end: 200 },
    { start: 201, end: 300 },
    { start: 301, end: 345 },
  ],
  stories: [
    {
      id: 1,
      page: 287,
      content: '주인공이 말한 내용에 대해 어떻게 생각했나요?',
      authorId: 2,
      replierIds: [3, 4, 6],
    },
    {
      id: 2,
      page: 267,
      content:
        '싱클레어가 데미안의 편지를 받는 장면이 오래 남았어요. 알을 깨고 나오는 새 이야기가 지금 내 상황이랑 겹쳐 보여서, 다들 이 부분을 어떻게 읽었는지 궁금해요.',
      authorId: 1,
      replierIds: [2, 3, 4, 6],
      myRepliedAt: '2026.10.26',
    },
    {
      id: 3,
      page: 267,
      content: '주인공이 말한 내용에 대해 어떻게 생각했나요?',
      authorId: 2,
      replierIds: [3, 4, 6],
    },
    {
      id: 4,
      page: 240,
      content: '주인공이 말한 내용에 대해 어떻게 생각했나요?',
      authorId: 2,
      replierIds: [3, 4, 5, 6],
      myRepliedAt: '2026.10.26',
    },
    {
      id: 5,
      page: 212,
      content: '주인공이 말한 내용에 대해 어떻게 생각했나요?',
      authorId: 1,
      replierIds: [2, 3, 4, 6],
      myRepliedAt: '2026.10.26',
    },
    {
      id: 6,
      page: 154,
      content: '에바 부인을 처음 만나는 장면, 여러분은 어떤 느낌이었나요?',
      authorId: 3,
      replierIds: [2, 4],
    },
    {
      id: 7,
      page: 122,
      content: '가장 오래 머물렀던 문장은 무엇인가요?',
      authorId: 1,
      replierIds: [3],
      myRepliedAt: '2026.10.21',
    },
    {
      id: 8,
      page: 24,
      content: '두 세계에 대한 묘사, 어릴 때 비슷한 기분을 느낀 적 있나요?',
      authorId: 4,
      replierIds: [2, 3, 5, 6],
      myRepliedAt: '2026.10.12',
    },
  ],
}

/** 데미안 방 외에는 아직 이야기가 없는 방 (피그마 "교환독서방_처음") */
export function getRoomDetailMock(roomId: number): RoomDetail | undefined {
  if (roomId === DEMIAN_ROOM.id) return DEMIAN_ROOM
  const summary = ROOMS_MOCK.find((room) => room.id === roomId)
  if (!summary) return undefined
  return {
    id: summary.id,
    name: summary.name,
    bookTitle: summary.bookTitle,
    author: summary.author,
    totalPages: summary.totalPages,
    coverUrl: summary.coverUrl,
    myId: DEMIAN_ROOM.myId,
    // 나머지 방은 다른 사람이 방장 (설정: 일반 멤버 나가기 확인용)
    hostId: 2,
    inviteCode: `BDL-${String(summary.id).padStart(4, '0')}`,
    password: '0000',
    dailyGoal: 20,
    // 나는 목록 진행률만큼, 다른 멤버는 조금씩 덜 읽은 상태
    members: DEMIAN_ROOM.members.map((member, index) => ({
      ...member,
      readPage: Math.round(((summary.totalPages * summary.progress) / 100) * (1 - index * 0.15)),
    })),
    pageRanges: toPageRanges(summary.totalPages),
    stories: [],
  }
}

/** 방 만들기 1단계 "내 책장에서 고르기" (피그마 "교환독서 만들기_01") */
export const MY_SHELF_BOOKS_MOCK: ShelfBook[] = [
  {
    id: 1,
    title: '혼모노',
    author: '성해나',
    totalPages: 268,
    status: 'reading',
    progress: 45,
  },
  {
    id: 2,
    title: '불편한 편의점',
    author: '김호연',
    coverUrl: convenienceStore,
    totalPages: 268,
    status: 'reading',
    progress: 30,
  },
  {
    id: 3,
    title: '아몬드',
    author: '손원평',
    coverUrl: almond,
    totalPages: 264,
    status: 'done',
    progress: 100,
  },
  {
    id: 4,
    title: '데미안',
    author: '헤르만 헤세',
    coverUrl: demian,
    totalPages: 345,
    status: 'done',
    progress: 100,
  },
  {
    id: 5,
    title: '모순',
    author: '양귀자',
    coverUrl: contradiction,
    totalPages: 296,
    status: 'done',
    progress: 100,
  },
]

/** 초대코드로 참가할 수 있는 방 (피그마 "교환독서 참여하기" 시안: BDL-8K2Q / 1234) */
export const JOINABLE_ROOMS_MOCK: JoinableRoom[] = [
  {
    roomId: 2,
    code: 'BDL8K2Q',
    password: '1234',
    name: '수요일 데미안 클럽',
    bookTitle: '데미안',
    author: '헤르만 헤세',
    totalPages: 345,
    coverUrl: demian,
    memberCount: 2,
    maxMembers: 6,
  },
  {
    // 인원이 가득 찬 방 (참가 불가 안내 확인용)
    roomId: 3,
    code: 'BDLFULL',
    password: '0000',
    name: '한강 읽기 모임',
    bookTitle: '소년이 온다',
    author: '한강',
    totalPages: 216,
    coverUrl: humanActs,
    memberCount: 6,
    maxMembers: 6,
  },
]

/** 페이지별 이야기에 달린 생각 (피그마 "페이지별 이야기" 시안 기준, 데미안 방만) */
const THOUGHTS_MOCK: Record<number, Thought[]> = {
  // P. 267 동진 질문 (아직 내 생각 안 남김 → 가려서 보여줌)
  3: [
    {
      id: 1,
      authorId: 3,
      content:
        '나는 오히려 그 선택이 가장 용감한 순간이라고 생각했어. 익숙한 세계를 깨고 나오는 느낌이었거든.',
      createdAt: '26.11.14',
      likedBy: [2, 4],
    },
    {
      id: 2,
      authorId: 2,
      content: '나도 비슷하게 읽었어. 그 장면에서 한참 멈춰 있었어',
      createdAt: '26.11.14',
      likedBy: [3, 4],
      parentId: 1,
      mentionId: 3,
    },
    {
      id: 3,
      authorId: 4,
      content: '두려움보다 궁금함이 더 컸던 것 같아. 다음 장이 계속 궁금했어.',
      createdAt: '26.11.15',
      likedBy: [2],
    },
    {
      id: 4,
      authorId: 6,
      content: '처음엔 이해가 안 됐는데 두 번 읽으니까 조금 알 것 같아.',
      createdAt: '26.11.16',
      likedBy: [],
    },
  ],
  // P. 267 내 질문 (내가 쓴 이야기라 바로 보임)
  2: [
    {
      id: 1,
      authorId: 3,
      content: '알을 깨는 이야기, 나도 요즘 딱 그런 시기라서 공감됐어.',
      createdAt: '26.10.27',
      likedBy: [1],
    },
    {
      id: 2,
      authorId: 1,
      content: '맞아, 그래서 더 오래 남았던 것 같아',
      createdAt: '26.10.27',
      likedBy: [3],
      parentId: 1,
      mentionId: 3,
    },
    {
      id: 3,
      authorId: 2,
      content: '편지를 받는 장면보다 그 뒤에 혼자 걷는 장면이 더 기억에 남아.',
      createdAt: '26.10.28',
      likedBy: [],
    },
  ],
}

const SAMPLE_THOUGHTS = [
  '이 장면에서 한참 멈춰서 다시 읽었어.',
  '처음엔 낯설었는데 읽을수록 이해가 됐어.',
  '나도 비슷한 경험이 있어서 더 와닿았어.',
  '이 문장을 메모해뒀어. 오래 기억날 것 같아.',
  '다른 사람들은 어떻게 읽었는지 궁금했는데 반가워.',
]

/**
 * 이야기의 생각 목록
 * 시안 예시가 있는 이야기(2·3번)는 그대로, 나머지는 이야기 정보(생각 남긴 멤버·내가 남긴 날짜)에 맞춰 만듦
 */
export function getThoughtsMock(roomId: number, storyId: number): Thought[] {
  if (roomId !== DEMIAN_ROOM.id) return []
  if (THOUGHTS_MOCK[storyId]) return THOUGHTS_MOCK[storyId]
  const story = DEMIAN_ROOM.stories.find((item) => item.id === storyId)
  if (!story) return []
  // "2026.10.26" → "26.10.26"
  const myDate = story.myRepliedAt?.slice(2)
  const authorIds = [
    ...(myDate && story.authorId !== MY_ID ? [MY_ID] : []),
    ...story.replierIds.filter((id) => id !== MY_ID),
  ]
  return authorIds.map((authorId, index) => ({
    id: index + 1,
    authorId,
    content: SAMPLE_THOUGHTS[(storyId + index) % SAMPLE_THOUGHTS.length],
    createdAt: authorId === MY_ID && myDate ? myDate : '26.10.20',
    likedBy: index % 2 === 0 ? [story.authorId] : [],
  }))
}
