import { PROFILE_OPTIONS, type ProfileId } from '@/components/signup/signupOptions'

type ProfileSelectorProps = {
  nickname: string
  selected: ProfileId | null
  onSelect: (id: ProfileId) => void
}

function ProfileSelector({ nickname, selected, onSelect }: ProfileSelectorProps) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      {/* 선택한 책짹이 + 닉네임 미리보기 */}
      <div className="flex items-center gap-3 rounded-2xl border-[1.5px] border-border-default bg-surface-gray-light p-4">
        <span className="size-11 shrink-0 rounded-full bg-surface-white" />
        <span className="text-m-body-l font-medium text-text-default lg:text-w-body-l">
          {nickname}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 lg:gap-3">
        {PROFILE_OPTIONS.map((id) => (
          <button
            key={id}
            type="button"
            aria-label={`책짹이 ${id}`}
            aria-pressed={selected === id}
            onClick={() => onSelect(id)}
            className={`aspect-square rounded-2xl border-[1.5px] bg-surface-white ${selected === id ? 'border-border-green' : 'border-border-default'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProfileSelector
