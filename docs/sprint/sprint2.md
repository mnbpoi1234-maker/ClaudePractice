# Sprint 2: 통합 검증 및 폴리싱

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Sprint 1에서 구현 완료된 모든 기능(게임 로직, 난이도 시스템, 타이머, 키보드 단축키)을 대상으로 엣지케이스를 처리하고, UI/UX를 다듬어 PRD 기준 완성도 높은 MVP를 완성한다.

**Architecture:** 기존 컴포넌트 구조(`useGameLogic`, `useTimer`, `useKeyboardShortcut`, `GameBoard`, `ActionButtons`, `DifficultyButtons`, `ResetButton`)를 최소한으로 수정하여 방어적 조건을 추가한다. 동작 변경 없이 구조를 개선하는 리팩토링 원칙을 준수한다. Karpathy Guidelines 준수: 불필요한 추상화 금지, 요구되지 않은 기능 추가 금지.

**Tech Stack:** React 18+, TypeScript (strict mode), Vite, Vitest, 순수 CSS

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 2 |
| 기간 | 2026-03-13 ~ 2026-03-26 (2주) |
| 담당 Phase | Phase 3: 통합 검증 + 엣지케이스 처리 + UI 폴리싱 + 코드 정리 |
| 마일스톤 | M3: 최종 완성 (MVP) |

---

## 스프린트 목표

모든 기능의 통합 동작을 검증하고, 엣지케이스를 처리하며, UI/UX를 다듬어 PRD의 모든 요구사항을 충족하는 완성도 높은 369 게임을 만든다.

---

## 구현 범위

### 포함 (In Scope)
- 엣지케이스 처리: 큰 숫자 박수 정확성, 게임 종료 후 입력 방지, 빠른 연타 방지 (디바운싱)
- UI 폴리싱: 컴퓨터/사용자 턴 시각적 피드백, 게임 종료 시 최종 도달 숫자 표시, 버튼 hover/active 스타일, viewport 재검증
- 코드 품질 정리: TypeScript strict 경고 해소, 미사용 import/변수 제거, 한국어 주석 정리
- 전체 기능 통합 테스트: 게임 시작~종료 시나리오, 난이도별 타이머, 연속 리셋, 키보드+버튼 혼용

### 제외 (Out of Scope)
- 신규 기능 추가 (게임 기록, 사운드, 멀티플레이어 등 - Backlog 항목)
- 외부 라이브러리 도입
- 모바일 터치 인터페이스 개선

---

## 작업 분해 (Task Breakdown)

### Task 1: 현재 코드베이스 분석 및 TypeScript strict 모드 경고 해소

**복잡도:** 낮음 | **예상 소요:** 30분

**Files:**
- Modify: `369-game/tsconfig.json` (strict 모드 활성화 확인)
- Modify: 경고 발생 파일 (분석 후 확정)

**Step 1: TypeScript 컴파일 에러/경고 현황 파악**

```bash
cd 369-game && npx tsc --noEmit
```

Expected: 에러/경고 목록 출력 (없으면 "Found 0 errors" 메시지)

**Step 2: tsconfig.json strict 설정 확인**

`tsconfig.json`의 `compilerOptions`에 아래 옵션이 모두 활성화되어 있는지 확인:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

없는 옵션은 추가한다. `strict: true`는 `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply` 등을 포함한다.

**Step 3: 경고 해소 - any 타입 제거**

`any` 타입이 사용된 곳을 찾아 적절한 타입으로 교체한다.

```bash
cd 369-game && grep -rn ": any" src/
```

발견된 `any` 타입 예시 교체:

```ts
// 변경 전
const handleAction = (action: any) => { ... }

// 변경 후
const handleAction = (action: 'shout' | 'clap') => { ... }
```

**Step 4: 미사용 import/변수 제거**

```bash
cd 369-game && grep -rn "^import" src/ | sort
```

사용되지 않는 import를 파일별로 제거한다.

**Step 5: 컴파일 에러 없음 확인**

