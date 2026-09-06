/* =========================================================
   K-서당 · 아이템 데이터 모듈
   팩: 「매화 피는 서당 뒤뜰」 (pack_maehwa_seodang)
   ---------------------------------------------------------
   레이어(z) 규칙
     0 sky     하늘        단일슬롯
     1 far     원경        단일슬롯
     2 wall    배경구조물  단일슬롯
     3 ground  바닥        단일슬롯
     4 mid     중경        자유배치 (y좌표로 정렬)
     5 front   전경        자유배치 (y좌표로 정렬)
     6 air     공중        자유배치 (항상 최상단)

   학동(아바타)은 z=4~5 구간에 y좌표로 끼어들어 정렬된다.
   즉 mid/front 아이템과 아바타는 같은 정렬 풀을 쓴다.
   ========================================================= */

export const LAYERS = [
  { z: 0, id: 'sky',    label: '하늘',   mode: 'single' },
  { z: 1, id: 'far',    label: '원경',   mode: 'single' },
  { z: 2, id: 'wall',   label: '담장',   mode: 'single' },
  { z: 3, id: 'ground', label: '바닥',   mode: 'single' },
  { z: 4, id: 'mid',    label: '중경',   mode: 'free', ySort: true },
  { z: 5, id: 'front',  label: '전경',   mode: 'free', ySort: true },
  { z: 6, id: 'air',    label: '공중',   mode: 'free' },
];

export const RARITY = {
  SR: { label: 'SR', color: '#E8A33C', weight: 1 },
  R:  { label: 'R',  color: '#6FA8C8', weight: 5 },
  N:  { label: 'N',  color: '#B3AEA6', weight: 14 },
};

export const PACK = {
  id: 'pack_maehwa_seodang',
  name: '매화 피는 서당 뒤뜰',
  season: 'spring',
  seriesId: 'series_sagye',        // 사계 시리즈
  openedAt: '2026-09-01',
  closedAt: null,                   // null = 상설, 날짜 = 기간한정
  itemCount: 20,
  palette: ['#F0A8BE','#FBD8E2','#8AB566','#6E9A50','#B08F6A','#FBF0E6'],
  cover: 'mhs_07',                  // 배너 대표 아이템
};

/* ---------------------------------------------------------
   아이템 레코드
     id        팩코드_번호
     slot      배치 레이어 id
     rarity    SR | R | N
     box       에셋 고유 좌표계 [w, h]  (렌더 시 scale 적용)
     anchor    배치 기준점
     price     { cur: 'yeopjeon' | 'ipsae', amt }
                 yeopjeon = 공부로 버는 무료 화폐
                 ipsae(잎새) = 유료 화폐 (가칭)
     animated  소품 애니메이션 여부
     svg       내부 마크업 (배경 없음 / 투명)
   --------------------------------------------------------- */

