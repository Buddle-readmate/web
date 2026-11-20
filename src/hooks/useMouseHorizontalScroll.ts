import { useCallback, type RefCallback } from 'react'

// 이만큼(px) 넘게 끌어야 드래그로 보고, 그보다 적게 움직이면 클릭으로 둠
const DRAG_THRESHOLD = 5

/**
 * 스크롤바를 숨긴 가로 스크롤 영역을 마우스로도 넘길 수 있게 함 (트랙패드가 없으면 넘길 방법이 없음)
 * - 휠(세로): 가로로 넘김, 양 끝에 닿으면 페이지 세로 스크롤로 넘겨줌
 * - 클릭 후 드래그: 끈 만큼 넘김 (터치는 브라우저 기본 스와이프 그대로)
 *
 * 반환값을 스크롤 영역의 ref에 연결 (요소가 생기고 없어질 때 알아서 붙고 떨어짐)
 */
export function useMouseHorizontalScroll<T extends HTMLElement>(): RefCallback<T> {
  return useCallback((node: T | null) => {
    if (!node) return
    const el = node

    let startX = 0
    let startScrollLeft = 0
    let isPressed = false
    let isDragging = false
    let suppressClick = false

    const endDrag = () => {
      isPressed = false
      el.style.cursor = ''
      el.style.userSelect = ''
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', endDrag)
    }

    function handlePointerMove(event: PointerEvent) {
      // 창 전환·우클릭 메뉴 등으로 손 뗀 걸 놓쳤으면 여기서 끝냄
      if ((event.buttons & 1) === 0) {
        endDrag()
        return
      }
      const deltaX = event.clientX - startX
      if (!isDragging && Math.abs(deltaX) < DRAG_THRESHOLD) return
      if (!isDragging) {
        isDragging = true
        // 끄는 동안에만 글자 선택 막음 (평소에는 제목 복사 가능)
        el.style.cursor = 'grabbing'
        el.style.userSelect = 'none'
        window.getSelection()?.removeAllRanges()
      }
      el.scrollLeft = startScrollLeft - deltaX
    }

    function handlePointerUp() {
      // 드래그로 끝났으면 손 뗄 때 바로 따라오는 클릭 한 번만 무시 (항목 눌림 방지)
      // 클릭이 영역 밖으로 가도 다음 이벤트 차례에 풀려서 이후 클릭은 막히지 않음
      if (isDragging) {
        suppressClick = true
        setTimeout(() => {
          suppressClick = false
        }, 0)
      }
      isDragging = false
      endDrag()
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
      window.addEventListener('pointercancel', endDrag)
    }

    const handleClick = (event: MouseEvent) => {
      if (!suppressClick) return
      suppressClick = false
      event.preventDefault()
      event.stopPropagation()
    }

    // 이미지를 끌면 브라우저가 이미지 드래그를 시작해서 스크롤이 멈춤
    const handleDragStart = (event: DragEvent) => {
      if (isPressed) event.preventDefault()
    }

    const handleWheel = (event: WheelEvent) => {
      // 트랙패드 가로 스와이프·Shift + 휠·Ctrl + 휠(핀치 확대 포함)은 브라우저 기본 동작 그대로
      if (event.shiftKey || event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
        return
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
      endDrag()
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('pointerdown', handlePointerDown)
      el.removeEventListener('click', handleClick, true)
      el.removeEventListener('dragstart', handleDragStart)
    }
  }, [])
}