```bash
cd 369-game && npx tsc --noEmit
```

Expected: "Found 0 errors"

**Step 6: 커밋**

```bash
cd 369-game && git add -p && git commit -m "refactor: TypeScript strict 모드 경고 해소 및 미사용 import 제거"
```

---

### Task 2: 코드 주석 한국어 정리

**복잡도:** 낮음 | **예상 소요:** 20분

**Files:**
- Modify: `369-game/src/` 하위 모든 `.ts`, `.tsx` 파일

**Step 1: 영문 주석 현황 파악**

```bash
cd 369-game && grep -rn "//" src/ | grep -v "node_modules"
```

**Step 2: 주석 한국어 변환 원칙 적용**

- 함수/컴포넌트 설명 주석: 한국어 JSDoc 형식 사용
- 인라인 로직 설명: 한국어로 작성
- 변수명/함수명 자체는 영어 유지 (코드 표준)

예시:
```ts
// 변경 전
// Computer turn delay in milliseconds
const COMPUTER_DELAY_MS = 700

// 변경 후
/** 컴퓨터 턴 딜레이 (밀리초) */
const COMPUTER_DELAY_MS = 700
```

**Step 3: 커밋**

```bash
cd 369-game && git add -p && git commit -m "refactor: 코드 주석 한국어로 정리"
```

---

### Task 3: 엣지케이스 처리 - 빠른 연타 방지 (디바운싱)

**복잡도:** 중간 | **예상 소요:** 40분

**Files:**
- Modify: `369-game/src/hooks/useGameLogic.ts` (또는 해당 로직이 있는 파일)

**배경:** 사용자가 버튼을 빠르게 연타하면 상태 전환 중에 중복 입력이 처리되어 상태가 꼬일 수 있다. 컴퓨터 턴이 시작된 직후에도 이전 클릭 이벤트가 처리되는 경우가 있다.

**Step 1: 실패하는 테스트 작성**

현재 테스트 파일 위치를 확인한다:

```bash
cd 369-game && find src -name "*.test.*"
```

`useGameLogic` 훅 테스트에 연타 방지 케이스를 추가한다:

```ts
// src/hooks/__tests__/useGameLogic.test.ts (또는 해당 경로)
it('컴퓨터 턴 중에는 사용자 입력이 무시된다', () => {
  // 컴퓨터 턴 상태에서 handleUserAction을 호출해도 상태가 변하지 않아야 한다
  const { result } = renderHook(() => useGameLogic())

  // 초기 상태는 컴퓨터 턴
  expect(result.current.state.turn).toBe('computer')

  // 컴퓨터 턴 중 사용자 입력 시도
  act(() => {
    result.current.handleUserAction('shout')
  })

  // 상태 변화 없음
  expect(result.current.state.turn).toBe('computer')
  expect(result.current.state.gameOver).toBe(false)
})

it('게임 종료 후 사용자 입력이 무시된다', () => {
  const { result } = renderHook(() => useGameLogic())

  // 게임을 종료 상태로 만든다 (사용자 턴에서 오답 입력)
  // ... 게임 진행 후 게임오버 상태 설정

  act(() => {
    result.current.handleUserAction('shout')
  })

  // gameOver 상태 유지
  expect(result.current.state.gameOver).toBe(true)
})
```

**Step 2: 테스트 실행하여 현재 동작 확인**

```bash
cd 369-game && npm test
```

Expected: 기존 테스트 통과 확인 (새 테스트는 환경에 따라 통과/실패)

**Step 3: 처리 중 플래그 추가로 연타 방지**

`useGameLogic`에서 입력 처리 중임을 나타내는 플래그를 추가한다. 이미 `turn !== 'user'` 조건으로 대부분 방지되어 있다면, 추가로 `isProcessing` 상태를 도입한다:

