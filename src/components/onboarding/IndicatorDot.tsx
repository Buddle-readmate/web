type IndicatorDotProps = {
  total: number
  current: number
}

function IndicatorDot({ total, current }: IndicatorDotProps) {
  return (
    <div
      role="img"
      aria-label={`${total}단계 중 ${current + 1}단계`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-2 rounded-full ${index === current ? 'w-4 bg-action-green' : 'w-2 bg-surface-gray'}`}
        />
      ))}
    </div>
  )
}

export default IndicatorDot
