# Sprint 1: 프로젝트 세팅 및 핵심 게임 구현

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Vite + React + TypeScript 기반 369 게임 프로젝트를 세팅하고, 핵심 게임 로직 및 기본 UI를 구현하여 컴퓨터와 번갈아 가며 플레이 가능한 상태를 만든다.

**Architecture:** 단일 `App.tsx` 컴포넌트에서 `useState`/`useReducer`로 게임 상태를 관리한다. 게임 핵심 로직(`countClaps`, `getCorrectAction`)은 순수 함수로 분리하여 독립적으로 테스트한다. 컴퓨터 턴은 `useEffect` + `setTimeout`으로 딜레이를 주어 처리한다.

**Tech Stack:** React 18+, TypeScript, Vite, Vitest (단위 테스트), 순수 CSS

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 1 |
| 기간 | 2026-03-13 ~ 2026-03-26 (2주) |
| 담당 Phase | Phase 1: 프로젝트 세팅 및 핵심 게임 구현 |
| 마일스톤 | M1: 기본 게임 플레이 가능 |

---

## 스프린트 목표

369 게임의 핵심 로직과 기본 UI를 구현하여, 난이도/타이머 없이 컴퓨터와 번갈아가며 게임을 플레이할 수 있는 상태를 만든다.

---

## 구현 범위

### 포함 (In Scope)
- Vite + React + TypeScript 프로젝트 초기 세팅
- 369 핵심 게임 로직 순수 함수 구현 및 단위 테스트
- 게임 상태 관리 (`currentNumber`, `turn`, `gameOver`, `displayText`, `actionText`)
- 기본 게임 UI (숫자 표시, 행위 텍스트, 숫자외치기/박수 버튼)
- 컴퓨터 자동 턴 수행 (500ms 딜레이)
- 리셋 기능

### 제외 (Out of Scope)
- 난이도 시스템 (Sprint 2)
- 타이머 기능 (Sprint 2)
- 키보드 단축키 (Sprint 2)
- 엣지케이스 폴리싱 (Sprint 3)
- 컴포넌트 분리 (Sprint 3에서 필요 시)

---

## 작업 분해 (Task Breakdown)

### Task 1: Vite + React + TypeScript 프로젝트 초기 세팅

**복잡도:** 낮음 | **예상 소요:** 30분

**Files:**
- Create: `369-game/` (프로젝트 루트)
- Modify: `369-game/src/index.css` (글로벌 폰트 설정)
- Delete: 보일러플레이트 파일 (`369-game/src/App.css`, 불필요한 에셋)

**Step 1: 프로젝트 생성**

```bash
npm create vite@latest 369-game -- --template react-ts
cd 369-game
npm install
```

Expected: `369-game/` 디렉토리 생성, `node_modules/` 설치 완료

**Step 2: 보일러플레이트 제거**

- `src/App.css` 삭제
- `src/assets/react.svg` 삭제
- `public/vite.svg` 삭제
- `src/App.tsx` 내용을 빈 컴포넌트로 초기화

```tsx
// src/App.tsx
function App() {
  return <div>369 게임</div>;
}

export default App;
```

**Step 3: 글로벌 CSS 폰트 설정**

`src/index.css`를 다음 내용으로 교체:

```css
/* src/index.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: '맑은 고딕', 'Malgun Gothic', sans-serif;
  background-color: #ffffff;
}
```

**Step 4: 정상 구동 확인**

```bash
npm run dev
```

Expected: `http://localhost:5173` 접속 시 "369 게임" 텍스트 표시, 콘솔 에러 없음

**Step 5: 커밋**

```bash
git add .
git commit -m "feat: Vite + React + TypeScript 프로젝트 초기 세팅"
```

---

### Task 2: Vitest 테스트 환경 설정

**복잡도:** 낮음 | **예상 소요:** 20분

**Files:**
- Modify: `369-game/vite.config.ts`
- Create: `369-game/src/game/__tests__/gameLogic.test.ts`

**Step 1: Vitest 설치**

```bash
npm install -D vitest @vitest/ui
```

**Step 2: vite.config.ts에 테스트 설정 추가**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

**Step 3: package.json 스크립트 추가**

`package.json`의 `scripts`에 추가:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: 테스트 실행 확인**

```bash
npm test
```

Expected: "No test files found" 또는 정상 종료 (에러 없음)

