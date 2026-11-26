import { useSearchParams } from 'react-router-dom'
import icLockOpen from '@/assets/icons/ic-lock-open.svg'
import icPlus from '@/assets/icons/ic-plus.svg'
import RoomCard from '@/components/room/RoomCard'
import RoomCreateFlow from '@/components/room/RoomCreateFlow'
import RoomCreateMenu from '@/components/room/RoomCreateMenu'
import RoomEmptyState from '@/components/room/RoomEmptyState'
import RoomFilterChips from '@/components/room/RoomFilterChips'
import RoomJoinFlow from '@/components/room/RoomJoinFlow'
import GroupIcon from '@/components/shared/GroupIcon'
import MaskIcon from '@/components/shared/MaskIcon'
import { useOverlayParam } from '@/hooks/useOverlayParam'
import { JOINABLE_ROOMS_MOCK, MY_SHELF_BOOKS_MOCK, ROOMS_MOCK } from '@/mocks/rooms'
import { toJoinableRoom, toRoomSummary, useCreatedRoomStore } from '@/stores/createdRoomStore'
import type { RoomFilter } from '@/types/room'

const EMPTY_TEXT: Record<RoomFilter, { title: string; description: string }> = {
  all: { title: '참여한 교환독서', description: '내가 속했던 교환독서방이 모두 표시돼요' },
  reading: { title: '참여 중인 교환독서', description: '내가 속한 교환독서방이 표시돼요' },
  done: { title: '완독한 교환독서', description: '다 읽은 교환독서방이 표시돼요' },
}

const isRoomFilter = (value: string | null): value is RoomFilter =>
  value === 'all' || value === 'reading' || value === 'done'

const headerButtonClassName =
  'flex h-14 w-[224px] items-center justify-center gap-1 rounded-2xl text-w-label-l'

function RoomListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  // TODO: 교환독서 목록 API 연동 전까지 더미 데이터 (개발 중 /rooms?mock=empty 로 빈 상태·빈 책장 확인)
  const isEmptyMock = import.meta.env.DEV && searchParams.get('mock') === 'empty'
  // 이번 접속에서 만든 방은 맨 앞에
  const createdRooms = useCreatedRoomStore((state) => state.rooms)
  const rooms = [...createdRooms.map(toRoomSummary), ...(isEmptyMock ? [] : ROOMS_MOCK)]
  // 방 만들기·코드로 참가하기는 ?modal= 로 목록 위에 띄움 (뒤로가기로 닫힘)
  const modal = useOverlayParam('modal')
  // 필터는 주소(?filter=)에 남겨서 새로고침·뒤로가기에도 유지 (시안 기본: 참여중)
  const filterParam = searchParams.get('filter')
  const filter: RoomFilter = isRoomFilter(filterParam) ? filterParam : 'reading'

  const counts = {
    reading: rooms.filter((room) => !room.isDone).length,
    done: rooms.filter((room) => room.isDone).length,
  }
  const visibleRooms = rooms.filter((room) => {
    if (filter === 'reading') return !room.isDone
    if (filter === 'done') return room.isDone
    return true
  })

  const changeFilter = (next: RoomFilter) => {
    const params = new URLSearchParams(searchParams)
    params.set('filter', next)
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      {/* 모바일: 제목 + 추가 메뉴 / 웹: 제목 + 참가하기·방 만들기 */}
      <header className="flex h-14 items-center justify-between px-6 lg:h-auto lg:items-start lg:px-10 lg:pt-[52px] desktop:px-[100px]">
        <h1 className="text-m-head-l text-text-default lg:text-w-head-l">교환독서</h1>
        <div className="lg:hidden">
          <RoomCreateMenu onCreate={() => modal.open('create')} onJoin={() => modal.open('join')} />
        </div>
        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={() => modal.open('join')}
            className={`${headerButtonClassName} border border-border-strong bg-action-white text-text-secondary`}
          >
            <GroupIcon
              src={icLockOpen}
              className="size-5"
              insetClassName="inset-[8.33%_12.5%]"
              bleedClassName="inset-[-5%_-5.56%]"
            />
            참가하기
          </button>
          <button
            type="button"
            onClick={() => modal.open('create')}
            className={`${headerButtonClassName} bg-action-green text-text-contrast`}
          >
            <MaskIcon src={icPlus} className="size-5 bg-surface-white" />방 만들기
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-3 px-6 pt-3 lg:gap-6 lg:px-10 lg:py-3 desktop:px-[100px]">
        <RoomFilterChips value={filter} counts={counts} onChange={changeFilter} />

        {visibleRooms.length === 0 ? (
          <RoomEmptyState
            {...EMPTY_TEXT[filter]}
            className="py-[136px]"
            action={
              <button
                type="button"
                onClick={() => modal.open('create')}
                className="flex h-12 items-center justify-center rounded-2xl bg-action-green px-7 text-m-label-m text-text-contrast lg:hidden"
              >
                교환독서 시작하기
              </button>
            }
          />
        ) : (
          <ul className="grid gap-2 lg:grid-cols-2 lg:gap-5">
            {visibleRooms.map((room) => (
              <li key={room.id}>
                <RoomCard room={room} />
              </li>
            ))}
          </ul>
        )}
      </main>

      {modal.value === 'create' && (
        <RoomCreateFlow shelfBooks={isEmptyMock ? [] : MY_SHELF_BOOKS_MOCK} onClose={modal.close} />
      )}
      {modal.value === 'join' && (
        <RoomJoinFlow
          rooms={[...createdRooms.map(toJoinableRoom), ...JOINABLE_ROOMS_MOCK]}
          onClose={modal.close}
        />
      )}
    </div>
  )
}

export default RoomListPage
