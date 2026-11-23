import icCheckWhite from '@/assets/icons/ic-check-white.svg'
import SheetModal from '@/components/shared/SheetModal'
import type { YearOption } from '@/types/my'

type YearSelectSheetProps = {
  years: YearOption[]
  selected: number
  onSelect: (year: number) => void
  onClose: () => void
}

// 웹 연도 선택 시안은 없어서 모바일 시트 내용을 웹 모달 틀로 보여줌
/** 연도 선택 (기록이 없는 연도는 흐리게) */
function YearSelectSheet({ years, selected, onSelect, onClose }: YearSelectSheetProps) {
  return (
    <SheetModal
      title="연도 선택"
      description="선택한 연도의 독서 통계를 보여줘요"
      onClose={onClose}
    >
      <ul className="flex flex-col gap-2">
        {years.map(({ year, hasRecords }) => {
          const isSelected = year === selected
          return (
            <li key={year} className={hasRecords || isSelected ? '' : 'opacity-60'}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(year)}
                className={`flex w-full items-center gap-3 rounded-2xl border-[1.5px] p-4 ${isSelected ? 'border-border-green bg-surface-green-soft' : 'border-border-strong bg-surface-white'}`}
              >
                <span
                  className={`flex-1 text-left text-m-label-m ${isSelected ? 'text-text-default' : 'text-text-weak'}`}
                >
                  {year}년
                </span>
                {isSelected ? (
                  <span className="flex size-[22px] items-center justify-center rounded-full bg-action-green">
                    <img src={icCheckWhite} alt="" className="size-3" />
                  </span>
                ) : (
                  <span className="size-[22px] rounded-full border-[1.5px] border-action-disabled bg-surface-white" />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </SheetModal>
  )
}

export default YearSelectSheet
