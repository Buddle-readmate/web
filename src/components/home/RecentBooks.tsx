import { useNavigate } from 'react-router-dom'
import SectionHeader from '@/components/home/SectionHeader'
import type { RecentBook } from '@/types/home'

const SHELF_COVER_COUNT = 4

// 웹 책장은 칸 너비에 맞춰 뒤쪽 책부터 숨김 (책 128px + 간격 20px, 겹침 방지)
// 표지 1·2권: 항상 / 3권: 424px↑ / 4권: 572px↑ / 책등 칸: 720px↑
const COVER_VISIBILITY = ['', '', 'hidden @min-[424px]:block', 'hidden @min-[572px]:block']
const SPINE_VISIBILITY = 'hidden @min-[720px]:block'

// 웹 책장 마지막 칸의 책등 크기·위치 (피그마 W/Shelf/Row 기준, 최대 3권)
// tilt: 오른쪽 아래 모서리를 기준으로 기울기 (음수 = 윗부분이 왼쪽 책에 기댐)
// bottom: 기울이면 왼쪽 아래 모서리가 내려가서 그만큼(24 × sin 8° ≈ 3.3px) 올려줌
const SPINES = [
  { width: 44, height: 172, left: 0, bottom: 0, tilt: 0 },
  { width: 32, height: 148, left: 51, bottom: 0, tilt: 0 },
  { width: 24, height: 132, left: 101, bottom: 3.3, tilt: -8 },
]

type RecentBooksProps = {
  books: RecentBook[]
  className?: string
}

function BookCover({ book, className = '' }: { book?: RecentBook; className?: string }) {
  return book?.coverUrl ? (
    <img src={book.coverUrl} alt="" className={`object-cover ${className}`} />
  ) : (
    <span className={`block bg-border-strong ${className}`} />
  )
}

/** 최근 읽은 책 (모바일: 표지 가로 목록 / 웹: 책장 모양) */
function RecentBooks({ books, className = '' }: RecentBooksProps) {
  const navigate = useNavigate()
  const coverBooks = books.slice(0, SHELF_COVER_COUNT)
  const spineBooks = books.slice(SHELF_COVER_COUNT, SHELF_COVER_COUNT + SPINES.length)

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
        <ul className="-mx-6 flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
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

      {/* 웹: 책장 */}
      <div className="@container hidden flex-col gap-2 lg:flex">
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
                {coverBooks.map((book, index) => (
                  <BookCover
                    key={book.id}
                    book={book}
                    className={`h-48 w-32 shrink-0 rounded-t-xl border-x-[1.5px] border-t-[1.5px] border-border-strong shadow-weak ${COVER_VISIBILITY[index]}`}
                  />
                ))}
                {spineBooks.length > 0 && (
                  <div
                    className={`relative h-48 w-32 shrink-0 overflow-hidden ${SPINE_VISIBILITY}`}
                  >
                    {spineBooks.map((book, index) => {
                      const spine = SPINES[index]
                      return (
                        <span
                          key={book.id}
                          className="absolute origin-bottom-right overflow-hidden rounded-t-lg pt-4 text-w-body-m font-medium text-text-contrast [text-orientation:sideways] [writing-mode:vertical-rl]"
                          style={{
                            left: spine.left,
                            bottom: spine.bottom,
                            width: spine.width,
                            height: spine.height,
                            backgroundColor: book.spineColor ?? '#b6a974',
                            transform: spine.tilt ? `rotate(${spine.tilt}deg)` : undefined,
                            lineHeight: `${spine.width}px`,
                          }}
                        >
                          <span className="block truncate">{book.title}</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
          {/* 책장 선반 */}
          <span className="h-3 w-full rounded-b-sm bg-brown-700" />
        </div>

        {coverBooks.length > 0 && (
          <ul className="flex gap-5">
            {coverBooks.map((book, index) => (
              <li
                key={book.id}
                className={`w-32 shrink-0 truncate text-w-body-m font-medium text-text-default ${COVER_VISIBILITY[index]}`}
              >
                {book.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default RecentBooks
