const rows=[
 ['ㄅ','ㄆ','ˇ','ˋ','ㄓ','ˊ','˙','ㄚ','ㄞ','ㄢ','ㄦ',null],
 ['ㄇ','ㄈ','ㄘ','ㄌ','ㄛ','ㄜ','ˉ','ㄟ','ㄣ','ㄧ',null,null],
 ['ㄉ','ㄊ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄔ','ㄗ','ㄤ',null,null],
 ['ㄋ','ㄌ','ㄈ','ㄧ','ㄨ','ㄩ','ㄒ','ㄕ','ㄙ','ㄥ',null,null]
];

// 依參考圖重排為傳統注音鍵盤視覺；為避免重複/缺字，以下使用標準鍵位配置。
const keyboardRows=[
 ['ㄅ','ㄉ','ˇ','ˋ','ㄓ','ˊ','˙','ㄚ','ㄞ','ㄢ','ㄦ'],
 ['ㄆ','ㄊ','ㄍ','ㄐ','ㄔ','ㄗ','ㄧ','ㄛ','ㄟ','ㄣ'],
 ['ㄇ','ㄋ','ㄎ','ㄑ','ㄕ','ㄘ','ㄨ','ㄜ','ㄠ','ㄤ'],
 ['ㄈ','ㄌ','ㄏ','ㄒ','ㄖ','ㄙ','ㄩ','ㄝ','ㄡ','ㄥ']
];

let composing='',sentence='';
const $=id=>document.getElementById(id);
const tones=['ˊ','ˇ','ˋ','˙'];

function say(t){
 if(!t)return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(t);
 u.lang='zh-TW';u.rate=.85;
 speechSynthesis.speak(u);
}
function phoneticSay(x){
 const names={'ˉ':'一聲','ˊ':'二聲','ˇ':'三聲','ˋ':'四聲','˙':'輕聲'};
 say(names[x]||x);
}
const nextWords={
'我':['要','想','好','可以','不要'],
'我要':['喝','吃','水','休息','上廁所','幫忙'],
'我想':['喝','吃','要','休息','回家'],
'喝':['水','牛奶','果汁','飲料','茶'],
'吃':['飯','水果','麵包','點心','藥'],
'我要喝':['水','牛奶','果汁','飲料'],
'我要吃':['飯','水果','麵包','點心'],
'我要去':['廁所','教室','外面','回家'],
'我不舒服':['頭痛','肚子痛','想休息','要幫忙'],
'要':['喝','吃','水','休息','幫忙'],
'不要':['吃','喝','碰','去'],
'好':['了','的','嗎']
};
function phraseCandidates(){
 const keys=Object.keys(nextWords).sort((a,b)=>b.length-a.length);
 const k=keys.find(k=>sentence.endsWith(k));
 return k?nextWords[k]:[];
}
function candidates(){
  return zhuyinCandidates(composing);
}
function render(){
 $('sentence').textContent=sentence||'請用下方注音開始輸入…';
 $('compose').textContent=composing||'　';
 $('cands').innerHTML='';
 const list=composing?candidates():phraseCandidates();
 list.forEach(w=>{
  const b=document.createElement('button');
  b.className='cand';b.textContent=w;
  b.onclick=()=>{sentence+=w;composing='';say(w);render()};
  $('cands').appendChild(b);
 });
}
function addKey(x){
 const b=document.createElement('button');
 b.className='key '+(tones.includes(x)?'tone':'');
 b.textContent=x;
 b.onclick=()=>{composing+=x;phoneticSay(x);render()};
 $('keys').appendChild(b);
}
function makeKeys(){
 keyboardRows.forEach(row=>{
  row.forEach(addKey);
  for(let i=row.length;i<12;i++){
   const z=document.createElement('span');z.className='blank';$('keys').appendChild(z);
  }
 });

 // 刪除鍵
 const back=document.createElement('button');
 back.className='key action';back.textContent='⌫';
 back.onclick=()=>{
  if(composing) composing=composing.slice(0,-1);
  else sentence=sentence.slice(0,-1);
  render();
 };
 $('keys').appendChild(back);

 // 一聲鍵與刪除鍵同行：刪除鍵在左，一聲長條鍵接在右側
 const wrap=document.createElement('div');
 wrap.className='one-tone-wrap';
 const tone1=document.createElement('button');
 tone1.className='one-tone';
 tone1.setAttribute('aria-label','一聲');
 tone1.title='一聲';
 tone1.innerHTML='<span class="one-tone-dot"></span>';
 tone1.onclick=()=>{
  // 一聲以 ˉ 記錄；候選查詢同時相容「未標一聲」的字典資料
  if(composing && !/[ˉˊˇˋ˙]$/.test(composing)) composing+='ˉ';
  phoneticSay('ˉ');
  render();
 };
 wrap.appendChild(tone1);
 $('keys').appendChild(wrap);
 for(let i=0;i<4;i++){
  const z=document.createElement('span');z.className='blank';$('keys').appendChild(z);
 }
}
let favs=JSON.parse(localStorage.getItem('zhuyinFavs')||'["我要","不要","幫忙","上廁所","休息"]');
function saveFav(i){
 if(!sentence){alert('請先在上方輸入要儲存的句子。');return}
 if(confirm(`要將「${sentence}」儲存到這一格嗎？`)){
  favs[i]=sentence;localStorage.setItem('zhuyinFavs',JSON.stringify(favs));renderFavs();
 }
}
function renderFavs(){
 $('favorites').innerHTML='';
 favs.forEach((x,i)=>{
  const b=document.createElement('button');b.className='fav';b.textContent=x||'＋常用語';
  let timer,longPressed=false;
  b.onpointerdown=()=>{longPressed=false;timer=setTimeout(()=>{longPressed=true;saveFav(i)},700)};
  b.onpointerup=()=>clearTimeout(timer);b.onpointercancel=()=>clearTimeout(timer);
  b.onclick=()=>{if(longPressed)return;sentence+=x;say(x);render()};
  $('favorites').appendChild(b);
 });
}
$('speak').onclick=()=>say(sentence);
$('clear').onclick=()=>{sentence='';composing='';render()};
makeKeys();renderFavs();render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=12');
