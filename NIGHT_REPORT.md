# NIGHT REPORT — 2026-11-08 · 공통 디자인 정비

대상: AASM 수면 단계 심층 판독 가이드 (`index.html`, `style.css`, `script.js`)
브랜치: `claude/night-2026-11-08` (main 푸시·PR 없음)

콘텐츠(설명 문장, 판독 기준, 차트 데이터)는 바꾸지 않았습니다. 변경 전후 페이지 본문 텍스트를 추출해 비교한 결과,
추가된 것은 허브 링크, 이미지 출처 캡션, 차트 대체 텍스트뿐입니다.

## 한눈에 보는 변경 전후

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 폰트 | Noto Sans KR (Google Fonts) | **Pretendard Variable** (jsDelivr, dynamic subset) |
| 색 관리 | HTML·JS 곳곳에 하드코딩 (`#4F9A94` 청록, Tailwind gray) | `style.css` `:root` 토큰. 강조색 **#1F5FA8** |
| 다크 모드 | 없음 | `prefers-color-scheme` 자동. 파형 캔버스·Chart.js 색도 토큰에서 읽고, 테마가 바뀌면 다시 그림 |
| `style.css` / `script.js` | CodePen 잔재(주황 배경, h1 크기 조절). 페이지에 연결되지 않음 | 실제 스타일시트/스크립트로 사용. 인라인 `<style>`/`<script>` 이동 |
| Tailwind 의존 | CDN 미로딩 시 레이아웃 붕괴 | 사용하는 유틸리티를 같은 값으로 `style.css`에 폴백 정의. CDN이 없어도 화면이 같음 (스크린샷 확인) |
| CDN 버전 | 버전 미지정 (`chart.js`, `cdn.tailwindcss.com`) | Chart.js 4.4.1, Tailwind 3.4.17 고정. Chart.js 실패 시 텍스트 요약 표시 |
| 파형 캔버스 | 300×150 기본 해상도를 늘려 흐림 | 같은 좌표계와 수식으로 계산하되 실제 크기·DPR에 맞춰 선명하게 렌더링. 움직임 줄이기 설정이나 화면 밖에서는 애니메이션 정지 |
| 수면 이면도 | 반전된 y축 때문에 W 방향(위)으로 채워져 각성 구간처럼 보임 | 채움 제거, 계단선만 표시 (데이터 동일) |
| 접근성 | 버튼 상태 표시 없음, 포커스 스타일 없음, 캔버스 설명 없음 | 본문 바로가기, `:focus-visible` 링, `aria-pressed`, 단계 제목 `aria-live`, 캔버스/차트 `role="img"`와 라벨, 터치 영역 44px, 제목 계층 정리(h1→h2→h3) |
| 이미지 | alt 있음. 투명 라인아트라 다크에서 안 보일 위험 | 더 구체적인 alt, `loading="lazy"`, 흰 바탕 figure, 출처 캡션 |
| SEO | title만 있음 | description, canonical, OG/Twitter 카드, `og-image.png`(1200×630), MedicalWebPage JSON-LD, `sitemap.xml`, `robots.txt` |
| 허브 링크 | 없음 | 상단 내비게이션 + 하단 footer → `https://kypent2952-stack.github.io/ent-diseases-guide/` |
| README | CodePen 안내 3줄 | 프로젝트 설명, 구성, 파일, 디자인 규칙, 로컬 실행 방법 |
| 기타 | head의 AI 생성 계획 주석(약 2KB) | 삭제 |

## 스크린샷 (`docs/night-2026-11-08/`)

| | 변경 전 | 변경 후 |
| --- | --- | --- |
| 라이트 1280 | `before-light-1280.png` | `after-light-1280.png` |
| 라이트 375 | `before-light-375.png` | `after-light-375.png` |
| 다크 1280 | `before-dark-1280.png` (다크 미지원) | `after-dark-1280.png` |
| 다크 375 | `before-dark-375.png` | `after-dark-375.png` |
| Tailwind 미로딩 | — | `after-no-tailwind-light-1280.png` |
| 키보드 포커스 | — | `after-dark-375-keyboard-focus.png` |

