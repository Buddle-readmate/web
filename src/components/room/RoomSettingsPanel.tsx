import { useId, useState } from 'react'
import icCancel from '@/assets/icons/ic-cancel.svg'
import { SelectedBookCard } from '@/components/room/BookCards'
import BookChangeDialog from '@/components/room/BookChangeDialog'
import ConfirmDialog from '@/components/room/ConfirmDialog'
import RoomInfoFields from '@/components/room/RoomInfoFields'
import type { RoomInfoEdit } from '@/stores/roomEditStore'
import type { RoomDetail, ShelfBook } from '@/types/room'
import { toGoalPreset, validateRoomInfo, type DailyGoalPreset } from '@/utils/room'

type RoomSettingsPanelProps = {
  room: RoomDetail
  isHost: boolean
  /** 책 변경에서 고를 내 책장 */
  shelfBooks: ShelfBook[]
  onClose: () => void
  /** 방장이 바꾼 값 (올바른 값만, 바뀔 때마다 바로 저장) */
  onSave: (edit: RoomInfoEdit) => void
  onDelete: () => void
  onLeave: () => void
}

type Confirm = 'delete' | 'leave' | null

const CONFIRM_TEXT = {
  delete: {
    title: '독서방을 삭제하시겠어요?',
    description: '독서방에 관련된 모든 기록이 삭제되며, 복구할 수 없어요',
    confirmLabel: '삭제하기',
  },
  leave: {
    title: '독서방에서 나가시겠어요?',
    description: '내가 작성한 모든 기록이 삭제되며, 복구할 수 없어요',
    confirmLabel: '나가기',
  },
  hostLeave: {
    title: '독서방에서 나가시겠어요?',
    description: '방장이 나가면 독서방이 삭제되며, 복구할 수 없어요',
    confirmLabel: '나가기',
  },
}

const bottomButtonClassName =
  'flex h-14 w-full items-center justify-center rounded-2xl border border-border-default bg-action-white text-m-label-l lg:text-w-label-l'

/**
 * 교환독서방 설정 (모바일: 전체 화면 / 웹: 왼쪽 칸)
 * - 방장: 책·방 이름·총 쪽수·하루 목표 수정(바로 저장), 독서방 삭제
 * - 일반 멤버: 보기만 가능, 나가기
 */
function RoomSettingsPanel({
  room,
  isHost,
  shelfBooks,
  onClose,
  onSave,
  onDelete,
  onLeave,
}: RoomSettingsPanelProps) {
  const titleId = useId()
  const [name, setName] = useState(room.name)
  const [pages, setPages] = useState(String(room.totalPages))
  const [goalPreset, setGoalPreset] = useState<DailyGoalPreset | null>(toGoalPreset(room.dailyGoal))
  const [customGoal, setCustomGoal] = useState(
    toGoalPreset(room.dailyGoal) === 'custom' ? String(room.dailyGoal) : '',
  )
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [confirm, setConfirm] = useState<Confirm>(null)

  const myPage = room.members.find((member) => member.id === room.myId)?.readPage ?? 0
  const myPercent = room.totalPages > 0 ? Math.round((myPage / room.totalPages) * 100) : 0
  const currentBook: ShelfBook = {
    id: -1,
    title: room.bookTitle,
    author: room.author,
    coverUrl: room.coverUrl,
    totalPages: room.totalPages,
    status: myPercent >= 100 ? 'done' : 'reading',
    progress: myPercent,
  }

  // 입력이 바뀔 때마다 올바른 값만 바로 저장 (저장 버튼 없는 시안)
  const save = (next: {
    name?: string
    pages?: string
    goalPreset?: DailyGoalPreset | null
    customGoal?: string
  }) => {
    const values = {
      name: next.name ?? name,
      pages: next.pages ?? pages,
      goalPreset: next.goalPreset !== undefined ? next.goalPreset : goalPreset,
      customGoal: next.customGoal ?? customGoal,
    }
    const result = validateRoomInfo(values.name, values.pages, values.goalPreset, values.customGoal)
    const edit: RoomInfoEdit = {}
    if (result.isNameValid) edit.name = values.name.trim()
    if (result.isPagesValid) edit.totalPages = result.totalPages
    if (result.isGoalValid) edit.dailyGoal = result.dailyGoal
    onSave(edit)
  }

  const changeBook = (book: ShelfBook) => {
    // 총 쪽수가 이전 책 쪽수 그대로면 새 책 쪽수로 바꾸기 (직접 고친 값은 유지)
    const nextPages = pages === String(room.totalPages) ? String(book.totalPages) : pages
    setPages(nextPages)
    onSave({ book: { title: book.title, author: book.author, coverUrl: book.coverUrl } })
    save({ pages: nextPages })
    setIsBookDialogOpen(false)
  }

  const confirmText =
    confirm === 'delete'
      ? CONFIRM_TEXT.delete
      : confirm === 'leave'
        ? isHost
          ? CONFIRM_TEXT.hostLeave
          : CONFIRM_TEXT.leave
        : null

  return (
    <section aria-labelledby={titleId} className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between px-6 lg:px-0">
        <h2 id={titleId} className="text-m-head-m text-text-default lg:text-w-head-m">
          설정
        </h2>
        <button type="button" aria-label="설정 닫기" onClick={onClose} className="flex">
          <img src={icCancel} alt="" width={24} height={24} className="size-6 lg:size-7" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-8 overflow-y-auto px-6 pt-3 pb-[52px] lg:px-0 lg:pt-6 lg:pb-10">
        <div className="flex flex-col gap-5">
          <SelectedBookCard
            book={currentBook}
            onChange={isHost ? () => setIsBookDialogOpen(true) : undefined}
          />
          <RoomInfoFields
            name={name}
            onNameChange={(value) => {
              setName(value)
              save({ name: value })
            }}
            pages={pages}
            onPagesChange={(value) => {
              setPages(value)
              save({ pages: value })
            }}
            goalPreset={goalPreset}
            onGoalPresetChange={(value) => {
              setGoalPreset(value)
              save({ goalPreset: value })
            }}
            customGoal={customGoal}
            onCustomGoalChange={(value) => {
              setCustomGoal(value)
              save({ customGoal: value })
            }}
            customLabel="직접"
            disabled={!isHost}
          />
          {!isHost && (
            <p className="text-m-caption text-text-weak lg:text-w-caption">
              방 정보는 방장만 바꿀 수 있어요
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isHost && (
            <button
              type="button"
              onClick={() => setConfirm('delete')}
              // 시안: 모바일은 회색 글씨(아래 나가기가 빨강), 웹은 삭제만 있어서 빨강
              className={`${bottomButtonClassName} text-text-secondary lg:text-text-error`}
            >
              독서방 삭제하기
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirm('leave')}
            className={`${bottomButtonClassName} text-text-error ${isHost ? 'lg:hidden' : ''}`}
          >
            나가기
          </button>
        </div>
      </div>

      {isBookDialogOpen && (
        <BookChangeDialog
          books={shelfBooks}
          currentTitle={room.bookTitle}
          onChange={changeBook}
          onClose={() => setIsBookDialogOpen(false)}
        />
      )}
      {confirmText && (
        <ConfirmDialog
          {...confirmText}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            setConfirm(null)
            // 방장이 나가면 방 삭제와 같음
            if (confirm === 'delete' || isHost) onDelete()
            else onLeave()
          }}
        />
      )}
    </section>
  )
}

export default RoomSettingsPanel
