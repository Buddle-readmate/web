import chakjjaki from '@/assets/characters/chakjjaki-placeholder.svg'

type CharacterAvatarProps = {
  /** 원 크기·배경 (예: 'size-24 bg-gray-200') */
  className?: string
}

// TODO: 책짹이 캐릭터 이미지 나오면 선택한 캐릭터로 교체 (지금은 시안의 placeholder)
/** 동그란 배경 안의 책짹이. 캐릭터는 원 지름의 약 45% (시안 96px 원 → 43.5px) */
function CharacterAvatar({ className = '' }: CharacterAvatarProps) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full ${className}`}>
      <img src={chakjjaki} alt="" className="h-[51.4%] w-[45.3%]" />
    </span>
  )
}

export default CharacterAvatar