```ts
// useGameLogic.ts 내 handleUserAction 함수 수정 예시
const handleUserAction = useCallback((action: 'shout' | 'clap') => {
  // 컴퓨터 턴, 게임 종료, 또는 처리 중일 때 입력 무시
  if (state.turn !== 'user' || state.gameOver) return

  // ... 기존 로직
}, [state])
```

**중요:** 이미 `turn !== 'user'` 조건이 있다면 추가 플래그 없이 해당 조건으로 충분하다. YAGNI 원칙 준수 - 실제 문제가 확인될 때만 디바운싱을 추가한다.

**Step 4: 테스트 통과 확인**

```bash
cd 369-game && npm test
```

Expected: 전체 테스트 통과

**Step 5: 커밋**

```bash
cd 369-game && git add -p && git commit -m "fix: 컴퓨터 턴 중 및 게임 종료 후 사용자 입력 완전 차단"
```

---

### Task 4: 엣지케이스 처리 - 큰 숫자 박수 정확성 검증 및 통합 테스트

**복잡도:** 중간 | **예상 소요:** 45분

**Files:**
- Modify: `369-game/src/game/__tests__/gameLogic.test.ts`

**배경:** `countClaps`가 큰 숫자(33, 39, 333, 369, 999 등)에서 정확하게 동작하는지 추가 케이스로 검증한다. 이미 기본 케이스가 있지만 경계값과 특수 케이스를 보강한다.

**Step 1: 실패하는 추가 테스트 작성**

```ts
// src/game/__tests__/gameLogic.test.ts 에 추가
describe('countClaps - 경계값 및 특수 케이스', () => {
  it('100 이상의 숫자에서 3/6/9 없으면 0을 반환한다', () => {
    expect(countClaps(100)).toBe(0)
    expect(countClaps(200)).toBe(0)
    expect(countClaps(1000)).toBe(0)
  })

  it('세 자리 숫자에서 3/6/9가 두 개인 경우', () => {
    expect(countClaps(300)).toBe(1)  // 3만 포함
    expect(countClaps(303)).toBe(2)  // 3이 두 개
    expect(countClaps(336)).toBe(2)  // 3 하나, 6 하나
    expect(countClaps(369)).toBe(3)  // 3, 6, 9 각 하나씩
    expect(countClaps(999)).toBe(3)  // 9가 세 개
  })

  it('숫자 30은 3 하나만 포함하므로 1을 반환한다', () => {
    expect(countClaps(30)).toBe(1)
  })

  it('숫자 300은 3 하나만 포함하므로 1을 반환한다', () => {
    expect(countClaps(300)).toBe(1)
  })
})

describe('getCorrectAction - 큰 숫자 박수 값 검증', () => {
  it('33은 "/박수//박수/" 2개를 반환한다', () => {
    expect(getCorrectAction(33)).toEqual({ type: 'clap', value: '/박수//박수/' })
  })

  it('333은 "/박수/" 3개를 반환한다', () => {
    expect(getCorrectAction(333)).toEqual({ type: 'clap', value: '/박수//박수//박수/' })
  })

  it('369는 "/박수/" 3개를 반환한다', () => {
    expect(getCorrectAction(369)).toEqual({ type: 'clap', value: '/박수//박수//박수/' })
  })

  it('9999는 "/박수/" 4개를 반환한다', () => {
    expect(getCorrectAction(9999)).toEqual({ type: 'clap', value: '/박수//박수//박수//박수/' })
  })
})
```

**Step 2: 테스트 실행하여 현재 상태 확인**

```bash
cd 369-game && npm test
```

Expected: 기존 구현이 올바르면 전부 통과, 문제가 있으면 FAIL

**Step 3: 필요 시 gameLogic.ts 수정**

테스트가 실패하는 경우에만 `countClaps`나 `getCorrectAction`을 수정한다. 이미 통과한다면 이 Step은 건너뛴다.

**Step 4: 전체 테스트 통과 확인**

```bash
cd 369-game && npm test
```

Expected: 전체 통과

**Step 5: 커밋**

```bash
cd 369-game && git add src/game/__tests__/gameLogic.test.ts && git commit -m "test: 큰 숫자 박수 정확성 경계값 테스트 추가"
```

