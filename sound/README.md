# sound 폴더

여기에 배경음악 파일을 넣으세요.

어느 화면에서 어떤 파일을 틀지는 `index.html`의 `BGM_TRACKS` 표에서
정합니다. 지금은 정원 화면 하나뿐입니다:

```js
const BGM_TRACKS = {
  garden: 'sound/garden.mp3'
};
```

나중에 다른 공간에서도 음악을 틀려면 이 표에 한 줄만 더하고
(예: `seodang: 'sound/seodang.mp3'`), 그 파일을 이 폴더에 넣으면 됩니다.

파일이 아직 없으면 재생 버튼을 눌러도 그냥 아무 일도 일어나지
않습니다(오류로 멈추지 않습니다).
