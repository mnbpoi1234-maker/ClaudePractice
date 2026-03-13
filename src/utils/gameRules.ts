import { ActionType } from '../types/game'

/**
 * 숫자에 포함된 3, 6, 9의 개수를 반환하는 순수 함수
 * @param num 검사할 숫자
 * @returns 3, 6, 9의 개수 (박수 횟수)
 */
export function countClaps(num: number): number {
  return String(num)
    .split('')
    .filter(d => d === '3' || d === '6' || d === '9')
    .length
}

/**
 * 주어진 숫자에 대한 올바른 행위를 반환하는 순수 함수
 * @param num 현재 숫자
 * @returns 행위 타입과 표시 텍스트
 */
export function getCorrectAction(num: number): { type: ActionType; text: string } {
  const claps = countClaps(num)
  if (claps > 0) {
    return { type: 'clap', text: '/박수/'.repeat(claps) }
  }
  return { type: 'shout', text: String(num) }
}

/**
 * 사용자 입력 행위가 올바른지 검증하는 순수 함수
 * @param num 현재 숫자
 * @param actionType 사용자가 선택한 행위 타입
 * @returns 정답 여부
 */
export function isCorrectUserAction(num: number, actionType: ActionType): boolean {
  const claps = countClaps(num)
  if (actionType === 'clap') return claps > 0
  return claps === 0
}