---

### Task 5: UI 폴리싱 - 컴퓨터/사용자 턴 시각적 피드백

**복잡도:** 낮음 | **예상 소요:** 30분

**Files:**
- Modify: `369-game/src/index.css`
- Modify: 해당 컴포넌트 파일 (턴 정보를 렌더링하는 곳)

**배경:** 현재 사용자가 자신의 턴인지 컴퓨터 턴인지 시각적으로 명확하지 않을 수 있다. 색상이나 텍스트로 현재 턴을 구분한다.

**Step 1: 턴 표시 텍스트 확인**

현재 코드에서 턴 표시가 어떻게 구현되어 있는지 확인한다:

```bash
cd 369-game && grep -rn "turn" src/ --include="*.tsx" --include="*.ts"
```

**Step 2: 턴 표시 UI 개선**

컴퓨터 턴일 때와 사용자 턴일 때 색상이나 배경으로 구분한다. GameBoard 또는 해당 컴포넌트에서 턴 상태에 따라 클래스를 다르게 적용한다:

```tsx
// 컴포넌트 내 턴 표시 예시
<div className={`turn-indicator ${turn === 'computer' ? 'turn-computer' : 'turn-user'}`}>
  {turn === 'computer' ? '컴퓨터 차례' : '내 차례'}
</div>
```

```css
/* index.css 추가 */

/* 턴 표시 인디케이터 */
.turn-indicator {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* 컴퓨터 턴: 회색 배경 */
.turn-computer {
  background-color: #f0f0f0;
  color: #666666;
}

/* 사용자 턴: 파란색 배경으로 강조 */
.turn-user {
  background-color: #e3f2fd;
  color: #1565c0;
  font-weight: bold;
}
```

**Step 3: 브라우저에서 시각적 확인**

```bash
cd 369-game && npm run dev
```

Expected: 컴퓨터 턴과 사용자 턴이 색상으로 구분됨

**Step 4: 커밋**

```bash
cd 369-game && git add -p && git commit -m "feat: 컴퓨터/사용자 턴 시각적 피드백 추가"
```

---

### Task 6: UI 폴리싱 - 게임 종료 시 최종 도달 숫자 표시

**복잡도:** 낮음 | **예상 소요:** 30분

**Files:**
- Modify: `369-game/src/hooks/useGameLogic.ts` (또는 상태 관리 파일)
- Modify: 게임 종료 화면 렌더링 컴포넌트

**배경:** 현재 게임 종료 시 "게임 종료" 텍스트만 표시된다. 사용자가 몇 번까지 도달했는지 알 수 있도록 최종 숫자를 함께 표시한다.

**Step 1: 실패하는 테스트 작성**

```ts
// 게임 종료 상태에서 최종 숫자가 보존되는지 확인
it('게임 종료 시 최종 도달 숫자가 상태에 보존된다', () => {
  // useGameLogic 테스트에서 게임오버 발생 시
  // state.currentNumber 또는 state.finalNumber가 마지막 숫자를 가리켜야 함
})
```

**Step 2: 상태에 최종 숫자 저장**

게임 종료 처리 로직에서 `gameOver = true`가 되는 시점에 현재 숫자를 별도 필드로 저장하거나, 기존 `currentNumber`가 유지되는지 확인한다.

이미 `currentNumber`가 보존된다면 추가 필드 없이 그대로 사용한다 (YAGNI).

**Step 3: 게임 종료 화면 UI 수정**

```tsx
// 게임 종료 시 렌더링 예시
{gameOver && (
  <div className="game-over-screen">
    <div className="game-over-text">게임 종료</div>
    <div className="final-number">최종 도달 숫자: {currentNumber}</div>
  </div>
)}
```

```css
/* index.css 추가 */

/* 게임 종료 화면 */
.game-over-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* 게임 종료 텍스트 */
.game-over-text {
  font-size: 25px;
  font-weight: bold;
  color: #c62828;
}

/* 최종 도달 숫자 */
.final-number {
  font-size: 16px;
  color: #555555;
}
```

