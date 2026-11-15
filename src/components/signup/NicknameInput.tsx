import { NICKNAME_MAX, NICKNAME_MIN } from '@/components/signup/signupOptions'

type NicknameInputProps = {
  value: string
  onChange: (value: string) => void
}

function NicknameInput({ value, onChange }: NicknameInputProps) {
  const hasError = value.length > 0 && value.length < NICKNAME_MIN

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-m-label-s lg:text-w-label-s">
        <label htmlFor="nickname" className="text-text-secondary">
          닉네임
        </label>
        <span className="text-text-weak">
          {value.length}/{NICKNAME_MAX}자
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <input
          id="nickname"
          type="text"
          value={value}
          maxLength={NICKNAME_MAX}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`${NICKNAME_MIN}자 이상 입력해주세요`}
          aria-invalid={hasError}
          aria-describedby={hasError ? 'nickname-error' : undefined}
          autoComplete="off"
          className={`h-[52px] w-full rounded-2xl border-[1.5px] bg-surface-white px-4 text-m-body-l font-medium text-text-default caret-text-default outline-none placeholder:text-text-weak lg:text-w-body-l ${hasError ? 'border-border-error' : 'border-border-default focus:border-border-green'}`}
        />
        {hasError && (
          <p id="nickname-error" className="text-m-caption text-text-error lg:text-w-caption">
            {NICKNAME_MIN}자 이상 입력해주세요
          </p>
        )}
      </div>
    </div>
  )
}

export default NicknameInput
