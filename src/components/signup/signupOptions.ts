export const TERMS = [
  { id: 'age', label: '(필수) 만 14세 이상입니다.' },
  { id: 'service', label: '(필수) 서비스 이용 약관에 동의합니다.', detailPath: '/terms' },
  { id: 'privacy', label: '(필수) 개인정보 수집 및 이용에 동의합니다.', detailPath: '/privacy' },
] as const

export type TermId = (typeof TERMS)[number]['id']

export const NICKNAME_MIN = 2
export const NICKNAME_MAX = 10

// TODO: 책짹이 캐릭터 이미지 나오면 각 항목에 이미지 연결
export const PROFILE_OPTIONS = [1, 2, 3, 4, 5, 6] as const

export type ProfileId = (typeof PROFILE_OPTIONS)[number]