**Step 4: 브라우저에서 확인**

```bash
cd 369-game && npm run dev
```

Expected: 게임 종료 시 "게임 종료" 텍스트 + "최종 도달 숫자: N" 표시

**Step 5: 커밋**

```bash
cd 369-game && git add -p && git commit -m "feat: 게임 종료 시 최종 도달 숫자 표시"
```

---

### Task 7: UI 폴리싱 - viewport 상대 위치 재검증 및 버튼 스타일 보강

**복잡도:** 낮음 | **예상 소요:** 30분

**Files:**
- Modify: `369-game/src/index.css`

**Step 1: 브라우저 리사이즈 직접 확인**

```bash
cd 369-game && npm run dev
```

브라우저 개발자 도구에서 반응형 모드로 다음 크기를 확인:
- 375 x 667 (모바일)
- 768 x 1024 (태블릿)
- 1920 x 1080 (데스크톱)

각 크기에서 모든 버튼이 화면 안에 보이는지, 레이아웃이 겹치지 않는지 확인한다.

**Step 2: 난이도 버튼 우측 상단 위치 재검증**

PRD 요구사항: 난이도 버튼은 우측 상단 `position: fixed`, `top`, `right` 위치.

현재 CSS를 확인하고 모바일에서도 버튼이 잘리지 않도록 최소 여백을 보장한다:

```css
/* index.css - 난이도 버튼 컨테이너 */
.difficulty-buttons {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: row;
  gap: 8px;
}
```

**Step 3: 버튼 hover/active 스타일 일관성 확인**

모든 버튼 클래스(`.game-button`, `.difficulty-button`, `.reset-button`)에 hover/active/disabled 상태 스타일이 일관되게 적용되어 있는지 확인한다.

누락된 상태 스타일을 추가한다:

```css
/* 난이도 버튼 선택 상태 */
.difficulty-button.selected {
  background-color: #1565c0;
  color: #ffffff;
  border-color: #1565c0;
}

.difficulty-button:hover:not(:disabled):not(.selected) {
  background-color: #e3f2fd;
}
```

**Step 4: 브라우저 리사이즈 최종 확인**

```bash
cd 369-game && npm run dev
```

Expected: 375px 너비에서 난이도 버튼 3개가 잘리지 않고 표시됨

**Step 5: 커밋**

```bash
cd 369-game && git add src/index.css && git commit -m "fix: viewport 상대 위치 재검증 및 버튼 스타일 일관성 보강"
```

---

### Task 8: 전체 기능 통합 테스트 - 시나리오 테스트 보강

**복잡도:** 중간 | **예상 소요:** 60분

**Files:**
- Modify/Create: `369-game/src/game/__tests__/gameLogic.test.ts`
- Modify/Create: 통합 테스트 파일 (현재 구조에 맞게)

**Step 1: 현재 테스트 커버리지 확인**

```bash
cd 369-game && npm test -- --coverage
```

**Step 2: 게임 시작~종료 시나리오 테스트 작성**

