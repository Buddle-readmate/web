import { useEffect, useId, useRef, useState } from 'react'
import icClose from '@/assets/icons/ic-close.svg'
import icCoverCheck from '@/assets/icons/ic-cover-check.svg'
import Button from '@/components/shared/Button'
import type { ExchangeBook, NewReadingRecord } from '@/types/calendar'
import { formatDateLabel } from '@/utils/calendar'

const MEMO_MAX = 100

type RecordAddSheetProps = {
  dateKey: string
  books: ExchangeBook[]
  onSave: (record: NewReadingRecord) => void
  onClose: () => void
}

type PageInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function PageInput({ label, value, onChange }: PageInputProps) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border-[1.5px] border-border-strong bg-surface-white px-4 py-3.5 lg:p-4">
      <span className="sr-only">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 5))}
        className="w-full min-w-0 bg-transparent text-m-body-l text-text-default outline-none lg:text-w-body-m"
      />
      <span className="shrink-0 text-m-body-m font-medium text-text-secondary lg:text-w-body-m lg:font-medium">
        쪽
      </span>
    </label>
  )
}

/**
 * 이 날 기록 추가
 * - 모바일: 아래에서 올라오는 바텀시트
 * - 웹(lg): 화면 가운데 모달 560px (취소 / 기록 저장)
 * 닫기: X 버튼 / ESC / 바깥 영역 클릭
 */
function RecordAddSheet({ dateKey, books, onSave, onClose }: RecordAddSheetProps) {
  const titleId = useId()
  const onCloseRef = useRef(onClose)
  const [bookId, setBookId] = useState(books[0]?.id)
  const [startPage, setStartPage] = useState('')
  const [endPage, setEndPage] = useState('')
  const [memo, setMemo] = useState('')

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 열려 있는 동안 뒤 화면 스크롤 막기 + ESC로 닫기
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const book = books.find((item) => item.id === bookId)
  const start = Number(startPage)
  const end = Number(endPage)
  // TODO: 잘못 입력했을 때 안내 문구·버튼 상태는 시안 나오면 추가 (지금은 저장만 막음)
  const canSave =
    Boolean(book) &&
    startPage !== '' &&
    endPage !== '' &&
    start >= 1 &&
    end >= start &&
    (!book || end <= book.totalPages)

  const handleSave = () => {
    if (!book || !canSave) return
    onSave({
      date: dateKey,
      book: { id: book.id, title: book.title, coverUrl: book.coverUrl },
      startPage: start,
      endPage: end,
      memo: memo.trim(),
    })
  }

  const labelClass = 'text-m-label-s text-text-secondary lg:text-w-label-s'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-gray-900/50 lg:items-center lg:justify-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-24px)] w-full flex-col gap-5 overflow-y-auto rounded-t-3xl bg-surface-page px-6 pt-3 pb-[52px] lg:max-h-[calc(100dvh-64px)] lg:w-[560px] lg:gap-6 lg:rounded-2xl lg:p-8 lg:shadow-[0_24px_60px_0_rgb(51_51_46/0.18)]"
      >
        <div className="flex justify-center lg:hidden">
          <span className="h-1 w-[84px] rounded-xl bg-[rgb(200_200_184/0.41)]" />
        </div>

        <header className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5 lg:gap-1">
            <h2 id={titleId} className="text-m-head-m text-text-default lg:text-w-head-m">
              이 날 기록 추가
            </h2>
            <p className="text-m-body-m text-text-secondary lg:text-w-body-m">
              {formatDateLabel(dateKey)}
            </p>
          </div>
          <button type="button" aria-label="닫기" onClick={onClose}>
            <img src={icClose} alt="" className="size-6" />
          </button>
        </header>

        <fieldset className="flex min-w-0 flex-col gap-2.5 lg:gap-3">
          <legend className="mb-2.5 flex items-center gap-1.5 lg:mb-3 lg:gap-2">
            <span className={labelClass}>책</span>
            <span className="text-m-caption text-text-weak lg:text-w-caption">
              진행 중인 교환독서에서 골라요
            </span>
          </legend>
          <div className="-mx-6 flex gap-2.5 overflow-x-auto px-6 [scrollbar-width:none] lg:mx-0 lg:gap-3 lg:px-0 [&::-webkit-scrollbar]:hidden">
            {books.map((item) => {
              const selected = item.id === bookId
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`${item.title} (${item.roomName})`}
                  aria-pressed={selected}
                  onClick={() => setBookId(item.id)}
                  className={`relative h-20 w-14 shrink-0 overflow-hidden rounded bg-surface-brown lg:h-[92px] lg:w-16 ${selected ? 'border-[2.5px] border-action-green' : ''}`}
                >
                  {item.coverUrl && (
                    <img
                      src={item.coverUrl}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                  {selected ? (
                    <img
                      src={icCoverCheck}
                      alt=""
                      className="absolute -top-px -right-px size-[21.6px] lg:-top-0.5 lg:-right-0.5 lg:size-6"
                    />
                  ) : (
                    <span className="absolute inset-0 bg-surface-white/45" />
                  )}
                </button>
              )
            })}
          </div>
          {book && (
            <p className="text-m-caption text-text-secondary lg:text-w-caption">
              {book.roomName} · {book.title} · 총 {book.totalPages}쪽
            </p>
          )}
        </fieldset>

        <fieldset className="flex min-w-0 flex-col gap-2.5 lg:gap-3">
          <legend className={`mb-2.5 lg:mb-3 ${labelClass}`}>읽은 페이지</legend>
          <div className="flex items-center gap-2.5 lg:gap-3">
            <PageInput label="시작 쪽" value={startPage} onChange={setStartPage} />
            <span className="text-m-body-m font-medium text-text-weak lg:text-w-body-m lg:font-medium">
              ~
            </span>
            <PageInput label="끝 쪽" value={endPage} onChange={setEndPage} />
          </div>
        </fieldset>

        <div className="flex flex-col gap-2.5 lg:gap-3">
          <label htmlFor="record-memo" className={labelClass}>
            한 줄 메모
          </label>
          <div className="flex h-24 flex-col justify-between rounded-2xl border-[1.5px] border-border-strong bg-surface-white px-4 py-3.5 lg:h-[108px] lg:p-4">
            <textarea
              id="record-memo"
              value={memo}
              maxLength={MEMO_MAX}
              onChange={(event) => setMemo(event.target.value.replace(/\n/g, ''))}
              rows={1}
              className="w-full flex-1 resize-none bg-transparent text-m-body-l text-text-default outline-none lg:text-w-body-m"
            />
            <span className="text-m-caption text-text-weak lg:text-w-caption">
              {memo.length}/{MEMO_MAX}
            </span>
          </div>
        </div>

        <Button onClick={handleSave} className="lg:hidden">
          기록 저장
        </Button>
        <div className="hidden justify-end gap-3 lg:flex">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border-[1.5px] border-border-strong bg-surface-white px-6 py-3.5 text-w-label-s text-text-default"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-action-green px-6 py-3.5 text-w-label-s text-text-contrast"
          >
            기록 저장
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecordAddSheet
