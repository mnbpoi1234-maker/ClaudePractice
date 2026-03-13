# Sprint 3: Backlog 기능 구현 (게임 기록, 사운드, 모바일, 접근성)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** MVP 완성 이후 Backlog에 쌓인 4가지 기능(게임 기록, 사운드 효과, 모바일 최적화, 접근성 강화)을 단순하고 최소한의 추상화로 구현한다.

**Architecture:** 기존 컴포넌트 구조(`useGameLogic`, `useTimer`, `useKeyboardShortcut`, `GameBoard`, `ActionButtons`, `DifficultyButtons`, `ResetButton`)를 최소한으로 수정한다. localStorage 직접 호출, Web Audio API 직접 호출 방식으로 외부 라이브러리 없이 구현한다. Karpathy Guidelines 준수: 단순하게, 필요한 것만, 최소한의 추상화로.

**Tech Stack:** React 18+, TypeScript, Vite, Vitest, 순수 CSS, Web Audio API, localStorage

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 3 |
| 기간 | 2026-03-13 ~ 2026-03-26 (2주) |
| 담당 Phase | Backlog: 게임 기록 / 사운드 효과 / 모바일 최적화 / 접근성 강화 |
| 마일스톤 | 폴리싱 완성 (Enhanced MVP) |

---

## 스프린트 목표

MVP를 기반으로 사용자 경험을 향상시키는 4가지 Backlog 항목을 구현한다. 각 기능은 독립적으로 동작하며, 기존 게임 로직에 영향을 주지 않는다.

---

## 구현 범위

### 포함 (In Scope)
- **게임 기록**: 최고 도달 숫자를 localStorage에 저장 및 UI 표시
- **사운드 효과**: 박수 소리(정답 박수 입력 시), 게임 종료 효과음 (Web Audio API)
- **모바일 최적화**: 터치 인터페이스 개선 (버튼 크기 44px 이상, 적절한 gap)
- **접근성 강화**: ARIA 레이블, 스크린리더용 안내 텍스트

### 제외 (Out of Scope)
- 멀티플레이어 기능
- 외부 오디오 파일(.mp3 등) 사용 (Web Audio API 합성음만 사용)
- 외부 라이브러리(react-aria, react-spring 등) 도입
- 게임 기록 서버 저장 (localStorage만 사용)
- 리더보드 / 랭킹 시스템

---

## 작업 분해 (Task Breakdown)

---

### Task 1: 현재 코드베이스 파일 구조 파악

**복잡도:** 낮음 | **예상 소요:** 15분

**Files:**
- 수정 없음 (분석만 수행)

**Step 1: 실제 파일 구조 확인**

```bash
find 369-game/src -type f | sort
```

Expected: `src/` 하위 `.ts`, `.tsx`, `.css` 파일 목록 출력

**Step 2: 게임 상태 타입 파악**

```bash
cat 369-game/src/types/game.ts
```

또는 타입 파일이 다른 경로에 있을 경우:

```bash
grep -rn "GameState\|gameOver\|currentNumber" 369-game/src --include="*.ts" --include="*.tsx" | head -30
```

Expected: `GameState` 인터페이스와 `currentNumber`, `gameOver` 필드 위치 파악

**Step 3: App.tsx 또는 최상위 컴포넌트에서 게임 상태 전달 방식 파악**

```bash
cat 369-game/src/App.tsx
```

Expected: `useGameLogic` 훅에서 상태를 받아 컴포넌트에 prop으로 전달하는 구조 파악

**Step 4: 기존 테스트 파일 위치 확인**

```bash
find 369-game/src -name "*.test.*" | sort
```

Expected: 테스트 파일 경로 목록 (Task 2, 3, 4에서 파일 경로 확정에 사용)

---

### Task 2: 게임 기록 — localStorage 저장 및 UI 표시

**복잡도:** 중간 | **예상 소요:** 45분

**Files:**
- Create: `369-game/src/utils/bestScore.ts`
- Modify: `369-game/src/App.tsx` (또는 게임 종료 처리가 있는 파일)
- Modify: `369-game/src/App.css` 또는 `369-game/src/index.css`

**배경:** 게임 종료 시 현재 도달 숫자(`currentNumber`)가 최고 기록보다 높으면 localStorage에 저장한다. 화면 상단에 "최고 기록: N" 형태로 항상 표시한다.

**Step 1: 실패하는 테스트 작성**

