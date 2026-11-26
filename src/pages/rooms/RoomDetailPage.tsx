import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import icBack from '@/assets/icons/ic-back.svg'
import icMembers from '@/assets/icons/ic-members.svg'
import icPlus from '@/assets/icons/ic-plus.svg'
import icSetting from '@/assets/icons/ic-setting.svg'
import icChevronRight16 from '@/assets/icons/ic-chevron-right-16.svg'
import ConfirmDialog from '@/components/room/ConfirmDialog'
import FriendsPopover from '@/components/room/FriendsPopover'
import InviteCodeBox from '@/components/room/InviteCodeBox'
import MemberList from '@/components/room/MemberList'
import ReadingProgress from '@/components/room/ReadingProgress'
import RoomBookInfo from '@/components/room/RoomBookInfo'
import RoomEmptyState from '@/components/room/RoomEmptyState'
import RoomSettingsPanel from '@/components/room/RoomSettingsPanel'
import StoryBubble from '@/components/room/StoryBubble'
import StoryCreateSheet from '@/components/room/StoryCreateSheet'
import StoryToolbar from '@/components/room/StoryToolbar'
import GroupIcon from '@/components/shared/GroupIcon'
import MaskIcon from '@/components/shared/MaskIcon'
import SheetModal from '@/components/shared/SheetModal'
import { useOverlayParam } from '@/hooks/useOverlayParam'
import { getRoomDetailMock, MY_ID, MY_SHELF_BOOKS_MOCK } from '@/mocks/rooms'
import { MAX_ROOM_MEMBERS, toRoomDetail, useCreatedRoomStore } from '@/stores/createdRoomStore'
import { applyRoomEdit, useRoomEditStore } from '@/stores/roomEditStore'
import { useRoomStoryStore } from '@/stores/roomStoryStore'
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
  // TODO: 교환독서방 API 연동 전까지 더미 데이터 (+ 이번 접속에서 만든 방)
  const createdRoom = useCreatedRoomStore((state) =>
    state.rooms.find((item) => item.id === Number(roomId)),
  )
  const baseRoom = createdRoom
    ? toRoomDetail(createdRoom, MY_ID)
    : getRoomDetailMock(Number(roomId))
  // 설정에서 바꾼 정보·내보낸 멤버 반영, 삭제했거나 나간 방은 없는 방으로
  const edit = useRoomEditStore((state) => state.edits[Number(roomId)])
  const removedIds = useRoomEditStore((state) => state.removedMembers[Number(roomId)])
  const isClosed = useRoomEditStore((state) => state.closedRoomIds.includes(Number(roomId)))
  const room = baseRoom && !isClosed ? applyRoomEdit(baseRoom, edit, removedIds) : undefined

  // 삭제했거나 나간 방 (뒤로가기로 다시 온 경우 포함) → 목록으로
  if (baseRoom && isClosed) return <Navigate to="/rooms" replace />

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
  const [searchParams, setSearchParams] = useSearchParams()
  // 이야기 생성은 ?sheet=story 로 띄움 (뒤로가기로 닫힘)
  const sheet = useOverlayParam('sheet')
  // 설정은 ?panel=settings 로 띄움 (모바일 전체 화면 / 웹 왼쪽 칸)
  const panel = useOverlayParam('panel')
  const tab = searchParams.get('tab') === 'members' ? 'members' : 'stories'
  const isHost = room.hostId === room.myId
  const isFull = room.members.length >= MAX_ROOM_MEMBERS

  const editRoom = useRoomEditStore((state) => state.editRoom)
  const removeMember = useRoomEditStore((state) => state.removeMember)
  const closeRoom = useRoomEditStore((state) => state.closeRoom)
  // 웹: 멤버 아이콘 아래 친구 목록 / 모바일: 초대하기 바텀시트 / 내보낼 멤버 확인
  const [isFriendsOpen, setIsFriendsOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<RoomMember | null>(null)
  const friendsButtonRef = useRef<HTMLButtonElement>(null)

  const myPage = room.members.find((member) => member.id === room.myId)?.readPage ?? 0
  const currentRange = findCurrentRange(room.pageRanges, myPage)

  // TODO: 이야기 등록 API 연동 (지금은 더미 데이터 + 이번 접속에서 등록한 이야기)
  const addedStories = useRoomStoryStore((state) => state.addedStories[room.id])
  const saveStory = useRoomStoryStore((state) => state.addStory)
  const stories = addedStories ? [...room.stories, ...addedStories] : room.stories
  const [showUnread, setShowUnread] = useState(true)
  const [sort, setSort] = useState<SortOrder>('desc')
  const [revealedIds, setRevealedIds] = useState<Set<number>>(() => new Set())
  // 웹: 왼쪽에서 고른 구간 / 모바일: 펼친 구간들 (처음엔 지금 읽는 구간)
  // 'all': 맨 위 ALL → 모든 구간의 이야기를 한 번에 (구간이 없는 방도 ALL)
  const [selectedStartState, setSelectedStart] = useState<number | 'all'>(
    currentRange?.start ?? 'all',
  )
  const [openStartsState, setOpenStarts] = useState<Set<number>>(
    () => new Set(currentRange ? [currentRange.start] : []),
  )
  // 설정에서 총 쪽수를 바꿔 구간이 새로 나뉘면, 없어진 구간 대신 ALL / 지금 읽는 구간으로
  const rangeStarts = new Set(room.pageRanges.map((range) => range.start))
  const selectedStart =
    selectedStartState === 'all' || rangeStarts.has(selectedStartState) ? selectedStartState : 'all'
  const openStarts = [...openStartsState].some((start) => rangeStarts.has(start))
    ? openStartsState
    : new Set(currentRange ? [currentRange.start] : [])
  const [statusMessage, setStatusMessage] = useState('')
  const tabRefs = useRef<Record<'stories' | 'members', HTMLButtonElement | null>>({
    stories: null,
    members: null,
  })

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
    // 주소로 바로 들어와 앱 안 이전 기록이 없으면 목록으로
    // (탭·구간 변경은 replace라 location.key로는 판단 못 해서 router 기록 순번(idx)으로 확인)
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (historyIndex > 0) navigate(-1)
    else navigate('/rooms')
  }

  const changeTab = (next: 'stories' | 'members') => {
    if (next === tab) return
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

  // 방 삭제·나가기: 목록으로 (이 방 주소로 되돌아오지 않게 replace)
  const leaveRoom = () => {
    closeRoom(room.id)
    navigate('/rooms', { replace: true })
  }

  const confirmRemove = () => {
    if (!removeTarget) return
    removeMember(room.id, removeTarget.id)
    setStatusMessage(`${removeTarget.nickname}님을 내보냈어요`)
    setRemoveTarget(null)
  }

  const addStory = ({ page, content }: { page: number; content: string }) => {
    saveStory(room.id, {
      id: Math.max(0, ...stories.map((story) => story.id)) + 1,
      page,
      content,
      authorId: room.myId,
      replierIds: [],
      myRepliedAt: formatToday(),
    })
    // 방금 쓴 이야기가 보이도록 해당 구간 열기 (ALL을 보고 있으면 그대로)
    const range = room.pageRanges.find((item) => isInRange(page, item))
    if (range) {
      if (selectedStart !== 'all') setSelectedStart(range.start)
      setOpenStarts((prev) => new Set(prev).add(range.start))
    }
    // 같은 문구가 연달아 와도 스크린리더가 다시 읽도록 비웠다가 채우기
    setStatusMessage('')
    window.setTimeout(() => setStatusMessage(`P. ${page} 이야기를 등록했어요`), 100)
    sheet.close()
  }

  // 탭: 좌우 방향키로 이동 (탭이 2개라 서로 바꾸기)
  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = tab === 'stories' ? 'members' : 'stories'
    changeTab(next)
    tabRefs.current[next]?.focus()
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

  const settingButton = (
    <button
      type="button"
      aria-label="방 설정"
      onClick={() => panel.open('settings')}
      className="flex"
    >
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
            <div
              role="tablist"
              aria-label="교환독서방 메뉴"
              onKeyDown={handleTabKeyDown}
              className="flex"
            >
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
                    ref={(element) => {
                      tabRefs.current[value] = element
                    }}
                    type="button"
                    role="tab"
                    tabIndex={isSelected ? 0 : -1}
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

            <div
              role="tabpanel"
              id="room-panel-members"
              aria-labelledby="room-tab-members"
              hidden={tab !== 'members'}
              className="pt-1"
            >
              <div className="flex flex-col gap-5">
                <ReadingProgress
                  totalPages={room.totalPages}
                  members={room.members}
                  myId={room.myId}
                  variant="card"
                />
                <div className="flex flex-col gap-2">
                  <h2 className="text-m-body-l font-medium text-text-secondary">
                    멤버 {room.members.length}/{MAX_ROOM_MEMBERS}
                  </h2>
                  <div className="flex flex-col">
                    {/* 최대 인원이면 더 초대할 수 없음 */}
                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => setIsInviteOpen(true)}
                      className="flex items-center gap-2 rounded-2xl bg-green-50 py-3 pl-3 text-m-body-l font-medium text-text-green disabled:bg-surface-gray-light disabled:text-text-weak"
                    >
                      <MaskIcon
                        src={icPlus}
                        className={`size-5 ${isFull ? 'bg-text-weak' : 'bg-text-green'}`}
                      />
                      {isFull ? `인원이 가득 찼어요 (최대 ${MAX_ROOM_MEMBERS}명)` : '초대하기'}
                    </button>
                    <MemberList
                      members={room.members}
                      hostId={room.hostId}
                      myId={room.myId}
                      onRemove={isHost ? setRemoveTarget : undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              role="tabpanel"
              id="room-panel-stories"
              aria-labelledby="room-tab-stories"
              hidden={tab !== 'stories'}
            >
              {!hasStories ? (
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
        {/* 친구 목록 팝오버가 헤더 왼쪽 끝에 맞춰 뜨도록 relative */}
        <header className="relative flex h-14 items-center justify-between pr-10">
          <button type="button" aria-label="뒤로" onClick={goBack} className="flex">
            <img src={icBack} alt="" width={28} height={28} className="size-7" />
          </button>
          <div className="flex items-center gap-5">
            <button
              ref={friendsButtonRef}
              type="button"
              aria-label="친구 목록"
              aria-expanded={isFriendsOpen}
              onClick={() => setIsFriendsOpen((open) => !open)}
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
            {isFriendsOpen && (
              <FriendsPopover
                room={room}
                isHost={isHost}
                onRemove={setRemoveTarget}
                onClose={() => setIsFriendsOpen(false)}
                triggerRef={friendsButtonRef}
              />
            )}
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
                    onClick={() => setSelectedStart(key)}
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
        {toolbar}
        <WebStoryList
          hasStories={hasStories}
          range={selectedStart === 'all' ? undefined : selectedRange}
          stories={selectedRange ? getStoriesInRange(visibleStories, selectedRange, sort) : []}
          renderBubble={renderBubble}
          createButton={createButton}
        />
      </main>

      <button
        type="button"
        aria-label="새로운 이야기 생성"
        onClick={() => sheet.open('story')}
        // 모바일 멤버 탭에서는 숨김 (웹은 오른쪽이 늘 이야기 목록)
        className={`fixed right-6 bottom-[52px] z-30 size-[74px] items-center justify-center rounded-full bg-action-green shadow-strong lg:right-10 lg:bottom-[72px] lg:flex lg:size-[72px] desktop:right-[100px] ${tab === 'members' ? 'hidden' : 'flex'}`}
      >
        <MaskIcon src={icPlus} className="size-[44.4px] bg-surface-white" />
      </button>

      {sheet.value === 'story' && (
        <StoryCreateSheet totalPages={room.totalPages} onClose={sheet.close} onSubmit={addStory} />
      )}

      {/* 모바일: 화면 전체 / 웹: 왼쪽 칸 자리에 겹쳐서 */}
      {panel.value === 'settings' && (
        <div className="fixed inset-0 z-40 flex flex-col bg-surface-page lg:right-auto lg:w-[360px] lg:pt-[52px] lg:pr-10 lg:pl-10 desktop:w-[482px] desktop:pl-[100px]">
          <RoomSettingsPanel
            room={room}
            isHost={isHost}
            shelfBooks={MY_SHELF_BOOKS_MOCK}
            onClose={panel.close}
            onSave={(next) => editRoom(room.id, next)}
            onDelete={leaveRoom}
            onLeave={leaveRoom}
          />
        </div>
      )}

      {isInviteOpen && (
        <SheetModal title="친구 초대" onClose={() => setIsInviteOpen(false)}>
          <InviteCodeBox
            roomName={room.name}
            inviteCode={room.inviteCode}
            password={room.password}
          />
        </SheetModal>
      )}

      {removeTarget && (
        <ConfirmDialog
          title="친구를 내보낼까요?"
          description={`${removeTarget.nickname}님이 작성한 모든 기록이 삭제되며, 복구할 수 없어요`}
          confirmLabel="내보내기"
          onConfirm={confirmRemove}
          onCancel={() => setRemoveTarget(null)}
        />
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
