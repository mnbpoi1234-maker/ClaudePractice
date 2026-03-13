# Sprint 1 코드 리뷰 보고서

**검토 대상**: Sprint 1 구현 (369 게임 React+TypeScript)
**검토 기준**: sprint1.md 계획 문서, Karpathy Guidelines, 코드 품질 기준
**검토 일시**: 2026-03-13
**검토자**: code-reviewer 에이전트

---

## 전체 평가

Sprint 1 구현은 계획 문서 대비 **범위를 초과**하여 Sprint 2 기능(난이도 버튼, 타이머, 키보드 단축키)까지 포함하고 있습니다. 이는 Karpathy Guidelines의 YAGNI 원칙 위반에 해당하나, 코드 품질 자체는 매우 높습니다. 아키텍처 설계, 타입 안전성, 관심사 분리가 모두 우수합니다.

---

## Important (수정 권장)

### 1. Sprint 1 범위 초과 구현

**위치**: `App.tsx`, `useTimer.ts`, `useKeyboardShortcut.ts`, `DifficultyButtons.tsx`, `types/game.ts`

**내용**: Sprint 1 계획 문서에는 난이도 시스템, 타이머, 키보드 단축키가 명시적으로 "Out of Scope (Sprint 2)"로 정의되어 있습니다. 그러나 구현 결과물에는 이 기능들이 완전히 구현되어 있습니다.

- `useTimer.ts`: 카운트다운 타이머 훅 (Sprint 2 항목)
- `useKeyboardShortcut.ts`: 키보드 단축키 훅 (Sprint 2 항목)
- `DifficultyButtons.tsx`: 난이도 버튼 컴포넌트 (Sprint 2 항목)
- `GameBoard.tsx`의 `timeLeft` prop: 타이머 표시 (Sprint 2 항목)
- `types/game.ts`의 `Difficulty`, `DIFFICULTY_TIME`: Sprint 2용 타입
- `App.tsx`: 타이머, 단축키, 난이도 변경 로직이 이미 연결됨

**영향**: Sprint 2의 작업 범위가 사실상 완료된 상태이므로, ROADMAP.md와 sprint2.md 계획이 현실을 반영하도록 업데이트가 필요합니다.

**권장 조치**: Sprint 1 완료 상태 그대로 유지하되, Sprint 2 시작 시 이미 구현된 기능들을 확인하고 sprint2.md를 실제 남은 작업 기준으로 재작성할 것을 권장합니다.

---

## Suggestions (참고 사항)

### 2. `useGameLogic.ts`의 `timeLeft` 상태 중복

**위치**: `src/types/game.ts` (L13), `src/hooks/useTimer.ts`

**내용**: `GameState` 인터페이스에 `timeLeft: number` 필드가 있으나, 실제 타이머 값은 `useTimer` 훅이 별도 로컬 state로 관리합니다. `GameState.timeLeft`는 `DIFFICULTY_TIME[difficulty]`로만 초기화되고 실제 카운트다운 값으로 사용되지 않습니다. 두 `timeLeft`의 역할이 모호합니다.

**권장 조치**: `GameState.timeLeft` 필드를 제거하고 `useTimer`의 반환값만 사용하는 것이 단일 진실 공급원(Single Source of Truth) 원칙에 부합합니다.

### 3. `useEffect` 의존성 배열 경고 가능성

**위치**: `src/App.tsx` (L27)

```tsx
useEffect(() => {
  if (!isComputerTurn) return
  const id = setTimeout(() => {
    computerPlay()
  }, 1000)
  return () => clearTimeout(id)
}, [isComputerTurn, state.currentNumber])
```

**내용**: `computerPlay` 함수가 의존성 배열에 포함되지 않았습니다. React의 exhaustive-deps ESLint 규칙이 활성화된 경우 경고가 발생할 수 있습니다. `computerPlay`는 `useGameLogic`에서 `dispatch`를 감싼 안정적인 함수이므로 런타임 문제는 없으나, lint 설정에 따라 경고가 발생할 수 있습니다.

**권장 조치**: `useGameLogic`에서 `computerPlay`를 `useCallback`으로 메모이제이션하거나, 의존성 배열에 추가하는 것을 고려하세요.

### 4. `GameBoard.tsx`에 타이머 prop이 항상 전달됨

**위치**: `src/components/GameBoard.tsx` (L7, L34)

**내용**: `timeLeft` prop이 항상 `GameBoard`에 전달되지만, 실제 표시는 `isUserTurn && !isGameOver` 조건에서만 됩니다. Sprint 1의 "게임 종료 시 현재 숫자 위치에 '게임 종료' 텍스트 표시" 요구사항에서 `isGameOver`가 `true`일 때 숫자가 아닌 텍스트를 표시하는 로직이 올바르게 구현되어 있습니다.

### 5. 테스트 파일 위치

**위치**: `src/utils/gameRules.test.ts`

**내용**: 계획 문서에는 `src/game/__tests__/gameRules.test.ts`로 경로가 지정되어 있으나, `src/utils/gameRules.test.ts`에 위치합니다. 이는 폴더 구조 변경에 따른 합리적인 조정이므로 문제는 없습니다.

---

## 잘 구현된 사항

- **순수 함수 분리**: `countClaps`, `getCorrectAction`, `isCorrectUserAction`이 사이드 이펙트 없는 순수 함수로 올바르게 구현되어 테스트 용이성이 높습니다.
- **useReducer 패턴**: 게임 상태를 `useReducer`로 관리하여 상태 전이 로직이 명확하고 예측 가능합니다.
- **이벤트 클린업**: `useTimer`, `useKeyboardShortcut`, `App.tsx`의 모든 `useEffect`에서 cleanup 함수를 통해 메모리 리크를 방지합니다.
- **Ref 패턴**: `useTimer`와 `useKeyboardShortcut`에서 `useRef`를 활용하여 stale closure 문제를 방지합니다.
- **타입 안전성**: `ActionType`, `Difficulty`, `Turn`, `GameStatus` 등 세분화된 타입 정의로 런타임 에러를 컴파일 타임에 방지합니다.
- **컴포넌트 분리**: 계획에서는 단일 컴포넌트로 시작하기로 했으나, 이미 의미 있는 컴포넌트 분리가 이루어져 Sprint 3의 리팩토링 부담이 줄었습니다.
- **CSS 구조**: `position: fixed` + `transform: translate(-50%, -50%)` 패턴으로 뷰포트 중앙 고정이 올바르게 구현되었습니다.
- **버튼 키 힌트**: `숫자외치기(A)`, `박수(L)` 레이블로 키보드 단축키를 UI에서 직접 안내합니다.

---

## 이슈 요약

| 구분 | 항목 수 | 내용 |
|------|---------|------|
| Critical | 0 | 없음 |
| Important | 1 | Sprint 1 범위 초과 구현 (ROADMAP 업데이트 필요) |
| Suggestions | 4 | timeLeft 중복, useEffect 의존성, prop 전달, 테스트 위치 |

---

## 조치 권장 사항

1. **즉시 필요**: Sprint 2 계획 수립 시 이미 구현된 기능(난이도, 타이머, 키보드 단축키)을 파악하고 실제 남은 작업만 sprint2.md에 기재
2. **Sprint 2 시작 전**: `GameState.timeLeft` 필드 제거 또는 역할 명확화 검토
3. **Sprint 3**: `computerPlay` useCallback 메모이제이션 포함하여 전반적인 lint 경고 해소