**Step 5: 커밋**

```bash
git add vite.config.ts package.json
git commit -m "feat: Vitest 테스트 환경 설정"
```

---

### Task 3: 369 핵심 게임 로직 함수 구현 (TDD)

**복잡도:** 중간 | **예상 소요:** 60분

**Files:**
- Create: `369-game/src/game/gameLogic.ts`
- Create: `369-game/src/game/__tests__/gameLogic.test.ts`

**Step 1: 실패하는 테스트 먼저 작성**

```ts
// src/game/__tests__/gameLogic.test.ts
import { describe, it, expect } from 'vitest'
import { countClaps, getCorrectAction } from '../gameLogic'

describe('countClaps', () => {
  it('3/6/9가 없는 숫자는 0을 반환한다', () => {
    expect(countClaps(1)).toBe(0)
    expect(countClaps(2)).toBe(0)
    expect(countClaps(12)).toBe(0)
    expect(countClaps(45)).toBe(0)
  })

  it('3이 하나 있으면 1을 반환한다', () => {
    expect(countClaps(3)).toBe(1)
    expect(countClaps(13)).toBe(1)
    expect(countClaps(31)).toBe(1)
  })

  it('6이 하나 있으면 1을 반환한다', () => {
    expect(countClaps(6)).toBe(1)
    expect(countClaps(16)).toBe(1)
  })

  it('9가 하나 있으면 1을 반환한다', () => {
    expect(countClaps(9)).toBe(1)
    expect(countClaps(19)).toBe(1)
  })

  it('3/6/9가 두 개 있으면 2를 반환한다', () => {
    expect(countClaps(33)).toBe(2)
    expect(countClaps(36)).toBe(2)
    expect(countClaps(39)).toBe(2)
    expect(countClaps(63)).toBe(2)
  })

  it('3/6/9가 세 개 있으면 3을 반환한다', () => {
    expect(countClaps(333)).toBe(3)
    expect(countClaps(369)).toBe(3)
    expect(countClaps(963)).toBe(3)
  })
})

describe('getCorrectAction', () => {
  it('3/6/9가 없는 숫자는 shout 타입과 숫자 문자열을 반환한다', () => {
    expect(getCorrectAction(1)).toEqual({ type: 'shout', value: '1' })
    expect(getCorrectAction(2)).toEqual({ type: 'shout', value: '2' })
    expect(getCorrectAction(10)).toEqual({ type: 'shout', value: '10' })
  })

  it('3은 clap 타입과 "/박수/" 1개를 반환한다', () => {
    expect(getCorrectAction(3)).toEqual({ type: 'clap', value: '/박수/' })
  })

  it('6은 clap 타입과 "/박수/" 1개를 반환한다', () => {
    expect(getCorrectAction(6)).toEqual({ type: 'clap', value: '/박수/' })
  })

  it('9는 clap 타입과 "/박수/" 1개를 반환한다', () => {
    expect(getCorrectAction(9)).toEqual({ type: 'clap', value: '/박수/' })
  })

  it('33은 clap 타입과 "/박수//박수/" 2개를 반환한다', () => {
    expect(getCorrectAction(33)).toEqual({ type: 'clap', value: '/박수//박수/' })
  })

  it('39는 clap 타입과 "/박수//박수/" 2개를 반환한다', () => {
    expect(getCorrectAction(39)).toEqual({ type: 'clap', value: '/박수//박수/' })
  })

  it('369는 clap 타입과 "/박수/" 3개를 반환한다', () => {
    expect(getCorrectAction(369)).toEqual({ type: 'clap', value: '/박수//박수//박수/' })
  })
})
```

**Step 2: 테스트 실행하여 실패 확인**

```bash
npm test
```

Expected: FAIL - "Cannot find module '../gameLogic'"

**Step 3: 최소 구현 작성**

```ts
// src/game/gameLogic.ts

/**
 * 숫자 n에 포함된 3, 6, 9의 개수를 반환하는 순수 함수
 * @param n 검사할 숫자
 * @returns 3, 6, 9의 개수
 */
export function countClaps(n: number): number {
  return String(n)
    .split('')
    .filter((digit) => digit === '3' || digit === '6' || digit === '9')
    .length
}

/**
 * 현재 숫자에 대한 올바른 행동을 반환하는 순수 함수
 * @param n 현재 숫자
 * @returns 올바른 행동 객체 (shout 또는 clap)
 */
export function getCorrectAction(n: number): { type: 'shout' | 'clap'; value: string } {
  const claps = countClaps(n)
  if (claps === 0) {
    return { type: 'shout', value: String(n) }
  }
  return { type: 'clap', value: '/박수/'.repeat(claps) }
}
```

