import almond from '@/assets/mocks/covers/almond.jpg'
import contradiction from '@/assets/mocks/covers/contradiction.jpg'
import dallergut from '@/assets/mocks/covers/dallergut.jpg'
import demian from '@/assets/mocks/covers/demian.jpg'
import humanActs from '@/assets/mocks/covers/human-acts.jpg'
import type { HomeData } from '@/types/home'

// TODO: 홈 API 나오면 교체 (피그마 "홈_교환독서 2개 이상" 기준 더미 데이터)
export const HOME_MOCK: HomeData = {
  nickname: '김버들',
  hasUnreadNotification: true,
  streak: {
    year: 2026,
    month: 12,
    levels: {
      3: 1,
      4: 3,
      5: 4,
      6: 4,
      7: 1,
      8: 2,
      11: 1,
      12: 2,
      13: 2,
      14: 4,
      15: 1,
      16: 2,
      19: 1,
      20: 1,
      22: 1,
      24: 1,
    },
    days: 15,
    pages: 1628,
    thoughts: 45,
  },
  notifications: Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    message: '민지님이 데미안 66–88p에 생각을 남겼어요',
    preview:
      '“나는 오히려 그 선택이 가장 용감한 순간이라고 생각했어. 익숙한 세계를 깨고 나오는 느낌이었거든."',
    timeAgo: '5분 전',
  })),
  exchanges: [
    {
      id: 1,
      name: '혼모노들의 교환독서',
      bookTitle: '혼모노',
      author: '성해나',
      memberAvatarUrls: Array(5).fill(undefined),
      progress: 64,
    },
    {
      id: 2,
      name: '수요일 데미안 클럽',
      bookTitle: '데미안',
      author: '헤르만 헤세',
      memberAvatarUrls: Array(5).fill(undefined),
      progress: 64,
    },
    {
      id: 3,
      name: '한강 읽기 모임',
      bookTitle: '소년이 온다',
      author: '한강',
      memberAvatarUrls: Array(3).fill(undefined),
      progress: 30,
    },
  ],
  recentBooks: [
    { id: 1, title: '데미안', coverUrl: demian },
    { id: 2, title: '소년이 온다', coverUrl: humanActs },
    { id: 3, title: '달러구트 꿈백화점', coverUrl: dallergut },
    { id: 4, title: '아몬드', coverUrl: almond },
    { id: 5, title: '프로젝트 헤일메리' },
    { id: 6, title: '모순', coverUrl: contradiction },
    { id: 7, title: '어린왕자' },
  ],
}

// 피그마 "홈_교환독서X" (빈 상태) 확인용
export const HOME_MOCK_EMPTY: HomeData = {
  ...HOME_MOCK,
  hasUnreadNotification: false,
  streak: { ...HOME_MOCK.streak, levels: {}, days: 0, pages: 0, thoughts: 0 },
  notifications: [],
  exchanges: [],
  recentBooks: [],
}
