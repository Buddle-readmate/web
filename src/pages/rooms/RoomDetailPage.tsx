import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import icBack from '@/assets/icons/ic-back.svg'
import icMembers from '@/assets/icons/ic-members.svg'
import icPlus from '@/assets/icons/ic-plus.svg'
import icSetting from '@/assets/icons/ic-setting.svg'
import icChevronRight16 from '@/assets/icons/ic-chevron-right-16.svg'
import ReadingProgress from '@/components/room/ReadingProgress'
import RoomBookInfo from '@/components/room/RoomBookInfo'
import RoomEmptyState from '@/components/room/RoomEmptyState'
import StoryBubble from '@/components/room/StoryBubble'
import StoryCreateSheet from '@/components/room/StoryCreateSheet'
import StoryToolbar from '@/components/room/StoryToolbar'
import GroupIcon from '@/components/shared/GroupIcon'
import MaskIcon from '@/components/shared/MaskIcon'
import { useOverlayParam } from '@/hooks/useOverlayParam'
import { getRoomDetailMock } from '@/mocks/rooms'
import type { PageRange, RoomDetail, RoomMember, Story } from '@/types/room'
import {
  findCurrentRange,
  formatPageRange,
  formatToday,
  getStoriesInRange,
  isInRange,
  sortRanges,
  type SortOrder,
} from '@/utils/room'

function RoomDetailPage() {
  const { roomId } = useParams()
  // TODO: 교환독서방 API 연동 전까지 더미 데이터
  const room = getRoomDetailMock(Number(roomId))

  if (!room) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface-page px-6 text-center">
        <p className="text-m-head-m text-text-secondary lg:text-w-head-m">
          교환독서방을 찾을 수 없어요
        </p>
        <Link
          to="/rooms"
          className="flex h-12 items-center rounded-2xl bg-action-green px-7 text-m-label-m text-text-contrast lg:text-w-label-m"
        >
          교환독서 목록으로
        </Link>
      </main>
    )
  }

  // 방이 바뀌면 상태(펼친 구간 등)를 새로 시작
  return <RoomDetailView key={room.id} room={room} />
}

type RoomDetailViewProps = {
  room: RoomDetail
}

