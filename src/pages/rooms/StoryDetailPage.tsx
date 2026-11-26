import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import icBack from '@/assets/icons/ic-back.svg'
import icBubbleTailLeft from '@/assets/icons/ic-bubble-tail-left.svg'
import icChevronRight16 from '@/assets/icons/ic-chevron-right-16.svg'
import ThoughtInput, { type ThoughtTarget } from '@/components/room/ThoughtInput'
import ThoughtList from '@/components/room/ThoughtList'
import { useRoom, useRoomStories } from '@/hooks/useRoom'
import { getThoughtsMock } from '@/mocks/rooms'
import { mergeThoughts, storyKey, useThoughtStore } from '@/stores/thoughtStore'
import type { RoomDetail, Story, StoryLinkState, Thought } from '@/types/room'
import { formatPageRange, formatToday, getStoriesInRange, sortRanges } from '@/utils/room'

function StoryDetailPage() {
  const { roomId, storyId } = useParams()
  const { room, isClosed } = useRoom(Number(roomId))

  if (isClosed) return <Navigate to="/rooms" replace />
  if (!room) {
    return <NotFound message="교환독서방을 찾을 수 없어요" to="/rooms" label="교환독서 목록으로" />
  }

  return <StoryDetailRoom key={room.id} room={room} storyId={Number(storyId)} />
}

type NotFoundProps = {
  message: string
  to: string
  label: string
}

function NotFound({ message, to, label }: NotFoundProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface-page px-6 text-center">
      <p className="text-m-head-m text-text-secondary lg:text-w-head-m">{message}</p>
      <Link
        to={to}
        className="flex h-12 items-center rounded-2xl bg-action-green px-7 text-m-label-m text-text-contrast lg:text-w-label-m"
      >
        {label}
      </Link>
    </main>
  )
}

type StoryDetailRoomProps = {
  room: RoomDetail
  storyId: number
}

function StoryDetailRoom({ room, storyId }: StoryDetailRoomProps) {
  const stories = useRoomStories(room)
  const story = stories.find((item) => item.id === storyId)
  if (!story) {
    return (
      <NotFound message="이야기를 찾을 수 없어요" to={`/rooms/${room.id}`} label="교환독서방으로" />
    )
  }

  // 다른 이야기로 바뀌면 입력·가림 상태를 새로 시작
  return <StoryDetailView key={story.id} room={room} story={story} stories={stories} />
}

type StoryDetailViewProps = {
  room: RoomDetail
  story: Story
  stories: Story[]
}

/**
 * 페이지별 이야기 상세
 * - 모바일: 위 질문 + 생각 목록 + 아래 입력창
 * - 웹: 왼쪽 구간별 이야기 목록 + 오른쪽 생각 목록·입력창
 * - 내 생각을 남기기 전에는 친구들 생각을 흐리게 가림 (웹은 눌러서 먼저 보기 가능)
 */
