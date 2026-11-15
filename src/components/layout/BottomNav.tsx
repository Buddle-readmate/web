import { NavLink } from 'react-router-dom'
import icNavCalendar from '@/assets/icons/ic-nav-calendar.svg'
import icNavHome from '@/assets/icons/ic-nav-home.svg'
import icNavMy from '@/assets/icons/ic-nav-my.svg'
import icNavRooms from '@/assets/icons/ic-nav-rooms.svg'
import icNavShelf from '@/assets/icons/ic-nav-shelf.svg'
import MaskIcon from '@/components/shared/MaskIcon'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: icNavHome },
  { to: '/shelf', label: '책장', icon: icNavShelf },
  { to: '/rooms', label: '교환독서', icon: icNavRooms },
  { to: '/calendar', label: '캘린더', icon: icNavCalendar },
  { to: '/my', label: '마이', icon: icNavMy },
]

/** 화면 아래 떠 있는 탭바 (모바일 342px / 웹 내용 너비) */
function BottomNav() {
  return (
    <nav className="fixed bottom-[52px] left-1/2 z-40 flex w-[342px] max-w-[calc(100%-48px)] -translate-x-1/2 items-center justify-center rounded-full bg-surface-white p-2 shadow-nav-m lg:w-auto lg:max-w-none lg:px-4 lg:py-3 lg:shadow-nav-w">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-full pt-2 pb-1 lg:h-[72px] lg:w-[100px] lg:gap-1 ${isActive ? 'bg-green-200' : 'bg-surface-white'}`
          }
        >
          {({ isActive }) => (
            <>
              <MaskIcon
                src={icon}
                className={`size-6 lg:size-8 ${isActive ? 'bg-action-green' : 'bg-icon-weak'}`}
              />
              <span
                className={`text-m-caption lg:text-w-body-m lg:font-medium ${isActive ? 'text-text-green' : 'text-text-weak'}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
