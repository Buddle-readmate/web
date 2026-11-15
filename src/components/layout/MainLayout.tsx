import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/layout/BottomNav'

/**
 * 하단 탭바가 있는 메인 화면들 (홈·책장·교환독서·캘린더·마이)
 * 아래 여백: 떠 있는 탭바(아래 52px + 높이 72px, 웹 96px)에 내용이 가리지 않도록
 */
function MainLayout() {
  return (
    <>
      <div className="min-h-dvh bg-surface-page pb-[124px] lg:pb-[148px]">
        <Outlet />
      </div>
      <BottomNav />
    </>
  )
}

export default MainLayout
