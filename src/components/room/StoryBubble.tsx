import { Link } from 'react-router-dom'
import icBubbleTailLeft from '@/assets/icons/ic-bubble-tail-left.svg'
import icBubbleTailRight from '@/assets/icons/ic-bubble-tail-right.svg'
import MemberAvatars from '@/components/room/MemberAvatars'
import type { RoomMember, Story } from '@/types/room'

type StoryBubbleProps = {
  roomId: number
  story: Story
  author?: RoomMember
  repliers: RoomMember[]
  isMine: boolean
  /** 내가 아직 안 읽은 쪽의 이야기 → 가려서 보여주기 */
  isHidden: boolean
  onReveal: () => void
}

/** "예진, 효정 외 2명" */
function formatRepliers(repliers: RoomMember[]) {
  if (repliers.length === 0) return '아직 남긴 생각이 없어요'
  const names = repliers.slice(0, 2).map((member) => member.nickname)
  const rest = repliers.length - names.length
  return rest > 0 ? `${names.join(', ')} 외 ${rest}명` : names.join(', ')
}

const actionClassName =
  'flex h-9 w-[124px] shrink-0 items-center justify-center rounded-2xl text-m-label-s lg:w-[156px] lg:text-w-label-s'

/**
 * 페이지별 이야기 말풍선
 * - 친구 글: 왼쪽 (프로필 + 이름) / 내 글: 오른쪽
 * - 내 생각 남기기 전: 초록 버튼 / 남긴 뒤: 남긴 날짜
 * - 안 읽은 쪽: 흐리게 가리고 눌러야 보임
 */
function StoryBubble({
  roomId,
  story,
  author,
  repliers,
  isMine,
  isHidden,
  onReveal,
}: StoryBubbleProps) {
  const storyUrl = `/rooms/${roomId}/stories/${story.id}`

  const bubble = (
    <div
      className={`relative flex min-w-0 flex-col gap-2 rounded-[20px] bg-surface-white px-5 pt-5 pb-4 drop-shadow-bubble-m lg:drop-shadow-bubble-w ${isMine ? 'w-[286px] max-w-full lg:w-[520px]' : 'max-w-[286px] flex-1 lg:max-w-[520px]'}`}
    >
      <img
        src={isMine ? icBubbleTailRight : icBubbleTailLeft}
        alt=""
        width={16}
        height={16}
        className={`absolute top-[15px] size-4 ${isMine ? '-right-[13px]' : '-left-[13px]'}`}
      />

      <div aria-hidden={isHidden} className="flex flex-col gap-2">
        <p className="text-m-body-l font-medium break-keep [overflow-wrap:anywhere] text-text-default lg:text-w-body-l lg:font-medium">
          <span className="font-semibold text-text-green">P. {story.page}</span> 에서{' '}
          {story.content}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <MemberAvatars members={repliers} />
            <span className="hidden truncate text-w-caption text-text-weak lg:inline">
              {formatRepliers(repliers)}
            </span>
          </div>

          {isHidden ? (
            // 가려진 동안 버튼 자리만 차지 (시안: 투명 버튼)
            <span className={`${actionClassName} invisible`} />
          ) : story.myRepliedAt ? (
            <Link
              to={storyUrl}
              aria-label={`${story.myRepliedAt}에 남긴 내 생각 보기`}
              className={`${actionClassName} border border-border-default bg-action-white text-text-weak`}
            >
              {story.myRepliedAt}
              <span className="hidden lg:inline">&nbsp;기록</span>
            </Link>
          ) : (
            <Link to={storyUrl} className={`${actionClassName} bg-action-green text-text-contrast`}>
              내 생각 남기기
            </Link>
          )}
        </div>
      </div>

      {isHidden && (
        <button
          type="button"
          onClick={onReveal}
          className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-[20px] bg-surface-white/70 backdrop-blur-[3px]"
        >
          <span className="text-m-body-m font-medium text-gray-600 lg:text-w-body-m lg:font-medium">
            아직 읽지 않은 범위예요
          </span>
          <span className="text-m-label-m text-text-secondary lg:text-w-label-m">
            눌러서 확인하기
          </span>
        </button>
      )}
    </div>
  )

  if (isMine) {
    return <div className="flex justify-end">{bubble}</div>
  }

  return (
    <div className="flex items-start gap-5 lg:gap-6">
      <div className="flex max-w-14 shrink-0 flex-col items-center gap-1">
        {author?.avatarUrl ? (
          <img src={author.avatarUrl} alt="" className="size-9 rounded-full lg:size-11" />
        ) : (
          <span className="size-9 rounded-full bg-surface-gray lg:size-11" />
        )}
        <span className="w-full truncate text-center text-m-body-m font-medium text-text-secondary-brown lg:text-w-body-m lg:font-medium">
          {author?.nickname ?? '알 수 없음'}
        </span>
      </div>
      {bubble}
    </div>
  )
}

export default StoryBubble