## 확인 체크리스트

- [x] Pretendard 적용: 계산된 `body` font-family가 `"Pretendard Variable", Pretendard, …`임을 확인 (4개 뷰 모두)
- [x] 375px / 1280px × 라이트/다크 4개 조합 모두 `scrollWidth == clientWidth` (가로 스크롤 없음)
- [x] 콘솔 에러 0 (4개 조합. Tailwind 미로딩 테스트에서는 일부러 막은 요청 1건만 발생)
- [x] 텍스트 대비 AA: 화면의 텍스트 요소 64개를 자동 측정. 라이트·다크 모두 기준 미달 0건
- [x] 키보드: Tab → 본문 바로가기 → 허브 링크 → W → N1, Enter로 단계 전환, `aria-pressed` 갱신 확인
- [x] Tailwind CDN 차단 상태에서도 레이아웃 동일
- [x] 페이지 본문 텍스트 전후 비교: 기존 문구 변경 없음
- [x] 표: 현재 페이지에 `<table>` 없음. 나중에 표를 추가할 때 쓸 `.table-wrap` 가로 스크롤 래퍼를 준비해 둠
- [x] `node --check script.js` 통과

## 원장님 확인 필요

1. **허브 주소 미검증**: `https://kypent2952-stack.github.io/ent-diseases-guide/`는 오늘 밤 다른 세션에서 만들고 있는 사이트이고, 이 샌드박스에서는 외부 접속이 막혀 열어 보지 못했습니다. 배포 후 링크를 한 번 눌러 확인해 주세요.
2. **사이트 주소(canonical/OG/sitemap)**: 저장소가 `kypent2952-stack/kypent2952.github.io`이므로 GitHub Pages 주소를 `https://kypent2952-stack.github.io/kypent2952.github.io/`로 가정했습니다. 저장소 이름이 계정 이름과 달라 사용자 사이트(루트 주소)가 아니라 프로젝트 사이트로 배포됩니다. 실제 주소가 다르면 `index.html`의 canonical·og:url·og:image·JSON-LD와 `sitemap.xml`·`robots.txt`의 주소를 함께 바꿔 주세요.
3. **robots.txt 한계**: 프로젝트 사이트(하위 경로)에 둔 `robots.txt`는 검색엔진이 읽지 않습니다. 검색엔진은 도메인 루트(`kypent2952-stack.github.io/robots.txt`)에 있는 파일만 읽습니다. sitemap은 Search Console에 직접 등록하면 됩니다.
4. **강조색 변경**: 공통 규격에 맞춰 기존 청록(#4F9A94)을 #1F5FA8 파랑으로 바꿨습니다. 단계 비율 도넛 차트는 수면이 깊을수록 진한 파랑, REM은 마젠타를 써서 의미가 이어지게 했습니다.
5. **새로 쓴 대체 텍스트**: 수면 이면도 대체 텍스트("수면 전반부에는 N3, 후반부에는 REM이 길게 나타납니다")는 차트 데이터를 설명하려고 새로 쓴 문장입니다. 표현을 확인해 주세요.

## 검증 환경 메모

샌드박스에서는 외부 CDN(jsDelivr, Tailwind, Google Fonts, Wikimedia)에 접속할 수 없었습니다. 그래서 Playwright에서 다음과 같이 대체해 렌더링했습니다.

- Chart.js 4.4.1, Pretendard 1.3.9: npm 패키지의 같은 버전 파일로 대체
- Tailwind: 같은 3.4.17 버전 CLI로 컴파일한 CSS로 대체
- Wikimedia 이미지: 비슷한 모양의 대체 PNG

변경 전 스크린샷에는 Noto Sans KR이 적용되지 않아 시스템 폰트로 보입니다. 이 부분은 실제 배포 화면과 다를 수 있습니다.
