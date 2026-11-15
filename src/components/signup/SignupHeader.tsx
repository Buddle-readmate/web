import icBack from '@/assets/icons/ic-back.svg'

type SignupHeaderProps = {
  onBack: () => void
}

function SignupHeader({ onBack }: SignupHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center px-6">
      <button type="button" aria-label="이전" onClick={onBack}>
        <img src={icBack} alt="" className="size-6" />
      </button>
    </header>
  )
}

export default SignupHeader
