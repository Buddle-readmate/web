import { useState } from 'react'
import Button from '@/components/shared/Button'
import SheetModal from '@/components/shared/SheetModal'
import CharacterAvatar from '@/components/my/CharacterAvatar'
import { NICKNAME_MAX } from '@/components/signup/signupOptions'

type ProfileEditSheetProps = {
  nickname: string
  yearlyGoal: number
  finishedThisYear: number
  onSave: (profile: { nickname: string; yearlyGoal: number }) => void
  onClose: () => void
}

// TODO: 캐릭터 변경·회원 탈퇴 화면 시안 나오면 연결
/** 프로필 편집 (모바일: 바텀시트 / 웹: 가운데 모달) */
function ProfileEditSheet({
  nickname: initialNickname,
  yearlyGoal: initialGoal,
  finishedThisYear,
  onSave,
  onClose,
}: ProfileEditSheetProps) {
  const [nickname, setNickname] = useState(initialNickname)
  const [goal, setGoal] = useState(String(initialGoal))

  const handleSave = () => {
    // TODO: 닉네임·목표 검사 안내 시안 나오면 추가 (지금은 저장만 막음)
    if (nickname.trim().length < 2 || Number(goal) < 1) return
    onSave({ nickname: nickname.trim(), yearlyGoal: Number(goal) })
  }

  const labelClass = 'text-m-label-s text-text-secondary lg:text-w-label-s'
  const inputBoxClass =
    'flex h-[52px] items-center gap-3 rounded-2xl border-[1.5px] border-border-default bg-surface-white px-4 lg:h-auto lg:border-border-strong lg:p-4'
  const inputClass =
    'bg-transparent text-m-body-l font-medium text-text-default outline-none lg:text-w-body-m lg:font-normal'

  return (
    <SheetModal
      title="프로필 편집"
      description={
        <>
          다른 독자에게 보여지는 내 정보를 수정해요<span className="hidden lg:inline">.</span>
        </>
      }
      onClose={onClose}
    >
      <div className="flex flex-col items-center gap-2 lg:gap-3">
        <CharacterAvatar className="size-20 bg-gray-200 lg:size-24 lg:bg-surface-green-soft" />
        <button
          type="button"
          className="text-m-label-s text-text-secondary lg:text-w-caption lg:text-text-default"
        >
          캐릭터 변경
        </button>
      </div>

      <div className="flex flex-col gap-2 lg:gap-3">
        <div className="flex items-center justify-between">
          <label htmlFor="profile-nickname" className={labelClass}>
            닉네임
          </label>
          <span className="text-m-label-s text-text-weak lg:hidden">
            {nickname.length}/{NICKNAME_MAX}
          </span>
        </div>
        <div className={inputBoxClass}>
          <input
            id="profile-nickname"
            type="text"
            value={nickname}
            maxLength={NICKNAME_MAX}
            onChange={(event) => setNickname(event.target.value)}
            autoComplete="off"
            className={`min-w-0 flex-1 ${inputClass}`}
          />
          <span className="hidden text-w-caption text-text-weak lg:inline">
            {nickname.length}/{NICKNAME_MAX}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:gap-3">
        <label htmlFor="profile-goal" className={labelClass}>
          연간 독서 목표
        </label>
        <div className={inputBoxClass}>
          {/* 모바일: '30권'처럼 숫자 바로 뒤에 단위 / 웹: 단위를 오른쪽 끝에 */}
          <input
            id="profile-goal"
            type="text"
            inputMode="numeric"
            value={goal}
            onChange={(event) => setGoal(event.target.value.replace(/\D/g, '').slice(0, 3))}
            className={`min-w-4 [field-sizing:content] lg:flex-1 lg:[field-sizing:fixed] ${inputClass}`}
          />
          <span className="-ml-3 text-m-body-l font-medium text-text-default lg:ml-0 lg:text-w-body-m lg:font-medium lg:text-text-secondary">
            권
          </span>
        </div>
        <p className="text-m-caption text-text-weak lg:text-w-caption">
          올해 {finishedThisYear}권을 읽었어요. 목표를 바꾸면
          <span className="hidden lg:inline"> 마이페이지</span> 진행률이 다시 계산돼요
          <span className="hidden lg:inline">.</span>
        </p>
      </div>

      {/* 모바일: 저장하기 + 회원 탈퇴 아래 / 웹: 회원 탈퇴 왼쪽, 취소·저장하기 오른쪽 */}
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:pt-3">
        <Button onClick={handleSave} className="lg:hidden">
          저장하기
        </Button>
        <button type="button" className="text-m-caption text-text-weak lg:text-w-caption">
          회원 탈퇴
        </button>
        <div className="hidden gap-3 lg:flex">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border-[1.5px] border-border-strong bg-surface-white px-6 py-3.5 text-w-label-s text-text-default"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-action-green px-6 py-3.5 text-w-label-s text-text-contrast"
          >
            저장하기
          </button>
        </div>
      </div>
    </SheetModal>
  )
}

export default ProfileEditSheet