export const ITEMS = [
{
  id:'mhs_01', name:'서당 뒷담', slot:'wall', rarity:'SR',
  box:[380,60], anchor:'bottom-left', price:{cur:'yeopjeon',amt:1800}, animated:false,
  tags:['담장','기와','구조물'],
  svg:`<rect y="12" width="380" height="48" fill="#D9C6B0"/><rect y="4" width="380" height="12" rx="4" fill="#9C8874"/><path d="M0 26h380M0 42h380" stroke="#CDBAA3" stroke-width="1.5"/>`
},
{
  id:'mhs_02', name:'먼 봄 산', slot:'far', rarity:'N',
  box:[380,90], anchor:'bottom-left', price:{cur:'yeopjeon',amt:400}, animated:false,
  tags:['원경','산'],
  svg:`<path d="M0 52 L90 14 L160 46 L240 18 L340 50 L380 34 V90 H0Z" fill="#AEBCA4"/><path d="M0 66 L110 32 L200 64 L290 36 L380 62 V90 H0Z" fill="#8FA88A"/>`
},
{
  id:'mhs_03', name:'아지랑이 하늘', slot:'sky', rarity:'R',
  box:[380,250], anchor:'top-left', price:{cur:'yeopjeon',amt:1200}, animated:true,
  tags:['하늘','배경'],
  svg:`<rect width="380" height="250" fill="#FDF3E9"/><circle cx="312" cy="46" r="26" fill="#FFF3D8"/><ellipse cx="80" cy="52" rx="54" ry="16" fill="#FFFAF3"/><ellipse cx="210" cy="38" rx="42" ry="13" fill="#FFFAF3"/><ellipse cx="300" cy="96" rx="36" ry="11" fill="#FFFAF3"/>`
},
{
  id:'mhs_04', name:'디딤돌 길', slot:'ground', rarity:'N',
  box:[380,110], anchor:'bottom-left', price:{cur:'yeopjeon',amt:500}, animated:false,
  tags:['바닥','길'],
  svg:`<rect width="380" height="110" fill="#BDD892"/><path d="M40 96 q60 -30 128 -26 q80 4 130 -18" stroke="#D9C7A6" stroke-width="14" fill="none" stroke-linecap="round"/><g fill="#C7B392"><ellipse cx="70" cy="88" rx="12" ry="6"/><ellipse cx="120" cy="76" rx="13" ry="6"/><ellipse cx="172" cy="71" rx="12" ry="6"/><ellipse cx="224" cy="74" rx="13" ry="6"/><ellipse cx="276" cy="63" rx="12" ry="6"/></g>`
},
{
  id:'mhs_05', name:'꽃잎 바닥', slot:'ground', rarity:'R',
  box:[380,110], anchor:'bottom-left', price:{cur:'ipsae',amt:60}, animated:false,
  tags:['바닥','꽃잎'],
  svg:`<rect width="380" height="110" fill="#C9A882"/><path d="M0 0h380v34q-190 16 -380 0Z" fill="#D9BE9A"/><g fill="#F0A8BE"><ellipse cx="42" cy="46" rx="7" ry="4.5"/><ellipse cx="128" cy="30" rx="6.5" ry="4"/><ellipse cx="220" cy="52" rx="7" ry="4.5"/><ellipse cx="308" cy="38" rx="6.5" ry="4"/><ellipse cx="76" cy="82" rx="7" ry="4.5"/><ellipse cx="180" cy="94" rx="6.5" ry="4"/><ellipse cx="268" cy="80" rx="7" ry="4.5"/><ellipse cx="346" cy="96" rx="6" ry="4"/></g>`
},
{
  id:'mhs_06', name:'새싹 잔디', slot:'ground', rarity:'N',
  box:[380,110], anchor:'bottom-left', price:{cur:'yeopjeon',amt:300}, animated:false,
  tags:['바닥','풀'],
  svg:`<rect width="380" height="110" fill="#BDD892"/><path d="M0 40 q100 -16 190 -2 q90 14 190 -4 v76 H0Z" fill="#AECD82"/><g stroke="#6E9A50" stroke-width="3" fill="none" stroke-linecap="round"><path d="M50 94 q-4 -16 2 -22"/><path d="M136 100 q4 -16 -2 -20"/><path d="M228 90 q-4 -14 2 -18"/><path d="M316 98 q4 -16 -2 -20"/></g>`
},
{
  id:'mhs_07', name:'늙은 매화나무', slot:'mid', rarity:'SR',
  box:[150,170], anchor:'bottom-center', price:{cur:'ipsae',amt:180}, animated:false,
  tags:['나무','매화','대형'],
  svg:`<path d="M78 168 q9 -60 -4 -92 q-10 -24 -34 -38" stroke="#7A5F45" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M74 96 q28 -14 42 -44 M70 126 q-24 -10 -36 -30" stroke="#7A5F45" stroke-width="9" fill="none" stroke-linecap="round"/><g fill="#F0A8BE"><circle cx="36" cy="46" r="25"/><circle cx="78" cy="26" r="27"/><circle cx="116" cy="54" r="23"/><circle cx="60" cy="74" r="23"/><circle cx="108" cy="94" r="21"/><circle cx="26" cy="86" r="17"/></g><g fill="#FBD8E2"><circle cx="78" cy="22" r="11"/><circle cx="38" cy="42" r="9"/><circle cx="108" cy="90" r="9"/><circle cx="60" cy="70" r="8"/><circle cx="116" cy="50" r="7"/></g><g fill="#FFFFFF"><circle cx="78" cy="20" r="4"/><circle cx="38" cy="40" r="3.5"/><circle cx="108" cy="88" r="3.5"/></g>`
},
{
  id:'mhs_08', name:'어린 홍매', slot:'mid', rarity:'R',
  box:[96,120], anchor:'bottom-center', price:{cur:'yeopjeon',amt:1400}, animated:false,
  tags:['나무','매화'],
  svg:`<path d="M48 118 q3 -40 0 -56" stroke="#8B6A55" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M48 76 q17 -10 25 -23 M48 88 q-14 -6 -22 -17" stroke="#8B6A55" stroke-width="5" fill="none" stroke-linecap="round"/><g fill="#E2789A"><circle cx="28" cy="44" r="16"/><circle cx="56" cy="32" r="17"/><circle cx="74" cy="52" r="14"/><circle cx="40" cy="64" r="14"/></g><g fill="#F5AFC6"><circle cx="56" cy="29" r="7"/><circle cx="29" cy="41" r="6"/><circle cx="40" cy="61" r="5.5"/></g>`
},
{
  id:'mhs_09', name:'백매 가지', slot:'mid', rarity:'R',
  box:[120,100], anchor:'bottom-left', price:{cur:'yeopjeon',amt:1300}, animated:false,
  tags:['나무','매화','백매'],
  svg:`<path d="M4 92 q34 -14 56 -36 q17 -18 56 -22" stroke="#7A5F45" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M38 68 q8 -18 4 -28 M76 42 q10 -16 8 -24" stroke="#7A5F45" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#FFFFFF"><circle cx="28" cy="72" r="12"/><circle cx="50" cy="54" r="13"/><circle cx="76" cy="38" r="12"/><circle cx="102" cy="26" r="11"/><circle cx="42" cy="34" r="10"/><circle cx="86" cy="14" r="10"/></g><g fill="#F0A8BE"><circle cx="50" cy="54" r="4"/><circle cx="76" cy="38" r="4"/><circle cx="28" cy="72" r="3.5"/><circle cx="102" cy="26" r="3.5"/><circle cx="42" cy="34" r="3"/></g>`
},
{
  id:'mhs_10', name:'진달래 덤불', slot:'mid', rarity:'N',
  box:[90,60], anchor:'bottom-center', price:{cur:'yeopjeon',amt:600}, animated:false,
  tags:['덤불','꽃'],
  svg:`<ellipse cx="45" cy="40" rx="42" ry="20" fill="#6E9A50"/><ellipse cx="45" cy="33" rx="37" ry="16" fill="#8AB566"/><g fill="#E4749B"><circle cx="20" cy="28" r="7"/><circle cx="46" cy="19" r="7.5"/><circle cx="70" cy="30" r="7"/><circle cx="32" cy="42" r="6.5"/><circle cx="60" cy="44" r="6.5"/></g><g fill="#F7A9C3"><circle cx="46" cy="19" r="3.4"/><circle cx="20" cy="28" r="3"/><circle cx="70" cy="30" r="3"/></g>`
},
{
  id:'mhs_11', name:'개나리 덤불', slot:'mid', rarity:'N',
  box:[90,60], anchor:'bottom-center', price:{cur:'yeopjeon',amt:600}, animated:false,
  tags:['덤불','꽃'],
  svg:`<ellipse cx="45" cy="42" rx="42" ry="18" fill="#6E9A50"/><ellipse cx="45" cy="35" rx="37" ry="15" fill="#8AB566"/><g fill="#F2C43C"><circle cx="18" cy="30" r="6.5"/><circle cx="42" cy="20" r="7"/><circle cx="66" cy="28" r="6.5"/><circle cx="30" cy="44" r="6"/><circle cx="58" cy="44" r="6"/><circle cx="76" cy="42" r="5.5"/></g><g fill="#FBE29A"><circle cx="42" cy="20" r="3"/><circle cx="18" cy="30" r="2.8"/><circle cx="66" cy="28" r="2.8"/></g>`
},
{
  id:'mhs_12', name:'싸리 울타리', slot:'mid', rarity:'N',
  box:[140,56], anchor:'bottom-left', price:{cur:'yeopjeon',amt:450}, animated:false,
  tags:['울타리','구조물','연결형'],
  repeatable:true,
  svg:`<g stroke="#B08F6A" stroke-width="5" stroke-linecap="round"><path d="M14 52 V8"/><path d="M40 54 V6"/><path d="M66 52 V8"/><path d="M92 54 V6"/><path d="M120 52 V10"/></g><g stroke="#96764F" stroke-width="4" stroke-linecap="round"><path d="M4 20 H136"/><path d="M4 40 H136"/></g>`
},
{
  id:'mhs_13', name:'돌물확', slot:'front', rarity:'R',
  box:[80,44], anchor:'bottom-center', price:{cur:'ipsae',amt:80}, animated:true,
  tags:['석물','물'],
  svg:`<ellipse cx="40" cy="34" rx="34" ry="15" fill="#A79684"/><ellipse cx="40" cy="27" rx="34" ry="15" fill="#C4B4A0"/><ellipse cx="40" cy="25" rx="26" ry="11" fill="#8FB6C4"/><ellipse cx="40" cy="23" rx="26" ry="11" fill="#A9CDD8"/><g fill="#F0A8BE"><ellipse cx="30" cy="20" rx="4.5" ry="3"/><ellipse cx="49" cy="25" rx="4.5" ry="3"/><ellipse cx="40" cy="17" rx="4" ry="2.6"/></g>`
},
{
  id:'mhs_14', name:'대나무 물받이', slot:'front', rarity:'N',
  box:[76,70], anchor:'bottom-center', price:{cur:'yeopjeon',amt:700}, animated:true,
  tags:['석물','물','대나무'],
  svg:`<path d="M14 8 v34 q0 8 10 8 h20" stroke="#8AAE5C" stroke-width="8" fill="none" stroke-linecap="round"/><g stroke="#6E9A50" stroke-width="2"><line x1="9" y1="20" x2="19" y2="20"/><line x1="9" y1="32" x2="19" y2="32"/></g><path d="M46 54 q0 8 -2 12" stroke="#A9CDD8" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="48" cy="66" rx="20" ry="9" fill="#A79684"/><ellipse cx="48" cy="62" rx="20" ry="9" fill="#C4B4A0"/><ellipse cx="48" cy="61" rx="14" ry="6" fill="#A9CDD8"/>`
},
{
  id:'mhs_15', name:'나무 평상', slot:'front', rarity:'R',
  box:[100,46], anchor:'bottom-center', price:{cur:'ipsae',amt:90}, animated:false,
  tags:['가구','앉기'],
  sitSlot:{x:50,y:12},
  svg:`<rect x="4" y="14" width="92" height="12" rx="4" fill="#B08F6A"/><rect x="4" y="9" width="92" height="9" rx="4" fill="#C9A87C"/><rect x="14" y="26" width="8" height="20" rx="3" fill="#96764F"/><rect x="78" y="26" width="8" height="20" rx="3" fill="#96764F"/><g fill="#F0A8BE"><ellipse cx="30" cy="7" rx="4.5" ry="3"/><ellipse cx="68" cy="6" rx="4.5" ry="3"/></g>`
},
{
  id:'mhs_16', name:'삿갓 장독', slot:'front', rarity:'N',
  box:[70,60], anchor:'bottom-center', price:{cur:'yeopjeon',amt:550}, animated:false,
  tags:['장독','생활'],
  svg:`<path d="M20 56 q-9 -22 3 -32 q9 -8 18 0 q12 10 3 32 Z" fill="#5C3F2C"/><path d="M20 56 q-7 -22 5 -30 q8 -7 15 0 q12 8 5 30 Z" fill="#7C5942"/><path d="M10 24 q23 -16 46 0 Z" fill="#D9B96A"/><path d="M8 25 q25 -20 50 0 q-13 5 -25 5 q-12 0 -25 -5 Z" fill="#E8CD8A"/><path d="M22 20 l6 -10 M44 20 l-6 -10" stroke="#C9A85E" stroke-width="1.5" fill="none"/>`
},
{
  id:'mhs_17', name:'호랑나비 한 쌍', slot:'air', rarity:'R',
  box:[80,70], anchor:'center', price:{cur:'ipsae',amt:70}, animated:true,
  anim:'flutter',
  tags:['생물','움직임'],
  svg:`<g stroke="#C9738F" stroke-width="2" fill="#FBD3E0"><path d="M24 34 q-14 -16 -3 -23 q11 -6 6 18"/><path d="M24 34 q14 -16 3 -23 q-11 -6 -6 18"/></g><line x1="24" y1="13" x2="24" y2="34" stroke="#B85A78" stroke-width="2"/><g stroke="#E0A03C" stroke-width="2" fill="#FCE9AF"><path d="M56 60 q-12 -14 -2 -20 q9 -5 5 16"/><path d="M56 60 q12 -14 2 -20 q-9 -5 -5 16"/></g><line x1="56" y1="42" x2="56" y2="60" stroke="#C98A2C" stroke-width="2"/>`
},
{
  id:'mhs_18', name:'흩날리는 꽃비', slot:'air', rarity:'SR',
  box:[380,250], anchor:'top-left', price:{cur:'ipsae',amt:200}, animated:true,
  anim:'petalFall',
  tags:['이펙트','움직임','전체화면'],
  svg:`<g fill="#F0A8BE"><ellipse cx="40" cy="30" rx="6" ry="4" transform="rotate(-30 40 30)"/><ellipse cx="150" cy="18" rx="6.5" ry="4.2" transform="rotate(20 150 18)"/><ellipse cx="266" cy="44" rx="6" ry="4" transform="rotate(-15 266 44)"/><ellipse cx="340" cy="22" rx="5.5" ry="3.6" transform="rotate(25 340 22)"/><ellipse cx="86" cy="110" rx="6.5" ry="4.2" transform="rotate(35 86 110)"/><ellipse cx="204" cy="128" rx="6" ry="4" transform="rotate(-25 204 128)"/><ellipse cx="312" cy="150" rx="6.5" ry="4.2" transform="rotate(15 312 150)"/><ellipse cx="52" cy="196" rx="6" ry="4" transform="rotate(-35 52 196)"/><ellipse cx="176" cy="216" rx="5.5" ry="3.6" transform="rotate(25 176 216)"/><ellipse cx="290" cy="232" rx="6" ry="4" transform="rotate(-20 290 232)"/></g><g fill="#FBD8E2"><ellipse cx="112" cy="62" rx="5" ry="3.4" transform="rotate(10 112 62)"/><ellipse cx="238" cy="86" rx="5" ry="3.4" transform="rotate(-20 238 86)"/><ellipse cx="24" cy="140" rx="5" ry="3.4" transform="rotate(30 24 140)"/><ellipse cx="356" cy="188" rx="4.5" ry="3" transform="rotate(-10 356 188)"/></g>`
},
{
  id:'mhs_19', name:'담장 위 참새', slot:'air', rarity:'N',
  box:[90,60], anchor:'center', price:{cur:'yeopjeon',amt:800}, animated:true,
  anim:'hop',
  tags:['생물','움직임'],
  svg:`<path d="M2 48 q22 -6 44 -16 q18 -6 40 -6" stroke="#7A5F45" stroke-width="5" fill="none" stroke-linecap="round"/><g><ellipse cx="26" cy="34" rx="13" ry="9" fill="#A08768"/><circle cx="35" cy="25" r="7.5" fill="#B39A79"/><path d="M15 36 l-10 5 l10 4 Z" fill="#8A7359"/><circle cx="37" cy="24" r="1.8" fill="#4A3B2C"/><path d="M41 25 l6 2.5 l-6 2.5 Z" fill="#D9A44C"/></g><g><ellipse cx="64" cy="20" rx="11" ry="8" fill="#A08768"/><circle cx="72" cy="12" r="7" fill="#B39A79"/><path d="M54 22 l-9 4 l9 3 Z" fill="#8A7359"/><circle cx="74" cy="11" r="1.7" fill="#4A3B2C"/><path d="M78 12 l6 2.5 l-6 2.5 Z" fill="#D9A44C"/></g>`
},
{
  id:'mhs_20', name:'서안과 붓', slot:'front', rarity:'N',
  box:[80,54], anchor:'bottom-center', price:{cur:'yeopjeon',amt:900}, animated:false,
  tags:['서당','공부','생활'],
  studyBonus:0.02,
  svg:`<rect x="8" y="24" width="64" height="10" rx="4" fill="#96764F"/><rect x="8" y="19" width="64" height="8" rx="4" fill="#B08F6A"/><rect x="16" y="34" width="6" height="20" rx="2" fill="#7A5F45"/><rect x="58" y="34" width="6" height="20" rx="2" fill="#7A5F45"/><path d="M18 19 h26 v-9 h-26 Z" fill="#F2E7D2"/><path d="M18 10 q13 -5 26 0" stroke="#D9C6A8" stroke-width="1.5" fill="none"/><rect x="50" y="13" width="4.5" height="7" rx="1.6" fill="#3D3A36"/><rect x="50" y="0" width="4.5" height="14" rx="2" fill="#B08F6A"/><ellipse cx="62" cy="18" rx="9" ry="4" fill="#5C6B72"/><ellipse cx="62" cy="16" rx="9" ry="4" fill="#7D8C93"/>`
},
];

