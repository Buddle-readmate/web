import icChevronRight16 from '@/assets/icons/ic-chevron-right-16.svg'
import type { SortOrder } from '@/utils/room'

type StoryToolbarProps = {
  showUnread: boolean
  onShowUnreadChange: (value: boolean) => void
  sort: SortOrder
  onSortChange: (value: SortOrder) => void
}

/** 읽지 않은 범위 표시 스위치 + 내림차순/오름차순 */
function StoryToolbar({ showUnread, onShowUnreadChange, sort, onSortChange }: StoryToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        role="switch"
        aria-checked={showUnread}
        onClick={() => onShowUnreadChange(!showUnread)}
        className="flex h-6 items-center gap-2 text-m-body-m font-medium text-text-secondary lg:h-10 lg:text-w-body-m lg:font-medium"
      >
        <span
          aria-hidden
          className={`flex h-5 w-8 items-center rounded-full p-0.5 transition-colors motion-reduce:transition-none ${showUnread ? 'bg-border-green' : 'bg-action-disabled'}`}
        >
          <span
            className={`size-4 rounded-full bg-surface-white transition-transform motion-reduce:transition-none ${showUnread ? 'translate-x-3' : 'translate-x-0'}`}
          />
        </span>
        읽지 않은 범위 표시
      </button>

      <button
        type="button"
        onClick={() => onSortChange(sort === 'desc' ? 'asc' : 'desc')}
        aria-label={`정렬: ${sort === 'desc' ? '내림차순' : '오름차순'} (눌러서 바꾸기)`}
        className="flex h-6 items-center gap-1 rounded-md text-m-body-m font-medium text-text-secondary lg:h-10 lg:text-w-body-m lg:font-medium"
      >
        {sort === 'desc' ? '내림차순' : '오름차순'}
        <img
          src={icChevronRight16}
          alt=""
          width={16}
          height={16}
          className={`size-4 ${sort === 'desc' ? 'rotate-90' : '-rotate-90'}`}
        />
      </button>
    </div>
  )
}

export default StoryToolbar