`369-game/src/utils/bestScore.test.ts` 파일을 생성한다:

```ts
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
```

**Step 2: 테스트 실행하여 실패 확인**

```bash
cd 369-game && npm test -- bestScore
```

Expected: FAIL (파일 없음)

**Step 3: bestScore.ts 구현**

`369-game/src/utils/bestScore.ts`를 생성한다:

```ts
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
```

**Step 4: 테스트 실행하여 통과 확인**

```bash
cd 369-game && npm test -- bestScore
```

Expected: 전체 통과

**Step 5: App.tsx에서 게임 종료 시 최고 기록 저장**

`App.tsx`에서 게임 종료 처리 시점(`gameOver`가 `true`로 바뀌는 곳)을 찾는다.

```bash
grep -n "gameOver" 369-game/src/App.tsx
```

게임 종료 시 `saveBestScore`를 호출하는 `useEffect`를 추가한다. App.tsx 상단에 import를 추가하고, 기존 `gameOver` 상태 변화를 감지하는 `useEffect` 안에서 호출한다:

```tsx
// App.tsx 상단에 추가
import { getBestScore, saveBestScore } from './utils/bestScore'

// 컴포넌트 내부에 추가
const [bestScore, setBestScore] = useState<number>(() => getBestScore())

useEffect(() => {
  // gameOver가 true로 바뀌는 순간에만 저장 시도
  if (gameOver) {
    saveBestScore(currentNumber)
    setBestScore(getBestScore())
  }
}, [gameOver])
```

`gameOver`, `currentNumber`가 `useGameLogic` 훅에서 오는 경우 해당 훅의 반환값에서 구조분해한 변수명을 그대로 사용한다.

**Step 6: 최고 기록 UI 표시**

`App.tsx`의 JSX에서 최고 기록 표시를 추가한다. 기존 레이아웃의 상단(난이도 버튼 영역 등과 겹치지 않는 위치, 예: 좌측 상단 고정)에 배치한다:

```tsx
{/* 최고 기록 표시 — 좌측 상단 고정 */}
<div className="best-score">
  최고 기록: {bestScore}
</div>
```

**Step 7: CSS 추가**

`index.css` (또는 `App.css`)에 추가한다:

```css
/* 최고 기록 표시 — 좌측 상단 고정 */
.best-score {
  position: fixed;
  top: 16px;
  left: 16px;
  font-size: 14px;
  color: #555555;
}
```

**Step 8: 개발 서버에서 동작 확인**

```bash
cd 369-game && npm run dev
```

확인 항목:
- 화면 좌측 상단에 "최고 기록: 0" 표시
- 게임 플레이 후 종료 시 최고 기록 갱신 여부
- 브라우저 새로고침 후 최고 기록 유지 여부 (localStorage 확인: F12 > Application > Local Storage)

**Step 9: 커밋**

```bash
cd 369-game && git add src/utils/bestScore.ts src/utils/bestScore.test.ts src/App.tsx src/index.css && git commit -m "feat: 최고 도달 숫자 localStorage 저장 및 표시"
```

---

### Task 3: 사운드 효과 — Web Audio API 합성음

**복잡도:** 중간 | **예상 소요:** 60분

**Files:**
- Create: `369-game/src/utils/sound.ts`
- Modify: `369-game/src/App.tsx` (또는 `ActionButtons.tsx`에서 박수 입력 처리하는 곳)

**배경:** 외부 오디오 파일 없이 Web Audio API의 `OscillatorNode`로 합성음을 생성한다. 정답 박수 입력 시 짧은 박수음, 게임 종료 시 낮은 종료음을 재생한다. 사용자가 처음 클릭하기 전에는 AudioContext를 생성하지 않는다(브라우저 autoplay 정책).

**Step 1: sound.ts 구현 (테스트 없이 직접 구현)**

Web Audio API는 브라우저 전용이므로 Vitest에서 테스트하기 어렵다. 구현 후 브라우저에서 직접 확인한다.

`369-game/src/utils/sound.ts`를 생성한다:

