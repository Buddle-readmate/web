import { useSearchParams } from 'react-router-dom'
import ExchangeSection from '@/components/home/ExchangeSection'
import HomeHeader from '@/components/home/HomeHeader'
import NotificationCard from '@/components/home/NotificationCard'
import NotificationModal from '@/components/home/NotificationModal'
import ReadingStreakCard from '@/components/home/ReadingStreakCard'
import RecentBooks from '@/components/home/RecentBooks'
import { useOverlayParam } from '@/hooks/useOverlayParam'
import { HOME_MOCK, HOME_MOCK_EMPTY } from '@/mocks/home'

function HomePage() {
  const [searchParams] = useSearchParams()
  // TODO: 홈 API 연동 전까지 더미 데이터 (개발 중 /?mock=empty 로 빈 상태 확인)
  const data =
    import.meta.env.DEV && searchParams.get('mock') === 'empty' ? HOME_MOCK_EMPTY : HOME_MOCK
  // 알림 상세는 ?panel=notifications 로 홈 위에 모달로 띄움 (뒤로가기로 닫힘)
  const panel = useOverlayParam('panel')
  const openNotifications = () => panel.open('notifications')

  return (
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto max-w-[1440px]">
        <HomeHeader
          hasUnreadNotification={data.hasUnreadNotification}
          onOpenNotifications={openNotifications}
        />

        {/* 아래 여백: 떠 있는 탭바(높이 + 아래 52px)에 내용이 가리지 않도록 */}
        <main className="flex flex-col gap-4 px-6 pt-6 pb-[148px] lg:gap-8 lg:px-10 lg:pt-9 lg:pb-[184px] desktop:px-[100px]">
          <div className="flex flex-col gap-1">
            <h2 className="text-m-head-l text-text-default lg:text-w-head-l">
              {data.nickname}님, 반가워요!
            </h2>
            <p className="text-m-body-l text-text-secondary lg:text-w-body-l lg:font-medium">
              이번달의 독서 잔디를 확인해보세요
            </p>
          </div>

          {/* 모바일: 잔디 → 교환독서 → 최근 읽은 책 / 웹: 2단 (잔디·알림, 최근 읽은 책·교환독서) */}
          <div className="flex flex-col gap-7 lg:grid lg:grid-cols-[minmax(0,720fr)_minmax(0,484fr)] lg:gap-x-9 lg:gap-y-8">
            <ReadingStreakCard
              nickname={data.nickname}
              streak={data.streak}
              className="lg:col-start-1 lg:row-start-1"
            />
            <NotificationCard
              notifications={data.notifications}
              onShowAll={openNotifications}
              className="hidden lg:col-start-2 lg:row-start-1 lg:flex"
            />
            <ExchangeSection rooms={data.exchanges} className="lg:col-start-2 lg:row-start-2" />
            <RecentBooks books={data.recentBooks} className="lg:col-start-1 lg:row-start-2" />
          </div>
        </main>
      </div>

      {panel.value === 'notifications' && (
        <NotificationModal notifications={data.notifications} onClose={panel.close} />
      )}
    </div>
  )
}

export default HomePage
