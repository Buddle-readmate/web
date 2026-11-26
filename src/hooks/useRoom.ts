import { getRoomDetailMock, MY_ID } from '@/mocks/rooms'
import { toRoomDetail, useCreatedRoomStore } from '@/stores/createdRoomStore'
import { applyRoomEdit, useRoomEditStore } from '@/stores/roomEditStore'
import { useRoomStoryStore } from '@/stores/roomStoryStore'
import { storyKey, useThoughtStore } from '@/stores/thoughtStore'
import type { RoomDetail, Story } from '@/types/room'

/**
 * 교환독서방 찾기 (더미 데이터 + 이번 접속에서 만든 방 + 설정에서 바꾼 정보)
 * - isClosed: 삭제했거나 나간 방
 */
// TODO: 교환독서방 API 연동되면 서버 데이터로 교체
export function useRoom(roomId: number) {
  const createdRoom = useCreatedRoomStore((state) => state.rooms.find((item) => item.id === roomId))
  const edit = useRoomEditStore((state) => state.edits[roomId])
  const removedIds = useRoomEditStore((state) => state.removedMembers[roomId])
  const isClosed = useRoomEditStore((state) => state.closedRoomIds.includes(roomId))

  const baseRoom = createdRoom ? toRoomDetail(createdRoom, MY_ID) : getRoomDetailMock(roomId)
  const room = baseRoom && !isClosed ? applyRoomEdit(baseRoom, edit, removedIds) : undefined
  return { room, isClosed: Boolean(baseRoom) && isClosed }
}

/**
 * 방의 이야기 목록 (더미 + 새로 등록한 이야기)
 * 이야기 상세에서 내 생각을 남겼으면 "내 생각 남김"(myRepliedAt)으로 표시
 */
export function useRoomStories(room: RoomDetail): Story[] {
  const addedStories = useRoomStoryStore((state) => state.addedStories[room.id])
  const addedThoughts = useThoughtStore((state) => state.addedThoughts)

  return [...room.stories, ...(addedStories ?? [])].map((story) => {
    if (story.myRepliedAt) return story
    const myThought = addedThoughts[storyKey(room.id, story.id)]?.find(
      (thought) => thought.authorId === room.myId && thought.parentId === undefined,
    )
    return myThought ? { ...story, myRepliedAt: `20${myThought.createdAt}` } : story
  })
}
