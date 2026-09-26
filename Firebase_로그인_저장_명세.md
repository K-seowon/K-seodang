# 운교서당 — 로그인과 서버 저장 (Firebase) 작업 명세

Claude Code에 그대로 넘길 수 있는 작업 명세다.
구글 계정으로 로그인해서 어느 기기에서든 이어 하고, 다른 이용자의 정원을
구경할 수 있게 한다. 로그인은 선택이고, 로그인하지 않아도 지금처럼 기기에
저장하며 쓸 수 있어야 한다.

---

## 1. 범위

**이번에 하는 것 (1차)**

- 구글 로그인 / 로그아웃
- 학습 기록과 정원을 서버에 저장하고, 다른 기기에서 로그인하면 이어 하기
- 처음 로그인할 때 이 기기에 쌓인 기록을 계정으로 옮기기
- 호(이름 팻말에 나올 이름)를 정하기
- 사랑방 「이웃」 목록을 실제 이용자의 정원으로 바꾸기 (지금의 달래·도련·두메·하늬는
  로그인하지 않았거나 서버에 닿지 않을 때만 보여준다)

**이번에 하지 않는 것 (2차 이후, 10장 참고)**

- 카카오·네이버 로그인
- 이웃 식물에 준 물이 그 이웃의 정원에 실제로 반영되는 것
- 친구 맺기, 신고·차단

---

## 2. 사람이 직접 할 준비 (코드 작업 전에)

Firebase 콘솔(console.firebase.google.com)에서 한다. 카드 등록은 필요 없다(Spark 요금제).

1. **프로젝트 만들기** — 이름 예: `k-seodang`. 구글 애널리틱스는 꺼도 된다
2. **웹 앱 등록** — 「</>」 아이콘. 나오는 `firebaseConfig` 값을 복사해 둔다
   (이 값은 웹페이지에 공개되어도 되는 값이다. 보안은 5장의 보안 규칙이 지킨다)
3. **Authentication** → 시작하기 → 로그인 방법에서 **Google** 사용 설정
4. **Authentication → 설정 → 승인된 도메인**에 `k-seowon.github.io` 추가
   (`localhost`는 기본으로 들어 있다)
5. **Firestore Database** 만들기
   - 에디션: Standard
   - 위치: `asia-northeast3 (서울)` — **나중에 바꿀 수 없다**
   - 보안 규칙: 프로덕션 모드로 시작 (5장 규칙으로 바로 바꾼다)

---

## 3. 저장 구조

문서 두 가지. 한 이용자당 하나씩.

### `users/{uid}` — 나만 읽고 쓰는 기록

| 필드 | 형태 | 내용 |
|---|---|---|
| `data` | 문자열 | 지금 `localStorage`에 넣는 `S`를 `JSON.stringify` 한 것 그대로 |
| `updatedAt` | 숫자 | `S.updatedAt` (밀리초). 어느 쪽이 최신인지 가르는 데 쓴다 |
| `v` | 숫자 | 저장 형식 버전. 지금은 `1` |

`S`를 필드로 풀어 넣지 않고 **문자열 하나로** 넣는다. 이유:

- 지금의 `save()`/`load()` 구조를 그대로 쓸 수 있다
- `S.prog.char`처럼 글자마다 칸이 생기는 자료를 풀어 넣으면 Firestore가 칸마다
  색인을 만들어, 문서 하나의 색인 한도에 걸릴 수 있다
- 문서 하나의 최대 크기는 1MiB. 지금 `S`는 넉넉히 잡아도 100KB 안팎이다

### `gardens/{uid}` — 누구나(로그인한 사람) 읽는 공개 정원

| 필드 | 형태 | 내용 |
|---|---|---|
| `nick` | 문자열 | 호. 한글·영문·숫자 2~8자 |
| `rankIdx` | 정수 0~5 | `curRankIdx()` |
| `chars` | 정수 | 익힌 글자 수 `metCount()` |
| `placed` | 배열 | `S.placed` |
| `spot` | 맵 | `S.spot` 중 `placed`에 있는 것만 |
| `growth` | 맵 | `S.growth` 중 `placed`에 있는 것만 |
| `wear` | 맵 | `S.wear` |
| `updatedAt` | 타임스탬프 | `serverTimestamp()` |

지금 코드의 이웃 자료(`NEIGHBORS`)와 모양을 맞춘 것이다. 읽어 온 뒤
`{ id:uid, name:nick, rankIdx, chars, placed, spot, growth, wear }`로 바꿔
`enterNeighborGarden()`에 그대로 넘긴다.

---

## 4. 동기화 규칙

