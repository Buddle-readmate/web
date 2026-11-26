import { useId, useState, type FormEvent, type KeyboardEvent, type Ref } from 'react'
import type { RoomMember } from '@/types/room'

const CONTENT_MAX = 500

export type ThoughtTarget = {
  /** 답글이면 원래 생각 id */
  parentId?: number
  /** @멘션할 멤버 */
  mention?: RoomMember
}

type ThoughtInputProps = {
  /** @로 부를 수 있는 멤버 (나 빼고) */
  members: RoomMember[]
  target: ThoughtTarget
  onTargetChange: (target: ThoughtTarget) => void
  onSubmit: (content: string) => void
  /** 답글 버튼을 눌렀을 때 입력칸으로 포커스를 옮기려고 받는 ref (React 19: 일반 prop) */
  ref?: Ref<HTMLInputElement>
}

/** 입력 끝의 "@검색어" (없으면 null) */
// @는 글 맨 처음이나 띄어쓰기 바로 뒤에 올 때만 멘션으로 봄 (abc@지 같은 글자 중간은 제외)
const MENTION_AT_END = /(^|\s)@([^\s@]*)$/
const getMentionQuery = (text: string) => text.match(MENTION_AT_END)?.[2] ?? null
/** 끝의 "@검색어"만 지우고 앞 띄어쓰기는 남기기 */
const removeMentionQuery = (text: string) => text.replace(MENTION_AT_END, '$1')

/**
 * "나만의 생각을 남겨주세요" 입력창
 * - @를 치면 멤버 목록이 떠서 고르면 초록 @이름이 앞에 붙음 (지우기: 빈칸에서 Backspace)
 * - 답글 버튼을 누르면 그 사람 @이름이 붙은 채로 열림
 */
function ThoughtInput({ members, target, onTargetChange, onSubmit, ref }: ThoughtInputProps) {
  const listId = useId()
  const [text, setText] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const query = getMentionQuery(text)
  const candidates =
    query === null ? [] : members.filter((member) => member.nickname.includes(query))
  const isListOpen = candidates.length > 0
  const canSubmit = text.trim().length > 0

  const chooseMention = (member: RoomMember) => {
    // "@검색어"를 지우고 앞에 초록 @이름으로 붙이기
    setText((prev) => removeMentionQuery(prev).trimEnd())
    onTargetChange({ parentId: target.parentId, mention: member })
    setActiveIndex(0)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 글자 확정용 → 멤버 고르기·등록을 하지 않음 (조합 끝난 뒤 Enter로 진행)
    // (keyCode 229: 일부 브라우저가 조합 중 키에 주는 값)
    if (event.nativeEvent.isComposing || event.keyCode === 229) {
      if (event.key === 'Enter') event.preventDefault()
      return
    }
    if (isListOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const step = event.key === 'ArrowDown' ? 1 : -1
        setActiveIndex((index) => (index + step + candidates.length) % candidates.length)
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        chooseMention(candidates[Math.min(activeIndex, candidates.length - 1)])
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        setText(removeMentionQuery)
        return
      }
    }
    // 빈칸에서 지우면 @이름·답글 대상 지우기
    if (event.key === 'Backspace' && text === '' && (target.mention || target.parentId)) {
      onTargetChange({})
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    // 멤버 목록이 열려 있어도 등록 버튼은 그대로 등록 (Enter는 위에서 멤버 고르기로 처리)
    if (!canSubmit) return
    onSubmit(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {isListOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label="부를 멤버"
          className="scrollbar-slim absolute right-0 bottom-[calc(100%+8px)] left-0 max-h-[176px] overflow-y-auto rounded-3xl bg-surface-white p-2 shadow-strong"
        >
          {candidates.map((member, index) => (
            <li
              key={member.id}
              id={`${listId}-${member.id}`}
              role="option"
              aria-selected={index === activeIndex}
              // 입력창 포커스를 잃지 않게 mousedown에서 고르기
              onMouseDown={(event) => {
                event.preventDefault()
                chooseMention(member)
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-m-body-l font-medium text-text-default lg:text-w-body-l lg:font-medium ${index === activeIndex ? 'bg-surface-gray-light' : ''}`}
            >
              <span aria-hidden className="size-6 shrink-0 rounded-full bg-surface-gray" />
              {member.nickname}
            </li>
          ))}
        </ul>
      )}

      {/* 입력칸에 키보드로 들어오면 입력창 전체에 초록 테두리 (outline-none 대신 보이는 포커스 표시) */}
      <div className="flex items-center gap-2 rounded-3xl border-[1.5px] border-transparent bg-surface-white py-2 pr-2 pl-5 shadow-strong has-[input:focus-visible]:border-border-green">
        <label className="flex min-w-0 flex-1 items-center gap-1">
          <span className="sr-only">
            {target.mention ? `${target.mention.nickname}님에게 ` : ''}생각 남기기
          </span>
          {target.mention && (
            <span className="shrink-0 text-m-body-l font-medium text-text-green lg:text-w-body-l lg:font-medium">
              @{target.mention.nickname}
            </span>
          )}
          <input
            ref={ref}
            type="text"
            name="thought"
            autoComplete="off"
            value={text}
            maxLength={CONTENT_MAX}
            onChange={(event) => {
              setText(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder={target.mention ? '' : '나만의 생각을 남겨주세요'}
            role="combobox"
            aria-expanded={isListOpen}
            aria-controls={isListOpen ? listId : undefined}
            aria-activedescendant={
              isListOpen ? `${listId}-${candidates[activeIndex]?.id}` : undefined
            }
            aria-autocomplete="list"
            className="h-10 min-w-0 flex-1 bg-transparent text-m-body-l font-medium text-text-default caret-text-default outline-none placeholder:text-text-weak lg:text-w-body-l lg:font-medium"
          />
        </label>
        <button
          type="submit"
          disabled={!canSubmit}
          className="shrink-0 rounded-2xl bg-action-green px-5 py-2 text-m-label-m text-text-contrast disabled:bg-action-disabled lg:text-w-label-m"
        >
          등록
        </button>
      </div>
    </form>
  )
}

export default ThoughtInput
