import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import PolicyView from '@/components/policy/PolicyView'
import Button from '@/components/shared/Button'
import NicknameInput from '@/components/signup/NicknameInput'
import ProfileSelector from '@/components/signup/ProfileSelector'
import SignupHeader from '@/components/signup/SignupHeader'
import { NICKNAME_MIN, TERMS, type ProfileId, type TermId } from '@/components/signup/signupOptions'
import StepIndicator from '@/components/signup/StepIndicator'
import StepTitle from '@/components/signup/StepTitle'
import TermsAgreement from '@/components/signup/TermsAgreement'
import { POLICIES } from '@/constants/policies'
import { usePolicyParam } from '@/hooks/usePolicyParam'
import { useAuthStore } from '@/stores/authStore'

const STEP = { TERMS: 0, NICKNAME: 1, PROFILE: 2, COMPLETE: 3 } as const
const INPUT_STEP_COUNT = 3

// PC 시안의 단계별 영역 높이 (위 콘텐츠와 아래 버튼 사이 간격이 이 높이로 정해짐)
const PC_HEIGHT = ['lg:h-[480px]', 'lg:h-[480px]', 'lg:h-[800px]']

const parseStep = (value: string | null) => {
  const step = Number(value ?? STEP.TERMS)
  return Number.isInteger(step) && step >= STEP.TERMS && step <= STEP.COMPLETE ? step : STEP.TERMS
}

function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // 단계를 주소(?step=)에 남겨서 휴대폰·브라우저 뒤로가기로 이전 단계로 돌아갈 수 있게 함
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseStep(searchParams.get('step'))
  // 약관 상세는 ?doc= 로 같은 화면 위에 띄움 (페이지 이동이 없어서 체크한 약관이 유지됨)
  const { openedPolicy, openPolicy, closePolicy } = usePolicyParam()

  const isSignedUp = useAuthStore((state) => state.isSignedUp)
  const completeSignup = useAuthStore((state) => state.completeSignup)

  const [agreedTerms, setAgreedTerms] = useState<TermId[]>([])
  const [nickname, setNickname] = useState('')
  const [profile, setProfile] = useState<ProfileId | null>(null)

  const trimmedNickname = nickname.trim()
  const isDone = [
    agreedTerms.length === TERMS.length,
    trimmedNickname.length >= NICKNAME_MIN,
    profile !== null,
  ]
  const firstIncompleteStep = isDone.indexOf(false)

  // 가입을 마친 뒤 뒤로가기로 다시 들어온 경우
  if (isSignedUp) return <Navigate to="/" replace />

  // 새로고침 등으로 앞 단계 입력값이 없는 채로 뒤 단계에 들어온 경우
  if (firstIncompleteStep !== -1 && step > firstIncompleteStep) {
    const search = firstIncompleteStep === STEP.TERMS ? '' : `?step=${firstIncompleteStep}`
    return <Navigate to={`/signup${search}`} replace />
  }

  const goBack = () => {
    // 주소를 직접 입력해서 들어와 이전 기록이 없으면 온보딩 로그인 화면으로
    if (location.key === 'default') {
      navigate('/onboarding?step=login', { replace: true })
      return
    }
    navigate(-1)
  }

  // TODO: 백엔드 회원가입 API 나오면 프로필 단계에서 가입 요청 후 완료로 이동
  const goNext = () =>
    // 완료 화면은 프로필 단계 기록을 덮어써서, 뒤로가기로 프로필 선택에 다시 들어가지 않게 함
    setSearchParams({ step: String(step + 1) }, { replace: step === STEP.PROFILE })

  const start = () => {
    completeSignup()
    navigate('/', { replace: true })
  }

  if (step === STEP.COMPLETE) {
    return (
      <div className="flex min-h-dvh flex-col bg-surface-page lg:items-center lg:pt-20">
        <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col lg:h-[574px] lg:w-[520px] lg:max-w-none lg:flex-none lg:justify-between">
          <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 lg:flex-none">
            {/* 완료 일러스트 자리 */}
            <div className="h-[300px] w-full rounded-2xl bg-surface-white" />
            <div className="w-full text-center">
              <StepTitle
                title="가입이 완료되었어요!"
                description={['읽은 책을 기록하고', '나만의 책장을 채워보세요']}
              />
            </div>
          </main>
          <footer className="px-6 pt-4 pb-[52px]">
            <Button onClick={start}>버들 시작하기</Button>
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface-page lg:items-center lg:pt-8">
      <div
        className={`mx-auto flex w-full max-w-[480px] flex-1 flex-col lg:w-[520px] lg:max-w-none lg:flex-none lg:justify-between ${PC_HEIGHT[step]}`}
      >
        <div className="flex flex-1 flex-col lg:flex-none">
          <SignupHeader onBack={goBack} />
          <main className="flex flex-col gap-5 px-6 pt-3">
            {step === STEP.TERMS && (
              <>
                <StepTitle title="약관에 동의해주세요" />
                <TermsAgreement
                  checked={agreedTerms}
                  onChange={setAgreedTerms}
                  onOpenPolicy={openPolicy}
                />
              </>
            )}
            {step === STEP.NICKNAME && (
              <>
                <StepTitle
                  title="닉네임을 정해주세요"
                  description={['교환독서 방에서 친구들에게', '보이는 이름이에요']}
                />
                <NicknameInput value={nickname} onChange={setNickname} />
              </>
            )}
            {step === STEP.PROFILE && (
              <>
                <StepTitle
                  title="프로필 책짹이를 골라주세요"
                  description={['마이페이지에서', '언제든 변경할 수 있어요']}
                />
                <ProfileSelector
                  nickname={trimmedNickname}
                  selected={profile}
                  onSelect={setProfile}
                />
              </>
            )}
          </main>
        </div>

        <footer className="flex flex-col gap-4 px-6 pt-4 pb-[52px]">
          <StepIndicator total={INPUT_STEP_COUNT} current={step} />
          <Button disabled={!isDone[step]} onClick={goNext}>
            다음
          </Button>
        </footer>
      </div>

      {openedPolicy && <PolicyView document={POLICIES[openedPolicy]} onClose={closePolicy} />}
    </div>
  )
}

export default SignupPage