기기 저장(`localStorage`)은 **지금처럼 그대로 주 저장소**로 두고, 서버는 그 사본을
올리고 내려받는 자리로 쓴다. 앱이 켜질 때 `const S = load() || {...}`가 곧바로
실행되는 지금 구조를 건드리지 않기 위해서다.

### 저장할 때

- `save()`는 지금처럼 `localStorage`에 곧장 쓰고, `S.updatedAt = Date.now()`를 찍는다
- 서버에는 곧장 올리지 않고 **30초에 한 번만** 올린다 (그 사이 여러 번 저장해도 한 번)
- 화면을 닫거나 다른 앱으로 넘어갈 때(`visibilitychange` → hidden, `pagehide`)는
  기다리지 않고 바로 올린다
- 공개 정원(`gardens`)은 정원·옷·호·급 중 하나라도 **바뀌었을 때만** 올린다.
  학습만 했을 때는 올리지 않는다

> 이 두 가지가 비용을 좌우한다. 지금 `save()`는 퀴즈 한 문제마다 불린다(37곳).
> 매번 서버에 쓰면 무료 한도(하루 쓰기 2만 번)를 이용자 수십 명이면 다 쓴다.

### 로그인했을 때 (앱을 켤 때마다, 그리고 로그인 직후)

서버의 `users/{uid}`를 한 번 읽어서:

| 경우 | 할 일 |
|---|---|
| 서버에 문서가 없다 (첫 로그인) | 이 기기의 `S`를 올린다. 호를 묻는다 |
| 서버가 더 최신 (`updatedAt`이 더 크다) | 서버 자료를 `localStorage`에 쓰고 **새로고침** |
| 이 기기가 더 최신 | 이 기기의 `S`를 올린다 |
| 같다 | 아무것도 안 한다 |

- 새로고침은 한 번만 하도록 `sessionStorage`에 표시해 둔다 (무한 새로고침 방지)
- `S.ownerUid`에 로그인한 계정을 적어 둔다. **이 기기에 다른 계정의 기록이 있으면**
  (`S.ownerUid`가 있는데 지금 계정과 다르면) 이 기기 것을 올리지 말고 서버 것을 내려받는다.
  남의 기록으로 내 계정을 덮어쓰지 않기 위해서다
- 두 기기에서 동시에 오프라인으로 하다가 합치면 **나중에 저장한 쪽이 이긴다**.
  1차에서는 이것으로 충분하다

### 로그아웃할 때

- 남은 저장을 바로 올린 뒤 로그아웃
- 이 기기의 `localStorage` 기록을 지우고 새로고침 → 처음 상태(손님)로 시작
  (기록은 서버에 있으므로 다시 로그인하면 돌아온다)

---

## 5. 보안 규칙

Firestore → 규칙 탭에 넣는다. 게시 전에 **규칙 플레이그라운드**에서 아래 경우를 시험한다.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }

    match /users/{uid} {
      allow read, delete: if isOwner(uid);
      allow create, update: if isOwner(uid)
        && request.resource.data.keys().hasOnly(['data', 'updatedAt', 'v'])
        && request.resource.data.data is string
        && request.resource.data.data.size() < 900000
        && request.resource.data.updatedAt is number;
    }

    match /gardens/{uid} {
      allow read: if signedIn();
      allow delete: if isOwner(uid);
      allow create, update: if isOwner(uid) && validGarden(request.resource.data);
    }

    function validGarden(d) {
      return d.keys().hasOnly(['nick','rankIdx','chars','placed','spot','growth','wear','updatedAt'])
        && d.nick is string && d.nick.matches('^[가-힣A-Za-z0-9]{2,8}$')
        && d.rankIdx is int && d.rankIdx >= 0 && d.rankIdx <= 5
        && d.chars is int && d.chars >= 0 && d.chars <= 1000
        && d.placed is list && d.placed.size() <= 200
        && d.spot is map && d.growth is map && d.wear is map
        && d.updatedAt == request.time;
    }
  }
}
```

시험할 경우:

- 로그인 안 한 사람: `users`, `gardens` 모두 읽기·쓰기 거부
- A가 B의 `users/B` 읽기 → 거부 / B의 `gardens/B` 읽기 → 허용 / 쓰기 → 거부
- 호에 `<script>`나 공백이 들어가면 → 거부

### 남의 자료를 화면에 그릴 때 (규칙만으로는 못 막는 것)

보안 규칙은 배열 안의 값 하나하나까지 검사하지 못한다. 그래서 **남의 정원 자료는
화면에 그리기 전에 반드시 걸러야 한다.** 지금 코드는 이름과 물건 번호를 HTML에
그대로 끼워 넣으므로, 거르지 않으면 남이 심은 코드가 내 화면에서 실행될 수 있다(XSS).

- `placed`: `/^[a-z0-9_]+(__\d+)?$/` 에 맞고 `ITEMS`에 있는 것만 남긴다
- `wear`: `WEAR`에 있는 것만 남긴다
- `spot`: 값이 숫자 두 개짜리 배열인 것만
- `growth`: 값이 0~100 정수인 것만
- `nick`: 규칙과 같은 정규식으로 다시 확인하고, 화면에 넣을 때 `&<>"'`를 바꿔 넣는다