```ts
// 게임 플로우 통합 테스트 예시
describe('게임 전체 플로우', () => {
  it('숫자 1부터 시작하여 오답 시 게임이 종료된다', () => {
    // 1. 초기 상태: currentNumber=1, turn='computer'
    // 2. 컴퓨터 턴 처리 후 turn='user', currentNumber=2
    // 3. 사용자가 오답('clap') 입력 시 gameOver=true
    // 4. 게임오버 상태에서 추가 입력 무시
  })

  it('숫자 3에서 컴퓨터는 박수를 수행한다', () => {
    // getCorrectAction(3).type === 'clap' 확인
    expect(getCorrectAction(3).type).toBe('clap')
    expect(getCorrectAction(3).value).toBe('/박수/')
  })

  it('숫자 12에서 컴퓨터는 숫자를 외친다', () => {
    // getCorrectAction(12).type === 'shout' 확인
    expect(getCorrectAction(12).type).toBe('shout')
    expect(getCorrectAction(12).value).toBe('12')
  })

  it('리셋 후 게임이 초기 상태로 돌아온다', () => {
    // currentNumber=1, turn='computer', gameOver=false
  })
})

describe('난이도별 타이머 설정 검증', () => {
  it('쉬움 난이도의 제한 시간은 5000ms이다', () => {
    // DIFFICULTY_SETTINGS 또는 해당 상수 파일에서 확인
    // expect(DIFFICULTY_SETTINGS.easy.timeLimit).toBe(5000)
  })

  it('보통 난이도의 제한 시간은 3000ms이다', () => {
    // expect(DIFFICULTY_SETTINGS.normal.timeLimit).toBe(3000)
  })

  it('어려움 난이도의 제한 시간은 1000ms이다', () => {
    // expect(DIFFICULTY_SETTINGS.hard.timeLimit).toBe(1000)
  })
})
```

**Step 3: 테스트 실행**

```bash
cd 369-game && npm test
```

Expected: 전체 테스트 통과

**Step 4: 커밋**

```bash
cd 369-game && git add -p && git commit -m "test: 게임 전체 시나리오 및 난이도 설정 통합 테스트 추가"
```

---

### Task 9: 최종 품질 검증

**복잡도:** 낮음 | **예상 소요:** 20분

**Files:**
- 수정 없음 (검증만 수행)

**Step 1: TypeScript 컴파일 최종 확인**

```bash
cd 369-game && npx tsc --noEmit
```

Expected: "Found 0 errors"

**Step 2: 전체 테스트 최종 실행**

```bash
cd 369-game && npm test
```

Expected: 전체 테스트 통과

**Step 3: 개발 서버 실행 및 콘솔 에러 확인**

```bash
cd 369-game && npm run dev
```

브라우저 개발자 도구 Console 탭에서 에러/경고 없음을 확인한다.

**Step 4: 게임을 숫자 30까지 수동으로 플레이하여 이상 없음 확인**

확인 항목:
- 3, 6, 9, 12, 18, 21, 30 등 각 숫자에서 박수/외치기 정확성
- 33, 36, 39에서 박수 2번 정확성
- 타이머가 각 난이도에서 정상 동작
- 키보드 `a`, `l` 단축키 동작

---

## 완료 기준 (Definition of Done)

- ✅ TypeScript 컴파일 에러 없음 (`npx tsc --noEmit` 통과)
- ✅ 전체 단위 테스트 통과 (`npm test`)
- ✅ 콘솔 에러/경고 없음 (`npm run dev` 후 브라우저 확인)
- ⬜ 게임을 30 이상까지 정상 진행 가능 (다양한 3/6/9 조합 검증) - 수동 확인
- ⬜ 모든 난이도에서 타이머 정상 동작 - 수동 확인
- ⬜ 브라우저 리사이즈 시 레이아웃 깨지지 않음 - 수동 확인
- ✅ 게임 종료 후 추가 입력 완전 차단
- ✅ 게임 종료 시 최종 도달 숫자 표시
- ✅ 컴퓨터/사용자 턴 시각적 구분
- ✅ PRD의 모든 요구사항이 구현 및 검증됨

---

## Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증 (sprint-close 시점에 수행)

**전체 게임 플로우 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 초기 상태: 숫자 1, 컴퓨터 턴 표시 확인
3. 컴퓨터 턴 완료 후 `browser_click` -> "숫자외치기" (숫자 2)
4. `browser_snapshot` -> 컴퓨터가 숫자 3에 "/박수/" 수행 확인
5. `browser_click` -> "박수" (숫자 4 - 오답이므로 게임 종료 예상)
6. `browser_snapshot` -> "게임 종료" + "최종 도달 숫자" 표시 확인