```ts
/** AudioContext는 사용자 제스처 이후 생성한다 (브라우저 autoplay 정책). */
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

/**
 * 짧은 비프음을 재생한다.
 * @param frequency - 주파수 (Hz)
 * @param duration - 재생 시간 (초)
 * @param type - 파형 종류
 */
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine'
): void {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // 클릭음 방지를 위해 부드럽게 시작/종료
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // AudioContext 미지원 환경에서는 무음 처리
  }
}

/** 정답 박수 입력 시 재생하는 효과음 (밝은 단음) */
export function playClapSound(): void {
  playTone(880, 0.12, 'triangle')
}

/** 게임 종료 시 재생하는 효과음 (낮은 하강음) */
export function playGameOverSound(): void {
  playTone(220, 0.4, 'sawtooth')
}
```

**Step 2: App.tsx에서 사운드 연결**

정답 박수 입력 처리 위치를 찾는다:

```bash
grep -n "clap\|handleUserAction\|onAction" 369-game/src/App.tsx 369-game/src/components/ActionButtons.tsx 2>/dev/null | head -20
```

App.tsx 상단에 import 추가:

```tsx
import { playClapSound, playGameOverSound } from './utils/sound'
```

사용자가 박수(`clap`) 정답을 입력할 때 `playClapSound()`를 호출한다. 구체적인 위치는 Step 1에서 확인한 파일 구조에 따라 다르다.

예시 (App.tsx에서 직접 처리하는 경우):

```tsx
// 사용자 액션 처리 함수 내
const handleUserAction = (action: 'shout' | 'clap') => {
  const correct = getCorrectAction(currentNumber)
  if (correct.type === 'clap' && action === 'clap') {
    playClapSound()  // 정답 박수일 때만 소리
  }
  // 기존 게임 로직 호출
  dispatch({ type: 'USER_ACTION', action })
}
```

게임 종료 useEffect에서 `playGameOverSound()` 호출:

```tsx
useEffect(() => {
  if (gameOver) {
    playGameOverSound()
    saveBestScore(currentNumber)
    setBestScore(getBestScore())
  }
}, [gameOver])
```

**Step 3: 브라우저에서 사운드 동작 확인**

```bash
cd 369-game && npm run dev
```

확인 항목:
- 박수 정답 입력 시 짧은 비프음 재생
- 게임 종료 시 낮은 효과음 재생
- 새로고침 후 첫 클릭 시 소리 재생 여부 (autoplay 정책 우회 확인)
- 브라우저 콘솔에 AudioContext 관련 에러 없음

**Step 4: 커밋**

```bash
cd 369-game && git add src/utils/sound.ts src/App.tsx && git commit -m "feat: Web Audio API 합성음 효과음 추가 (박수, 게임 종료)"
```

---

### Task 4: 모바일 최적화 — 터치 인터페이스 개선

**복잡도:** 낮음 | **예상 소요:** 40분

**Files:**
- Modify: `369-game/src/index.css` 또는 `369-game/src/App.css`

**배경:** 모바일에서 버튼 탭 영역이 너무 작거나 버튼 간격이 좁아서 오탭이 발생할 수 있다. Apple HIG 권장 최소 터치 영역은 44x44pt이다. CSS만으로 대응한다.

**Step 1: 현재 버튼 크기 CSS 확인**

```bash
grep -n "width\|height\|gap\|padding" 369-game/src/index.css 369-game/src/App.css 2>/dev/null
```

Expected: 현재 버튼 크기 값 파악 (예: `100px x 50px`)

**Step 2: 모바일 미디어 쿼리 추가**

`index.css`에 모바일 대응 미디어 쿼리를 추가한다. 기존 데스크톱 스타일은 변경하지 않는다.

```css
/* ===========================
   모바일 최적화 (768px 이하)
   =========================== */
@media (max-width: 768px) {
  /* 액션 버튼 (숫자외치기, 박수) — 터치 영역 확보 */
  .action-button {
    width: 120px;
    height: 52px;
    font-size: 15px;
  }

  /* 액션 버튼 컨테이너 — 버튼 간격 확대 */
  .action-buttons {
    gap: 16px;
  }

  /* 난이도 버튼 — 터치 영역 확보 */
  .difficulty-button {
    min-width: 64px;
    height: 44px;
    font-size: 13px;
    padding: 0 8px;
  }

  /* 난이도 버튼 컨테이너 — 간격 유지 */
  .difficulty-buttons {
    gap: 6px;
  }

  /* 리셋 버튼 */
  .reset-button {
    min-width: 64px;
    height: 44px;
  }
}
```

클래스 이름은 Step 1에서 확인한 실제 클래스명으로 교체한다.