---

## 6. 코드 변경

### 6-1. Firebase 불러오기

`index.html` 맨 끝, 지금의 `<script>` 뒤에 모듈 스크립트를 하나 더 둔다.
빌드 도구 없이 구글 CDN에서 바로 불러온다. **버전을 고정한다** (작성 시점 최신: 12.19.0).

```html
<script type="module">
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const firebaseConfig = { /* 2장에서 복사한 값 */ };
// ...아래 window.cloud를 채운다
</script>
```

모듈 스크립트는 지금의 스크립트가 다 돈 뒤에 실행된다. 두 스크립트는
`window.cloud` 하나로만 이어지게 한다.

```
window.cloud = {
  user,            // 로그인한 사람 (없으면 null)
  signIn(), signOut(),
  saveSoon(),      // 30초 모아서 올리기
  flush(),         // 바로 올리기
  listGardens(),   // 이웃 목록
}
```

기존 스크립트에서는 `window.cloud`가 아직 없을 수도 있다고 보고 `window.cloud?.saveSoon()`처럼 부른다.

### 6-2. 바꿀 곳

| 자리 | 지금 | 바꿀 것 |
|---|---|---|
| `save()` (맨 끝 쪽) | `localStorage`에만 쓴다 | `S.updatedAt` 찍기, `window.cloud?.saveSoon()` 부르기 |
| `nameplateSVG()` | 이름이 `'푸믹'`으로 고정 | `S.nick \|\| '푸믹'`, 남의 이름은 바꿔 넣기(escape) |
| `fetchNeighbors()` | `NEIGHBORS`를 돌려준다 | 로그인 중이면 서버에서 `gardens`를 최근 순 20개 읽어 5장 방식으로 거른 뒤 돌려준다. 나 자신은 뺀다. 실패하거나 손님이면 `NEIGHBORS` |
| `openNeighborList()` | `fetchNeighbors()`를 곧장 쓴다 | 서버에서 받아오는 동안 「이웃을 찾는 중…」을 보여주고, 받아온 뒤 그린다 (`async`) |
| `growStageIdx()` | 남의 정원에서도 내 `S.growth`로 크기를 정한다 | 구경 중이면 `visiting.growth`를 쓴다 (지금도 있는 잘못. 실제 이용자 정원에서는 눈에 띈다) |
| `waterNeighborPlant()` | `S.neighborWater[nb.id]`에 오늘 날짜를 적는다 | 그대로 둔다. `nb.id`가 uid가 될 뿐이다 |

### 6-3. 새로 넣을 화면

새 화면을 크게 만들지 말고 지금 있는 것을 쓴다.

- **로그인 단추**: 사랑방에 「로그인」 자리 하나. 로그인하면 「호 · 로그아웃」으로 바뀐다
  (사랑방은 이미 이웃 구경 자리라 어울린다)
- **호 정하기**: 첫 로그인 때 시트(`openSheetRaw`)로 한 번 묻는다. 한글·영문·숫자 2~8자.
  나중에 사랑방에서 바꿀 수 있다
- **이 기기 기록 옮기기**: 첫 로그인 때 이 기기에 진도가 있으면
  「이 기기의 기록을 계정에 담았습니다」 토스트 하나면 된다 (4장 규칙대로 자동)
- **동기화 상태**: 따로 보여주지 않는다. 올리기에 실패하면 조용히 다음 번에 다시 올린다

---

## 7. 비용 지키기

| 할 일 | 까닭 |
|---|---|
| 서버에 올리기는 30초에 한 번 + 화면 닫을 때 | 쓰기 횟수가 비용의 대부분 |
| `gardens`는 바뀌었을 때만 | 학습할 때마다 공개 정원을 다시 쓰지 않게 |
| 이웃 목록은 20개까지, 한 번 받으면 앱을 켜 둔 동안 다시 쓴다 | 목록을 열 때마다 20번씩 읽지 않게 |
| 이웃 정원은 목록에서 받은 자료로 그린다 | 정원에 들어갈 때 또 읽지 않게 |

예상 (하루 이용자 기준, 한 사람이 하루 쓰기 20번·읽기 11번 정도):

