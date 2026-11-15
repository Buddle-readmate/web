import { Link } from 'react-router-dom'
import SocialLoginButton from '@/components/onboarding/SocialLoginButton'

function OnboardingLogin() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-16 lg:flex-none lg:items-stretch lg:gap-16 lg:p-0">
      {/* 모바일 로고·일러스트 자리 (PC는 왼쪽 큰 박스) */}
      <div className="h-12 w-[140px] shrink-0 rounded-2xl bg-surface-white lg:hidden" />
      <div className="h-60 w-full shrink-0 rounded-2xl bg-surface-white lg:hidden" />

      <h1 className="hidden text-w-head-l text-text-default lg:block">
        <span className="block">카카오·구글로</span>
        <span className="block">3초 만에 시작해요</span>
      </h1>

      <div className="flex w-full flex-col items-center gap-2">
        <p className="flex gap-0.5 text-caption whitespace-nowrap text-icon-secondary">
          <Link to="/terms" className="underline">
            이용약관
          </Link>
          <span>및</span>
          <Link to="/privacy" className="underline">
            개인정보 처리방침
          </Link>
          <span>에 동의하고 계속</span>
        </p>
        <div className="flex w-full flex-col gap-2 lg:gap-3">
          {/* TODO: 백엔드 OAuth 준비되면 로그인 연결 */}
          <SocialLoginButton provider="kakao" />
          <SocialLoginButton provider="google" />
        </div>
      </div>
    </main>
  )
}

export default OnboardingLogin
