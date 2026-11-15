type StepIndicatorProps = {
  total: number
  current: number
}

/** 현재 단계까지 초록색으로 채워지는 진행 바 */
function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className="flex w-full gap-2">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-2 flex-1 rounded-full ${index <= current ? 'bg-border-green' : 'bg-surface-gray'}`}
        />
      ))}
    </div>
  )
}

export default StepIndicator
