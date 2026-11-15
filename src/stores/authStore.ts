import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthState = {
  isSignedUp: boolean
  completeSignup: () => void
}

// TODO: 백엔드 로그인/회원가입 연동되면 실제 인증 상태(토큰 등)로 교체
// 가입을 마친 사용자가 뒤로가기로 온보딩·회원가입 화면에 돌아가지 않게 막는 용도
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isSignedUp: false,
      completeSignup: () => set({ isSignedUp: true }),
    }),
    { name: 'buddle-auth', storage: createJSONStorage(() => sessionStorage) },
  ),
)
