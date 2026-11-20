import icRight from '@/assets/icons/ic-right.svg'

type SettingsListProps = {
  yearlyGoal: number
  onGoalClick: () => void
  className?: string
}

// TODO: 알림 설정 화면·로그아웃 확인 시안 나오면 연결
/** 알림 설정 · 독서 목표 · 로그아웃 (모바일: 둥근 카드 / 웹: 프로필 카드 아래 목록) */
function SettingsList({ yearlyGoal, onGoalClick, className = '' }: SettingsListProps) {
  const rows = [
    { label: '알림 설정', value: '새 이야기 · 답글', onClick: undefined, weak: false },
    { label: '독서 목표', value: `연 ${yearlyGoal}권`, onClick: onGoalClick, weak: false },
    { label: '로그아웃', value: '', onClick: undefined, weak: true },
  ]

  return (
    <ul className={className}>
      {rows.map(({ label, value, onClick, weak }, index) => (
        <li
          key={label}
          className={
            index > 0
              ? 'border-t-[1.5px] border-border-strong'
              : 'lg:border-t-[1.5px] lg:border-border-strong'
          }
        >
          <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between py-4"
          >
            <span
              className={`text-m-label-s lg:text-w-label-s ${weak ? 'text-text-weak' : 'text-text-default'}`}
            >
              {label}
            </span>
            <span className="flex items-center gap-1 text-m-caption text-text-weak lg:text-w-caption">
              {value}
              <img src={icRight} alt="" className="size-4" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default SettingsList
