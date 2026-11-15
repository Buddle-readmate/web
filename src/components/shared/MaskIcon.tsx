type MaskIconProps = {
  src: string
  className?: string
}

/**
 * SVG 모양만 가져오고 색은 배경색(bg-*)으로 칠하는 아이콘
 * 선택 상태에 따라 색이 바뀌는 아이콘(하단 탭 등)에 사용
 */
function MaskIcon({ src, className = '' }: MaskIconProps) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{
        maskImage: `url("${src}")`,
        maskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskImage: `url("${src}")`,
        WebkitMaskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  )
}

export default MaskIcon