**Step 3: 모바일에서 탭 하이라이트 제거 (UX 개선)**

모바일 브라우저의 기본 탭 하이라이트가 게임 UI와 어울리지 않을 수 있다:

```css
/* 모바일 탭 하이라이트 제거 */
button {
  -webkit-tap-highlight-color: transparent;
}
```

**Step 4: 브라우저 개발자 도구에서 모바일 크기 확인**

```bash
cd 369-game && npm run dev
```

브라우저 DevTools > Toggle device toolbar에서 다음 크기로 확인:
- iPhone SE (375 x 667)
- iPhone 14 Pro (390 x 844)

확인 항목:
- 버튼 간격이 충분하여 오탭 위험 낮음
- 난이도 버튼 3개가 잘리지 않고 모두 표시됨
- 게임 영역이 화면을 벗어나지 않음

**Step 5: 커밋**

```bash
cd 369-game && git add src/index.css && git commit -m "fix: 모바일 터치 버튼 크기 및 간격 개선"
```

---

### Task 5: 접근성 강화 — ARIA 레이블 및 스크린리더 지원

**복잡도:** 중간 | **예상 소요:** 50분

**Files:**
- Modify: `369-game/src/components/ActionButtons.tsx`
- Modify: `369-game/src/components/DifficultyButtons.tsx`
- Modify: `369-game/src/components/ResetButton.tsx`
- Modify: `369-game/src/components/GameBoard.tsx` (또는 게임 상태 표시 컴포넌트)
- Modify: `369-game/src/index.css` 또는 `369-game/src/App.css`

**배경:** 스크린리더 사용자가 게임 상태(현재 숫자, 현재 턴, 타이머)를 인지할 수 있도록 ARIA 속성을 추가한다. 시각적으로는 보이지 않지만 스크린리더가 읽을 수 있는 텍스트(`sr-only`)를 활용한다.

**Step 1: 현재 컴포넌트 props 파악**

```bash
cat 369-game/src/components/ActionButtons.tsx
cat 369-game/src/components/DifficultyButtons.tsx
cat 369-game/src/components/ResetButton.tsx
```

Expected: 각 컴포넌트의 props와 버튼 구조 파악

**Step 2: sr-only 유틸리티 클래스 추가**

`index.css`에 스크린리더 전용 텍스트 클래스를 추가한다:

```css
/* 스크린리더 전용 텍스트 — 화면에는 보이지 않지만 스크린리더가 읽는다 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Step 3: ActionButtons에 ARIA 속성 추가**

`ActionButtons.tsx`에서 버튼에 `aria-label`을 추가한다. 현재 숫자와 기대 행동을 함께 알려주는 것이 좋다.

```tsx
{/* 변경 전 */}
<button onClick={() => onAction('shout')} disabled={disabled}>
  숫자외치기
</button>
<button onClick={() => onAction('clap')} disabled={disabled}>
  박수
</button>

{/* 변경 후 */}
<button
  onClick={() => onAction('shout')}
  disabled={disabled}
  aria-label="숫자외치기 (단축키: A)"
>
  숫자외치기
</button>
<button
  onClick={() => onAction('clap')}
  disabled={disabled}
  aria-label="박수치기 (단축키: L)"
>
  박수
</button>
```

**Step 4: DifficultyButtons에 ARIA 속성 추가**

`DifficultyButtons.tsx`에서 현재 선택된 난이도를 `aria-pressed`로 표시한다:

```tsx
{/* 난이도 버튼 예시 */}
<button
  className={`difficulty-button ${difficulty === 'easy' ? 'selected' : ''}`}
  onClick={() => onDifficultyChange('easy')}
  aria-pressed={difficulty === 'easy'}
  aria-label="쉬움 난이도 (제한 시간 5초)"
>
  쉬움
</button>
<button
  className={`difficulty-button ${difficulty === 'normal' ? 'selected' : ''}`}
  onClick={() => onDifficultyChange('normal')}
  aria-pressed={difficulty === 'normal'}
  aria-label="보통 난이도 (제한 시간 3초)"
>
  보통
</button>
<button
  className={`difficulty-button ${difficulty === 'hard' ? 'selected' : ''}`}
  onClick={() => onDifficultyChange('hard')}
  aria-pressed={difficulty === 'hard'}
  aria-label="어려움 난이도 (제한 시간 1초)"
>
  어려움
