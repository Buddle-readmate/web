import { useState } from 'react'
import OnboardingHeader from '@/components/onboarding/OnboardingHeader'
import OnboardingIntro from '@/components/onboarding/OnboardingIntro'
import OnboardingLogin from '@/components/onboarding/OnboardingLogin'

const SLIDES = [
  {
    title: ['같은 책, 다른 생각을', '친구와 나눠요'],
    description: ['같은 페이지를 읽고', '서로의 생각을 주고받아요'],
  },
  {
    title: ['다 읽은 책이', '내 책장에 쌓여가요'],
    description: ['페이지 수만큼 두꺼워지는 책등,', '한 권씩 채워지는 나만의 책장'],
  },
  {
    title: ['매일 조금씩', '독서 잔디를 채워요'],
    description: ['읽은 날마다 한 칸씩 채워지고', '많이 읽은 날은 더 진해져요'],
  },
]

const LOGIN_STEP = SLIDES.length

function OnboardingPage() {
  const [step, setStep] = useState(0)
  const isLoginStep = step === LOGIN_STEP

  const goBack = () => setStep((prev) => prev - 1)
  const goNext = () => setStep((prev) => prev + 1)
  const goLogin = () => setStep(LOGIN_STEP)

  return (
    <div className="flex min-h-dvh flex-col bg-surface-page lg:flex-row lg:gap-16 lg:p-16">
      {/* PC 일러스트 자리 */}
      <div className="hidden rounded-2xl bg-surface-white lg:block lg:flex-1" />

      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col lg:mx-0 lg:w-[472px] lg:max-w-none lg:flex-none lg:justify-between">
        <OnboardingHeader
          onBack={step > 0 ? goBack : undefined}
          onSkip={isLoginStep ? undefined : goLogin}
        />

        {isLoginStep ? (
          <OnboardingLogin />
        ) : (
          <OnboardingIntro
            title={SLIDES[step].title}
            description={SLIDES[step].description}
            total={SLIDES.length}
            current={step}
            onNext={goNext}
          />
        )}
      </div>
    </div>
  )
}

export default OnboardingPage
