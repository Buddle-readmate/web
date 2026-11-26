import { useState, type FormEvent } from 'react'
import SheetModal from '@/components/shared/SheetModal'

const CONTENT_MAX = 200

type StoryCreateSheetProps = {
  totalPages: number
  onClose: () => void
  onSubmit: (story: { page: number; content: string }) => void
}

const inputClassName =
  'w-full rounded-2xl border-[1.5px] bg-surface-white px-4 text-m-body-l font-medium text-text-default caret-text-default outline-none placeholder:text-text-weak lg:text-w-body-l lg:font-medium'

/**
 * 새로운 이야기 생성 (모바일: 바텀시트 / 웹: 가운데 모달)
 * 페이지 번호(1~총 쪽수)와 이야기할 내용을 모두 채워야 등록 가능
 */
function StoryCreateSheet({ totalPages, onClose, onSubmit }: StoryCreateSheetProps) {
  const [page, setPage] = useState('')
  const [content, setContent] = useState('')

  const pageNumber = Number(page)
  const isPageValid = Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages
  const hasPageError = page !== '' && !isPageValid
  const canSubmit = isPageValid && content.trim().length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit({ page: pageNumber, content: content.trim() })
  }

  return (
    <SheetModal title="새로운 이야기 생성" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="story-page"
              className="text-m-label-s text-text-secondary lg:text-w-label-s"
            >
              페이지 번호
            </label>
            <input
              id="story-page"
              name="page"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={page}
              // 숫자만 입력
              onChange={(event) => setPage(event.target.value.replace(/\D/g, ''))}
              placeholder="페이지 번호를 입력해주세요"
              aria-invalid={hasPageError}
              aria-describedby={hasPageError ? 'story-page-error' : undefined}
              className={`h-[52px] ${inputClassName} ${hasPageError ? 'border-border-error' : 'border-border-default focus:border-border-green'}`}
            />
            {hasPageError && (
              <p id="story-page-error" className="text-m-caption text-text-error lg:text-w-caption">
                1~{totalPages} 사이의 쪽수를 입력해주세요
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="story-content"
              className="text-m-label-s text-text-secondary lg:text-w-label-s"
            >
              이야기할 내용
            </label>
            <textarea
              id="story-content"
              name="content"
              value={content}
              maxLength={CONTENT_MAX}
              onChange={(event) => setContent(event.target.value)}
              placeholder="예) 가장 오래 머물렀던 문장은 무엇인가요?"
              className={`h-[84px] resize-none py-3 ${inputClassName} border-border-default focus:border-border-green`}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-action-white text-m-label-m text-text-secondary lg:text-w-label-m"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-action-green text-m-label-m text-text-contrast disabled:bg-action-disabled lg:text-w-label-m"
          >
            등록
          </button>
        </div>
      </form>
    </SheetModal>
  )
}

export default StoryCreateSheet