</button>
```

실제 prop 이름과 클래스명은 Step 1에서 파악한 값을 사용한다.

**Step 5: 게임 상태 영역에 aria-live 추가**

게임 상태(현재 숫자, 행동 텍스트)가 바뀔 때 스크린리더가 자동으로 읽도록 `aria-live` 영역을 추가한다. `GameBoard.tsx` 또는 해당 컴포넌트에서 찾는다:

```tsx
{/* 게임 상태 안내 영역 — 스크린리더가 변경 시 자동 읽음 */}
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {gameOver
    ? `게임 종료. 최종 도달 숫자: ${currentNumber}`
    : `현재 숫자 ${currentNumber}. ${turn === 'computer' ? '컴퓨터 차례입니다.' : '당신의 차례입니다.'}`}
</div>
```

`aria-live="polite"`는 현재 진행 중인 읽기가 끝난 후 읽는다. 게임처럼 빠른 전환이 있는 경우 적합하다.

**Step 6: ResetButton에 aria-label 추가**

```tsx
<button
  className="reset-button"
  onClick={onReset}
  aria-label="게임 다시 시작"
>
  리셋
</button>
```

**Step 7: TypeScript 컴파일 확인**

```bash
cd 369-game && npx tsc --noEmit
```

Expected: "Found 0 errors"

**Step 8: 개발 서버에서 확인**

```bash
cd 369-game && npm run dev
```

확인 항목 (macOS VoiceOver 또는 Windows Narrator로 확인하거나 브라우저 DevTools Accessibility 탭 사용):
- 버튼에 마우스 오버 시 aria-label 내용이 툴팁으로 확인됨
- DevTools > Accessibility 탭에서 각 버튼의 accessible name이 올바르게 표시됨
- 난이도 버튼의 `aria-pressed` 상태가 선택 시 변경됨

**Step 9: 커밋**

```bash
cd 369-game && git add src/components/ src/index.css && git commit -m "feat: ARIA 레이블 및 스크린리더 지원 추가"
```

---

### Task 6: 최종 품질 검증

**복잡도:** 낮음 | **예상 소요:** 20분

**Files:**
- 수정 없음 (검증만 수행)

**Step 1: TypeScript 컴파일 최종 확인**

```bash
cd 369-game && npx tsc --noEmit
```

Expected: "Found 0 errors"

**Step 2: 전체 테스트 실행**

```bash
cd 369-game && npm test
```

Expected: 전체 통과 (최소 bestScore 관련 테스트 포함)

**Step 3: 개발 서버 실행 후 수동 확인 체크리스트**

```bash
cd 369-game && npm run dev
```

확인 항목:
- ⬜ 화면 좌측 상단에 "최고 기록: 0" 표시
- ⬜ 게임 종료 시 최고 기록 갱신
- ⬜ 브라우저 새로고침 후 최고 기록 유지 (localStorage)
- ⬜ 정답 박수 입력 시 효과음 재생
- ⬜ 게임 종료 시 효과음 재생
- ⬜ 모바일 375px 너비에서 버튼이 잘리지 않음
- ⬜ 버튼 aria-label이 DevTools Accessibility 탭에서 확인됨
- ⬜ 콘솔 에러 없음

---

## 완료 기준 (Definition of Done)

- ✅ `npx tsc --noEmit` 통과 (TypeScript 에러 없음)
- ✅ `npm test` 전체 통과 (27개, bestScore 유닛 테스트 포함)
- ✅ 최고 기록이 localStorage에 저장되고 새로고침 후 유지됨
- ⬜ 박수 정답 입력 시 효과음, 게임 종료 시 효과음 재생 (수동 확인 필요)
- ⬜ 모바일(375px)에서 버튼이 잘리지 않고 탭 영역이 충분함 (수동 확인 필요)
- ✅ 버튼에 적절한 aria-label, aria-pressed, aria-live 속성이 부여됨
- ⬜ 콘솔 에러/경고 없음 (수동 확인 필요)
- ✅ 기존 게임 로직 회귀 없음 (27개 테스트 전체 통과)

---

## Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증 (sprint-close 시점에 수행)

**게임 기록 검증:**
1. `browser_navigate` -> `http://localhost:5173` 접속
2. `browser_snapshot` -> 좌측 상단에 "최고 기록: 0" 표시 확인
3. 게임을 플레이하여 종료 후 `browser_snapshot` -> 최고 기록 갱신 확인
4. `browser_navigate` -> 페이지 새로고침
5. `browser_snapshot` -> 최고 기록이 유지됨 확인

