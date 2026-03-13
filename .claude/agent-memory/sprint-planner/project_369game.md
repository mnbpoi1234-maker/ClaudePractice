---
name: 369-game-project-context
description: 369 게임 프로젝트의 기술 스택, 아키텍처, 스프린트 진행 상황 요약
type: project
---

## 프로젝트 개요

- **프로젝트명**: 369 게임 (React + TypeScript)
- **목표**: 컴퓨터와 1:1 대결하는 369 게임 웹 애플리케이션
- **전체 스프린트**: 3개 (약 6주), 기준일 2026-03-13

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | React 18+ |
| 언어 | TypeScript |
| 빌드 도구 | Vite |
| 상태 관리 | React useState/useReducer |
| 스타일링 | 순수 CSS |
| 폰트 | 맑은 고딕 (fallback: sans-serif) |
| 테스트 | Vitest |

## 스프린트 현황

| 스프린트 | 상태 | 주요 내용 |
|----------|------|-----------|
| Sprint 1 | 완료 (2026-03-13) | 프로젝트 세팅, 핵심 게임 로직, 기본 UI + Phase 2 기능(난이도, 타이머, 키보드) 모두 구현 |
| Sprint 2 | 계획 수립 완료 (2026-03-13) | Phase 3: 통합 검증, 엣지케이스, UI 폴리싱, 코드 정리 (ROADMAP Phase 3 담당) |
| Sprint 3 | - | Sprint 1에서 Phase 2까지 완료하여 Sprint 3은 불필요해짐 |

**중요:** Sprint 1에서 ROADMAP Phase 1 + Phase 2가 모두 구현됨. Sprint 2가 Phase 3(MVP 완성)를 담당.

## Sprint 1 핵심 산출물

- `369-game/src/game/gameLogic.ts` - countClaps, getCorrectAction 순수 함수
- `369-game/src/game/types.ts` - GameState, Turn 타입
- `369-game/src/App.tsx` - 게임 상태 관리 + UI
- `369-game/src/index.css` - viewport 중앙 고정 레이아웃
- `369-game/src/hooks/useGameLogic.ts` - useReducer 상태 관리
- `369-game/src/hooks/useTimer.ts` - 카운트다운 타이머
- `369-game/src/hooks/useKeyboardShortcut.ts` - a/l 단축키
- `369-game/src/components/GameBoard.tsx` - 게임 보드
- `369-game/src/components/ActionButtons.tsx` - 숫자외치기/박수 버튼
- `369-game/src/components/DifficultyButtons.tsx` - 난이도 버튼 (쉬움/보통/어려움)
- `369-game/src/components/ResetButton.tsx` - 리셋 버튼

## Sprint 2 계획 요약 (2026-03-13 수립)

- 담당: ROADMAP Phase 3 (통합 검증 + 엣지케이스 + UI 폴리싱 + 코드 정리)
- 9개 Task로 구성, 각 Task별 커밋 단위
- 핵심 작업: TypeScript strict, 디바운싱, 큰 숫자 테스트, 턴 시각적 피드백, 게임종료 최종숫자 표시

## 아키텍처 결정 사항

- 게임 로직은 순수 함수로 분리 (테스트 용이성)
- 컴퓨터 턴: useEffect + setTimeout 700ms 딜레이
- 단일 App.tsx 컴포넌트로 구현 (Phase 3에서 필요 시 분리)
- 버튼 비활성화: disabled 속성 + turn !== 'user' 조건

## 마일스톤

| 마일스톤 | 예상 완료 |
|----------|-----------|
| M1: 기본 게임 플레이 | Sprint 1 완료 |
| M2: 난이도 + 단축키 | Sprint 2 완료 |
| M3: 최종 완성 (MVP) | Sprint 3 완료 |