**Step 4: 테스트 실행하여 전체 통과 확인**

```bash
npm test
```

Expected: PASS - 모든 테스트 통과

**Step 5: 커밋**

```bash
git add src/game/gameLogic.ts src/game/__tests__/gameLogic.test.ts
git commit -m "feat: 369 핵심 게임 로직 함수 구현 (countClaps, getCorrectAction) 및 단위 테스트"
```

---

### Task 4: 게임 상태 타입 및 초기 상태 정의

**복잡도:** 낮음 | **예상 소요:** 20분

**Files:**
- Create: `369-game/src/game/types.ts`

**Step 1: 게임 상태 타입 정의**

```ts
// src/game/types.ts

/** 누구의 차례인지 */
export type Turn = 'computer' | 'user'

/** 게임 전체 상태 */
export interface GameState {
  /** 현재 차례의 숫자 */
  currentNumber: number
  /** 현재 차례 */
  turn: Turn
  /** 게임 종료 여부 */
  gameOver: boolean
  /** 화면에 표시할 숫자 또는 "게임 종료" 텍스트 */
  displayText: string
  /** 컴퓨터 또는 사용자의 행동 결과 텍스트 */
  actionText: string
}

/** 게임 초기 상태 */
export const INITIAL_STATE: GameState = {
  currentNumber: 1,
  turn: 'computer',
  gameOver: false,
  displayText: '1',
  actionText: '',
}
```

**Step 2: 커밋**

```bash
git add src/game/types.ts
git commit -m "feat: 게임 상태 타입 및 초기 상태 정의"
```

---

### Task 5: App.tsx에 게임 상태 관리 구현

**복잡도:** 중간 | **예상 소요:** 60분

**Files:**
- Modify: `369-game/src/App.tsx`

**Step 1: App.tsx 게임 로직 구현**

```tsx
// src/App.tsx
import { useState, useEffect, useCallback } from 'react'
import { GameState, INITIAL_STATE } from './game/types'
import { getCorrectAction } from './game/gameLogic'

/** 컴퓨터 턴 딜레이 (ms) */
const COMPUTER_DELAY_MS = 700

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)

  /**
   * 사용자 입력 처리 함수
   * @param userAction 사용자가 선택한 행동 타입
   */
  const handleUserAction = useCallback(
    (userAction: 'shout' | 'clap') => {
      if (gameState.gameOver || gameState.turn !== 'user') return

      const correct = getCorrectAction(gameState.currentNumber)

      if (userAction !== correct.type) {
        // 오답: 게임 종료
        setGameState((prev) => ({
          ...prev,
          gameOver: true,
          displayText: '게임 종료',
          actionText: '',
        }))
        return
      }

      // 정답: 다음 숫자로 진행, 컴퓨터 턴으로 전환
      const nextNumber = gameState.currentNumber + 1
      setGameState((prev) => ({
        ...prev,
        currentNumber: nextNumber,
        turn: 'computer',
        displayText: String(nextNumber),
        actionText: '',
      }))
    },
    [gameState]
  )

  /**
   * 리셋 처리 함수
   */
  const handleReset = useCallback(() => {
    setGameState(INITIAL_STATE)
  }, [])

  /**
   * 컴퓨터 턴 자동 수행 (딜레이 후 처리)
   */
  useEffect(() => {
    if (gameState.turn !== 'computer' || gameState.gameOver) return

    const timer = setTimeout(() => {
      const action = getCorrectAction(gameState.currentNumber)
      const nextNumber = gameState.currentNumber + 1

      setGameState((prev) => ({
        ...prev,
        currentNumber: nextNumber,
        turn: 'user',
        displayText: String(nextNumber),
        actionText: action.value,
      }))
    }, COMPUTER_DELAY_MS)

    // cleanup: 컴포넌트 언마운트 또는 상태 변경 시 타이머 정리
    return () => clearTimeout(timer)
  }, [gameState.turn, gameState.gameOver, gameState.currentNumber])

  return (
    <div className="game-container">
      {/* 현재 숫자 또는 게임 종료 텍스트 */}
      <div className="display-number">{gameState.displayText}</div>

      {/* 컴퓨터 행동 결과 텍스트 */}
      {gameState.actionText && (
        <div className="action-text">{gameState.actionText}</div>
      )}

      {/* 사용자 입력 버튼 (게임 진행 중 사용자 턴일 때만 활성화) */}
      <div className="button-group">
        <button
          className="game-button"
          onClick={() => handleUserAction('shout')}
          disabled={gameState.gameOver || gameState.turn !== 'user'}
        >
          숫자외치기
        </button>
        <button
          className="game-button"
          onClick={() => handleUserAction('clap')}
          disabled={gameState.gameOver || gameState.turn !== 'user'}
        >
          박수
        </button>
      </div>

      {/* 리셋 버튼 */}
      <button className="reset-button" onClick={handleReset}>
        리셋
      </button>
    </div>
  )
}

export default App
```

