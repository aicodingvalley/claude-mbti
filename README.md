# MBTI 찐테스트

12문항으로 알아보는 진짜 MBTI 성격 유형 테스트. 순수 HTML/CSS/JS로 만들어졌고 GitHub Pages로 배포됩니다.

## 🚀 배포

GitHub Pages로 호스팅됨 — `main` 브랜치의 루트를 소스로 사용합니다.

## 🗂 프로젝트 구조

```
.
├── index.html      # 진입점
├── style.css       # 스타일
├── data.js         # 문항 + 16유형 결과 데이터
├── app.js          # 퀴즈 로직 / 상태 관리
└── .nojekyll       # GitHub Pages Jekyll 처리 비활성화
```

## 🛠 로컬 실행

빌드 스텝이 필요 없습니다. 아무 정적 서버나 띄우면 됩니다.

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 🧠 테스트 구성

- E/I, S/N, T/F, J/P 4개 차원 × 각 3문항 = 총 12문항
- 각 답변에 -2 / 0 / +2 점수 부여 후 차원별 합산
- 16가지 유형 전체에 대해 별명 · 설명 · 강점 · 약점 · 궁합 제공
