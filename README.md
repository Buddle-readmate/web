# 🌿 버들 (Buddle)

책은 각자, 기록은 함께

버들은 친구·연인과 함께 하는 **교환독서를 웹으로 옮긴** 반응형 모바일 웹앱입니다. 실물 책을 돌려 보며 남기던 기록을 하나의 방에 모아, 책이 상하지 않고 기록도 한 사람에게만 남지 않도록 했습니다. 같은 책을 각자 읽으며 페이지별로 이야기를 나누고, 서로의 진도를 확인하고, 다 읽은 책은 나만의 책장에 쌓을 수 있습니다.

## ✨ 주요 기능

- **교환독서 방**: 최대 6명이 한 책을 함께 읽는 방. 초대코드 + 4자리 비밀번호로 참여하고, 혼자 기록하는 1인 방도 만들 수 있어요.
- **페이지별 이야기 · 먼저 쓰고 보기**: 쪽수와 문장을 붙여 기록을 남기고, 내 기록을 먼저 써야 다른 사람의 기록이 열려요. ('먼저 볼래요'로 바로 볼 수도 있어요.)
- **진도 · 책장 · 캘린더**: 오늘 읽은 쪽수를 기록하면 방 안 멤버별 진도(%)에 반영되고, 다 읽은 책은 책장에, 읽은 날은 캘린더에 남아요.

<br>

## 🛠 기술 스택

| 분야         | 스택                                                                              |
| ------------ | --------------------------------------------------------------------------------- |
| Frontend     | React, TypeScript, Vite, Tailwind CSS, React Router, Zustand                      |
| Backend      | Java, Spring Boot, Spring Security + OAuth2 (카카오·구글), Spring Data JPA, MySQL |
| External API | 카카오 책 검색 API                                                                |
| Deploy       | FE: Vercel / BE: 미정                                                             |

<br>

## 📁 폴더 구조

```txt
src/
  pages/          # 화면 단위 컴포넌트 (라우트에 연결)
    onboarding/
    home/
    shelf/
    calendar/
    rooms/        # 교환독서 목록, 방 만들기, 방 참여, 방 상세, 이야기 상세
    my/
  components/     # 재사용 UI 컴포넌트
    layout/       # BottomNav, Header 등
    shelf/
    room/
    record/
    shared/       # Button, Modal, ProgressBar, 책짹이 등 공용
  api/            # 서버 통신 함수
  hooks/          # 커스텀 훅
  stores/         # Zustand 전역 상태
  types/          # TypeScript 타입 정의
  assets/         # 폰트, 아이콘, 이미지
  App.tsx
  main.tsx
```

<br>

## 🚀 실행 방법

1. **저장소 클론**

   ```bash
   git clone [저장소 URL]
   cd web
   ```

2. **패키지 설치**

   ```bash
   npm install
   ```

3. **환경변수 설정**
   - 프로젝트 루트에 `.env` 파일 생성
   - `.env.example`을 참고해서 값 채우기 (팀 내부 공유)

   ```env
   VITE_API_BASE_URL=   # 백엔드 서버 주소
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   → http://localhost:5173 접속

**요구 사항**

- Node.js 18 이상

<br>

## 🌿 Git 브랜치 전략 / 커밋 컨벤션

[GIT_FLOW.md](./GIT_FLOW.md) 참고
