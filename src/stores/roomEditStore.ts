import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { RoomDetail, RoomSummary, ShelfBook } from '@/types/room'
import { toPageRanges } from '@/utils/room'

/** 설정에서 바꾼 방 정보 */
export type RoomInfoEdit = {
  name?: string
  totalPages?: number
  dailyGoal?: number
  book?: Pick<ShelfBook, 'title' | 'author' | 'coverUrl'>
}

type RoomEditState = {
  /** 방 id → 바꾼 정보 */
  edits: Record<number, RoomInfoEdit>
  /** 방 id → 내보낸 멤버 id */
  removedMembers: Record<number, number[]>
  /** 삭제했거나 나간 방 */
  closedRoomIds: number[]
  editRoom: (roomId: number, edit: RoomInfoEdit) => void
  removeMember: (roomId: number, memberId: number) => void
  closeRoom: (roomId: number) => void
}

// TODO: 방 수정·삭제·나가기·내보내기 API 연동되면 서버 데이터로 교체
export const useRoomEditStore = create<RoomEditState>()(
  persist(
    (set) => ({
      edits: {},
      removedMembers: {},
      closedRoomIds: [],
      editRoom: (roomId, edit) =>
        set((state) => ({
          edits: { ...state.edits, [roomId]: { ...state.edits[roomId], ...edit } },
        })),
      removeMember: (roomId, memberId) =>
        set((state) => ({
          removedMembers: {
            ...state.removedMembers,
            [roomId]: [...(state.removedMembers[roomId] ?? []), memberId],
          },
        })),
      closeRoom: (roomId) => set((state) => ({ closedRoomIds: [...state.closedRoomIds, roomId] })),
    }),
    { name: 'buddle-room-edits', storage: createJSONStorage(() => sessionStorage) },
  ),
)

/** 방 상세에 수정 내용 반영 (내보낸 멤버와 그 멤버가 쓴 이야기는 빼기) */
export function applyRoomEdit(
  room: RoomDetail,
  edit: RoomInfoEdit | undefined,
  removedIds: number[] | undefined,
): RoomDetail {
  const removed = new Set(removedIds)
  return {
    ...room,
    name: edit?.name ?? room.name,
    totalPages: edit?.totalPages ?? room.totalPages,
    dailyGoal: edit?.dailyGoal ?? room.dailyGoal,
    // 총 쪽수를 바꾸면 쪽 구간도 새로 나누기
    pageRanges: edit?.totalPages ? toPageRanges(edit.totalPages) : room.pageRanges,
    bookTitle: edit?.book?.title ?? room.bookTitle,
    author: edit?.book?.author ?? room.author,
    coverUrl: edit?.book ? edit.book.coverUrl : room.coverUrl,
    members: room.members.filter((member) => !removed.has(member.id)),
    stories: room.stories.filter((story) => !removed.has(story.authorId)),
  }
}

/** 목록 카드에 수정 내용 반영 */
export function applySummaryEdit(room: RoomSummary, edit: RoomInfoEdit | undefined): RoomSummary {
  if (!edit) return room
  return {
    ...room,
    name: edit.name ?? room.name,
    totalPages: edit.totalPages ?? room.totalPages,
    bookTitle: edit.book?.title ?? room.bookTitle,
    author: edit.book?.author ?? room.author,
    coverUrl: edit.book ? edit.book.coverUrl : room.coverUrl,
  }
}
