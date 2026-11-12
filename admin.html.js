(function(){
var $=function(i){return document.getElementById(i)},L=[],sha='',ls;
try{ls=window.localStorage}catch(e){ls=null}
function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function msg(t,bad){var m=$('msg');m.textContent=t;m.className=bad?'er':'ok'}
function cfg(){return{o:$('o').value.trim(),r:$('r').value.trim(),b:$('b').value.trim()||'main',t:$('t').value.trim()}}
['o','r','b','t'].forEach(function(k){try{var v=ls&&ls.getItem('pz_'+k);if(v)$(k).value=v}catch(e){}});
function keep(c){try{if(ls)['o','r','b','t'].forEach(function(k){ls.setItem('pz_'+k,c[k])})}catch(e){}}
function api(c,extra,opt){opt=opt||{};opt.headers=Object.assign({'Authorization':'Bearer '+c.t,'Accept':'application/vnd.github+json'},opt.headers||{});
  return fetch('https://api.github.com/repos/'+encodeURIComponent(c.o)+'/'+encodeURIComponent(c.r)+'/contents/products.json'+extra,opt)}
function b64(s){var u=new TextEncoder().encode(s),o='';for(var i=0;i<u.length;i+=32768)o+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(o)}
function rs(f){return new Promise(function(ok,no){var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){
  var k=Math.min(1,520/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.74))};
  im.onerror=no;im.src=fr.result};fr.onerror=no;fr.readAsDataURL(f)})}
function why(r){return r.status===401?'Token galat ya expire ho gaya hai.':r.status===403?'Token ko is repository mein Contents: Read and write ki permission chahiye.':r.status===404?'Username/repository ka naam galat hai ya token ko is repo ka access nahi.':r.status===409||r.status===422?'File pehle se badal chuki hai. "Connect & products laayein" dabakar dobara try karein.':'Error '+r.status}
function draw(){
  var box=$('list');box.textContent='';
  if(!L.length){box.appendChild(mk('small','','Koi product nahi. "+ Naya product" dabayein.'));return}
  L.forEach(function(p,i){
    var r=mk('div','row'),th=mk('img','th');th.alt='';if(p.img)th.src=p.img;r.appendChild(th);
    var d=mk('div'),nm=mk('input'),pr=mk('input'),g=mk('div','g2');
    nm.type='text';nm.maxLength=80;nm.value=p.name;nm.placeholder='Product ka naam';nm.oninput=function(){p.name=nm.value};
    pr.type='number';pr.min=0;pr.value=p.price;pr.placeholder='Price';pr.oninput=function(){p.price=Math.max(0,Math.round(+pr.value||0))};
    var a=mk('div'),b=mk('div');a.appendChild(mk('label','','Naam'));a.appendChild(nm);b.appendChild(mk('label','','Price (\u20B9)'));b.appendChild(pr);g.appendChild(a);g.appendChild(b);d.appendChild(g);
    var g3=mk('div','g2'),oa=mk('div'),ob=mk('div'),of=mk('input');
    of.type='number';of.min=0;of.value=p.offer||'';of.placeholder='Offer price';of.oninput=function(){p.offer=Math.max(0,Math.round(+of.value||0))};
    oa.appendChild(mk('label','','Offer price (\u20B9)'));oa.appendChild(of);
    var ol=mk('label'),oc=document.createElement('input');ol.style.cssText='display:flex;gap:6px;align-items:center;margin-top:32px';
    oc.type='checkbox';oc.checked=!!p.offerOn;oc.onchange=function(){p.offerOn=oc.checked};ol.appendChild(oc);ol.appendChild(document.createTextNode('Offer chalu'));
    ob.appendChild(ol);g3.appendChild(oa);g3.appendChild(ob);d.appendChild(g3);
    var ck=mk('div','ck'),l1=mk('label'),c1=mk('input'),l2=mk('label'),c2=mk('input');
    c1.type='checkbox';c1.checked=p.show!==false;c1.onchange=function(){p.show=c1.checked};l1.appendChild(c1);l1.appendChild(document.createTextNode('Website par dikhao'));
    c2.type='checkbox';c2.checked=p.note==='Combo';c2.onchange=function(){p.note=c2.checked?'Combo':''};l2.appendChild(c2);l2.appendChild(document.createTextNode('Combo'));
    ck.appendChild(l1);ck.appendChild(l2);d.appendChild(ck);
    var sw=mk('div','ck');sw.appendChild(mk('span','','Size:'));
    ['S','M','L','XL'].forEach(function(z){var l=mk('label'),cb=document.createElement('input');cb.type='checkbox';cb.checked=(p.sizes||[]).indexOf(z)>-1;
      cb.onchange=function(){var a=['S','M','L','XL'].filter(function(y){return y===z?cb.checked:(p.sizes||[]).indexOf(y)>-1});if(a.length){p.sizes=a}else{delete p.sizes}};
      l.appendChild(cb);l.appendChild(document.createTextNode(z));sw.appendChild(l)});
    d.appendChild(sw);
    var fi=mk('input');fi.type='file';fi.accept='image/*';fi.style.display='none';
    fi.onchange=function(){if(!fi.files[0])return;rs(fi.files[0]).then(function(u){p.img=u;th.src=u;msg('Photo lag gayi. Ab "Website par save karein" dabayein.')},function(){msg('Ye photo nahi khul saki.',1)})};
    var ac=mk('div','ac'),bp=mk('button','',p.img?'Photo badlein':'Photo chunein'),up=mk('button','','\u2191'),dn=mk('button','','\u2193'),dl=mk('button','dl','Delete');
    [bp,up,dn,dl].forEach(function(x){x.type='button'});
    bp.onclick=function(){fi.click()};
    up.onclick=function(){if(i>0){L.splice(i-1,0,L.splice(i,1)[0]);draw()}};
    dn.onclick=function(){if(i<L.length-1){L.splice(i+1,0,L.splice(i,1)[0]);draw()}};
    dl.onclick=function(){if(confirm('"'+(p.name||'Ye product')+'" delete karein?')){L.splice(i,1);draw()}};
    [bp,up,dn,dl,fi].forEach(function(x){ac.appendChild(x)});d.appendChild(ac);r.appendChild(d);box.appendChild(r)})}
