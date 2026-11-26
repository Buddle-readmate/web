import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { NewReadingRecord, ReadingRecord } from '@/types/calendar'

type ReadingRecordState = {
  /** 사용자가 캘린더에서 추가한 기록 (더미 데이터와 별도로 보관) */
  addedRecords: ReadingRecord[]
  addRecord: (record: NewReadingRecord) => void
}

// TODO: 독서 기록 API 연동되면 서버 데이터로 교체
// 캘린더에서 추가한 기록을 마이페이지 통계에도 반영하기 위한 공용 상태
export const useReadingRecordStore = create<ReadingRecordState>()(
  persist(
    (set) => ({
      addedRecords: [],
      addRecord: (record) =>
        set((state) => ({
          addedRecords: [...state.addedRecords, { ...record, id: Date.now() }],
        })),
    }),
    { name: 'buddle-reading-records', storage: createJSONStorage(() => sessionStorage) },
  ),
)
