import { useId, useState } from 'react'
import { BookOption } from '@/components/room/BookCards'
import RoomFlowModal from '@/components/room/RoomFlowModal'
import type { ShelfBook } from '@/types/room'

type BookChangeDialogProps = {
  books: ShelfBook[]
  /** 지금 방의 책 제목 (처음 선택 표시용) */
  currentTitle: string
  onChange: (book: ShelfBook) => void
  onClose: () => void
}

/** 방 설정: 함께 읽을 책 바꾸기 (내 책장에서 고르기) */
function BookChangeDialog({ books, currentTitle, onChange, onClose }: BookChangeDialogProps) {
  const titleId = useId()
  const [selected, setSelected] = useState<ShelfBook | undefined>(() =>
    books.find((book) => book.title === currentTitle),
  )
  const canChange = selected !== undefined && selected.title !== currentTitle

  return (
    <RoomFlowModal labelledBy={titleId} onClose={onClose} mobileVariant="card">
      <div className="flex min-h-0 flex-col gap-4 lg:gap-6">
        <h2 id={titleId} className="text-m-head-m text-text-default lg:text-w-head-m">
          함께 읽을 책 변경
        </h2>
        {books.length === 0 ? (
          <p className="rounded-2xl bg-surface-gray-light px-6 py-10 text-center text-m-body-m text-text-weak lg:text-w-body-m">
            내 책장에 고를 수 있는 책이 없어요
          </p>
        ) : (
          <div
            role="radiogroup"
            aria-labelledby={titleId}
            className="scrollbar-slim -mx-1 flex max-h-[50dvh] flex-col gap-2 overflow-y-auto px-1 py-1"
          >
            {books.map((book) => (
              <BookOption
                key={book.id}
                book={book}
                isSelected={selected?.id === book.id}
                onSelect={() => setSelected(book)}
              />
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-action-white text-m-label-m text-text-secondary lg:h-14 lg:text-w-label-l"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canChange}
            onClick={() => selected && onChange(selected)}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-action-green text-m-label-m text-text-contrast disabled:bg-action-disabled lg:h-14 lg:text-w-label-l"
          >
            변경
          </button>
        </div>
      </div>
    </RoomFlowModal>
  )
}

export default BookChangeDialog
