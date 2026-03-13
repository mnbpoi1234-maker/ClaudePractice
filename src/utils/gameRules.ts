import { ActionType } from '../types/game'

// 숫자에 포함된 3, 6, 9의 개수를 반환
export function countClaps(num: number): number {
  return String(num)
    .split('')
    .filter(d => d === '3' || d === '6' || d === '9')
    .length
}

// 올바른 행위 반환
export function getCorrectAction(num: number): { type: ActionType; text: string } {
  const claps = countClaps(num)
  if (claps > 0) {
    return { type: 'clap', text: '/박수/'.repeat(claps) }
  }
  return { type: 'shout', text: String(num) }
}

// 사용자 입력이 올바른지 검증
export function isCorrectUserAction(num: number, actionType: ActionType): boolean {
  const claps = countClaps(num)
  if (actionType === 'clap') return claps > 0
  return claps === 0
}
