import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionHeader from '@/components/home/SectionHeader'
import type { RecentBook } from '@/types/home'

// 웹 책장에 표지로 보여줄 최근 책 수 (피그마 W/Shelf/Row: 표지 4권 + 책등 칸 = 720px)
const SHELF_COVER_COUNT = 4

// 웹 책장 마지막 칸의 책등 (피그마 W/Shelf/Row 일러스트 기준)
// tilt: 오른쪽 아래 모서리를 기준으로 기울기 (음수 = 윗부분이 왼쪽 책에 기댐)
// bottom: 기울이면 왼쪽 아래 모서리가 내려가서 그만큼(24 × sin 8° ≈ 3.3px) 올려줌
// decoration: 빨강 = 책갈피 리본, 노랑 = 아래쪽 띠, 초록 = 왼쪽 옆면
// 읽은 책 표지들 맨 끝에 붙는 장식이라 제목은 실제 책과 상관없이 고정
const SPINES = [
  {
    width: 44,
    height: 172,
    left: 0,
    bottom: 0,
    tilt: 0,
    className: 'bg-book-red text-text-contrast',
    decoration: 'ribbon',
    title: 'Buddle',
  },
  {
    width: 32,
    height: 148,
    left: 44,
    bottom: 0,
    tilt: 0,
    className: 'bg-book-yellow text-text-secondary',
    decoration: 'band',
    title: 'Read Mate',
  },
  {
    width: 24,
    height: 132,
    left: 93.1,
    bottom: 3.3,
    tilt: -8,
    className: 'bg-green-400 text-text-contrast',
    decoration: 'edge',
    title: 'Book',
  },
] as const

function SpineDecoration({ type }: { type: (typeof SPINES)[number]['decoration'] }) {
  if (type === 'ribbon') {
    // 아래가 V자로 파인 리본 (24 × 98, 가운데가 11.6px 파임)
    return (
      <span className="absolute top-0 left-2.5 h-[98px] w-6 bg-book-red-dark [clip-path:polygon(0_0,100%_0,100%_100%,50%_88.2%,0_100%)]" />
    )
  }
  if (type === 'band') {
    return <span className="absolute right-0 bottom-[23px] left-0 h-2 bg-book-yellow-dark" />
  }
  return <span className="absolute top-0 bottom-0 left-0 w-[6.5px] bg-book-green-dark" />
}

type RecentBooksProps = {
  books: RecentBook[]
  className?: string
}

function BookCover({ book, className = '' }: { book?: RecentBook; className?: string }) {
  return book?.coverUrl ? (
    <img src={book.coverUrl} alt="" loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <span className={`block bg-border-strong ${className}`} />
  )
}

// 이만큼(px) 넘게 끌어야 드래그로 보고, 그보다 적게 움직이면 클릭으로 둠
const DRAG_THRESHOLD = 5

/**
 * 마우스로 가로 스크롤되게 함 (스크롤바를 숨겨서 트랙패드가 없으면 넘길 방법이 없음)
 * - 휠(세로): 가로로 넘김, 양 끝에 닿으면 페이지 세로 스크롤로 넘겨줌
 * - 클릭 후 드래그: 끈 만큼 넘김 (터치는 브라우저 기본 스와이프 그대로)
 * @param active 스크롤 영역이 화면에 있을 때 true (빈 상태에서 목록으로 바뀌면 다시 연결)
 */
function useMouseHorizontalScroll<T extends HTMLElement>(active = true) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!active || !el) return

    let startX = 0
    let startScrollLeft = 0
    let isPressed = false
    let isDragging = false

    const handlePointerMove = (event: PointerEvent) => {
      if (!isPressed) return
      const deltaX = event.clientX - startX
      if (!isDragging && Math.abs(deltaX) < DRAG_THRESHOLD) return
      isDragging = true
      el.style.cursor = 'grabbing'
      el.scrollLeft = startScrollLeft - deltaX
    }

    const handlePointerUp = () => {
      isPressed = false
      el.style.cursor = ''
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (el.scrollWidth <= el.clientWidth) return
      startX = event.clientX
      startScrollLeft = el.scrollLeft
      isPressed = true
      isDragging = false
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      window.addEventListener('pointercancel', handlePointerUp)
    }

    // 드래그로 끝난 경우 손 뗄 때 생기는 클릭은 무시 (책 눌림 방지)
    const handleClick = (event: MouseEvent) => {
      if (!isDragging) return
      isDragging = false
      event.preventDefault()
      event.stopPropagation()
    }

    // 표지 이미지를 끌면 브라우저가 이미지 드래그를 시작해서 스크롤이 멈춤
    const handleDragStart = (event: DragEvent) => event.preventDefault()

    const handleWheel = (event: WheelEvent) => {
      // 트랙패드 가로 스와이프·Shift + 휠은 브라우저 기본 동작 그대로
      if (event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      if (maxScrollLeft <= 0) return
      const atStart = el.scrollLeft <= 0 && event.deltaY < 0
      const atEnd = el.scrollLeft >= maxScrollLeft - 1 && event.deltaY > 0
      if (atStart || atEnd) return

      event.preventDefault()
      el.scrollLeft += event.deltaY
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('pointerdown', handlePointerDown)
    el.addEventListener('click', handleClick, true)
    el.addEventListener('dragstart', handleDragStart)
    return () => {
      handlePointerUp()
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('pointerdown', handlePointerDown)
      el.removeEventListener('click', handleClick, true)
      el.removeEventListener('dragstart', handleDragStart)
    }
  }, [active])

  return ref
}

