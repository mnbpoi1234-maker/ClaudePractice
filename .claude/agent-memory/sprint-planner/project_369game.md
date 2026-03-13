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
| Sprint 1 | 계획 수립 완료 (2026-03-13) | 프로젝트 세팅, 핵심 게임 로직, 기본 UI |
| Sprint 2 | 예정 | 난이도 시스템, 타이머, 키보드 단축키 |
| Sprint 3 | 예정 | 통합 검증, 엣지케이스, UI 폴리싱 |

## Sprint 1 핵심 산출물

- `369-game/src/game/gameLogic.ts` - countClaps, getCorrectAction 순수 함수
- `369-game/src/game/types.ts` - GameState, Turn 타입
- `369-game/src/App.tsx` - 게임 상태 관리 + UI
- `369-game/src/index.css` - viewport 중앙 고정 레이아웃

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
