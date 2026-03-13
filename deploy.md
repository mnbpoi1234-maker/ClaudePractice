# 배포 및 검증 가이드

**프로젝트**: 369 게임 (React + TypeScript)
**최종 업데이트**: 2026-03-13 (Sprint 2 완료)

---

## Sprint 1 검증 체크리스트

### 자동 검증 완료 항목

- ✅ 단위 테스트 14개 전체 통과 (`npm test`)
  - `countClaps` 함수: 6개 테스트 통과
  - `getCorrectAction` 함수: 4개 테스트 통과
  - `isCorrectUserAction` 함수: 4개 테스트 통과
- ✅ TypeScript 타입 체크 통과 (`npx tsc --noEmit` - 에러 없음)

### 수동 검증 필요 항목

아래 항목들은 개발자가 직접 브라우저에서 확인해야 합니다.

#### 사전 준비

```bash
# 프로젝트 루트(C:\CLAUDEPractice)에서 실행
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

#### 기본 렌더링 확인

- ⬜ 페이지 정중앙에 현재 숫자가 25px 크기로 표시됨
- ⬜ 컴퓨터가 700ms 딜레이 후 첫 턴(숫자 1 외치기)을 수행하고 사용자 턴으로 전환됨
- ⬜ "숫자외치기" 버튼(100px x 50px)과 "박수" 버튼(100px x 50px)이 가로로 나란히 표시됨
- ⬜ 브라우저 개발자 도구 콘솔에 에러 없음 (F12 > Console 탭 확인)

#### 게임 플레이 시나리오 확인

**정상 플레이:**
- ⬜ 숫자 2 (3/6/9 없음) → "숫자외치기" 클릭 → 숫자 3으로 진행
- ⬜ 숫자 3 (3/6/9 있음) → 컴퓨터가 "/박수/" 수행 → 숫자 4로 진행
- ⬜ 숫자 6 → 컴퓨터가 "/박수/" 수행 확인
- ⬜ 숫자 9 → 컴퓨터가 "/박수/" 수행 확인
- ⬜ 숫자 33 → 컴퓨터가 "/박수//박수/" (2회) 수행 확인

**오답 처리:**
- ⬜ 숫자 2(3/6/9 없음)에서 "박수" 클릭 → "게임 종료" 텍스트 표시
- ⬜ 숫자 3(3/6/9 있음)에서 사용자 턴에 "숫자외치기" 클릭 → "게임 종료" 텍스트 표시
- ⬜ 게임 종료 후 버튼들이 비활성화(회색 처리)됨

**리셋 기능:**
- ⬜ "리셋" 버튼 클릭 → 숫자가 1로 초기화, 컴퓨터 턴 재시작됨

#### 레이아웃 확인

- ⬜ 브라우저 창 크기 변경 시 게임 요소가 항상 화면 중앙에 위치함
- ⬜ 폰트가 '맑은 고딕'(Windows) 또는 sans-serif(기타)로 표시됨

---

## 로컬 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# http://localhost:5173 에서 확인

# 테스트 실행
npm test

# TypeScript 타입 체크
npx tsc --noEmit

# 프로덕션 빌드
npm run build
```

---

## 구현된 파일 구조

```
src/
  App.tsx               # 메인 앱 컴포넌트 (게임 레이아웃)
  index.css             # 글로벌 스타일
  main.tsx              # 앱 진입점
  components/
    GameBoard.tsx        # 숫자 표시 및 행위 텍스트 컴포넌트
    ActionButtons.tsx    # 숫자외치기/박수 버튼
    DifficultyButtons.tsx # 난이도 버튼 (Sprint 2 준비)
    ResetButton.tsx      # 리셋 버튼
  hooks/
    useGameLogic.ts      # useReducer 기반 게임 상태 관리
    useTimer.ts          # 카운트다운 타이머 훅
    useKeyboardShortcut.ts # 단축키(a/l) 훅
  utils/
    gameRules.ts         # countClaps, getCorrectAction 순수 함수
    gameRules.test.ts    # 단위 테스트 (14개)
  types/
    game.ts              # GameState, Turn 등 타입 정의
```

---

---

## Sprint 2 검증 체크리스트

### 자동 검증 완료 항목 (2026-03-13)

- ✅ 단위 테스트 21개 전체 통과 (`npm test`)
  - `countClaps` 함수: 기본 케이스 + 경계값 (큰 숫자 300, 369, 9999 등)
  - `getCorrectAction` 함수: 박수/외치기 + 큰 숫자 박수 횟수
  - `isCorrectUserAction` 함수: 정답/오답 판별
- ✅ TypeScript 타입 체크 통과 (`npx tsc --noEmit` - 에러 없음)

### 수동 검증 필요 항목

아래 항목들은 개발자가 직접 브라우저에서 확인해야 합니다.

#### 사전 준비

```bash
# 프로젝트 루트(C:\CLAUDEPractice)에서 실행
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

#### Sprint 2 신규 기능 확인

**턴 인디케이터:**
- ⬜ 게임 시작 시 "컴퓨터 차례" 회색 배지가 표시됨
- ⬜ 컴퓨터 턴 완료 후 "내 차례" 파란색 배지로 전환됨
- ⬜ 게임 종료 시 턴 인디케이터가 사라짐

**게임 종료 화면:**
- ⬜ 오답 입력 시 "게임 종료" + "최종 도달 숫자: N" 함께 표시됨
- ⬜ 리셋 후 최종 도달 숫자가 사라지고 정상 게임 화면으로 복귀됨

**버튼 스타일:**
- ⬜ 버튼 클릭(active) 시 배경색이 어두워짐
- ⬜ 게임 종료 후 버튼이 비활성화(opacity 0.4) 상태로 표시됨

**모바일 viewport:**
- ⬜ 브라우저 개발자 도구 375px 너비에서 난이도 버튼 3개가 모두 표시됨 (flex-wrap 줄바꿈)

#### 기존 기능 회귀 테스트

**타이머 (난이도별):**
- ⬜ 쉬움 (5초) - 타이머 카운트다운 표시 및 시간 초과 시 종료
- ⬜ 보통 (3초) - 기본 동작
- ⬜ 어려움 (1초) - 빠른 시간 초과 처리

**키보드 단축키:**
- ⬜ 사용자 턴에서 `a` 키 → "숫자외치기" 동작
- ⬜ 사용자 턴에서 `l` 키 → "박수" 동작
- ⬜ 게임 종료 상태에서 `a`, `l` 키 → 무반응

**30 이상 게임 진행:**
- ⬜ 숫자 30 이상까지 정상 진행 (33, 36, 39에서 박수 2회 확인)

**콘솔 에러:**
- ⬜ 게임 플레이 전 과정에서 브라우저 콘솔 에러 없음 (F12 > Console 탭)

---

## 알려진 이슈 및 메모

- Sprint 2 완료: 난이도 시스템, 타이머, 키보드 단축키, UI 폴리싱, 코드 품질 정리 모두 완료
- MVP 완성 상태 (Phase 1 + Phase 2 + Phase 3 모두 완료)
- 코드 리뷰 보고서: `docs/sprint/sprint2/code-review-report.md`
- 검증 보고서: `docs/sprint/sprint2/validation-report.md`
