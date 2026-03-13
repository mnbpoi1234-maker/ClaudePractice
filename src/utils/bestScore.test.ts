import { describe, it, expect, beforeEach } from 'vitest'
import { getBestScore, saveBestScore } from './bestScore'

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

beforeEach(() => localStorageMock.clear())

describe('getBestScore', () => {
  it('저장된 기록이 없으면 0을 반환한다', () => {
    expect(getBestScore()).toBe(0)
  })

  it('저장된 기록이 있으면 해당 숫자를 반환한다', () => {
    localStorageMock.setItem('369_best_score', '42')
    expect(getBestScore()).toBe(42)
  })

  it('저장된 값이 숫자가 아니면 0을 반환한다', () => {
    localStorageMock.setItem('369_best_score', 'invalid')
    expect(getBestScore()).toBe(0)
  })
})

describe('saveBestScore', () => {
  it('현재 기록이 최고 기록보다 높으면 저장한다', () => {
    saveBestScore(10)
    expect(getBestScore()).toBe(10)
  })

  it('현재 기록이 최고 기록보다 낮으면 저장하지 않는다', () => {
    saveBestScore(20)
    saveBestScore(10)
    expect(getBestScore()).toBe(20)
  })

  it('현재 기록이 최고 기록과 같으면 저장하지 않는다', () => {
    saveBestScore(15)
    saveBestScore(15)
    expect(getBestScore()).toBe(15)
  })
})
