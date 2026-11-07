(function(){
var LV={1:{n:'초급',d:'용어와 핵심 서비스 이름을 익힙니다'},2:{n:'중급',d:'네트워크·데이터·운영을 설계합니다'},3:{n:'고급',d:'보안·재해 복구·비용·실전 사례를 다룹니다'}};
var TOP=window.TOPICS||[];
var EXT=window.EXT||{};
TOP.forEach(function(t){var e=EXT[t.id];if(e){t.c=t.c.concat(e.c||[]);t.ex=t.ex.concat(e.ex||[]);t.tip=t.tip.concat(e.tip||[]);t.qz=t.qz.concat(e.qz||[])}});
TOP=TOP.map(function(t,i){return[t,i]}).sort(function(a,b){return a[0].lv-b[0].lv||a[1]-b[1]}).map(function(x){return x[0]});
var app=document.getElementById('app');
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function getDone(){try{return JSON.parse(ls('pca2_done')||'[]')}catch(e){return[]}}
function toggleDone(id){var d=getDone(),i=d.indexOf(id);if(i<0)d.push(id);else d.splice(i,1);ls('pca2_done',JSON.stringify(d))}
function byLv(n){return TOP.filter(function(t){return t.lv===n})}
function find(id){return TOP.filter(function(t){return t.id===id})[0]}

function quiz(qs){
  return '<div>'+qs.map(function(q,i){
    var o=[q[1],q[2],q[3],q[4]].map(function(t,k){return{t:t,c:k===0}});
    var r=(i*5+q[0].length)%4, s=o.slice(r).concat(o.slice(0,r));
    return '<div class="q"><div class="n">Q'+(i+1)+'</div><p>'+esc(q[0])+'</p><div class="opts">'+
      s.map(function(x,k){return '<button type="button" class="opt" data-c="'+(x.c?1:0)+'"><b>'+'ABCD'[k]+'</b><span>'+esc(x.t)+'</span></button>'}).join('')+
      '</div><div class="exp"><b>해설</b> '+esc(q[5])+'</div></div>';
  }).join('')+'<div class="score" id="sc">0 / '+qs.length+' 정답</div></div>';
}
function bindQuiz(){
  var got=0,ans=0,qs=app.querySelectorAll('.q'),sc=document.getElementById('sc');
  qs.forEach(function(d){d.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){
    if(d.classList.contains('done'))return;d.classList.add('done');ans++;
    if(b.dataset.c==='1'){b.classList.add('ok');got++}else{b.classList.add('bad');d.querySelector('[data-c="1"]').classList.add('ok')}
    d.querySelectorAll('.opt').forEach(function(x){x.disabled=true});
    sc.textContent=got+' / '+qs.length+' 정답 · '+ans+'문항 풀이';
  })})});
}

