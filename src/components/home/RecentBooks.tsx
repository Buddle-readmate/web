import { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import SectionHeader from '@/components/home/SectionHeader'
import { useMouseHorizontalScroll } from '@/hooks/useMouseHorizontalScroll'
import type { RecentBook } from '@/types/home'

// 웹 책장에 표지로 보여줄 최근 책 수 (피그마 W/Shelf/Row: 표지 4권 + 책등 칸 = 720px)
const SHELF_COVER_COUNT = 4
// 피그마 책장 크기: 표지 128×192, 간격 20, 책등 칸 128 → 4권 + 책등 = 720px
const COVER_WIDTH = 128
const COVER_HEIGHT = 192
const SHELF_GAP = 20

/** 표지 n권 + 책등 칸을 시안 크기로 놓을 때 필요한 폭 (4권이면 720px) */
function getShelfDesignWidth(coverCount: number) {
  return (coverCount + 1) * COVER_WIDTH + coverCount * SHELF_GAP
}

/**
 * 책장 실제 폭 (모바일처럼 책장이 숨겨져 아직 못 쟀으면 null)
 * 첫 화면에서 시안 크기로 잠깐 그려졌다 줄어드는 걸 막으려고, 붙자마자 한 번 재고 폭이 바뀔 때도 바로 반영
 */
function useShelfWidth() {
  const [width, setWidth] = useState<number | null>(null)
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    // 숨겨진 상태(폭 0)는 무시
    const initialWidth = node.getBoundingClientRect().width
    if (initialWidth > 0) setWidth(initialWidth)
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width
      if (nextWidth === 0) return
      // 아이패드를 세로→가로로 돌려 책장이 처음 보일 때도 줄어든 크기로 바로 그려지게 함
      flushSync(() => setWidth(nextWidth))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

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

/** 최근 읽은 책 (모바일: 표지 가로 목록 / 웹: 책장 모양) */
function RecentBooks({ books, className = '' }: RecentBooksProps) {
  const navigate = useNavigate()
  const listRef = useMouseHorizontalScroll<HTMLUListElement>()
  const [shelfRef, shelfWidth] = useShelfWidth()
  const shelfBooks = books.slice(0, SHELF_COVER_COUNT)
  // 놓인 책이 시안 크기로 다 들어가면 그대로(1), 모자라면 같은 비율로 줄임
  const shelfScale =
    shelfWidth === null ? 1 : Math.min(1, shelfWidth / getShelfDesignWidth(shelfBooks.length))
  const coverSize = { width: COVER_WIDTH * shelfScale, height: COVER_HEIGHT * shelfScale }
  const shelfGap = SHELF_GAP * shelfScale

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
          className="-mx-6 flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
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

      {/* 웹: 책장 (좁으면 표지·간격·책등을 시안 비율대로 줄임, 제목 글씨 크기는 그대로) */}
      <div ref={shelfRef} className="hidden lg:block">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <div
              className="flex items-end gap-5"
              style={books.length > 0 ? { gap: shelfGap } : undefined}
            >
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
                    <div key={book.id} className="shrink-0" style={coverSize}>
                      <BookCover
                        book={book}
                        className="size-full rounded-t-xl border-x-[1.5px] border-t-[1.5px] border-border-strong shadow-weak"
                      />
                    </div>
                  ))}
                  {/* 책등 장식 (표지 목록 맨 끝, 128×192 일러스트를 통째로 줄임) */}
                  <div aria-hidden className="relative shrink-0 overflow-hidden" style={coverSize}>
                    <div
                      className="absolute bottom-0 left-0 h-48 w-32 origin-bottom-left"
                      style={shelfScale < 1 ? { transform: `scale(${shelfScale})` } : undefined}
                    >
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
                  </div>
                </>
              )}
            </div>
            {/* 책장 선반 */}
            <span className="h-3 w-full rounded-b-sm bg-brown-700" />
          </div>

          {shelfBooks.length > 0 && (
            <ul className="flex" style={{ gap: shelfGap }}>
              {shelfBooks.map((book) => (
                <li
                  key={book.id}
                  className="shrink-0 truncate text-w-body-m font-medium text-text-default"
                  style={{ width: coverSize.width }}
                  // TODO: 표지가 줄어 말줄임된 제목 전체를 보여줄지 디자인 확인 필요 (PR #49에 질문 남김)
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
