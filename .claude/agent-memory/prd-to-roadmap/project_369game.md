---
name: 369 게임 프로젝트 개요
description: 369 게임 프로젝트의 기술 스택, 주요 결정사항, 로드맵 구조 요약
type: project
---

## 프로젝트: 369 게임
- 기술 스택: React + TypeScript + Vite
- PRD 위치: docs/PRD.md
- ROADMAP 위치: docs/ROADMAP.md
- ROADMAP 생성일: 2026-03-13
- 전체 3 Phase (Sprint 1~3, 약 6주)

## Phase 구조
- Phase 1: 프로젝트 세팅 + 핵심 게임 로직 + 기본 UI + 리셋
- Phase 2: 난이도 시스템 (쉬움/보통/어려움) + 타이머 + 키보드 단축키 (a/l)
- Phase 3: 통합 검증 + 엣지케이스 + UI 폴리싱 + 코드 정리

## 주요 기술 결정
- 상태 관리: useState/useReducer (외부 라이브러리 불필요)
- 스타일링: 순수 CSS (간단한 UI)
- 게임 로직은 순수 함수로 분리 (countClaps, getCorrectAction)
- Vite 기본 포트 5173 사용 (또는 설정으로 3000 변경)
