import icChevronDown from '@/assets/icons/ic-chevron-down.svg'

type YearSelectButtonProps = {
  year: number
  onClick: () => void
}

/** 연도 선택 버튼 (모바일: 알약 모양 14px / 웹: 둥근 사각 13px) */
function YearSelectButton({ year, onClick }: YearSelectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${year}년, 연도 선택`}
      className="flex items-center gap-1 rounded-full border-[1.5px] border-border-strong bg-surface-white px-3 py-1.5 text-m-label-s text-text-default lg:rounded-2xl lg:text-w-caption lg:text-text-secondary-brown"
    >
      {year}
      <img src={icChevronDown} alt="" className="size-3.5" />
    </button>
  )
}

export default YearSelectButton
