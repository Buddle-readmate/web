import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Thought } from '@/types/room'

/** "방id:이야기id" */
export const storyKey = (roomId: number, storyId: number) => `${roomId}:${storyId}`

type ThoughtState = {
  /** 이야기별로 이번 접속에서 새로 남긴 생각 */
  addedThoughts: Record<string, Thought[]>
  /** "방id:이야기id:생각id" → 내가 좋아요를 눌렀는지 (더미 데이터 위에 덮어씀) */
  myLikes: Record<string, boolean>
  addThought: (key: string, thought: Thought) => void
  setLike: (key: string, thoughtId: number, liked: boolean) => void
}

// TODO: 생각 남기기·좋아요 API 연동되면 서버 데이터로 교체
export const useThoughtStore = create<ThoughtState>()(
  persist(
    (set) => ({
      addedThoughts: {},
      myLikes: {},
      addThought: (key, thought) =>
        set((state) => ({
          addedThoughts: {
            ...state.addedThoughts,
            [key]: [...(state.addedThoughts[key] ?? []), thought],
          },
        })),
      setLike: (key, thoughtId, liked) =>
        set((state) => ({ myLikes: { ...state.myLikes, [`${key}:${thoughtId}`]: liked } })),
    }),
    { name: 'buddle-thoughts', storage: createJSONStorage(() => sessionStorage) },
  ),
)

/** 더미 생각 + 새로 남긴 생각에 내 좋아요 반영 */
export function mergeThoughts(
  base: Thought[],
  added: Thought[] | undefined,
  myLikes: Record<string, boolean>,
  key: string,
  myId: number,
): Thought[] {
  return [...base, ...(added ?? [])].map((thought) => {
    const liked = myLikes[`${key}:${thought.id}`]
    if (liked === undefined) return thought
    const others = thought.likedBy.filter((id) => id !== myId)
    return { ...thought, likedBy: liked ? [...others, myId] : others }
  })
}
