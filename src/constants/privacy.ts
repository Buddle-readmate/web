import type { PolicyDocument } from '@/types/policy'

// 개인정보 처리방침
// TODO: 개인정보 처리방침 확정되면 추가 (#9)
//  - 노션 "약관 상세 문안 초안 C" 기준으로 sections 채우기
//  - 개인정보 보호책임자 (버들 개발팀 ReadMate / readmate00@gmail.com)
//  - 시행일
export const PRIVACY_POLICY: PolicyDocument = {
  title: '개인정보 처리방침',
  sections: [
    {
      heading: '안내',
      paragraph: '개인정보 처리방침은 확정 후 게시됩니다.',
    },
  ],
}