**게임 종료 후 입력 차단 검증:**
1. 게임 종료 상태에서 `browser_click` -> "숫자외치기" 버튼 클릭
2. `browser_snapshot` -> 상태 변화 없음 확인 (게임 종료 유지)

**난이도 변경 후 타이머 검증:**
1. `browser_click` -> "어려움" 난이도 선택
2. `browser_click` -> "리셋" 버튼 클릭
3. `browser_snapshot` -> 게임 초기화, 타이머 1초 제한 확인
4. 1초 경과 대기 후 `browser_snapshot` -> 시간 초과 "게임 종료" 확인

**키보드 단축키 + 버튼 혼용 검증:**
1. `browser_navigate` -> 페이지 새로고침
2. 컴퓨터 턴 완료 후 `browser_keyboard` -> `a` 키 입력 (숫자외치기)
3. `browser_snapshot` -> 다음 숫자로 정상 진행 확인
4. 컴퓨터 턴 완료 후 `browser_click` -> "박수" 버튼 클릭
5. `browser_snapshot` -> 정상 진행 또는 오답 처리 확인

**반응형 레이아웃 검증:**
1. `browser_resize` -> 모바일 크기 (375 x 667)
2. `browser_snapshot` -> 모든 버튼이 화면 안에 표시됨 확인
3. `browser_resize` -> 데스크톱 크기 (1920 x 1080)
4. `browser_snapshot` -> 레이아웃 정상 확인

**콘솔 에러 최종 확인:**
1. `browser_console_messages(level: "error")` -> 전체 과정에서 에러 없음

---

## 의존성 및 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| Sprint 1 구현 파일 구조가 예상과 다를 수 있음 | 높음 | Task 1에서 실제 파일 구조 분석 후 Task별 파일 경로 조정 |
| TypeScript strict 모드 활성화 시 기존 코드에 다수 에러 발생 | 중간 | 에러 개수 파악 후 단계적 해소, 한 번에 처리하지 않고 커밋 단위로 분리 |
| 디바운싱 추가 시 기존 동작 변경 가능성 | 낮음 | 기존 `turn !== 'user'` 조건으로 충분한지 먼저 확인, YAGNI 원칙 적용 |
| viewport 리사이즈 시 난이도 버튼 3개가 좁은 화면에서 겹칠 수 있음 | 낮음 | 버튼 간격/크기 조정 또는 세로 배치로 대응 |

---

## 예상 산출물

스프린트 2 완료 시 다음 결과물이 생성/수정됩니다:

1. `369-game/src/game/__tests__/gameLogic.test.ts` - 경계값 및 통합 테스트 추가
2. `369-game/src/hooks/useGameLogic.ts` - 엣지케이스 방어 조건 보강 (필요 시)
3. `369-game/src/index.css` - 턴 표시, 게임 종료 화면, 버튼 스타일 개선
4. `369-game/tsconfig.json` - strict 모드 옵션 확인/추가
5. `369-game/src/` 전체 `.ts/.tsx` - 미사용 import 제거, 한국어 주석 정리
6. `docs/sprint/sprint2/playwright-report.md` - Playwright 검증 보고서 (sprint-close 시 생성)

---

## 기술적 접근 방법

### 엣지케이스 처리 원칙
- 기존 로직 변경을 최소화하고 방어적 조건문(`if` 가드) 추가
- 이미 `disabled` 속성과 `turn !== 'user'` 조건이 있는 경우 중복 방어 불필요 (YAGNI)
- 실제 버그가 발견된 경우에만 수정 (예상되는 문제에 미리 대응하지 않음)

### 리팩토링 원칙
- 동작 변경 없이 구조만 개선
- 테스트가 통과하는 상태를 유지하며 작업
- 각 변경 사항은 작은 단위로 커밋 (기능별, 파일별)

### 코드 품질 원칙 (Karpathy Guidelines 준수)
- YAGNI: 요구되지 않은 기능/추상화 추가 금지
- DRY: 중복 제거는 명확한 경우에만
- 불필요한 컴포넌트 분리 금지 (현재 구조로 충분한 경우)