function home(){
  var d=getDone();
  var next=TOP.filter(function(t){return d.indexOf(t.id)<0})[0];
  var cards=[1,2,3].map(function(n){
    var ts=byLv(n),c=ts.filter(function(t){return d.indexOf(t.id)>=0}).length;
    return '<a class="lvbtn lv'+n+'" href="#/l/'+n+'"><div class="k">LEVEL '+n+'</div><h3>'+LV[n].n+'</h3><p>'+LV[n].d+'</p><div class="prog"><i style="width:'+(ts.length?c/ts.length*100:0)+'%"></i></div><div class="pt">'+c+' / '+ts.length+' 완료</div></a>';
  }).join('');
  app.innerHTML='<div class="eyebrow">Google Cloud · Professional Cloud Architect</div><h1>초급에서 고급까지,<br><mark>버튼 하나씩</mark> 들어가서 배웁니다</h1><p class="lead">주제마다 개념, 예제, 시험 포인트, 퀴즈가 탭으로 나뉘어 있습니다. 한 번에 한 탭만 보이니 길게 스크롤하지 않아도 됩니다.</p><div class="lvgrid">'+cards+'</div><div class="tools">'+
    (next?'<a class="btn" href="#/t/'+next.id+'">이어서 학습: '+esc(next.t)+'</a>':'<span class="pt">모든 주제를 완료했습니다</span>')+
    '<a class="btn alt" href="#/mix/10">랜덤 10문제</a><a class="btn alt" href="#/mix/30">모의고사 30문제</a><a class="btn alt" href="guide.html">로드맵·용어·치트시트</a></div><div class="srch"><input id="sq" type="search" placeholder="주제 검색 (예: IAM, 로드밸런서, DR)" aria-label="주제 검색"><div class="tgrid" id="sr"></div></div>';
  var qi=document.getElementById('sq');qi.addEventListener('input',function(){var q=qi.value.trim().toLowerCase(),r=document.getElementById('sr');
    r.innerHTML=q?(TOP.filter(function(t){return (t.t+t.one+t.c.map(function(x){return x[0]+x[1]}).join('')).toLowerCase().indexOf(q)>=0}).map(function(t){return '<a class="topic lv'+t.lv+'" href="#/t/'+t.id+'"><div class="n">'+LV[t.lv].n+'</div><h3>'+esc(t.t)+'</h3><p>'+esc(t.one)+'</p></a>'}).join('')||'<p class="pt">검색 결과가 없습니다.</p>'):''});
}
function level(n){
  var d=getDone();
  app.innerHTML='<div class="crumb"><a href="#/">홈</a> / '+LV[n].n+'</div><h2>'+LV[n].n+'</h2><p class="lead">'+LV[n].d+'</p><div class="tgrid lv'+n+'">'+
    byLv(n).map(function(t,i){return '<a class="topic'+(d.indexOf(t.id)>=0?' done':'')+'" href="#/t/'+t.id+'"><div class="n">'+LV[n].n+' '+(i+1)+'</div><h3>'+esc(t.t)+'</h3><p>'+esc(t.one)+'</p></a>'}).join('')+'</div><p style="margin-top:20px"><a class="btn" href="#/mix/lv'+n+'">'+LV[n].n+' 전체 퀴즈 (10문제)</a></p>';
}
function topic(id,tab){
  var t=find(id);if(!t){location.hash='#/';return}
  tab=tab||'c';
  var idx=TOP.indexOf(t),prev=TOP[idx-1],nx=TOP[idx+1],isDone=getDone().indexOf(id)>=0;
  var tabs=[['c','개념'],['e','예제'],['p','시험 포인트'],['q','퀴즈']];
  var body='';
  if(tab==='c')body='<div class="cgrid">'+t.c.map(function(x){return '<div class="card"><h4>'+esc(x[0])+'</h4><p>'+esc(x[1])+'</p></div>'}).join('')+'</div>';
  else if(tab==='e')body='<div class="cgrid">'+t.ex.map(function(x){return '<div class="card"><span class="lab">상황</span><p>'+esc(x.s)+'</p><span class="lab">정답</span><p class="a">'+esc(x.a)+'</p><span class="lab">이유</span><p>'+esc(x.w)+'</p></div>'}).join('')+'</div>';
  else if(tab==='p')body='<ul class="tips">'+t.tip.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>';
  else body=quiz(t.qz);
  app.innerHTML='<div class="lv'+t.lv+'"><div class="crumb"><a href="#/">홈</a> / <a href="#/l/'+t.lv+'">'+LV[t.lv].n+'</a> / '+esc(t.t)+'</div><h2>'+esc(t.t)+'</h2><p class="lead" style="margin:0">'+esc(t.one)+'</p><div class="tabs">'+
    tabs.map(function(x){return '<a href="#/t/'+id+'/'+x[0]+'" class="'+(x[0]===tab?'on':'')+'">'+x[1]+'</a>'}).join('')+'</div>'+body+
    '<div class="pn"><div>'+(prev?'<a class="btn alt" href="#/t/'+prev.id+'">← '+esc(prev.t)+'</a>':'')+'</div><button type="button" class="btn'+(isDone?' alt':'')+'" id="dn">'+(isDone?'완료 취소':'완료로 표시')+'</button><div>'+(nx?'<a class="btn alt" href="#/t/'+nx.id+'">'+esc(nx.t)+' →</a>':'')+'</div></div></div>';
  document.getElementById('dn').addEventListener('click',function(){toggleDone(id);topic(id,tab)});
  if(tab==='q')bindQuiz();
}
function mix(p){
  var lv=/^lv(\d)$/.exec(p||''),cnt=lv?10:(+p||10),all=[];
  TOP.forEach(function(t){if(!lv||t.lv===+lv[1])t.qz.forEach(function(q){all.push(q)})});
  for(var i=all.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=all[i];all[i]=all[j];all[j]=x}
  var ttl=lv?LV[lv[1]].n+' 퀴즈':(cnt>=30?'모의고사 '+cnt+'문제':'랜덤 '+cnt+'문제');
  app.innerHTML='<div class="crumb"><a href="#/">홈</a> / 퀴즈</div><h2>'+ttl+'</h2><p class="lead">'+(lv?'이 레벨의 문제에서 무작위로 뽑습니다.':'전체 주제(총 '+all.length+'문항)에서 무작위로 뽑습니다.')+'</p>'+quiz(all.slice(0,cnt))+'<p><button type="button" class="btn" id="again">새로 뽑기</button></p>';
  document.getElementById('again').addEventListener('click',function(){mix(p)});
  bindQuiz();
}
function route(){
  var h=(location.hash||'#/').replace(/^#\/?/,'').split('/');
  window.scrollTo(0,0);
  if(h[0]==='l'&&LV[h[1]])level(+h[1]);
  else if(h[0]==='t'&&h[1])topic(h[1],h[2]);
  else if(h[0]==='mix')mix(h[1]);
  else home();
}
window.addEventListener('hashchange',route);
route();
})();
