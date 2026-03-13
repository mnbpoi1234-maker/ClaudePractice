# 배포 및 검증 가이드

**프로젝트**: 369 게임 (React + TypeScript)
**최종 업데이트**: 2026-03-13 (Sprint 1 완료)

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

## 알려진 이슈 및 메모

- Sprint 2에서 난이도 버튼(쉬움/보통/어려움) 및 타이머 기능이 추가될 예정
- Sprint 2에서 키보드 단축키(`a`=숫자외치기, `l`=박수) 기능이 추가될 예정
- `DifficultyButtons.tsx`, `useTimer.ts`, `useKeyboardShortcut.ts` 파일이 Sprint 1에서 미리 생성되었으나 Sprint 2에서 연결 예정
