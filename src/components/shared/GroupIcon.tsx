type GroupIconProps = {
  src: string
  /** 아이콘 칸 크기 (예: size-5) */
  className?: string
  /** 칸 안에서 그림이 놓이는 여백 (피그마 Group inset) */
  insetClassName: string
  /** 선 두께만큼 그림을 바깥으로 넓히는 값 (피그마 Group 안쪽 inset) */
  bleedClassName: string
}

/**
 * 피그마에서 여백 없이 잘려 나온 아이콘(Group)을 원래 칸 안 위치에 그대로 놓기
 * 예: 자물쇠·설정·멤버 아이콘
 */
function GroupIcon({ src, className = '', insetClassName, bleedClassName }: GroupIconProps) {
  return (
    <span aria-hidden className={`relative inline-block shrink-0 overflow-hidden ${className}`}>
      <span className={`absolute ${insetClassName}`}>
        <span className={`absolute ${bleedClassName}`}>
          <img src={src} alt="" className="block size-full max-w-none" />
        </span>
      </span>
    </span>
  )
}

export default GroupIcon
