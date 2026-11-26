import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import icCancel from '@/assets/icons/ic-cancel.svg'
import { RoomInfoCard } from '@/components/room/BookCards'
import PinInput, { PIN_LENGTH } from '@/components/room/PinInput'
import RoomFlowModal from '@/components/room/RoomFlowModal'
import { normalizeInviteCode } from '@/stores/createdRoomStore'
import type { JoinableRoom } from '@/types/room'

type RoomJoinFlowProps = {
  /** 초대코드로 찾을 수 있는 방 목록 (API 연동 전 더미) */
  rooms: JoinableRoom[]
  onClose: () => void
}

const secondaryButtonClassName =
  'flex h-12 flex-1 items-center justify-center rounded-2xl bg-action-white text-m-label-m text-text-secondary lg:h-14 lg:text-w-label-l'
const primaryButtonClassName =
  'flex h-12 shrink-0 items-center justify-center rounded-2xl bg-action-green px-7 text-m-label-m text-text-contrast disabled:bg-action-disabled lg:h-14 lg:flex-1 lg:text-w-label-l'

/**
 * 코드로 참가하기 (모바일: 가운데 카드 / 웹: 가운데 모달)
 * 1 초대코드 입력 → 2 방 정보 확인 + 비밀번호 4자리
 */
function RoomJoinFlow({ rooms, onClose }: RoomJoinFlowProps) {
  const navigate = useNavigate()
  const titleId = useId()

  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [room, setRoom] = useState<JoinableRoom | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // TODO: 초대코드 확인·참가 API 연동 (지금은 더미 방 목록에서 찾기)
  const submitCode = (event: FormEvent) => {
    event.preventDefault()
    const found = rooms.find((item) => item.code === normalizeInviteCode(code))
    if (!found) {
      setCodeError('초대코드를 다시 확인해주세요')
      return
    }
    if (found.memberCount >= found.maxMembers) {
      setCodeError(`인원이 가득 찬 방이에요 (최대 ${found.maxMembers}명)`)
      return
    }
    setRoom(found)
  }

  const submitPassword = (event: FormEvent) => {
    event.preventDefault()
    if (!room) return
    if (password !== room.password) {
      setPassword('')
      setPasswordError('비밀번호가 맞지 않아요. 다시 입력해주세요')
      return
    }
    navigate(`/rooms/${room.roomId}`, { replace: true })
  }

  const goBackToCode = () => {
    setRoom(null)
    setPassword('')
    setPasswordError('')
  }

  return (
    <RoomFlowModal labelledBy={titleId} onClose={onClose} mobileVariant="card">
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-m-head-m text-text-default lg:text-w-head-m">
            코드로 참가하기
          </h2>
          <button type="button" aria-label="참가하기 닫기" onClick={onClose} className="flex">
            <img src={icCancel} alt="" width={24} height={24} className="size-6 lg:size-7" />
          </button>
        </div>

        {room ? (
          <form onSubmit={submitPassword} className="flex flex-col gap-4 lg:gap-6">
            <div className="flex flex-col gap-3 lg:gap-6">
              <RoomInfoCard
                name={room.name}
                bookTitle={room.bookTitle}
                author={room.author}
                totalPages={room.totalPages}
                coverUrl={room.coverUrl}
                memberCount={room.memberCount}
                maxMembers={room.maxMembers}
              />
              <PinInput
                label="방 비밀번호 4자리"
                value={password}
                onChange={(next) => {
                  setPassword(next)
                  if (passwordError) setPasswordError('')
                }}
                error={passwordError}
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={goBackToCode} className={secondaryButtonClassName}>
                이전
              </button>
              <button
                type="submit"
                disabled={password.length !== PIN_LENGTH}
                className={primaryButtonClassName}
              >
                확인
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitCode} className="flex flex-col gap-4 lg:gap-6">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="join-code"
                className="text-m-label-s text-text-secondary lg:text-w-label-s"
              >
                초대코드
              </label>
              <input
                id="join-code"
                name="join-code"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={code}
                maxLength={12}
                onChange={(event) => {
                  setCode(event.target.value.toUpperCase())
                  if (codeError) setCodeError('')
                }}
                placeholder="공유받은 코드를 입력해주세요"
                aria-invalid={Boolean(codeError)}
                aria-describedby={codeError ? 'join-code-error' : undefined}
                className={`h-[52px] w-full rounded-2xl border-[1.5px] bg-surface-white px-4 text-m-body-l font-medium text-text-default caret-text-default outline-none placeholder:text-text-weak lg:text-w-body-l lg:font-medium ${codeError ? 'border-border-error' : 'border-border-default focus:border-border-green'}`}
              />
              {codeError && (
                <p
                  id="join-code-error"
                  role="alert"
                  className="text-m-caption text-text-error lg:text-w-caption"
                >
                  {codeError}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className={secondaryButtonClassName}>
                취소
              </button>
              <button
                type="submit"
                disabled={normalizeInviteCode(code).length === 0}
                className={primaryButtonClassName}
              >
                다음
              </button>
            </div>
          </form>
        )}
      </div>
    </RoomFlowModal>
  )
}

export default RoomJoinFlow
