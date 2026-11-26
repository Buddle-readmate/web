import { useId, useState } from 'react'

export const PIN_LENGTH = 4

type PinInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  /** 틀렸을 때 안내 (빨간 글씨) */
  error?: string
}

/**
 * 숫자 4자리 비밀번호 칸
 * 실제 입력은 칸 위에 투명하게 덮은 input 하나로 받고, 칸은 입력 상태만 보여줌
 * (휴대폰 숫자 키패드·붙여넣기·지우기가 그대로 동작)
 */
function PinInput({ label, value, onChange, error }: PinInputProps) {
  const inputId = useId()
  const errorId = useId()
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-m-label-s text-text-secondary lg:text-w-label-s">
        {label}
      </label>
      <div className="relative">
        <div aria-hidden className="flex gap-2">
          {Array.from({ length: PIN_LENGTH }, (_, index) => {
            const isFilled = index < value.length
            const isCurrent =
              isFocused &&
              (index === value.length || (value.length === PIN_LENGTH && index === PIN_LENGTH - 1))
            return (
              <span
                key={index}
                className={`flex h-16 flex-1 items-center justify-center rounded-2xl border-[1.5px] bg-surface-white ${error ? 'border-border-error' : isCurrent ? 'border-border-green' : 'border-border-strong'}`}
              >
                {isFilled ? (
                  <span className="size-3 rounded-full bg-text-weak" />
                ) : (
                  isCurrent && (
                    <span className="h-6 w-0.5 animate-pulse bg-text-default motion-reduce:animate-none" />
                  )
                )}
              </span>
            )
          })}
        </div>
        <input
          id={inputId}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={PIN_LENGTH}
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          // 칸 전체를 덮어 어느 칸을 눌러도 입력되게 (글자·커서는 숨김)
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-m-caption text-text-error lg:text-w-caption">
          {error}
        </p>
      )}
    </div>
  )
}

export default PinInput