/* ---------------------------------------------------------
   플레이어 저장 데이터 (예시)
   --------------------------------------------------------- */
export const SAMPLE_SAVE = {
  gardenId: 'g_0001',
  owned: ['mhs_01','mhs_04','mhs_07','mhs_10','mhs_12','mhs_17','mhs_20'],
  placed: [
    { itemId:'mhs_01', x:0,   y:118, flip:false },
    { itemId:'mhs_04', x:0,   y:140, flip:false },
    { itemId:'mhs_07', x:96,  y:200, flip:false, scale:1.0 },
    { itemId:'mhs_10', x:246, y:196, flip:false },
    { itemId:'mhs_12', x:14,  y:214, flip:false },
    { itemId:'mhs_20', x:196, y:224, flip:false },
    { itemId:'mhs_17', x:280, y:96,  flip:false },
  ],
  avatar: { x:150, y:210 },
};

/* ---------------------------------------------------------
   렌더러
     - 단일슬롯(sky/far/wall/ground)은 z 순서대로 먼저 깔고
     - mid/front + 아바타는 y 오름차순으로 한 번에 정렬
     - air는 마지막
   --------------------------------------------------------- */

const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const LAYER_MAP = Object.fromEntries(LAYERS.map(l => [l.id, l]));

export function getItem(id){ return ITEM_MAP[id]; }

