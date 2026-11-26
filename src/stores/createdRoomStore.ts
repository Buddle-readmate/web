import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { JoinableRoom, NewRoomInput, RoomDetail, RoomSummary } from '@/types/room'
import { toPageRanges } from '@/utils/room'

export const MAX_ROOM_MEMBERS = 6

/** 내가 방금 만든 방 (더미 데이터와 별도로 보관) */
export type CreatedRoom = {
  id: number
  name: string
  bookTitle: string
  author: string
  coverUrl?: string
  totalPages: number
  dailyGoal: number
  /** 화면 표시용 "BDL-8K2Q" */
  inviteCode: string
  password: string
}

type CreatedRoomState = {
  rooms: CreatedRoom[]
  createRoom: (input: NewRoomInput) => CreatedRoom
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** "BDL-" + 헷갈리는 글자(0·O·1·I) 뺀 4자리 */
function makeInviteCode() {
  const random = Array.from(
    { length: 4 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
  ).join('')
  return `BDL-${random}`
}

// TODO: 방 만들기 API 연동되면 서버 데이터로 교체
export const useCreatedRoomStore = create<CreatedRoomState>()(
  persist(
    (set) => ({
      rooms: [],
      createRoom: ({ book, name, totalPages, dailyGoal, password }) => {
        const room: CreatedRoom = {
          id: Date.now(),
          name,
          bookTitle: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          totalPages,
          dailyGoal,
          inviteCode: makeInviteCode(),
          password,
        }
        set((state) => ({ rooms: [room, ...state.rooms] }))
        return room
      },
    }),
    { name: 'buddle-created-rooms', storage: createJSONStorage(() => sessionStorage) },
  ),
)

/** 목록 카드용 */
export function toRoomSummary(room: CreatedRoom): RoomSummary {
  return {
    id: room.id,
    name: room.name,
    bookTitle: room.bookTitle,
    author: room.author,
    totalPages: room.totalPages,
    coverUrl: room.coverUrl,
    memberAvatarUrls: [undefined],
    progress: 0,
    isDone: false,
    lastActivity: '방금 전',
  }
}

/** 교환독서방 화면용 (아직 나 혼자, 이야기 없음) */
export function toRoomDetail(room: CreatedRoom, myId: number): RoomDetail {
  return {
    id: room.id,
    name: room.name,
    bookTitle: room.bookTitle,
    author: room.author,
    totalPages: room.totalPages,
    coverUrl: room.coverUrl,
    myId,
    hostId: myId,
    inviteCode: room.inviteCode,
    password: room.password,
    dailyGoal: room.dailyGoal,
    members: [{ id: myId, nickname: '나', readPage: 0 }],
    pageRanges: toPageRanges(room.totalPages),
    stories: [],
  }
}

/** 초대코드 참가 화면용 */
export function toJoinableRoom(room: CreatedRoom): JoinableRoom {
  return {
    roomId: room.id,
    code: normalizeInviteCode(room.inviteCode),
    password: room.password,
    name: room.name,
    bookTitle: room.bookTitle,
    author: room.author,
    totalPages: room.totalPages,
    coverUrl: room.coverUrl,
    memberCount: 1,
    maxMembers: MAX_ROOM_MEMBERS,
  }
}

/** 입력한 초대코드 비교용: 하이픈·공백 빼고 대문자 */
export function normalizeInviteCode(code: string) {
  return code.replace(/[^0-9a-z]/gi, '').toUpperCase()
}
