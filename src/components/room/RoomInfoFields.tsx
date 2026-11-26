import {
  DAILY_GOAL_PRESETS,
  onlyDigits,
  ROOM_NAME_MAX,
  validateRoomInfo,
  type DailyGoalPreset,
} from '@/utils/room'

const roomInputClassName =
  'h-[52px] w-full rounded-2xl border-[1.5px] bg-surface-white px-4 text-m-body-l font-medium text-text-default caret-text-default outline-none placeholder:text-text-weak disabled:text-text-secondary lg:text-w-body-l lg:font-medium'

const roomLabelClassName = 'text-m-label-s text-text-secondary lg:text-w-label-s'

type RoomInfoFieldsProps = {
  name: string
  onNameChange: (value: string) => void
  pages: string
  onPagesChange: (value: string) => void
  goalPreset: DailyGoalPreset | null
  onGoalPresetChange: (value: DailyGoalPreset) => void
  customGoal: string
  onCustomGoalChange: (value: string) => void
  /** 직접 입력 칩 이름 (방 만들기: 기타 / 설정: 직접) */
  customLabel: string
  /** 일반 멤버 설정: 보기만 가능 */
  disabled?: boolean
}

/** 방 이름 + 총 쪽수 + 하루 목표 분량 (방 만들기 2단계 · 방 설정) */
function RoomInfoFields({
  name,
  onNameChange,
  pages,
  onPagesChange,
  goalPreset,
  onGoalPresetChange,
  customGoal,
  onCustomGoalChange,
  customLabel,
  disabled = false,
}: RoomInfoFieldsProps) {
  const { totalPages, dailyGoal, isPagesValid, isGoalValid } = validateRoomInfo(
    name,
    pages,
    goalPreset,
    customGoal,
  )
  const hasPagesError = pages !== '' && !isPagesValid
  const fieldClassName = `${roomInputClassName} border-border-default focus:border-border-green`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label htmlFor="room-name" className={roomLabelClassName}>
            방 이름
          </label>
          <span className="text-m-label-s text-text-weak lg:text-w-label-s">
            {name.length}/{ROOM_NAME_MAX}자
          </span>
        </div>
        <input
          id="room-name"
          name="room-name"
          autoComplete="off"
          value={name}
          maxLength={ROOM_NAME_MAX}
          disabled={disabled}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="방 이름을 지정해주세요"
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="room-pages" className={roomLabelClassName}>
          총 쪽수
        </label>
        <input
          id="room-pages"
          name="room-pages"
          inputMode="numeric"
          autoComplete="off"
          value={pages}
          disabled={disabled}
          onChange={(event) => onPagesChange(onlyDigits(event.target.value).slice(0, 4))}
          placeholder="총 쪽수를 입력해주세요"
          aria-invalid={hasPagesError}
          aria-describedby={hasPagesError ? 'room-pages-error' : undefined}
          className={hasPagesError ? `${roomInputClassName} border-border-error` : fieldClassName}
        />
        {hasPagesError && (
          <p id="room-pages-error" className="text-m-caption text-text-error lg:text-w-caption">
            1쪽 이상으로 입력해주세요
          </p>
        )}
      </div>

      <fieldset disabled={disabled} className="flex flex-col gap-1">
        <legend className={`${roomLabelClassName} mb-1`}>하루 목표 분량</legend>
        <div className="flex gap-1 lg:gap-2">
          {[...DAILY_GOAL_PRESETS, 'custom' as const].map((preset) => {
            const isSelected = goalPreset === preset
            return (
              <label
                key={preset}
                className={`flex h-[52px] flex-1 items-center justify-center rounded-2xl border-[1.5px] text-m-label-m text-text-secondary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-border-green lg:text-w-label-m ${disabled ? '' : 'cursor-pointer'} ${isSelected ? 'border-border-green bg-green-50' : 'border-border-default bg-surface-white'}`}
              >
                <input
                  type="radio"
                  name="daily-goal"
                  checked={isSelected}
                  onChange={() => onGoalPresetChange(preset)}
                  className="sr-only"
                />
                {preset === 'custom' ? customLabel : `${preset}쪽`}
              </label>
            )
          })}
        </div>
        {goalPreset === 'custom' && (
          <>
            <label htmlFor="room-goal" className="sr-only">
              하루 목표 쪽수 직접 입력
            </label>
            <input
              id="room-goal"
              name="room-goal"
              inputMode="numeric"
              autoComplete="off"
              value={customGoal}
              onChange={(event) => onCustomGoalChange(onlyDigits(event.target.value).slice(0, 4))}
              placeholder="하루에 읽을 쪽수를 입력해주세요"
              className={fieldClassName}
            />
          </>
        )}
        {isPagesValid && dailyGoal > 0 && (
          <p
            aria-live="polite"
            className={`text-m-caption lg:text-w-caption ${isGoalValid ? 'text-text-green' : 'text-text-error'}`}
          >
            {isGoalValid
              ? `하루 ${dailyGoal}쪽씩 읽으면 약 ${Math.ceil(totalPages / dailyGoal)}일 만에 완독할 수 있어요`
              : `하루 목표는 총 쪽수(${totalPages}쪽)를 넘지 않게 정해주세요`}
          </p>
        )}
      </fieldset>
    </div>
  )
}

export default RoomInfoFields
