const dict={
'ㄅ':['不','把','被','比','白','爸','班','幫'],'ㄅㄚ':['八','巴','吧','拔','把','爸'],'ㄅㄚˋ':['爸','霸','罷'],
'ㄨ':['我','無','五','物','午'],'ㄨㄛ':['我','握','窩'],'ㄨㄛˇ':['我'],
'ㄋ':['你','那','年','能','哪'],'ㄋㄧ':['你','尼','泥','妮'],'ㄋㄧˇ':['你','擬'],
'ㄏ':['好','和','喝','很','會','還'],'ㄏㄠ':['好','號','豪'],'ㄏㄠˇ':['好'],
'ㄏㄜ':['喝','和','河','合'],'ㄏㄜˉ':['喝'],
'ㄕ':['是','想','上','水','說','什'],'ㄒ':['想','小','先','喜','謝'],
'ㄒㄧㄤ':['想','香','鄉','相'],'ㄒㄧㄤˇ':['想','響'],
'ㄕㄨㄟˇ':['水'],'ㄋㄧㄡˊ':['牛'],'ㄋㄞˇ':['奶']
};

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
function candidates(){
 const lookup=composing.endsWith('ˉ')?composing.slice(0,-1):composing;
 let exact=dict[composing]||dict[lookup]||[];
 if(!exact.length&&lookup){
  const all=[];
  for(const [k,v] of Object.entries(dict)) if(k.startsWith(lookup)) all.push(...v);
  exact=[...new Set(all)];
 }
 return exact.slice(0,12);
}
function render(){
 $('sentence').textContent=sentence||'請用下方注音開始輸入…';
 $('compose').textContent=composing||'　';
 $('cands').innerHTML='';
 candidates().forEach(w=>{
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

 // 補齊該列，讓下一列的一聲鍵可以置中
 for(let i=0;i<11;i++){
  const z=document.createElement('span');z.className='blank';$('keys').appendChild(z);
 }

 // 一聲鍵：依參考板設計為中央長條白鍵＋紅色圓點
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
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=4');
