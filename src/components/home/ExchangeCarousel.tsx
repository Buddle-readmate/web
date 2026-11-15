import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react'
import ExchangeCard from '@/components/home/ExchangeCard'
import type { ExchangeRoom } from '@/types/home'

const AUTO_SLIDE_INTERVAL = 5000
/** 이만큼(px) 이상 끌거나 옆으로 밀면 다음/이전 카드로 */
const SWIPE_THRESHOLD = 60
/** 트랙패드 관성 때문에 한 번 밀었을 때 여러 장 넘어가지 않도록 잠시 막는 시간 */
const WHEEL_LOCK_TIME = 600
/** 트랙패드를 이 시간 동안 안 밀면 쌓인 이동량 초기화 (작은 흔들림이 쌓여 넘어가는 것 방지) */
const WHEEL_IDLE_RESET = 200

/** 처음 ↔ 끝이 이어지도록 다음/이전 위치 계산 */
const wrapIndex = (index: number, direction: number, count: number) =>
  (((index + direction) % count) + count) % count

/** "동작 줄이기" 설정 여부 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReduced(query.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])
  return reduced
}

type ExchangeCarouselProps = {
  rooms: ExchangeRoom[]
}

/**
 * 웹 교환독서 카드 넘기기
 * - 5초마다 자동으로 다음 카드
 *   (마우스를 올려두거나, 끄는 중이거나, 키보드로 점에 포커스했거나, "동작 줄이기"면 멈춤)
 * - 마우스로 끌기 / 트랙패드 좌우 밀기 / 아래 점 클릭으로 넘기기
 */
function ExchangeCarousel({ rooms }: ExchangeCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [keyboardFocused, setKeyboardFocused] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const count = rooms.length
  // 방 개수가 줄어도 범위를 벗어나지 않게
  const activeIndex = count > 0 ? current % count : 0
  const canSlide = count > 1
  const autoPlay = canSlide && !reducedMotion && !hovered && !keyboardFocused && !isDragging

  const move = (direction: 1 | -1) =>
    setCurrent((prev) => wrapIndex(prev % count, direction, count))

  // 5초마다 다음 카드로. 직접 넘기면 그때부터 다시 5초
  useEffect(() => {
    if (!autoPlay) return
    const timer = setTimeout(
      () => setCurrent(wrapIndex(activeIndex, 1, count)),
      AUTO_SLIDE_INTERVAL,
    )
    return () => clearTimeout(timer)
  }, [activeIndex, autoPlay, count])

  // 트랙패드·가로 휠로 넘기기 (브라우저 뒤로가기 제스처를 막아야 해서 passive: false 로 직접 등록)
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !canSlide) return
    let accumulated = 0
    let locked = false
    let unlockTimer: ReturnType<typeof setTimeout>
    let idleTimer: ReturnType<typeof setTimeout>

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return // 세로 스크롤은 그대로
      event.preventDefault()
      if (locked) return

      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => (accumulated = 0), WHEEL_IDLE_RESET)
      accumulated += event.deltaX
      if (Math.abs(accumulated) < SWIPE_THRESHOLD) return

      const direction = accumulated > 0 ? 1 : -1
      setCurrent((prev) => wrapIndex(prev % count, direction, count))
      accumulated = 0
      locked = true
      unlockTimer = setTimeout(() => (locked = false), WHEEL_LOCK_TIME)
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      viewport.removeEventListener('wheel', handleWheel)
      clearTimeout(unlockTimer)
      clearTimeout(idleTimer)
    }
  }, [canSlide, count])

  // 실제 마우스일 때만 "올려둠"으로 처리 (터치는 떼도 leave가 안 와서 계속 멈춰버림)
  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovered(true)
  }
  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovered(false)
  }

  // 키보드(Tab)로 점에 포커스했을 때만 멈춤. 마우스 클릭으로 옮겨간 포커스면 다시 재생
  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    setKeyboardFocused(event.target.matches(':focus-visible'))
  }
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocused(false)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canSlide || event.button !== 0) return
    dragStartX.current = event.clientX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setDragOffset(event.clientX - dragStartX.current)
  }

  const resetDrag = () => {
    setDragOffset(0)
    setIsDragging(false)
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    if (dragOffset <= -SWIPE_THRESHOLD) move(1)
    else if (dragOffset >= SWIPE_THRESHOLD) move(-1)
    resetDrag()
  }

  return (
    <div
      className="flex flex-col items-center gap-4"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        // 브라우저가 세로 스크롤로 가져가며 취소된 경우엔 넘기지 않고 제자리로
        onPointerCancel={resetDrag}
        className={`w-full touch-pan-y overflow-hidden select-none ${canSlide ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
      >
        <ul
          className={`flex [&_img]:pointer-events-none ${isDragging ? '' : 'transition-transform duration-500 ease-out motion-reduce:transition-none'}`}
          style={{ transform: `translateX(calc(${-activeIndex * 100}% + ${dragOffset}px))` }}
        >
          {rooms.map((room, index) => (
            <li key={room.id} aria-hidden={index !== activeIndex} className="w-full shrink-0">
              <ExchangeCard room={room} className="w-full" />
            </li>
          ))}
        </ul>
      </div>

      {canSlide && (
        <div className="flex items-center gap-1">
          {rooms.map((room, index) => (
            <button
              key={room.id}
              type="button"
              aria-label={`${index + 1}번째 교환독서 보기`}
              aria-current={index === activeIndex}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-[width] duration-300 ${index === activeIndex ? 'w-4 bg-action-green' : 'w-2 bg-surface-gray'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExchangeCarousel
