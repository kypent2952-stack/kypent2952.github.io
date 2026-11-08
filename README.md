# AASM 수면 단계 심층 판독 가이드

수면다원검사(PSG) 판독을 공부하는 의료진·검사자를 위한 한 페이지짜리 교육용 웹 가이드입니다.
**AASM Manual for the Scoring of Sleep and Associated Events (Version 3, 2023)** 기준으로
수면 단계(W, N1, N2, N3, REM)별 EEG·EOG·EMG 특징을 정리하고, 대표 파형을 애니메이션으로 보여줍니다.

- 사이트: https://kypent2952-stack.github.io/kypent2952.github.io/
- 이비인후과 가이드 허브: https://kypent2952-stack.github.io/ent-diseases-guide/

## 구성

| 섹션 | 내용 |
| --- | --- |
| 단계별 심층 분석 | W/N1/N2/N3/REM 버튼으로 전환. 단계 설명 + EEG·EOG·EMG 판독 포인트 + 3채널 대표 파형 |
| 기본 뇌파 종류 | 알파·베타·델타파, 수면 방추와 K-복합체 |
| 심화 과정 | 과도기 에폭(다수결 원칙), 인공물 판별(근육·심탄도·땀·전기적) |
| 수면 구조 차트 | 수면 이면도(Hypnogram), 정상 성인 수면 단계 비율 |

## 파일

```
index.html    페이지 마크업, SEO 메타(OG/Twitter), MedicalWebPage JSON-LD
style.css     디자인 토큰(:root, 라이트/다크), 컴포넌트, Tailwind 미로딩 대비 폴백 유틸리티
script.js     단계 데이터·전환, 캔버스 파형(고해상도·테마 대응), Chart.js 차트
og-image.png  공유 미리보기 이미지 (1200×630)
sitemap.xml, robots.txt
```

## 디자인 규칙

- 글꼴: **Pretendard Variable** (jsDelivr CDN, dynamic subset)
- 강조색: `#1F5FA8` — 모든 색은 `style.css`의 `:root` 토큰으로 관리
- 다크 모드: `prefers-color-scheme` 자동 대응 (파형·차트 색 포함)
- 접근성: 본문 바로가기, 키보드 포커스 표시, `aria-pressed` 단계 버튼, 캔버스/차트 대체 텍스트, 움직임 줄이기 설정 시 파형 정지

## 외부 의존성 (CDN)

- Tailwind CSS Play CDN 3.4.17 — 없어도 `style.css` 폴백으로 동일한 레이아웃이 유지됩니다.
- Chart.js 4.4.1 — 로딩 실패 시 차트 자리에 텍스트 요약이 표시됩니다.
- 수면 방추/K-복합체 그림: Wikimedia Commons 이미지 링크

## 로컬 실행

빌드 과정이 없습니다. 아무 정적 서버로 열면 됩니다.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 주의

교육 목적의 자료이며, 실제 판독·진단은 최신 AASM 매뉴얼과 임상 판단을 따르십시오.
