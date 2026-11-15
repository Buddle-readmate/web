import { useNavigate } from 'react-router-dom'
import icBellDot from '@/assets/icons/ic-bell-dot.svg'
import icBell from '@/assets/icons/ic-bell.svg'
import icSearch from '@/assets/icons/ic-search.svg'
import logoBuddle from '@/assets/icons/logo-buddle.svg'

type HomeHeaderProps = {
  hasUnreadNotification: boolean
  onOpenNotifications: () => void
  profileImageUrl?: string
}

function HomeHeader({
  hasUnreadNotification,
  onOpenNotifications,
  profileImageUrl,
}: HomeHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex h-14 items-center justify-between px-6 lg:px-10 desktop:px-[100px]">
      <h1>
        <img src={logoBuddle} alt="Buddle" className="h-5 w-[95px] lg:h-6 lg:w-[114px]" />
      </h1>
      <div className="flex items-center gap-4 lg:gap-5">
        <button type="button" aria-label="책 검색" onClick={() => navigate('/search')}>
          <img src={icSearch} alt="" className="size-6 lg:size-7" />
        </button>
        <button
          type="button"
          aria-label={hasUnreadNotification ? '알림 (새 알림 있음)' : '알림'}
          onClick={onOpenNotifications}
        >
          <img
            src={hasUnreadNotification ? icBellDot : icBell}
            alt=""
            className="size-6 lg:size-7"
          />
        </button>
        <button type="button" aria-label="내 프로필" onClick={() => navigate('/my')}>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="" className="size-6 rounded-full lg:size-7" />
          ) : (
            <span className="block size-6 rounded-full bg-gray-200 lg:size-7" />
          )}
        </button>
      </div>
    </header>
  )
}

export default HomeHeader
