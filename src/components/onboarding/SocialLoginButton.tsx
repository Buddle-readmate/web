import icGoogle from '@/assets/icons/ic-google.svg'
import icKakao from '@/assets/icons/ic-kakao.svg'

const PROVIDERS = {
  kakao: {
    label: '카카오로 시작하기',
    icon: icKakao,
    className: 'bg-kakao',
  },
  google: {
    label: '구글으로 시작하기',
    icon: icGoogle,
    className: 'border border-border-strong bg-surface-white',
  },
}

type SocialLoginButtonProps = {
  provider: keyof typeof PROVIDERS
  onClick?: () => void
}

function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const { label, icon, className } = PROVIDERS[provider]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 w-full items-center justify-center gap-1 rounded-2xl pr-2 text-m-label-l text-text-default lg:text-w-label-l ${className}`}
    >
      <img src={icon} alt="" className="size-8" />
      {label}
    </button>
  )
}

export default SocialLoginButton
