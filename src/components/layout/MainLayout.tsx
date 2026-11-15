import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/layout/BottomNav'

/** 하단 탭바가 있는 메인 화면들 (홈·책장·교환독서·캘린더·마이) */
function MainLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}

export default MainLayout
