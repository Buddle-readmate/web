import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Story } from '@/types/room'

type RoomStoryState = {
  /** 방 id → 사용자가 새로 등록한 이야기 (더미 데이터와 별도로 보관) */
  addedStories: Record<number, Story[]>
  addStory: (roomId: number, story: Story) => void
}

// TODO: 이야기 등록 API 연동되면 서버 데이터로 교체
// 등록한 이야기가 이야기 상세에 다녀와도 남아 있도록 공용 상태로 보관
export const useRoomStoryStore = create<RoomStoryState>()(
  persist(
    (set) => ({
      addedStories: {},
      addStory: (roomId, story) =>
        set((state) => ({
          addedStories: {
            ...state.addedStories,
            [roomId]: [...(state.addedStories[roomId] ?? []), story],
          },
        })),
    }),
    { name: 'buddle-room-stories', storage: createJSONStorage(() => sessionStorage) },
  ),
)
