import { describe, it, expect } from 'vitest'
import { countClaps, getCorrectAction, isCorrectUserAction } from './gameRules'

describe('countClaps', () => {
  it('3, 6, 9가 없는 숫자는 0을 반환한다', () => {
    expect(countClaps(1)).toBe(0)
    expect(countClaps(2)).toBe(0)
    expect(countClaps(10)).toBe(0)
    expect(countClaps(22)).toBe(0)
  })

  it('3이 포함된 숫자는 1을 반환한다', () => {
    expect(countClaps(3)).toBe(1)
    expect(countClaps(13)).toBe(1)
    expect(countClaps(31)).toBe(1)
  })

  it('6이 포함된 숫자는 1을 반환한다', () => {
    expect(countClaps(6)).toBe(1)
    expect(countClaps(16)).toBe(1)
  })

  it('9가 포함된 숫자는 1을 반환한다', () => {
    expect(countClaps(9)).toBe(1)
    expect(countClaps(19)).toBe(1)
  })

  it('3, 6, 9가 2개 포함된 숫자는 2를 반환한다', () => {
    expect(countClaps(33)).toBe(2)
    expect(countClaps(39)).toBe(2)
    expect(countClaps(63)).toBe(2)
    expect(countClaps(99)).toBe(2)
  })

  it('3, 6, 9가 3개 포함된 숫자는 3을 반환한다', () => {
    expect(countClaps(369)).toBe(3)
    expect(countClaps(333)).toBe(3)
  })

  // 경계값 테스트
  it('100 이상의 숫자에서 3/6/9가 없으면 0을 반환한다', () => {
    expect(countClaps(100)).toBe(0)
    expect(countClaps(200)).toBe(0)
    expect(countClaps(1000)).toBe(0)
    expect(countClaps(1024)).toBe(0)
  })

  it('세 자리 숫자에서 정확한 개수를 반환한다', () => {
    expect(countClaps(300)).toBe(1)   // 3만 포함
    expect(countClaps(303)).toBe(2)   // 3이 두 개
    expect(countClaps(336)).toBe(3)   // 3 두 개, 6 하나
    expect(countClaps(999)).toBe(3)   // 9가 세 개
  })

  it('30은 3 하나만 포함하므로 1을 반환한다', () => {
    expect(countClaps(30)).toBe(1)
  })

  it('369는 3, 6, 9 각 하나씩이므로 3을 반환한다', () => {
    expect(countClaps(369)).toBe(3)
  })

  it('9999는 9가 4개이므로 4를 반환한다', () => {
    expect(countClaps(9999)).toBe(4)
  })
})

describe('getCorrectAction', () => {
  it('3, 6, 9가 없는 숫자는 숫자외치기를 반환한다', () => {
    expect(getCorrectAction(1)).toEqual({ type: 'shout', text: '1' })
    expect(getCorrectAction(10)).toEqual({ type: 'shout', text: '10' })
  })

  it('3, 6, 9가 1개인 숫자는 박수 1회를 반환한다', () => {
    expect(getCorrectAction(3)).toEqual({ type: 'clap', text: '/박수/' })
    expect(getCorrectAction(6)).toEqual({ type: 'clap', text: '/박수/' })
    expect(getCorrectAction(9)).toEqual({ type: 'clap', text: '/박수/' })
  })

  it('3, 6, 9가 2개인 숫자는 박수 2회를 반환한다', () => {
    expect(getCorrectAction(33)).toEqual({ type: 'clap', text: '/박수//박수/' })
    expect(getCorrectAction(39)).toEqual({ type: 'clap', text: '/박수//박수/' })
  })

  it('3, 6, 9가 3개인 숫자는 박수 3회를 반환한다', () => {
    expect(getCorrectAction(369)).toEqual({ type: 'clap', text: '/박수//박수//박수/' })
    expect(getCorrectAction(333)).toEqual({ type: 'clap', text: '/박수//박수//박수/' })
  })

  it('9999는 박수 4회를 반환한다', () => {
    expect(getCorrectAction(9999)).toEqual({ type: 'clap', text: '/박수//박수//박수//박수/' })
  })

  it('300은 박수 1회를 반환한다', () => {
    expect(getCorrectAction(300)).toEqual({ type: 'clap', text: '/박수/' })
  })
})

describe('isCorrectUserAction', () => {
  it('3, 6, 9 없는 숫자에서 숫자외치기는 정답이다', () => {
    expect(isCorrectUserAction(1, 'shout')).toBe(true)
    expect(isCorrectUserAction(2, 'shout')).toBe(true)
  })

  it('3, 6, 9 없는 숫자에서 박수는 오답이다', () => {
    expect(isCorrectUserAction(1, 'clap')).toBe(false)
  })

  it('3, 6, 9 있는 숫자에서 박수는 정답이다', () => {
    expect(isCorrectUserAction(3, 'clap')).toBe(true)
    expect(isCorrectUserAction(33, 'clap')).toBe(true)
    expect(isCorrectUserAction(369, 'clap')).toBe(true)
  })

  it('3, 6, 9 있는 숫자에서 숫자외치기는 오답이다', () => {
    expect(isCorrectUserAction(3, 'shout')).toBe(false)
    expect(isCorrectUserAction(369, 'shout')).toBe(false)
  })
})
