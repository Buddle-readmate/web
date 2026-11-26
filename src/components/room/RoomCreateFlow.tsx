import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import icBack from '@/assets/icons/ic-back.svg'
import icCancel from '@/assets/icons/ic-cancel.svg'
import icCheckOn from '@/assets/icons/ic-check-on.svg'
import icCopy from '@/assets/icons/ic-copy.svg'
import icSearch from '@/assets/icons/ic-search.svg'
import { BookOption, RoomInfoCard, SelectedBookCard } from '@/components/room/BookCards'
import PinInput, { PIN_LENGTH } from '@/components/room/PinInput'
import RoomFlowModal from '@/components/room/RoomFlowModal'
import Button from '@/components/shared/Button'
import GroupIcon from '@/components/shared/GroupIcon'
import MaskIcon from '@/components/shared/MaskIcon'
import StepIndicator from '@/components/signup/StepIndicator'
import { MAX_ROOM_MEMBERS, useCreatedRoomStore, type CreatedRoom } from '@/stores/createdRoomStore'
import type { ShelfBook } from '@/types/room'

const NAME_MAX = 20
const PAGES_MAX = 9999
const GOAL_PRESETS = [10, 20, 30] as const
const INPUT_STEPS = 3

const STEP_TEXT = [
  { title: '함께 읽을 책을 골라주세요', description: '교환독서는 방 하나에 책 한 권으로 진행돼요' },
  {
    title: '방 이름과 총 쪽수를 정해주세요',
    description: '판본이 달라도 진행률은 총 쪽수를 기준으로 해요',
  },
  { title: '방 비밀번호를 정해주세요', description: '비밀번호를 정하면 초대코드가 발급돼요' },
]

const ROOM_RULES = [
  '방 하나에 책 한 권, 최대 6명까지 함께 읽어요',
  '초대코드와 비밀번호를 입력해야 들어올 수 있어요',
  '혼자 기록하고 싶다면 초대 없이 시작해도 돼요',
]

const inputClassName =
  'h-[52px] w-full rounded-2xl border-[1.5px] bg-surface-white px-4 text-m-body-l font-medium text-text-default caret-text-default outline-none placeholder:text-text-weak lg:text-w-body-l lg:font-medium'

const labelClassName = 'text-m-label-s text-text-secondary lg:text-w-label-s'

/** 숫자만 남기기 */
const onlyDigits = (value: string) => value.replace(/\D/g, '')

type RoomCreateFlowProps = {
  shelfBooks: ShelfBook[]
  onClose: () => void
}

/**
 * 교환독서 방 만들기 (모바일: 전체 화면 / 웹: 가운데 모달)
 * 1 책 고르기 → 2 방 이름·총 쪽수·하루 목표 → 3 비밀번호 → 완료(초대코드)
 */