export function renderGarden(save, { width=380, height=250 } = {}) {
  const parts = [];
  const entries = save.placed
    .map(p => ({ p, it: ITEM_MAP[p.itemId] }))
    .filter(e => e.it);

  const bg  = entries.filter(e => LAYER_MAP[e.it.slot].mode === 'single')
                     .sort((a,b) => LAYER_MAP[a.it.slot].z - LAYER_MAP[b.it.slot].z);
  const mid = entries.filter(e => e.it.slot === 'mid' || e.it.slot === 'front');
  const air = entries.filter(e => e.it.slot === 'air');

  const sortPool = [
    ...mid.map(e => ({ y: e.p.y, draw: () => wrap(e) })),
    { y: save.avatar.y, draw: () => `<g class="avatar" transform="translate(${save.avatar.x},${save.avatar.y})"></g>` },
  ].sort((a,b) => a.y - b.y);

  bg.forEach(e => parts.push(wrap(e)));
  sortPool.forEach(s => parts.push(s.draw()));
  air.forEach(e => parts.push(wrap(e)));

  return `<svg viewBox="0 0 ${width} ${height}" width="100%">${parts.join('')}</svg>`;

  function wrap(e){
    const { p, it } = e;
    const [w, h] = it.box;
    let dx = p.x, dy = p.y;
    if (it.anchor === 'bottom-center') { dx -= w/2; dy -= h; }
    else if (it.anchor === 'bottom-left') { dy -= h; }
    else if (it.anchor === 'center') { dx -= w/2; dy -= h/2; }
    const s = p.scale || 1;
    const fx = p.flip ? ` scale(-1,1) translate(${-w},0)` : '';
    return `<g data-item="${it.id}" transform="translate(${dx},${dy}) scale(${s})${fx}">${it.svg}</g>`;
  }
}