function RoomDetailView({ room }: RoomDetailViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  // 이야기 생성은 ?sheet=story 로 띄움 (뒤로가기로 닫힘)
  const sheet = useOverlayParam('sheet')
  const tab = searchParams.get('tab') === 'members' ? 'members' : 'stories'

  const myPage = room.members.find((member) => member.id === room.myId)?.readPage ?? 0
  const currentRange = findCurrentRange(room.pageRanges, myPage)

  // TODO: 이야기 등록 API 연동 (지금은 화면에만 추가)
  const [stories, setStories] = useState(room.stories)
  const [showUnread, setShowUnread] = useState(true)
  const [sort, setSort] = useState<SortOrder>('desc')
  const [revealedIds, setRevealedIds] = useState<Set<number>>(() => new Set())
  // 웹: 왼쪽에서 고른 구간 / 모바일: 펼친 구간들 (처음엔 지금 읽는 구간)
  // 'all': 맨 위 ALL → 모든 구간의 이야기를 한 번에
  const [selectedStart, setSelectedStart] = useState<number | 'all' | undefined>(
    currentRange?.start,
  )
  const [openStarts, setOpenStarts] = useState<Set<number>>(
    () => new Set(currentRange ? [currentRange.start] : []),
  )
  const [statusMessage, setStatusMessage] = useState('')

  const membersById = new Map(room.members.map((member) => [member.id, member]))
  const isUnread = (story: Story) => story.authorId !== room.myId && story.page > myPage
  const visibleStories = showUnread ? stories : stories.filter((story) => !isUnread(story))
  const ranges = sortRanges(room.pageRanges, sort)
  const selectedRange =
    selectedStart === 'all'
      ? { start: 1, end: room.totalPages }
      : room.pageRanges.find((range) => range.start === selectedStart)
  const hasStories = stories.length > 0

  const goBack = () => {
    // 주소로 바로 들어와 이전 기록이 없으면 목록으로
    if (location.key === 'default') navigate('/rooms')
    else navigate(-1)
  }

  const changeTab = (next: 'stories' | 'members') => {
    const params = new URLSearchParams(searchParams)
    if (next === 'members') params.set('tab', 'members')
    else params.delete('tab')
    setSearchParams(params, { replace: true })
  }

  const toggleRange = (start: number) => {
    setOpenStarts((prev) => {
      const next = new Set(prev)
      if (next.has(start)) next.delete(start)
      else next.add(start)
      return next
    })
  }

  const reveal = (storyId: number) => {
    setRevealedIds((prev) => new Set(prev).add(storyId))
  }

  const addStory = ({ page, content }: { page: number; content: string }) => {
    setStories((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((story) => story.id)) + 1,
        page,
        content,
        authorId: room.myId,
        replierIds: [],
        myRepliedAt: formatToday(),
      },
    ])
    // 방금 쓴 이야기가 보이도록 해당 구간 열기
    const range = room.pageRanges.find((item) => isInRange(page, item))
    if (range) {
      setSelectedStart(range.start)
      setOpenStarts((prev) => new Set(prev).add(range.start))
    }
    setStatusMessage(`P. ${page} 이야기를 등록했어요`)
    sheet.close()
  }

  const renderBubble = (story: Story) => (
    <li key={story.id}>
      <StoryBubble
        roomId={room.id}
        story={story}
        author={membersById.get(story.authorId)}
        repliers={story.replierIds
          .map((id) => membersById.get(id))
          .filter((member): member is RoomMember => member !== undefined)}
        isMine={story.authorId === room.myId}
        isHidden={isUnread(story) && !revealedIds.has(story.id)}
        onReveal={() => reveal(story.id)}
      />
    </li>
  )

  const createButton = (
    <button
      type="button"
      onClick={() => sheet.open('story')}
      className="flex h-12 items-center justify-center rounded-2xl bg-action-green px-7 text-m-label-m text-text-contrast lg:w-[156px] lg:px-0 lg:text-w-label-m"
    >
      이야기 생성하기
    </button>
  )

  const toolbar = (
    <StoryToolbar
      showUnread={showUnread}
      onShowUnreadChange={setShowUnread}
      sort={sort}
      onSortChange={setSort}
    />
  )

  const membersPlaceholder = (
    // TODO: 교환독서방_멤버 화면 구현
    <p className="py-[88px] text-center text-m-body-l text-text-weak lg:text-w-body-l">
      멤버 화면은 준비 중이에요
    </p>
  )

  const settingButton = (
    // TODO: 교환독서방_설정 화면 연결
    <button type="button" aria-label="방 설정" className="flex">
      <GroupIcon
        src={icSetting}
        className="size-6 lg:size-7"
        insetClassName="inset-[8.41%_12.68%]"
        bleedClassName="inset-[-5.01%_-5.58%]"
      />
    </button>
  )

  return (
    <div className="min-h-dvh bg-surface-page lg:flex lg:bg-surface-gray-light">
      <p role="status" className="sr-only">
        {statusMessage}
      </p>

      {/* ───────── 모바일 ───────── */}
      <div className="flex flex-col pb-[160px] lg:hidden">
        <header className="flex h-14 items-center justify-between px-6">
          <button type="button" aria-label="뒤로" onClick={goBack} className="flex">
            <img src={icBack} alt="" width={24} height={24} className="size-6" />
          </button>
          {settingButton}
        </header>

        <div className="flex flex-col gap-2 px-6 py-3">
          <RoomBookInfo room={room} />

          <div className="flex flex-col gap-4">
            <div role="tablist" aria-label="교환독서방 메뉴" className="flex">
              {(
                [
                  ['stories', '이야기'],
                  ['members', '멤버'],
                ] as const
              ).map(([value, label]) => {
                const isSelected = tab === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    id={`room-tab-${value}`}
                    aria-selected={isSelected}
                    aria-controls={`room-panel-${value}`}
                    onClick={() => changeTab(value)}
                    className={`flex h-11 flex-1 items-center justify-center border-b-[3px] text-m-label-m ${isSelected ? 'border-surface-inverse text-text-default' : 'border-border-strong text-text-secondary'}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <div role="tabpanel" id={`room-panel-${tab}`} aria-labelledby={`room-tab-${tab}`}>
              {tab === 'members' ? (
                membersPlaceholder
              ) : !hasStories ? (
                <RoomEmptyState
                  title="페이지별 이야기"
                  description="책 속 장면에 대해 이야기할 수 있어요"
                  action={createButton}
                  className="py-[88px]"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {toolbar}
                  <MobileRangeList
                    ranges={ranges}
                    openStarts={openStarts}
                    onToggle={toggleRange}
                    getStories={(range) => getStoriesInRange(visibleStories, range, sort)}
                    renderBubble={renderBubble}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 아래쪽 흐림 (탭바 대신 + 버튼 아래로 내용이 사라지는 느낌) */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 h-[179px] bg-gradient-to-b from-gray-50/0 to-gray-50/50"
        />
      </div>

      {/* ───────── 웹 ───────── */}
      <aside className="hidden shrink-0 flex-col gap-6 bg-surface-page pt-[52px] pb-10 pl-10 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[360px] lg:overflow-y-auto desktop:w-[482px] desktop:pl-[100px]">
        <header className="flex h-14 items-center justify-between pr-10">
          <button type="button" aria-label="뒤로" onClick={goBack} className="flex">
            <img src={icBack} alt="" width={28} height={28} className="size-7" />
          </button>
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="멤버 보기"
              aria-pressed={tab === 'members'}
              onClick={() => changeTab(tab === 'members' ? 'stories' : 'members')}
              className="flex"
            >
              <GroupIcon
                src={icMembers}
                className="size-7"
                insetClassName="inset-[12.5%_8.33%]"
                bleedClassName="inset-[-5.56%_-5%]"
              />
            </button>
            {settingButton}
          </div>
        </header>

        <div className="pr-10">
          <RoomBookInfo room={room} />
        </div>

        <nav aria-label="쪽 구간">
          <ul className="flex flex-col">
            {[
              { key: 'all' as const, label: 'ALL' },
              ...ranges.map((range) => ({
                key: range.start,
                label: formatPageRange(range, 'web'),
              })),
            ].map(({ key, label }) => {
              const isSelected = key === selectedStart
              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => {
                      setSelectedStart(key)
                      changeTab('stories')
                    }}
                    className={`flex w-full items-center rounded-l-3xl px-6 py-5 text-w-label-l ${isSelected ? 'bg-surface-gray-light text-text-secondary-brown' : 'text-text-weak'}`}
                  >
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <main className="hidden min-w-0 flex-1 flex-col gap-6 px-10 pt-[52px] pb-[180px] lg:flex desktop:pr-[100px] desktop:pl-[72px]">
        <ReadingProgress totalPages={room.totalPages} members={room.members} myId={room.myId} />
        {tab === 'members' ? (
          membersPlaceholder
        ) : (
          <>
            {toolbar}
            <WebStoryList
              hasStories={hasStories}
              range={selectedStart === 'all' ? undefined : selectedRange}
              stories={selectedRange ? getStoriesInRange(visibleStories, selectedRange, sort) : []}
              renderBubble={renderBubble}
              createButton={createButton}
            />
          </>
        )}
      </main>

      {tab === 'stories' && (
        <button
          type="button"
          aria-label="새로운 이야기 생성"
          onClick={() => sheet.open('story')}
          className="fixed right-6 bottom-[52px] z-30 flex size-[74px] items-center justify-center rounded-full bg-action-green shadow-strong lg:right-10 lg:bottom-[72px] lg:size-[72px] desktop:right-[100px]"
        >
          <MaskIcon src={icPlus} className="size-[44.4px] bg-surface-white" />
        </button>
      )}

      {sheet.value === 'story' && (
        <StoryCreateSheet totalPages={room.totalPages} onClose={sheet.close} onSubmit={addStory} />
      )}
    </div>
  )
}

type MobileRangeListProps = {
  ranges: PageRange[]
  openStarts: Set<number>
  onToggle: (start: number) => void
  getStories: (range: PageRange) => Story[]
  renderBubble: (story: Story) => ReactNode
}

/** 모바일: 쪽 구간별로 접고 펼치는 이야기 목록 (이야기 있는 구간만) */
function MobileRangeList({
  ranges,
  openStarts,
  onToggle,
  getStories,
  renderBubble,
}: MobileRangeListProps) {
  const groups = ranges
    .map((range) => ({ range, stories: getStories(range) }))
    .filter((group) => group.stories.length > 0)

  if (groups.length === 0) {
    return (
      <p className="py-[88px] text-center text-m-body-l text-text-weak">
        보여줄 이야기가 없어요. 읽지 않은 범위 표시를 켜보세요
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {groups.map(({ range, stories }) => {
        const isOpen = openStarts.has(range.start)
        const panelId = `range-${range.start}`
        return (
          <li key={range.start} className="flex flex-col gap-3">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(range.start)}
              className="flex items-center justify-between rounded-full bg-surface-gray-light px-3 py-1 text-m-body-m font-medium text-text-secondary"
            >
              <span>
                {formatPageRange(range, 'mobile')}
                <span className="sr-only"> 이야기 {stories.length}개</span>
              </span>
              <img
                src={icChevronRight16}
                alt=""
                width={16}
                height={16}
                className={`size-4 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
              />
            </button>
            <ul id={panelId} hidden={!isOpen} className="flex flex-col gap-3">
              {stories.map(renderBubble)}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

type WebStoryListProps = {
  hasStories: boolean
  range?: PageRange
  stories: Story[]
  renderBubble: (story: Story) => ReactNode
  createButton: ReactNode
}

/** 웹: 왼쪽에서 고른 구간의 이야기 목록 */
function WebStoryList({
  hasStories,
  range,
  stories,
  renderBubble,
  createButton,
}: WebStoryListProps) {
  if (!hasStories) {
    return (
      <RoomEmptyState
        title="페이지별 이야기"
        description="책 속 장면에 대해 이야기할 수 있어요"
        action={createButton}
        className="py-[136px]"
      />
    )
  }

  if (stories.length === 0) {
    return (
      <RoomEmptyState
        title={range ? `${formatPageRange(range, 'web')} 이야기` : '페이지별 이야기'}
        description="이 구간에는 아직 보여줄 이야기가 없어요"
        action={createButton}
        className="py-[136px]"
      />
    )
  }

  return <ul className="flex flex-col gap-5">{stories.map(renderBubble)}</ul>
}

export default RoomDetailPage
