import icChevronRight from '@/assets/icons/ic-chevron-right.svg'

type SectionHeaderProps = {
  title: string
  count?: number
  /** 모바일에서는 개수 숨기기 (시안: 모바일 "최근 읽은 책"은 개수 없음) */
  hideCountOnMobile?: boolean
  onMore?: () => void
}

/** "진행 중인 교환독서 3 >" 같은 섹션 제목 */
function SectionHeader({ title, count, hideCountOnMobile, onMore }: SectionHeaderProps) {
  return (
    <button type="button" onClick={onMore} className="flex items-center gap-1 self-start">
      <span className="flex items-center gap-1">
        <span className="text-m-label-l text-text-default lg:text-w-label-l">{title}</span>
        {count !== undefined && (
          <span
            className={`text-w-label-l text-text-green ${hideCountOnMobile ? 'hidden lg:inline' : ''}`}
          >
            {count}
          </span>
        )}
      </span>
      <img src={icChevronRight} alt="" className="size-5" />
    </button>
  )
}

export default SectionHeader
