import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useApplicationStore = create(
  persist(
    (set) => ({
      application: null,
      // 사용자가 제출한 신청 정보를 한 번에 교체해 이전 입력과 섞이지 않게 합니다.
      saveApplication: (application) => set({ application }),
    }),
    { name: 'loan-application' },
  ),
)

export default useApplicationStore
