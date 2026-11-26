import icComment from '@/assets/icons/ic-comment.svg'
import icHeartOff from '@/assets/icons/ic-heart-off.svg'
import icHeartOn from '@/assets/icons/ic-heart-on.svg'
import type { RoomMember, Thought } from '@/types/room'

type ThoughtListProps = {
  thoughts: Thought[]
  membersById: Map<number, RoomMember>
  myId: number
  onToggleLike: (thought: Thought) => void
  /** 생각에 답글 달기 (원래 생각을 넘김) */
  onReply: (thought: Thought) => void
  /** 가려진 동안은 눌리지 않게 */
  disabled?: boolean
}

const nicknameOf = (membersById: Map<number, RoomMember>, id: number) =>
  membersById.get(id)?.nickname ?? '알 수 없음'

/** 페이지별 이야기의 생각 목록 (생각 아래에 답글이 들여쓰기로 붙음) */
function ThoughtList({
  thoughts,
  membersById,
  myId,
  onToggleLike,
  onReply,
  disabled = false,
}: ThoughtListProps) {
  // 원래 생각이 목록에서 빠진 답글(작성자가 나간 경우 등)은 사라지지 않게 맨 위 단계로
  const ids = new Set(thoughts.map((thought) => thought.id))
  const topLevel = thoughts.filter(
    (thought) => thought.parentId === undefined || !ids.has(thought.parentId),
  )
  const repliesOf = (parentId: number) =>
    thoughts.filter((thought) => thought.parentId === parentId)

  const renderThought = (thought: Thought, isReply: boolean) => {
    const author = nicknameOf(membersById, thought.authorId)
    const isLiked = thought.likedBy.includes(myId)
    const replyCount = isReply ? 0 : repliesOf(thought.id).length

    return (
      <article
        className={`flex flex-col gap-1 border-b-[1.5px] border-border-default py-4 lg:gap-2 lg:py-5 ${isReply ? 'ml-8 lg:ml-9' : ''}`}
      >
        <header className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {membersById.get(thought.authorId)?.avatarUrl ? (
              <img
                src={membersById.get(thought.authorId)?.avatarUrl}
                alt=""
                className="size-6 shrink-0 rounded-full lg:size-7"
              />
            ) : (
              <span
                aria-hidden
                className="size-6 shrink-0 rounded-full bg-surface-gray lg:size-7"
              />
            )}
            <span className="truncate text-m-body-l font-medium text-text-secondary-brown lg:text-w-body-l lg:font-medium">
              {author}
              {thought.authorId === myId && <span className="text-text-weak"> (나)</span>}
            </span>
          </div>
          {/* "26.11.14" → dateTime "2026-11-14" (시안: 모바일도 15px) */}
          <time
            dateTime={`20${thought.createdAt.replaceAll('.', '-')}`}
            className="shrink-0 text-w-body-m font-medium text-text-weak"
          >
            {thought.createdAt}
          </time>
        </header>

        <div className="flex flex-col gap-2 pl-8 lg:gap-3 lg:pl-9">
          <p className="text-m-body-l break-keep [overflow-wrap:anywhere] text-text-default lg:text-w-body-l">
            {thought.mentionId !== undefined && (
              <span className="text-text-green">
                @{nicknameOf(membersById, thought.mentionId)}{' '}
              </span>
            )}
            {thought.content}
          </p>
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              type="button"
              disabled={disabled}
              aria-pressed={isLiked}
              aria-label={`좋아요 ${thought.likedBy.length}개${isLiked ? ', 누름' : ''}`}
              onClick={() => onToggleLike(thought)}
              className="flex items-center gap-1 text-m-label-m text-text-secondary lg:text-w-label-m"
            >
              <img
                src={isLiked ? icHeartOn : icHeartOff}
                alt=""
                width={24}
                height={24}
                className="size-5 lg:size-6"
              />
              {thought.likedBy.length}
            </button>
            {!isReply && (
              <button
                type="button"
                disabled={disabled}
                aria-label={`${author}님 생각에 답글 달기 (답글 ${replyCount}개)`}
                onClick={() => onReply(thought)}
                className="flex items-center gap-1 text-m-label-m text-text-secondary lg:text-w-label-m"
              >
                <img src={icComment} alt="" width={24} height={24} className="size-5 lg:size-6" />
                {replyCount}
              </button>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <ul className="flex flex-col">
      {topLevel.map((thought) => (
        <li key={thought.id}>
          {renderThought(thought, false)}
          {repliesOf(thought.id).length > 0 && (
            <ul>
              {repliesOf(thought.id).map((reply) => (
                <li key={reply.id}>{renderThought(reply, true)}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ThoughtList
