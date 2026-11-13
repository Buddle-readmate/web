import icBack from '@/assets/icons/ic-back.svg'

type OnboardingHeaderProps = {
  onBack?: () => void
  onSkip?: () => void
}

function OnboardingHeader({ onBack, onSkip }: OnboardingHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-6 lg:h-6 lg:px-0">
      {onBack ? (
        <button type="button" aria-label="이전" onClick={onBack}>
          <img src={icBack} alt="" className="size-6" />
        </button>
      ) : (
        <span className="size-6" aria-hidden />
      )}
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="text-m-label-s text-text-weak lg:text-w-label-s"
        >
          건너뛰기
        </button>
      )}
    </header>
  )
}

export default OnboardingHeader
