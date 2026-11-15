import { useNavigate } from 'react-router-dom'
import ExchangeCard from '@/components/home/ExchangeCard'
import ExchangeCarousel from '@/components/home/ExchangeCarousel'
import SectionHeader from '@/components/home/SectionHeader'
import type { ExchangeRoom } from '@/types/home'

type ExchangeSectionProps = {
  rooms: ExchangeRoom[]
  className?: string
}

/** 진행 중인 교환독서 (모바일: 가로 스크롤 / 웹: 한 장씩 넘기는 카드 + 점) */
function ExchangeSection({ rooms, className = '' }: ExchangeSectionProps) {
  const navigate = useNavigate()
  const goRooms = () => navigate('/rooms')

  return (
    <section className={`flex min-w-0 flex-col gap-3 lg:gap-4 ${className}`}>
      <SectionHeader title="진행 중인 교환독서" count={rooms.length} onMore={goRooms} />

      {rooms.length === 0 ? (
        <div className="flex h-32 flex-col gap-3.5 rounded-2xl bg-surface-green p-4 lg:h-[194px] lg:justify-between lg:gap-0 lg:p-6">
          <div className="flex flex-col lg:gap-1">
            <h3 className="text-m-label-l text-text-default lg:text-w-label-l">
              책짹이를 초대해요
            </h3>
            <p className="text-m-body-m text-text-secondary lg:text-w-body-m">
              친구와 생각을 공유해보세요
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/rooms/new')}
            className="flex h-9 items-center justify-center rounded-2xl bg-action-green text-m-label-s text-text-contrast lg:h-12 lg:text-w-label-s"
          >
            교환독서 시작하기
          </button>
        </div>
      ) : (
        <>
          {/* 모바일: 가로 스크롤, 화면 끝까지 보이도록 좌우 여백만큼 확장 */}
          <ul className="-mx-6 flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            {rooms.map((room) => (
              <li key={room.id} className={rooms.length === 1 ? 'w-full' : 'w-[330px] shrink-0'}>
                <ExchangeCard room={room} className="w-full" />
              </li>
            ))}
          </ul>

          {/* 웹: 한 장씩 넘기기 (자동 5초 / 끌기 / 트랙패드 / 점) */}
          <div className="hidden lg:block">
            <ExchangeCarousel rooms={rooms} />
          </div>
        </>
      )}
    </section>
  )
}

export default ExchangeSection
