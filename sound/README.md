# sound 폴더

여기에 배경음악 파일을 넣으세요.

어느 화면에서 어떤 파일을 틀지는 `index.html`의 `BGM_TRACKS` 표에서
정합니다:

```js
const BGM_TRACKS = {
  garden: 'sound/garden.mp3',
  seodang: 'sound/seodang.mp3',
  inside: 'sound/seodang.mp3',
  market: 'sound/market.mp3',
  sarangbang: 'sound/sarangbang.mp3'
};
```

서당 안(글방)은 서당 마당과 같은 파일을 써서, 그 둘 사이를 오갈 때는
곡을 다시 시작하지 않고 이어서 틉니다.

나중에 다른 공간에서도 음악을 틀려면 이 표에 한 줄만 더하고, 그
파일을 이 폴더에 넣으면 됩니다.

파일이 아직 없으면 재생을 시도해도 그냥 아무 일도 일어나지
않습니다(오류로 멈추지 않습니다).