/** 최근 읽은 책 (모바일: 표지 가로 목록 / 웹: 책장 모양) */
function RecentBooks({ books, className = '' }: RecentBooksProps) {
  const navigate = useNavigate()
  const listRef = useMouseHorizontalScroll<HTMLUListElement>(books.length > 0)
  const shelfRef = useMouseHorizontalScroll<HTMLDivElement>()
  const shelfBooks = books.slice(0, SHELF_COVER_COUNT)

  return (
    <section className={`flex min-w-0 flex-col gap-3 lg:gap-4 ${className}`}>
      <SectionHeader
        title="최근 읽은 책"
        count={books.length}
        hideCountOnMobile
        onMore={() => navigate('/shelf')}
      />

      {/* 모바일 */}
      {books.length === 0 ? (
        <div className="flex h-[72px] flex-col items-center justify-center gap-1 text-center lg:hidden">
          <p className="text-m-body-l font-medium text-text-secondary">아직 읽은 책이 없어요</p>
          <p className="text-m-body-m text-text-weak">책을 검색하고 나의 독서를 기록해보세요</p>
        </div>
      ) : (
        <ul
          ref={listRef}
          className="-mx-6 flex gap-3 overflow-x-auto px-6 select-none [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {books.map((book) => (
            <li key={book.id} className="flex w-[106px] shrink-0 flex-col gap-1">
              <BookCover
                book={book}
                className="h-[159px] w-full rounded-xl border-[1.5px] border-border-strong shadow-weak"
              />
              <p className="truncate text-m-body-m font-medium text-text-default">{book.title}</p>
            </li>
          ))}
        </ul>
      )}

      {/* 웹: 책장 (칸이 책장보다 좁아지면 선반·제목까지 함께 가로 스크롤) */}
      <div
        ref={shelfRef}
        className="hidden overflow-x-auto select-none [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max min-w-full flex-col gap-2">
          <div className="flex flex-col">
            <div className="flex items-end gap-5">
              {books.length === 0 ? (
                <>
                  <BookCover className="h-48 w-32 shrink-0 rounded-t-xl border-x-[1.5px] border-t-[1.5px] border-border-strong shadow-weak" />
                  <div className="flex h-48 flex-1 flex-col justify-end gap-1 py-6">
                    <p className="text-w-label-l text-text-default">아직 읽은 책이 없어요</p>
                    <p className="text-w-body-m text-text-secondary">
                      책을 검색하고 나의 독서를 기록해보세요
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {shelfBooks.map((book) => (
                    <BookCover
                      key={book.id}
                      book={book}
                      className="h-48 w-32 shrink-0 rounded-t-xl border-x-[1.5px] border-t-[1.5px] border-border-strong shadow-weak"
                    />
                  ))}
                  {/* 책등 장식 (표지 목록 맨 끝) */}
                  <div aria-hidden className="relative h-48 w-32 shrink-0 overflow-hidden">
                    {SPINES.map((spine) => (
                      <span
                        key={spine.title}
                        className={`absolute origin-bottom-right overflow-hidden rounded-t-lg pt-4 text-w-body-m font-medium [text-orientation:sideways] [writing-mode:vertical-rl] ${spine.className}`}
                        style={{
                          left: spine.left,
                          bottom: spine.bottom,
                          width: spine.width,
                          height: spine.height,
                          transform: spine.tilt ? `rotate(${spine.tilt}deg)` : undefined,
                          lineHeight: `${spine.width}px`,
                        }}
                      >
                        <SpineDecoration type={spine.decoration} />
                        <span className="relative block truncate">{spine.title}</span>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* 책장 선반 */}
            <span className="h-3 w-full rounded-b-sm bg-brown-700" />
          </div>

          {shelfBooks.length > 0 && (
            <ul className="flex gap-5">
              {shelfBooks.map((book) => (
                <li
                  key={book.id}
                  className="w-32 shrink-0 truncate text-w-body-m font-medium text-text-default"
                >
                  {book.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default RecentBooks
