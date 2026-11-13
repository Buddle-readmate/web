import IndicatorDot from '@/components/onboarding/IndicatorDot'
import Button from '@/components/shared/Button'

type OnboardingIntroProps = {
  title: string[]
  description: string[]
  total: number
  current: number
  onNext: () => void
}

function OnboardingIntro({ title, description, total, current, onNext }: OnboardingIntroProps) {
  return (
    <div className="flex flex-1 flex-col lg:flex-none lg:gap-16">
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 lg:flex-none lg:px-0">
        {/* 모바일 일러스트 자리 (PC는 왼쪽 큰 박스) */}
        <div className="h-[300px] w-full shrink-0 rounded-2xl bg-surface-white lg:hidden" />

        <div className="flex w-full flex-col gap-3 text-center lg:gap-4 lg:text-left">
          <h1 className="text-m-head-l text-text-default lg:text-w-head-l">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-m-body-l text-text-secondary lg:text-w-body-l">
            {description.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </main>

      <footer className="flex shrink-0 flex-col items-center gap-4 px-6 pt-4 pb-13 lg:p-0">
        <IndicatorDot total={total} current={current} />
        <Button onClick={onNext}>다음</Button>
      </footer>
    </div>
  )
}

export default OnboardingIntro