$('ld').onclick=function(){
  var c=cfg();if(!c.o||!c.r||!c.t){msg('Username, repository aur token teeno bharein.',1);return}
  msg('Load ho raha hai...');var q='?ref='+encodeURIComponent(c.b);
  api(c,q).then(function(m){
    if(m.status===404){return m.json().then(function(){keep(c);sha='';L=[];draw();msg('products.json abhi repo mein nahi hai. Product add karke save karein.')})}
    if(!m.ok){msg(why(m),1);return}
    return m.json().then(function(j){sha=j.sha;return api(c,q,{headers:{'Accept':'application/vnd.github.raw+json'}})}).then(function(r){
      if(!r.ok){msg(why(r),1);return}return r.text()}).then(function(t){
      if(t==null)return;var d=JSON.parse(t);
      if(!d.products&&d.content&&d.encoding==='base64'){try{d=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(String(d.content).replace(/\s/g,'')),function(ch){return ch.charCodeAt(0)})))}catch(e){}}
      L=d.products||[];keep(c);
      if(L.length){draw();msg('Ho gaya: '+L.length+' products load hue.');return}
      return fetch('products.json?'+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(x){L=x.products||[];draw();msg(L.length?'Ho gaya: '+L.length+' products load hue.':'Products nahi mile. products.json file dobara upload karein.',!L.length)})})
  }).catch(function(){msg('Connect nahi ho paya. Internet ya details check karein.',1)})};
$('fg').onclick=function(){try{if(ls)['o','r','b','t'].forEach(function(k){ls.removeItem('pz_'+k)})}catch(e){}$('t').value='';msg('Token is browser se hata diya.')};
$('bon').onclick=function(){var v=Math.round(+$('bp').value);if(!(v>=1&&v<=90)){msg('1 se 90 ke beech % likhein.',1);return}
  L.forEach(function(p){p.offer=Math.max(1,Math.round(p.price*(100-v)/100));p.offerOn=true});draw();msg(v+'% offer sabhi products par laga. Ab "Website par save karein" dabayein.')};
$('bof').onclick=function(){L.forEach(function(p){p.offerOn=false});draw();msg('Saare offer band ho gaye. Ab "Website par save karein" dabayein.')};
$('ad').onclick=function(){L.push({id:'p'+Date.now(),name:'',price:0,note:'',img:'',show:true});draw();window.scrollTo(0,document.body.scrollHeight)};
$('sv').onclick=function(){
  var c=cfg();if(!L.length&&!confirm('Product list khaali hai. Save karne par website se saare products hat jayenge. Pakka save karein?'))return;if(!c.o||!c.r||!c.t){msg('Pehle connect karein.',1);return}
  for(var i=0;i<L.length;i++){if(!L[i].name.trim()){msg('Product '+(i+1)+' ka naam likhein.',1);return}if(L[i].offerOn&&!(L[i].offer>0&&L[i].offer<L[i].price)){msg('"'+L[i].name+'": Offer price asli price se kam honi chahiye.',1);return}if(!L[i].img){msg('"'+L[i].name+'" ki photo chunein.',1);return}}
  msg('Save ho raha hai...');
  var body={message:'Update products',content:b64(JSON.stringify({products:L},null,1)),branch:c.b};if(sha)body.sha=sha;
  api(c,'',{method:'PUT',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}).then(function(r){
    if(!r.ok){msg(why(r),1);return}
    return r.json().then(function(j){sha=j.content.sha;keep(c);msg('Save ho gaya! 1-2 minute mein website par dikhega.')})
  }).catch(function(){msg('Save nahi ho paya. Internet check karein.',1)})};
})();
