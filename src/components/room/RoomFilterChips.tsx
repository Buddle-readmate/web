import type { RoomFilter } from '@/types/room'

type RoomFilterChipsProps = {
  value: RoomFilter
  counts: Record<Exclude<RoomFilter, 'all'>, number>
  onChange: (value: RoomFilter) => void
}

const FILTERS: { value: RoomFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'reading', label: '참여중' },
  { value: 'done', label: '완독' },
]

/** 전체 / 참여중 N / 완독 N 필터 칩 */
function RoomFilterChips({ value, counts, onChange }: RoomFilterChipsProps) {
  return (
    <div role="group" aria-label="교환독서 필터" className="flex gap-1 lg:gap-2">
      {FILTERS.map((filter) => {
        const isSelected = filter.value === value
        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(filter.value)}
            className={`rounded-full px-3.5 py-1.5 text-m-label-s lg:px-4 lg:text-w-label-s ${isSelected ? 'bg-action-brown-selected text-text-contrast' : 'bg-action-brown text-text-secondary-brown'}`}
          >
            {filter.label}
            {filter.value !== 'all' && ` ${counts[filter.value]}`}
          </button>
        )
      })}
    </div>
  )
}

export default RoomFilterChips
