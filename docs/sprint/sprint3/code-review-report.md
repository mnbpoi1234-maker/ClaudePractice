# Sprint 3 코드 리뷰 보고서

**작성일**: 2026-03-13
**리뷰 대상**: master → sprint3 브랜치 diff
**리뷰어**: sprint-close agent (자동 코드 리뷰)

---

## 요약

| 등급 | 건수 |
|------|------|
| Critical | 0 |
| Important | 2 |
| Suggestion | 3 |

전체적으로 구현 품질이 양호합니다. 외부 라이브러리 없이 Web Audio API, localStorage, CSS 미디어 쿼리만 사용한 Karpathy 원칙 준수 구현이며, 테스트 27개 전체 통과, TypeScript 에러 없음이 확인됩니다.

---

## Important (중요 — 추후 개선 권장)

### [Important-1] handleClap이 오답 시에도 playClapSound()를 호출함

**파일**: `src/App.tsx` (44~49행)

```tsx
const handleClap = () => {
  playClapSound()  // 정답/오답 무관하게 항상 호출
  userClap()
}
```

**문제**: 사용자가 박수 오답을 입력했을 때도 효과음이 재생됩니다. 게임 종료 효과음 직전에 박수 정답 효과음이 함께 재생되어 UX 혼선이 발생할 수 있습니다.

**원인**: `handleClap` 호출 시점에는 정답 여부를 알 수 없습니다. `userClap()`은 reducer dispatch이므로 동기적으로 결과를 반환하지 않기 때문입니다.

**개선 방안**: `useGameLogic`에서 userClap의 정답 여부를 반환하거나, 게임 상태 변화를 감지하여 효과음을 분기 처리합니다.

```tsx
// 개선 예시: useGameLogic에서 정답 여부 반환
const handleClap = () => {
  const isCorrect = userClap()  // boolean 반환으로 변경 필요
  if (isCorrect) playClapSound()
}
```

**현재 영향**: 게임 종료 시 박수음 + 종료음이 겹쳐 재생됨. UX 이슈이나 기능 동작에는 영향 없음.

---

### [Important-2] useEffect 의존성 배열에 state.currentNumber 누락

**파일**: `src/App.tsx` (36~41행)

```tsx
useEffect(() => {
  if (!isGameOver) return
  playGameOverSound()
  saveBestScore(state.currentNumber)  // state.currentNumber 사용
  setBestScore(getBestScore())
}, [isGameOver])  // state.currentNumber 누락
```

**문제**: React exhaustive-deps 린트 규칙에 따르면 `state.currentNumber`가 의존성 배열에 포함되어야 합니다. 현재는 ESLint가 활성화되어 있어 경고가 발생할 수 있습니다.

**실제 영향**: 게임 오버 이벤트는 `isGameOver`가 false → true로 딱 한 번만 발생하므로, `state.currentNumber`가 의존성 배열에 없어도 실제 동작에는 문제 없습니다. 그러나 린트 경고를 유발합니다.

**개선 방안**:

```tsx
}, [isGameOver, state.currentNumber])
```

---

## Suggestion (제안 — 선택적 개선)

### [Suggestion-1] saveBestScore 내부에서 getBestScore() 이중 호출

**파일**: `src/utils/bestScore.ts` (12~15행)

```ts
export function saveBestScore(score: number): void {
  if (score > getBestScore()) {           // localStorage 읽기 1번
    localStorage.setItem(STORAGE_KEY, String(score))
  }
}
```

그리고 App.tsx에서:

```tsx
saveBestScore(state.currentNumber)
setBestScore(getBestScore())              // localStorage 읽기 2번
```

**설명**: localStorage를 두 번 읽습니다. 단일 스레드 JS에서 실제 성능 문제는 없으나, `saveBestScore`가 저장 여부를 boolean으로 반환하면 App.tsx에서 한 번만 읽어도 됩니다. 현재 구현으로도 충분히 문제없습니다.

---

### [Suggestion-2] aria-live 영역이 초기 렌더 시 불필요하게 읽힐 수 있음

**파일**: `src/components/GameBoard.tsx`

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isGameOver
    ? `게임 종료. 최종 도달 숫자: ${currentNumber}`
    : `현재 숫자 ${currentNumber}. ${isUserTurn ? '당신의 차례입니다.' : '컴퓨터 차례입니다.'}`
  }
</div>
```

**설명**: `aria-live` 영역은 DOM에 마운트될 때 스크린리더가 초기값을 읽을 수 있습니다. 게임 시작 직후 "현재 숫자 1. 컴퓨터 차례입니다."가 자동으로 읽히는 것은 오히려 의도한 동작일 수 있으므로, 현재 구현이 맥락에 맞습니다.

---

### [Suggestion-3] AudioContext 싱글톤의 suspended 상태 미처리

**파일**: `src/utils/sound.ts`

```ts
function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}
```

**설명**: 일부 브라우저에서 AudioContext가 `suspended` 상태로 생성될 수 있습니다. 이 경우 `ctx.resume()`을 호출해야 소리가 재생됩니다. 현재 구현은 try-catch로 감싸져 있어 실패 시 무음 처리됩니다. 소리가 재생되지 않는 환경이 존재할 수 있으나, 효과음은 부가 기능이므로 큰 문제는 아닙니다.

---

## 긍정적 평가

- **단순성**: 외부 라이브러리 없이 Web Audio API, localStorage, CSS만 사용 — Karpathy 원칙 준수
- **방어적 처리**: `saveBestScore`의 isNaN 처리, `sound.ts`의 try-catch 무음 처리
- **테스트 커버리지**: `bestScore.ts`에 대한 유닛 테스트 6개 작성 (edge case 포함)
- **접근성**: `aria-label`, `aria-pressed`, `aria-live`, `role="group"`, `role="timer"`, `sr-only` 표준 패턴 올바르게 적용
- **모바일 CSS**: 기존 데스크톱 스타일 변경 없이 미디어 쿼리 오버라이드만 추가
- **autoplay 정책**: AudioContext를 첫 사용자 제스처 이후 생성 — 브라우저 정책 준수

---

## 결론

Critical 이슈 없음. Important-1(오답 박수 시 효과음 중복)은 UX 이슈이나 기능 동작에는 영향 없으므로 다음 스프린트에서 선택적으로 개선할 수 있습니다. 현재 상태로 머지 가능합니다.