**사운드 검증 (수동):**
- 브라우저에서 직접 박수 버튼 클릭 후 소리 확인 (자동화 어려움)

**모바일 최적화 검증:**
1. `browser_resize` -> 375 x 667 (iPhone SE)
2. `browser_snapshot` -> 버튼이 모두 표시됨 확인, 잘림 없음
3. `browser_resize` -> 1920 x 1080
4. `browser_snapshot` -> 데스크톱 레이아웃 정상 확인

**접근성 검증:**
1. `browser_snapshot` -> 각 버튼에 aria-label 속성 포함 확인
2. `browser_snapshot` -> 난이도 버튼에 aria-pressed 속성 확인

**콘솔 에러 최종 확인:**
1. `browser_console_messages(level: "error")` -> 에러 없음

---

## 의존성 및 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 실제 컴포넌트 파일 구조가 예상과 다를 수 있음 | 높음 | Task 1에서 실제 파일 구조 분석 후 파일 경로 확정 |
| Web Audio API가 일부 환경에서 미지원 | 낮음 | try-catch로 감싸 무음 처리 (구현 시 포함) |
| 브라우저 autoplay 정책으로 첫 로드 시 소리 없음 | 중간 | 첫 사용자 제스처 이후 AudioContext 생성 (구현 시 처리) |
| 실제 CSS 클래스명이 예상과 다를 수 있음 | 중간 | Task 1에서 실제 클래스명 파악 후 Task 4, 5에서 교체 |
| ARIA 속성 추가 시 기존 스타일 깨짐 | 낮음 | ARIA 속성은 스타일에 영향 없음, `aria-pressed` 스타일만 주의 |

---

## 예상 산출물

스프린트 3 완료 시 다음 결과물이 생성/수정됩니다:

1. `369-game/src/utils/bestScore.ts` — localStorage 기반 최고 기록 유틸리티
2. `369-game/src/utils/bestScore.test.ts` — 최고 기록 유틸리티 유닛 테스트
3. `369-game/src/utils/sound.ts` — Web Audio API 사운드 효과 유틸리티
4. `369-game/src/App.tsx` — 최고 기록 저장/표시, 사운드 연결
5. `369-game/src/index.css` — 최고 기록 UI, 모바일 미디어 쿼리, sr-only 클래스
6. `369-game/src/components/ActionButtons.tsx` — aria-label 추가
7. `369-game/src/components/DifficultyButtons.tsx` — aria-label, aria-pressed 추가
8. `369-game/src/components/ResetButton.tsx` — aria-label 추가
9. `369-game/src/components/GameBoard.tsx` — aria-live 상태 안내 추가
10. `docs/sprint/sprint3/playwright-report.md` — Playwright 검증 보고서 (sprint-close 시 생성)

---

## 기술적 접근 방법

### 게임 기록 원칙
- localStorage 직접 호출 (별도 추상화 불필요, 단순 유틸 함수로 충분)
- React state는 `getBestScore()` 초기값으로 설정, 게임 종료 시에만 갱신
- localStorage 키: `369_best_score` (충돌 방지를 위해 앱 전용 prefix 사용)

### 사운드 원칙
- 외부 오디오 파일 없이 Web Audio API 합성음만 사용 (빌드 용량 최소화)
- AudioContext는 싱글톤 패턴 (모듈 스코프 변수), 첫 사용자 클릭 이후 생성
- try-catch로 예외 처리 (AudioContext 미지원 환경 무음 처리)
- 사운드는 독립된 유틸 함수로 분리 (테스트 불필요, 브라우저에서 직접 확인)

### 모바일 원칙
- CSS 미디어 쿼리(`@media (max-width: 768px)`)만 사용, JS 불필요
- 기존 데스크톱 스타일 변경 없이 모바일 오버라이드만 추가
- 최소 터치 영역: 높이 44px (Apple HIG 권장)

### 접근성 원칙
- ARIA 속성은 최소한으로 (과도한 ARIA는 오히려 해가 됨)
- 시각적 정보가 충분한 곳은 aria-label 생략
- `aria-live="polite"` 로 게임 상태 변화를 스크린리더에 전달
- `.sr-only`는 시각적으로는 숨기되 스크린리더는 읽는 표준 패턴 사용