function StoryDetailView({ room, story, stories }: StoryDetailViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const key = storyKey(room.id, story.id)
  const addedThoughts = useThoughtStore((state) => state.addedThoughts[key])
  const myLikes = useThoughtStore((state) => state.myLikes)
  const addThought = useThoughtStore((state) => state.addThought)
  const setLike = useThoughtStore((state) => state.setLike)

  const [target, setTarget] = useState<ThoughtTarget>({})
  const [isPeeked, setIsPeeked] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const statusTimerRef = useRef<number | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  // 아직 안 읽은 쪽의 다른 사람 이야기는 교환독서방처럼 "눌러서 확인하기"를 거쳐야 보임
  // (방 화면에서 이미 확인하고 들어왔으면 바로 보임)
  const myPage = room.members.find((member) => member.id === room.myId)?.readPage ?? 0
  const isUnreadStory = story.authorId !== room.myId && story.page > myPage
  const [isStoryRevealed, setIsStoryRevealed] = useState(
    () => !isUnreadStory || Boolean((location.state as StoryLinkState | null)?.revealed),
  )
  const isStoryHidden = !isStoryRevealed

  // 등록 안내 타이머는 다시 등록하거나 화면을 떠나면 정리
  useEffect(() => () => window.clearTimeout(statusTimerRef.current), [])

  const membersById = new Map(room.members.map((member) => [member.id, member]))
  // TODO: 생각 목록 API 연동 (지금은 더미 + 이번 접속에서 남긴 생각)
  const allThoughts = mergeThoughts(
    getThoughtsMock(room.id, story.id),
    addedThoughts,
    myLikes,
    key,
    room.myId,
  )
  // 내보냈거나 나간 멤버의 생각은 빼고 보여줌
  const thoughts = allThoughts.filter((thought) => membersById.has(thought.authorId))
  const isMine = story.authorId === room.myId
  const hasReplied = isMine || Boolean(story.myRepliedAt)
  const isHidden = !hasReplied && !isPeeked && thoughts.length > 0
  const author = membersById.get(story.authorId)
  const otherMembers = room.members.filter((member) => member.id !== room.myId)

  const goBack = () => {
    // 주소로 바로 들어와 앱 안 이전 기록이 없으면 방으로
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (historyIndex > 0) navigate(-1)
    else navigate(`/rooms/${room.id}`)
  }

  const toggleLike = (thought: Thought) => {
    setLike(key, thought.id, !thought.likedBy.includes(room.myId))
  }

  const reply = (thought: Thought) => {
    setTarget({ parentId: thought.id, mention: membersById.get(thought.authorId) })
    inputRef.current?.focus()
  }

  const submit = (content: string) => {
    addThought(key, {
      // 숨긴 생각까지 포함해서 번호가 겹치지 않게
      id: Math.max(0, ...allThoughts.map((thought) => thought.id)) + 1,
      authorId: room.myId,
      content,
      // "2026.11.14" → "26.11.14"
      createdAt: formatToday().slice(2),
      likedBy: [],
      parentId: target.parentId,
      mentionId: target.mention?.id,
    })
    setTarget({})
    // 같은 문구가 연달아 와도 스크린리더가 다시 읽도록 비웠다가 채우기
    const message = target.parentId ? '답글을 남겼어요' : '내 생각을 남겼어요'
    setStatusMessage('')
    window.clearTimeout(statusTimerRef.current)
    statusTimerRef.current = window.setTimeout(() => setStatusMessage(message), 100)
  }

  return (
    <div className="min-h-dvh bg-surface-page lg:flex">
      <p role="status" className="sr-only">
        {statusMessage}
      </p>

      {/* ───────── 웹: 왼쪽 구간별 이야기 목록 ───────── */}
      <aside className="hidden shrink-0 flex-col gap-6 overflow-y-auto border-r-[1.5px] border-border-default pt-[52px] pr-10 pb-10 pl-10 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[360px] desktop:w-[482px] desktop:pl-[100px]">
        <header className="flex h-14 shrink-0 items-center gap-2">
          <button type="button" aria-label="뒤로" onClick={goBack} className="flex">
            <img src={icBack} alt="" width={28} height={28} className="size-7" />
          </button>
          <h1 className="text-w-head-m text-text-default">페이지별 이야기</h1>
        </header>
        <StoryNav
          room={room}
          stories={stories}
          currentId={story.id}
          isCurrentRevealed={isStoryRevealed}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ───────── 모바일: 위쪽 질문 ───────── */}
        <div className="bg-surface-gray-light lg:hidden">
          <header className="flex h-14 items-center gap-2 px-6">
            <button type="button" aria-label="뒤로" onClick={goBack} className="flex">
              <img src={icBack} alt="" width={24} height={24} className="size-6" />
            </button>
            <h1 className="text-m-head-m text-text-default">페이지별 이야기</h1>
          </header>
          <div className="flex items-start gap-5 px-6 py-5">
            <div className="flex max-w-14 shrink-0 flex-col items-center gap-1">
              <span aria-hidden className="size-9 rounded-full bg-surface-gray" />
              <span className="w-full truncate text-center text-m-body-m font-medium text-text-secondary-brown">
                {author?.nickname ?? '알 수 없음'}
              </span>
            </div>
            <div className="relative min-w-0 flex-1 rounded-[20px] bg-surface-white p-5 drop-shadow-bubble-m">
              <img
                src={icBubbleTailLeft}
                alt=""
                width={16}
                height={16}
                className="absolute top-[15px] -left-[13px] size-4"
              />
              {isStoryHidden ? (
                <button
                  type="button"
                  onClick={() => setIsStoryRevealed(true)}
                  className="flex w-full flex-col items-center gap-0.5 py-2"
                >
                  <span className="text-m-body-m font-medium text-gray-600">
                    P. {story.page} · 아직 읽지 않은 범위예요
                  </span>
                  <span className="text-m-label-m text-text-secondary">눌러서 확인하기</span>
                </button>
              ) : (
                <p className="text-m-body-l font-medium break-keep [overflow-wrap:anywhere] text-text-default">
                  <span className="font-semibold text-text-green">P. {story.page}</span> 에서{' '}
                  {story.content}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ───────── 생각 목록 + 입력창 ───────── */}
        <main className="flex flex-1 flex-col px-6 pb-[140px] lg:px-10 lg:pt-[52px] lg:pb-10 desktop:pr-[100px] desktop:pl-[72px]">
          {/* 웹: 지금 보고 있는 이야기 (스크린리더용, 화면에는 왼쪽 목록에 표시) */}
          <h2 className="sr-only">
            P. {story.page} {isStoryHidden ? '아직 읽지 않은 범위예요' : `에서 ${story.content}`}
          </h2>

          {isStoryHidden ? (
            // 안 읽은 쪽 이야기: 확인하기 전에는 생각 목록·입력창도 보여주지 않음
            <div className="flex flex-col items-center gap-0.5 py-[88px] text-center lg:py-[200px]">
              <p className="text-m-body-l font-medium text-text-secondary lg:text-w-body-m lg:font-medium lg:text-gray-600">
                아직 읽지 않은 범위의 이야기예요
              </p>
              <button
                type="button"
                onClick={() => setIsStoryRevealed(true)}
                className="hidden text-w-label-m text-text-secondary lg:block"
              >
                눌러서 확인하기
              </button>
            </div>
          ) : thoughts.length === 0 ? (
            <p className="py-[88px] text-center text-m-body-l text-text-weak lg:text-w-body-l">
              아직 남겨진 생각이 없어요. 첫 번째 생각을 남겨보세요
            </p>
          ) : (
            <div className="relative">
              {/* inert: 흐리게 가린 동안 스크린리더·키보드로도 내용에 들어가지 못하게 */}
              <div
                inert={isHidden}
                aria-hidden={isHidden}
                className={isHidden ? 'pointer-events-none blur-[5px] select-none' : ''}
              >
                <ThoughtList
                  thoughts={thoughts}
                  membersById={membersById}
                  myId={room.myId}
                  onToggleLike={toggleLike}
                  onReply={reply}
                  disabled={isHidden}
                />
              </div>
              {isHidden && (
                <div className="absolute inset-x-0 top-[120px] flex flex-col items-center gap-0.5 text-center lg:top-[200px]">
                  <p className="text-m-body-l font-medium text-text-secondary lg:hidden">
                    내 생각을 등록하면
                    <br />
                    친구들의 생각을 볼 수 있어요
                  </p>
                  <p className="hidden text-w-body-m font-medium text-gray-600 lg:block">
                    아직 내 생각을 등록하지 않았어요
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPeeked(true)}
                    className="hidden text-w-label-m text-text-secondary lg:block"
                  >
                    눌러서 친구들의 생각 먼저 보기
                  </button>
                </div>
              )}
            </div>
          )}

          {!isStoryHidden && (
            <div className="fixed inset-x-6 bottom-[52px] z-20 lg:sticky lg:inset-x-auto lg:bottom-10 lg:mt-6 desktop:bottom-[100px]">
              <ThoughtInput
                ref={inputRef}
                members={otherMembers}
                target={target}
                onTargetChange={setTarget}
                onSubmit={submit}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

type StoryNavProps = {
  room: RoomDetail
  stories: Story[]
  currentId: number
  /** 지금 이야기를 "눌러서 확인하기"로 연 경우 목록에서도 내용 보여줌 */
  isCurrentRevealed: boolean
}

/**
 * 웹: 쪽 구간별로 묶은 이야기 목록 (지금 이야기 초록 테두리, 구간 접기)
 * 아직 안 읽은 쪽의 다른 사람 이야기는 교환독서방처럼 내용을 가림
 * (눌러서 열면 이야기 화면에서 한 번 더 "눌러서 확인하기"를 거침)
 */
function StoryNav({ room, stories, currentId, isCurrentRevealed }: StoryNavProps) {
  const [closedStarts, setClosedStarts] = useState<Set<number>>(() => new Set())
  const myPage = room.members.find((member) => member.id === room.myId)?.readPage ?? 0
  const isUnread = (story: Story) =>
    !(story.id === currentId && isCurrentRevealed) &&
    story.authorId !== room.myId &&
    story.page > myPage
  const groups = sortRanges(room.pageRanges, 'desc')
    .map((range) => ({ range, items: getStoriesInRange(stories, range, 'desc') }))
    .filter((group) => group.items.length > 0)

  const toggle = (start: number) => {
    setClosedStarts((prev) => {
      const next = new Set(prev)
      if (next.has(start)) next.delete(start)
      else next.add(start)
      return next
    })
  }

  return (
    <nav aria-label="페이지별 이야기 목록" className="flex flex-col gap-7">
      {groups.map(({ range, items }) => {
        const isOpen = !closedStarts.has(range.start)
        const listId = `story-range-${range.start}`
        return (
          <section key={range.start} className="flex flex-col gap-4">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={listId}
              onClick={() => toggle(range.start)}
              className="flex items-center justify-between rounded-full bg-surface-gray-light px-3 py-1 text-m-body-m font-medium text-text-secondary"
            >
              {formatPageRange(range, 'mobile')}
              <img
                src={icChevronRight16}
                alt=""
                width={16}
                height={16}
                className={`size-4 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
              />
            </button>
            <ul id={listId} hidden={!isOpen} className="flex flex-col gap-3">
              {items.map((item) => {
                const isCurrent = item.id === currentId
                return (
                  <li key={item.id}>
                    <Link
                      to={`/rooms/${room.id}/stories/${item.id}`}
                      // 목록에서 옮겨 다녀도 뒤로가기는 교환독서방으로
                      replace
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`block rounded-[20px] px-5 pt-5 pb-4 text-w-body-l font-medium break-keep [overflow-wrap:anywhere] drop-shadow-bubble-m ${isCurrent ? 'border-[1.5px] border-border-green bg-green-50 text-text-default' : 'bg-surface-white text-text-secondary'}`}
                    >
                      <span className="font-semibold text-text-green">P. {item.page}</span>{' '}
                      {isUnread(item) ? (
                        <span className="text-text-weak">아직 읽지 않은 범위예요</span>
                      ) : (
                        <>에서 {item.content}</>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </nav>
  )
}

export default StoryDetailPage