- 1,000명: 무료 한도 안
- 1만 명: 월 $5~7 (유료 Blaze 요금제로 바꿔야 함)
- 10만 명: 월 $60~70

유료로 바꾸면 **구글 클라우드 → 결제 → 예산 및 알림**에서 월 예산 알림(예: $10)을 꼭 건다.

---

## 8. 확인할 것

브라우저 두 개(또는 크롬 일반 창과 시크릿 창)로 확인한다.

- [ ] 로그인하지 않으면 지금과 똑같이 동작한다 (이웃은 달래·도련·두메·하늬)
- [ ] 이 기기에서 공부하다가 처음 로그인하면 기록이 그대로 남고 서버에 올라간다
- [ ] 다른 창에서 같은 계정으로 로그인하면 같은 진도·정원·전이 보인다
- [ ] A 창에서 공부하고 창을 닫은 뒤 B 창을 새로고침하면 이어진다
- [ ] 다른 계정으로 로그인하면 사랑방 이웃 목록에 첫 계정의 정원이 보이고, 들어가면 그 정원이 그대로 보인다(식물 크기 포함)
- [ ] 로그아웃하면 처음 상태가 되고, 다시 로그인하면 기록이 돌아온다
- [ ] 한 기기에서 A로 쓰다가 로그아웃 후 B로 로그인해도 A의 기록이 B로 넘어가지 않는다
- [ ] 인터넷을 끊고 공부해도 멈추지 않고, 다시 연결되면 올라간다
- [ ] 호에 `<b>` 같은 것을 넣으려 하면 막힌다
- [ ] Firebase 콘솔 → Firestore → 사용량에서 하루 쓰기 횟수가 한 사람당 수십 번 안쪽이다

---

## 9. 작업 순서 제안

한 번에 다 만들지 말고 단계마다 브라우저에서 확인한다.

1. 2장 준비를 마치고 `firebaseConfig`를 받는다 (사람이 할 일)
2. 모듈 스크립트와 로그인·로그아웃 단추만 붙인다. 로그인하면 토스트로 이름이 뜨는지 확인
3. `users/{uid}` 저장과 불러오기, 4장 동기화 규칙. 두 창으로 이어 하기 확인
4. 5장 보안 규칙을 게시하고 플레이그라운드로 시험
5. 호 정하기, 이름 팻말에 호 넣기
6. `gardens/{uid}` 올리기, 이웃 목록을 서버에서 받기, 남의 자료 거르기, `growStageIdx` 고치기
7. 8장 체크리스트를 처음부터 끝까지 한 번 더

---

## 10. 나중에 (2차 이후)

- **카카오·네이버 로그인** — Firebase에는 기본으로 없다. Cloud Functions에서 카카오 토큰을
  확인하고 Firebase 맞춤 토큰을 만들어 줘야 하므로 Blaze 요금제(카드 등록)가 필요하다.
  무료 한도 안이면 돈은 나가지 않는다
- **이웃 식물에 준 물이 실제로 반영** — 규칙(하루 세 번, 한 단계 성장, 「좋구나」)과
  화면은 이미 앱에 있다. 지금은 본보기 이웃에게 준 물이 이 기기(`S.nbGardens`)에만 남는다.
  서버가 붙으면:
  - 남의 문서를 직접 고치게 하면 안 되므로, 물을 줄 때 `gardens/{주인uid}/visits/{자동id}`에
    `{from: 내 호, iid, at}`만 남긴다 (`waterNeighborPlant()`의 주석 자리)
  - 정원 주인은 앱을 켤 때 안 읽은 `visits`를 모아 `receiveVisits()`에 넘기고 지운다.
    성장·「좋구나」·「다녀간 이웃」 알림은 이 함수가 이미 다 한다
  - 하루 세 번 제한은 지금 기기에서 센다. 서버에서도 막으려면 보안 규칙에서
    `visits` 쓰기 횟수를 세야 하는데 규칙만으로는 어렵다. 1차에서는 기기 제한으로 둔다
- **계정 삭제** — 사랑방에 「계정 지우기」. `users`, `gardens` 문서와 로그인 계정을 함께 지운다
- **신고·차단** — 호가 공개되므로 이용자가 늘면 필요하다

### 개인정보 — 공개 전에 꼭 확인

- 구글 로그인으로 이메일 주소를 받게 되므로 **개인정보 처리방침** 페이지가 필요하다
- 이용자 중에 **만 14세 미만**이 있을 수 있다면(서당 학습 앱이라 가능성이 있다),
  개인정보보호법상 법정대리인 동의가 필요하다. 로그인 전에 나이를 묻고 14세 미만은
  손님으로만 쓰게 하는 등 공개 전에 정해 두어야 한다