**Step 2: 브라우저에서 동작 확인**

```bash
npm run dev
```

Expected: 페이지 로드 후 700ms 뒤 컴퓨터가 "1" 외치기를 수행하고 사용자 턴으로 전환

**Step 3: 커밋**

```bash
git add src/App.tsx
git commit -m "feat: 게임 상태 관리 및 컴퓨터 자동 턴 수행 구현"
```

---

### Task 6: 게임 UI 레이아웃 CSS 구현

**복잡도:** 중간 | **예상 소요:** 45분

**Files:**
- Modify: `369-game/src/index.css`

**Step 1: UI 레이아웃 CSS 작성**

PRD 요구사항: 현재 숫자 페이지 정중앙 25px, 행위 텍스트 숫자 아래, 버튼 100px x 50px 가로 배치, 모든 컨트롤 viewport 상대 위치 고정

```css
/* src/index.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: '맑은 고딕', 'Malgun Gothic', sans-serif;
  background-color: #ffffff;
}

/* 게임 전체 컨테이너: 뷰포트 중앙 고정 레이아웃 */
.game-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 현재 숫자 또는 "게임 종료" 텍스트 */
.display-number {
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  min-height: 1.5em;
}

/* 컴퓨터/사용자 행동 결과 텍스트 */
.action-text {
  font-size: 18px;
  text-align: center;
  color: #555555;
  min-height: 1.5em;
}

/* 숫자외치기/박수 버튼 가로 배치 그룹 */
.button-group {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

/* 게임 버튼 (숫자외치기, 박수) */
.game-button {
  width: 100px;
  height: 50px;
  font-family: '맑은 고딕', 'Malgun Gothic', sans-serif;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #cccccc;
  background-color: #f5f5f5;
}

.game-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.game-button:active:not(:disabled) {
  background-color: #cccccc;
}

.game-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 리셋 버튼 */
.reset-button {
  width: 100px;
  height: 40px;
  font-family: '맑은 고딕', 'Malgun Gothic', sans-serif;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #aaaaaa;
  background-color: #ffffff;
  margin-top: 8px;
}

.reset-button:hover {
  background-color: #f0f0f0;
}
```

**Step 2: 브라우저에서 레이아웃 확인**

```bash
npm run dev
```

Expected:
- 숫자가 페이지 정중앙에 25px 크기로 표시
- 버튼 2개가 가로로 나란히 배치, 각 100px x 50px
- 리셋 버튼이 아래에 위치

**Step 3: 커밋**

```bash
git add src/index.css
git commit -m "feat: 게임 UI 레이아웃 CSS 구현 (viewport 중앙 고정, 버튼 100x50px)"
```

---

## 완료 기준 (Definition of Done)

- ⬜ `npm run dev`로 정상 구동 (`http://localhost:5173`)
- ⬜ 페이지 정중앙에 현재 숫자가 25px 크기로 표시됨
- ⬜ 컴퓨터가 먼저 올바른 행동(숫자 외치기/박수)을 수행하고 사용자 턴으로 전환됨
- ⬜ 사용자가 "숫자외치기" 또는 "박수" 버튼을 눌러 응답 가능
- ⬜ 올바른 응답 시 다음 숫자로 진행, 잘못된 응답 시 "게임 종료" 표시
- ⬜ 리셋 버튼으로 게임 재시작 가능 (숫자 1, 컴퓨터 턴)
- ⬜ `countClaps`, `getCorrectAction` 단위 테스트 전체 통과 (`npm test`)
- ⬜ 브라우저 콘솔에 에러 없음
- ⬜ TypeScript 컴파일 에러 없음 (`npm run build`)

