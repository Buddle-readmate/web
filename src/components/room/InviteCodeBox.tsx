import { useEffect, useState } from 'react'
import icCopy from '@/assets/icons/ic-copy.svg'
import GroupIcon from '@/components/shared/GroupIcon'

type InviteCodeBoxProps = {
  roomName: string
  inviteCode: string
  password: string
}

type CopyState = 'idle' | 'copied' | 'failed'

/** 초대코드 + 비밀번호 + 복사하기 (방 만들기 완료 · 친구 초대) */
function InviteCodeBox({ roomName, inviteCode, password }: InviteCodeBoxProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  // 복사 결과 문구는 잠깐 보여주고 원래대로
  useEffect(() => {
    if (copyState === 'idle') return
    const timer = window.setTimeout(() => setCopyState('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [copyState])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `[버들 교환독서] ${roomName}\n초대코드 ${inviteCode}\n비밀번호 ${password}`,
      )
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-green px-5 py-3">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-m-body-l font-medium text-text-default lg:text-w-body-l lg:font-medium">
          {inviteCode}
        </p>
        <p className="text-m-caption text-text-secondary lg:text-w-caption">비밀번호 {password}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex h-10 shrink-0 items-center gap-2 rounded-2xl text-m-label-m text-text-secondary lg:text-w-label-m"
      >
        <GroupIcon
          src={icCopy}
          className="size-5"
          insetClassName="inset-[8.33%]"
          bleedClassName="inset-[-5%]"
        />
        {copyState === 'copied' ? '복사했어요' : copyState === 'failed' ? '다시 복사' : '복사하기'}
      </button>
      <p role="status" className="sr-only">
        {copyState === 'copied' && '초대코드와 비밀번호를 복사했어요'}
        {copyState === 'failed' && '복사하지 못했어요. 초대코드를 직접 적어 보내주세요'}
      </p>
    </div>
  )
}

export default InviteCodeBox
