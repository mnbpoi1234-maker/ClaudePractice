const STORAGE_KEY = '369_best_score'

/** localStorage에서 최고 기록을 읽는다. 없으면 0을 반환한다. */
export function getBestScore(): number {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return 0
  const parsed = parseInt(raw, 10)
  return isNaN(parsed) ? 0 : parsed
}

/** 현재 점수가 최고 기록보다 높을 때만 localStorage에 저장한다. */
export function saveBestScore(score: number): void {
  if (score > getBestScore()) {
    localStorage.setItem(STORAGE_KEY, String(score))
  }
}