function RoomCreateFlow({ shelfBooks, onClose }: RoomCreateFlowProps) {
  const navigate = useNavigate()
  const titleId = useId()
  const createRoom = useCreatedRoomStore((state) => state.createRoom)

  const [step, setStep] = useState(0)
  const [query, setQuery] = useState('')
  const [book, setBook] = useState<ShelfBook | null>(null)
  const [name, setName] = useState('')
  const [pages, setPages] = useState('')
  const [goalPreset, setGoalPreset] = useState<number | 'custom' | null>(null)
  const [customGoal, setCustomGoal] = useState('')
  const [password, setPassword] = useState('')
  const [createdRoom, setCreatedRoom] = useState<CreatedRoom | null>(null)
  const [copyMessage, setCopyMessage] = useState('')

  const totalPages = Number(pages)
  const isPagesValid = Number.isInteger(totalPages) && totalPages >= 1 && totalPages <= PAGES_MAX
  const dailyGoal = goalPreset === 'custom' ? Number(customGoal) : (goalPreset ?? 0)
  const isGoalValid =
    Number.isInteger(dailyGoal) && dailyGoal >= 1 && (!isPagesValid || dailyGoal <= totalPages)

  const canGoNext = [
    book !== null,
    name.trim().length > 0 && isPagesValid && isGoalValid,
    password.length === PIN_LENGTH,
  ][step]

  // TODO: 책 검색 API 나오면 전체 책 검색으로 교체 (지금은 내 책장 안에서만 찾기)
  const trimmedQuery = query.trim()
  // 고른 책은 검색어와 안 맞아도 계속 보여줌 (안 보이는 책으로 다음 단계에 가지 않게)
  const visibleBooks = trimmedQuery
    ? shelfBooks.filter(
        (item) => item.id === book?.id || `${item.title} ${item.author}`.includes(trimmedQuery),
      )
    : shelfBooks

  const goNext = (event?: FormEvent) => {
    event?.preventDefault()
    if (!canGoNext || !book) return
    if (step < INPUT_STEPS - 1) {
      setStep(step + 1)
      return
    }
    setCreatedRoom(createRoom({ book, name: name.trim(), totalPages, dailyGoal, password }))
    setStep(INPUT_STEPS)
  }

  const goPrev = () => {
    if (step === 0) onClose()
    else setStep(step - 1)
  }

  const copyInvite = async () => {
    if (!createdRoom) return
    try {
      await navigator.clipboard.writeText(
        `[버들 교환독서] ${createdRoom.name}\n초대코드 ${createdRoom.inviteCode}\n비밀번호 ${createdRoom.password}`,
      )
      setCopyMessage('초대코드와 비밀번호를 복사했어요')
    } catch {
      setCopyMessage('복사하지 못했어요. 초대코드를 직접 적어 보내주세요')
    }
  }

  const closeButton = (
    <button type="button" aria-label="방 만들기 닫기" onClick={onClose} className="flex shrink-0">
      <img src={icCancel} alt="" width={28} height={28} className="size-7" />
    </button>
  )

  // ───────── 완료 ─────────
  if (step === INPUT_STEPS && createdRoom) {
    return (
      <RoomFlowModal labelledBy={titleId} onClose={onClose} mobileVariant="fullscreen">
        <div className="hidden justify-end lg:flex">{closeButton}</div>
        <div className="flex min-h-0 flex-1 flex-col items-center gap-8 overflow-y-auto px-6 pt-[148px] lg:flex-none lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 id={titleId} className="text-m-head-l text-text-default lg:text-w-head-m">
              교환독서가 시작됐어요!
            </h2>
            <p className="text-m-body-l text-text-secondary lg:text-w-body-l">
              초대코드와 비밀번호를 친구와 공유하세요
            </p>
          </div>

          <div className="flex w-full flex-col rounded-3xl bg-green-50">
            <RoomInfoCard
              name={createdRoom.name}
              bookTitle={createdRoom.bookTitle}
              author={createdRoom.author}
              totalPages={createdRoom.totalPages}
              coverUrl={createdRoom.coverUrl}
              memberCount={1}
              maxMembers={MAX_ROOM_MEMBERS}
              className="px-5 pt-6 pb-5"
            />
            <div className="flex items-center gap-3 rounded-2xl bg-surface-green px-5 py-3">
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-m-body-l font-medium text-text-default lg:text-w-body-l lg:font-medium">
                  {createdRoom.inviteCode}
                </p>
                <p className="text-m-caption text-text-secondary lg:text-w-caption">
                  비밀번호 {createdRoom.password}
                </p>
              </div>
              <button
                type="button"
                onClick={copyInvite}
                className="flex h-10 items-center gap-2 rounded-2xl text-m-label-m text-text-secondary lg:text-w-label-m"
              >
                <GroupIcon
                  src={icCopy}
                  className="size-5"
                  insetClassName="inset-[8.33%]"
                  bleedClassName="inset-[-5%]"
                />
                복사하기
              </button>
            </div>
          </div>
          <p role="status" className="text-center text-m-caption text-text-green lg:text-w-caption">
            {copyMessage}
          </p>
        </div>

        <div className="px-6 pt-4 pb-[52px] lg:px-0 lg:pt-2 lg:pb-0">
          <Button
            onClick={() => navigate(`/rooms/${createdRoom.id}`, { replace: true })}
            className="lg:h-14"
          >
            교환독서 시작하기
          </Button>
        </div>
      </RoomFlowModal>
    )
  }

  // ───────── 1~3단계 ─────────
  return (
    <RoomFlowModal labelledBy={titleId} onClose={onClose} mobileVariant="fullscreen">
      <form onSubmit={goNext} className="flex min-h-0 flex-1 flex-col lg:gap-6">
        {/* 모바일 위쪽: 1단계는 닫기, 이후는 뒤로 */}
        <div className="flex h-14 shrink-0 items-center justify-between px-6 lg:hidden">
          {step === 0 ? (
            <>
              <span />
              {closeButton}
            </>
          ) : (
            <button type="button" aria-label="이전 단계" onClick={goPrev} className="flex">
              <img src={icBack} alt="" width={24} height={24} className="size-6" />
            </button>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 pt-3 lg:gap-6 lg:px-0 lg:pt-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 lg:gap-1">
              <h2 id={titleId} className="text-m-head-l text-text-default lg:text-w-head-m">
                {STEP_TEXT[step].title}
              </h2>
              <p className="text-m-body-l text-text-secondary lg:text-w-body-l">
                {STEP_TEXT[step].description}
              </p>
            </div>
            <div className="hidden lg:flex">{closeButton}</div>
          </div>

          {step === 0 && (
            <div className="flex flex-col gap-5">
              <label className="flex h-[52px] items-center gap-2 rounded-2xl bg-surface-gray-light px-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-border-green">
                <MaskIcon src={icSearch} className="size-5 bg-text-weak" />
                <span className="sr-only">책 검색</span>
                <input
                  type="search"
                  name="book-search"
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    // Enter: 바로 걸러지므로 다음 단계로 넘어가지 않게
                    if (event.key === 'Enter') event.preventDefault()
                    // ESC: 검색어만 지우고 창은 닫지 않게 (창은 검색어가 없을 때 ESC로 닫힘)
                    if (event.key === 'Escape' && query) {
                      event.preventDefault()
                      setQuery('')
                    }
                  }}
                  placeholder="함께 읽을 책을 검색하세요"
                  className="min-w-0 flex-1 bg-transparent text-m-body-l font-medium text-text-default outline-none placeholder:text-text-weak lg:text-w-body-l lg:font-medium"
                />
              </label>

              <div className="flex flex-col gap-1">
                <p id={`${titleId}-shelf`} className={labelClassName}>
                  내 책장에서 고르기
                </p>
                {visibleBooks.length === 0 ? (
                  <div className="flex h-[160px] flex-col items-center justify-center gap-1 rounded-2xl bg-surface-gray-light px-6 text-center">
                    <p className="text-m-body-l font-medium text-text-secondary lg:text-w-body-l lg:font-medium">
                      {shelfBooks.length === 0
                        ? '내 책장에 아직 책이 없어요'
                        : `'${trimmedQuery}'에 맞는 책이 내 책장에 없어요`}
                    </p>
                    <p className="text-m-body-m text-text-weak lg:text-w-body-m">
                      {shelfBooks.length === 0
                        ? '위 검색창에서 함께 읽을 책을 찾아보세요.'
                        : '다른 제목이나 저자로 찾아보세요.'}
                    </p>
                  </div>
                ) : (
                  <div
                    role="radiogroup"
                    aria-labelledby={`${titleId}-shelf`}
                    className="flex flex-col gap-2"
                  >
                    {visibleBooks.map((item) => (
                      <BookOption
                        key={item.id}
                        book={item}
                        isSelected={book?.id === item.id}
                        onSelect={() => {
                          // 총 쪽수가 비었거나 이전 책 쪽수 그대로면 새 책 쪽수로 채우기
                          // (직접 고친 값은 유지, 판본이 다르면 고쳐 쓰면 됨)
                          if (!pages || pages === String(book?.totalPages)) {
                            setPages(String(item.totalPages))
                          }
                          setBook(item)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && book && (
            <div className="flex flex-col gap-5">
              <SelectedBookCard book={book} onChange={() => setStep(0)} />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="room-name" className={labelClassName}>
                      방 이름
                    </label>
                    <span className="text-m-label-s text-text-weak lg:text-w-label-s">
                      {name.length}/{NAME_MAX}자
                    </span>
                  </div>
                  <input
                    id="room-name"
                    name="room-name"
                    autoComplete="off"
                    value={name}
                    maxLength={NAME_MAX}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="방 이름을 지정해주세요"
                    className={`${inputClassName} border-border-default focus:border-border-green`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="room-pages" className={labelClassName}>
                    총 쪽수
                  </label>
                  <input
                    id="room-pages"
                    name="room-pages"
                    inputMode="numeric"
                    autoComplete="off"
                    value={pages}
                    onChange={(event) => setPages(onlyDigits(event.target.value).slice(0, 4))}
                    placeholder="총 쪽수를 입력해주세요"
                    aria-invalid={pages !== '' && !isPagesValid}
                    aria-describedby={
                      pages !== '' && !isPagesValid ? 'room-pages-error' : undefined
                    }
                    className={`${inputClassName} ${pages !== '' && !isPagesValid ? 'border-border-error' : 'border-border-default focus:border-border-green'}`}
                  />
                  {pages !== '' && !isPagesValid && (
                    <p
                      id="room-pages-error"
                      className="text-m-caption text-text-error lg:text-w-caption"
                    >
                      1쪽 이상으로 입력해주세요
                    </p>
                  )}
                </div>

                <fieldset className="flex flex-col gap-1">
                  <legend className={`${labelClassName} mb-1`}>하루 목표 분량</legend>
                  <div className="flex gap-1 lg:gap-2">
                    {[...GOAL_PRESETS, 'custom' as const].map((preset) => {
                      const isSelected = goalPreset === preset
                      return (
                        <label
                          key={preset}
                          className={`flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-2xl border-[1.5px] text-m-label-m text-text-secondary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-border-green lg:text-w-label-m ${isSelected ? 'border-border-green bg-green-50' : 'border-border-default bg-surface-white'}`}
                        >
                          <input
                            type="radio"
                            name="daily-goal"
                            checked={isSelected}
                            onChange={() => setGoalPreset(preset)}
                            className="sr-only"
                          />
                          {preset === 'custom' ? '기타' : `${preset}쪽`}
                        </label>
                      )
                    })}
                  </div>
                  {goalPreset === 'custom' && (
                    <>
                      <label htmlFor="room-goal" className="sr-only">
                        하루 목표 쪽수 직접 입력
                      </label>
                      <input
                        id="room-goal"
                        name="room-goal"
                        inputMode="numeric"
                        autoComplete="off"
                        value={customGoal}
                        onChange={(event) =>
                          setCustomGoal(onlyDigits(event.target.value).slice(0, 4))
                        }
                        placeholder="하루에 읽을 쪽수를 입력해주세요"
                        className={`${inputClassName} border-border-default focus:border-border-green`}
                      />
                    </>
                  )}
                  {isPagesValid && dailyGoal > 0 && (
                    <p
                      aria-live="polite"
                      className={`text-m-caption lg:text-w-caption ${isGoalValid ? 'text-text-green' : 'text-text-error'}`}
                    >
                      {isGoalValid
                        ? `하루 ${dailyGoal}쪽씩 읽으면 약 ${Math.ceil(totalPages / dailyGoal)}일 만에 완독할 수 있어요`
                        : `하루 목표는 총 쪽수(${totalPages}쪽)를 넘지 않게 정해주세요`}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>
          )}

          {step === 2 && book && (
            <div className="flex flex-1 flex-col justify-between gap-8">
              <div className="flex flex-col gap-5">
                <SelectedBookCard book={book} onChange={() => setStep(0)} />
                <PinInput label="방 비밀번호 4자리" value={password} onChange={setPassword} />
              </div>
              <ul className="flex flex-col gap-1 py-2">
                {ROOM_RULES.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-center gap-1 text-m-body-m text-text-secondary lg:text-w-body-m"
                  >
                    <img src={icCheckOn} alt="" width={16} height={16} className="size-4" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 px-6 pt-4 pb-[52px] lg:gap-6 lg:px-0 lg:pt-0 lg:pb-0">
          <StepIndicator total={INPUT_STEPS} current={step} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="hidden h-14 flex-1 items-center justify-center rounded-2xl bg-action-white text-w-label-l text-text-secondary lg:flex"
            >
              {step === 0 ? '취소' : '이전'}
            </button>
            <Button type="submit" disabled={!canGoNext} className="lg:flex-1">
              다음
            </Button>
          </div>
        </div>
      </form>
    </RoomFlowModal>
  )
}

export default RoomCreateFlow