---

## Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증 (sprint-close 시점에 수행)

**기본 렌더링 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 페이지 중앙에 숫자 "1" 또는 컴퓨터 행동 결과 확인
3. `browser_snapshot` -> "숫자외치기", "박수" 버튼 2개 존재 확인
4. `browser_console_messages(level: "error")` -> 콘솔 에러 없음 확인

**게임 플레이 검증:**
1. `browser_snapshot` -> 컴퓨터가 1을 외친 후 사용자 턴(숫자 2) 확인
2. `browser_click` -> "숫자외치기" 버튼 클릭 (숫자 2에는 3/6/9 없으므로 정답)
3. `browser_snapshot` -> 숫자가 3으로 진행, 컴퓨터 턴 확인
4. `browser_snapshot` -> 컴퓨터가 숫자 3에 대해 "/박수/" 행동 수행 확인
5. `browser_snapshot` -> 사용자 턴(숫자 4) 확인

**게임 종료 검증:**
1. `browser_navigate` -> 페이지 새로고침
2. (컴퓨터 턴 완료 대기 후) 사용자 턴에서 `browser_click` -> "박수" 버튼 클릭 (숫자 2에 박수는 오답)
3. `browser_snapshot` -> "게임 종료" 텍스트 표시 확인

**리셋 검증:**
1. `browser_click` -> "리셋" 버튼 클릭
2. `browser_snapshot` -> 숫자가 1로 초기화, 컴퓨터 턴 재시작 확인

---

## 의존성 및 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 맑은 고딕 폰트 미설치 환경 | 낮음 | fallback 폰트 체인(`sans-serif`) 지정으로 완화 |
| `setInterval`/`setTimeout` cleanup 누락 시 메모리 리크 | 중간 | `useEffect` return 함수에서 `clearTimeout` 반드시 호출 |
| 컴퓨터 턴 중 사용자 입력 처리 | 중간 | `disabled` 속성 및 `turn !== 'user'` 조건으로 차단 |
| Vite 기본 포트 5173 vs 3000 | 낮음 | 검증 시나리오를 `localhost:5173` 기준으로 작성 |

---

## 예상 산출물

스프린트 1 완료 시 다음 결과물이 생성됩니다:

1. `369-game/` - Vite + React + TypeScript 프로젝트
2. `369-game/src/game/gameLogic.ts` - 순수 게임 로직 함수
3. `369-game/src/game/__tests__/gameLogic.test.ts` - 단위 테스트 (최소 10개 케이스)
4. `369-game/src/game/types.ts` - 게임 상태 타입 정의
5. `369-game/src/App.tsx` - 게임 상태 관리 및 UI 컴포넌트
6. `369-game/src/index.css` - 게임 UI 레이아웃 스타일
7. `docs/sprint/sprint1/playwright-report.md` - Playwright 검증 보고서 (sprint-close 시 생성)

---

## 기술적 접근 방법

### 게임 로직 분리 원칙
- `countClaps`, `getCorrectAction`은 순수 함수로 구현하여 외부 의존성 없이 단위 테스트 가능
- 상태 관리(`useState`)와 로직이 분리되어 있어 추후 변경 시 영향 범위 최소화

### 컴퓨터 턴 처리
- `useEffect`에서 `turn === 'computer'` 조건으로 컴퓨터 턴 감지
- `setTimeout` 700ms 딜레이로 사용자가 진행 상황 인지 가능
- `cleanup` 함수에서 `clearTimeout` 호출로 메모리 리크 방지

### 상태 불변성
- `setGameState`에 항상 함수형 업데이터 `(prev) => ({...prev, ...})` 사용
- 직접 상태 변이(mutation) 금지

### 코드 품질 원칙 (Karpathy Guidelines 준수)
- YAGNI: Sprint 1 범위 밖의 기능(타이머, 난이도) 추가 금지
- DRY: 중복 로직은 함수로 추출
- 불필요한 추상화 금지 (단일 컴포넌트로 충분)
