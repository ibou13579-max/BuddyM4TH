/* Stars */
(function(){var c=document.getElementById('stars'),cols=['#c9a227','#e8c84a','#2e6adb','#38bdf8','#fff'],i,s,sz,col;for(i=0;i<70;i++){s=document.createElement('div');s.className='star';sz=Math.random()*2.2+.6;col=cols[Math.floor(Math.random()*cols.length)];s.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;background:'+col+';box-shadow:0 0 '+sz*2+'px '+col+';--d:'+(Math.random()*4+2)+'s;animation-delay:'+Math.random()*5+'s';c.appendChild(s)}})();

/* i18n */
var I={
fr:{sub:"Envoie ton problème — l'IA détecte, résout et vérifie",tw:"Écrire",tp:"Photo",tf:"Fichier PDF",yp:"Ton problème",tph:"Ex : Calculer l'intégrale de x² sin(x) dx entre 0 et π…",pd:"Glisse ta photo ici ou clique",ph:"Prends en photo ton exercice",fd:"Glisse ton PDF ici ou clique",fh:"Upload un TD, examen, poly…",we:"Quel exercice ?",ep:"Ex : Exercice 3, question b",il:"Consignes pour l'IA",opt:"optionnel",cp:"Ex : Utilise la méthode de Gauss…",sv:"Résoudre ✦",st:"Arrêter",solving:"Résolution…",stt:"✦ Solution détaillée",cp:"Copier",cpd:"Copié ✓",fq:"Cette solution est-elle correcte ?",fy:"✓ Correcte",fn:"✗ Incorrecte",vc:"Vérification…",vok:"✓ Solution validée",vw:"⚠ Incertitudes détectées",rh:"🔍 Recherche et correction",ct:"✦ Solution corrigée (recherche web)",hi:"Historique",et:"~15-30s",ep2:"~20-40s",ef:"~25-45s",td:"Terminé en",stopped:"Résolution arrêtée",ftk:"✓ Merci ! Correcte.",fsr:"🔍 Recherche web…",fns:"✓ Nouvelle solution ci-dessous",r1:"Recherche…",r2:"Analyse…",r3:"Correction…",r1d:"✓ Recherche",r2d:"✓ Analyse",r3d:"✓ Corrigé",rem:"Retirer",pfx:"Résous :\n",pfxl:"Résous (LaTeX) :\n",pi:"Résous cet exercice.",pis:"Résous : ",fi:"Résous le premier exercice.",fis:"Résous : ",swb:"Fichier volumineux (SZ). L'envoi pourrait échouer.",swh:"Fichier trop volumineux (SZ). Prends une photo de la page.",ef1:"Erreur réseau. Vérifie ta connexion.",ef2:"Fichier trop volumineux. Prends une photo de la page.",eg:"Erreur"},
en:{sub:"Send your problem — AI detects, solves and verifies",tw:"Write",tp:"Photo",tf:"PDF File",yp:"Your problem",tph:"E.g.: Calculate the integral of x² sin(x) dx from 0 to π…",pd:"Drag photo here or click",ph:"Take a photo of your exercise",fd:"Drag PDF here or click",fh:"Upload problem set, exam…",we:"Which exercise?",ep:"E.g.: Exercise 3, question b",il:"Instructions for AI",opt:"optional",cp:"E.g.: Use Gaussian elimination…",sv:"Solve ✦",st:"Stop",solving:"Solving…",stt:"✦ Detailed Solution",cp:"Copy",cpd:"Copied ✓",fq:"Is this solution correct?",fy:"✓ Correct",fn:"✗ Incorrect",vc:"Verifying…",vok:"✓ Solution validated",vw:"⚠ Uncertainties detected",rh:"🔍 Searching & correcting",ct:"✦ Corrected (web search)",hi:"History",et:"~15-30s",ep2:"~20-40s",ef:"~25-45s",td:"Completed in",stopped:"Stopped",ftk:"✓ Thanks! Correct.",fsr:"🔍 Web search…",fns:"✓ New solution below",r1:"Searching…",r2:"Analyzing…",r3:"Correcting…",r1d:"✓ Searched",r2d:"✓ Analyzed",r3d:"✓ Corrected",rem:"Remove",pfx:"Solve:\n",pfxl:"Solve (LaTeX):\n",pi:"Solve this exercise.",pis:"Solve: ",fi:"Solve the first exercise.",fis:"Solve: ",swb:"Large file (SZ). May fail.",swh:"File too large (SZ). Take a photo instead.",ef1:"Network error. Check your connection.",ef2:"File too large. Take a photo of the page.",eg:"Error"}
};
var lang='fr';
function t(k){return I[lang][k]||I.fr[k]||k}
function applyI(){
    document.querySelectorAll('[data-i]').forEach(function(e){var k=e.getAttribute('data-i');if(I[lang][k])e.textContent=I[lang][k]});
    document.querySelectorAll('[data-ip]').forEach(function(e){var k=e.getAttribute('data-ip');if(I[lang][k])e.placeholder=I[lang][k]});
    document.getElementById('ll').textContent=lang.toUpperCase();
    document.querySelectorAll('.lang-opt').forEach(function(o){o.classList.toggle('on',o.getAttribute('data-l')===lang)});
}
function toggleDD(){document.getElementById('dd').classList.toggle('open')}
function setL(l){lang=l;applyI();document.getElementById('dd').classList.remove('open')}
document.addEventListener('click',function(e){if(!e.target.closest('.lang-sw'))document.getElementById('dd').classList.remove('open')});

/* State */
var M='text',F='text',PD=null,FD=null,H=[],SR='',SR2='',LP=null,LC='',GEN=0,TI=null,TS=0;

/* Timer */
function timerOn(){
    var b=document.getElementById('tb');b.classList.add('vis');
    document.getElementById('tpu').className='tpulse';
    document.getElementById('tvl').className='tval';
    document.getElementById('ttx').textContent=t('solving');
    document.getElementById('tes').textContent=t(M==='text'?'et':M==='photo'?'ep2':'ef');
    TS=performance.now();
    TI=setInterval(function(){document.getElementById('tvl').textContent=((performance.now()-TS)/1000).toFixed(1)+'s'},100);
}
function timerOff(ok){
    clearInterval(TI);
    document.getElementById('tvl').textContent=((performance.now()-TS)/1000).toFixed(1)+'s';
    if(ok){document.getElementById('tvl').classList.add('ok');document.getElementById('tpu').classList.add('ok');document.getElementById('ttx').textContent=t('td')}
    else{document.getElementById('tvl').classList.add('no');document.getElementById('tpu').classList.add('no');document.getElementById('ttx').textContent=t('stopped')}
    document.getElementById('tes').textContent='';
}
function stopIt(){
    GEN++;clearInterval(TI);timerOff(false);
    document.getElementById('sb').classList.remove('ld');document.getElementById('sb').disabled=false;
    document.getElementById('xb').classList.remove('vis');
    document.getElementById('xbar').classList.add('vis');
    document.getElementById('xt').textContent=t('stopped');
}

/* Chips */
var CE={fr:["Méthode de Gauss","Détailler chaque étape","Par récurrence","Coordonnées polaires","Expliquer simplement"],en:["Gaussian elimination","Detail each step","By induction","Polar coordinates","Explain simply"]};
function mkC(cid,tid){var c=document.getElementById(cid);c.innerHTML='';(CE[lang]||CE.fr).forEach(function(x){var d=document.createElement('div');d.className='cchip';d.textContent=x;d.onclick=function(){var a=document.getElementById(tid);a.value=a.value?a.value+', '+x:x;a.focus()};c.appendChild(d)})}

var EX=[{l:"∫ x²eˣ dx",v:"Calculer l'intégrale de x² * e^x dx"},{l:"Dét 3×3",v:"Calculer le déterminant de [[2,1,3],[0,-1,2],[1,4,0]]"},{l:"B(10,0.3)",v:"X suit B(10, 0.3). P(X=3) et E(X)"},{l:"y''+4y=cos2x",v:"Résoudre y'' + 4y = cos(2x)"},{l:"(1+i)^10",v:"(1+i)^10 sous forme algébrique"}];
function mkEx(){var r=document.getElementById('exr');r.innerHTML='';if(M!=='text')return;EX.forEach(function(e){var d=document.createElement('div');d.className='exchip';d.textContent=e.l;d.onclick=function(){document.getElementById('ti').value=e.v;document.getElementById('ti').focus()};r.appendChild(d)})}

function swM(m,b){M=m;document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on')});b.classList.add('on');document.querySelectorAll('.pnl').forEach(function(p){p.classList.remove('on')});document.getElementById('p-'+m).classList.add('on');mkEx()}
function setF(b,f){F=f;document.querySelectorAll('.fbtn').forEach(function(x){x.classList.remove('on')});b.classList.add('on')}

/* File utils */
function r64(file){return new Promise(function(ok,no){var r=new FileReader();r.onload=function(){ok(r.result.split(',')[1])};r.onerror=function(){no(new Error('Read error'))};r.readAsDataURL(file)})}
function fS(b){return b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB'}
var MAX_SIZE=5*1024*1024; // 5MB hard limit

/* Photo */
function doP(file){
    if(!file||!file.type.startsWith('image/'))return;
    var sw=document.getElementById('psw');sw.classList.remove('vis');
    if(file.size>MAX_SIZE){sw.classList.add('vis');sw.textContent='⚠️ '+t('swh').replace('SZ',fS(file.size));return}
    if(file.size>3*1024*1024){sw.classList.add('vis');sw.textContent='⚠️ '+t('swb').replace('SZ',fS(file.size))}
    r64(file).then(function(b){
        PD={b64:b,mt:file.type};
        document.getElementById('pz').classList.add('has');document.getElementById('pp').style.display='none';
        var p=document.getElementById('ppv');p.style.display='block';
        p.innerHTML='<div class="fprev"><img class="fthumb" src="'+URL.createObjectURL(file)+'"><div class="finfo"><div class="fname">'+file.name+'</div><div class="fsize">'+fS(file.size)+'</div></div><button class="frem" onclick="event.stopPropagation();clP()">'+t('rem')+'</button></div>';
        document.getElementById('po').classList.add('vis');mkC('pce','pci');
    }).catch(function(e){sw.classList.add('vis');sw.textContent='⚠️ '+e.message});
}
function clP(){PD=null;document.getElementById('pz').classList.remove('has');document.getElementById('pp').style.display='';document.getElementById('ppv').style.display='none';document.getElementById('po').classList.remove('vis');document.getElementById('psw').classList.remove('vis');document.getElementById('pf').value='';document.getElementById('pei').value='';document.getElementById('pci').value=''}
function hsP(e){if(e.target.files[0])doP(e.target.files[0])}
function hdP(e){if(e.dataTransfer.files[0])doP(e.dataTransfer.files[0])}

/* File */
function doF(file){
    if(!file||file.type!=='application/pdf'){alert('PDF only');return}
    var sw=document.getElementById('fsw');sw.classList.remove('vis');
    if(file.size>MAX_SIZE){sw.classList.add('vis');sw.textContent='⚠️ '+t('swh').replace('SZ',fS(file.size));return}
    if(file.size>3*1024*1024){sw.classList.add('vis');sw.textContent='⚠️ '+t('swb').replace('SZ',fS(file.size))}
    r64(file).then(function(b){
        FD={b64:b,mt:file.type,nm:file.name,sz:file.size};
        document.getElementById('fz').classList.add('has');document.getElementById('fp').style.display='none';
        var p=document.getElementById('fpv');p.style.display='block';
        p.innerHTML='<div class="fprev"><div class="fthumb-p">📄</div><div class="finfo"><div class="fname">'+file.name+'</div><div class="fsize">'+fS(file.size)+'</div></div><button class="frem" onclick="event.stopPropagation();clF()">'+t('rem')+'</button></div>';
        document.getElementById('fo').classList.add('vis');mkC('fce','fci');
    }).catch(function(e){sw.classList.add('vis');sw.textContent='⚠️ '+e.message});
}
function clF(){FD=null;document.getElementById('fz').classList.remove('has');document.getElementById('fp').style.display='';document.getElementById('fpv').style.display='none';document.getElementById('fo').classList.remove('vis');document.getElementById('fsw').classList.remove('vis');document.getElementById('ff').value='';document.getElementById('fei').value='';document.getElementById('fci').value=''}
function hsF(e){if(e.target.files[0])doF(e.target.files[0])}
function hdF(e){if(e.dataTransfer.files[0])doF(e.dataTransfer.files[0])}

/* Render */
function rM(el){try{renderMathInElement(el,{delimiters:[{left:"$$",right:"$$",display:true},{left:"$",right:"$",display:false},{left:"\\[",right:"\\]",display:true},{left:"\\(",right:"\\)",display:false}],throwOnError:false})}catch(e){}}
function toH(txt){var c=txt.replace(/\*\*(?:Branche|Branch)\s*:.+?\*\*\n*/i,'');return '<p>'+c.replace(/###\s*(.+)/g,'<h3>$1</h3>').replace(/##\s*(.+)/g,'<h3>$1</h3>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br>')+'</p>'}
function getBr(txt){var m=txt.match(/\*\*(?:Branche|Branch)\s*:\s*(.+?)\*\*/i);return m?m[1].trim():'Math'}

function reset(){['s1','s2','rs'].forEach(function(x){document.getElementById(x).style.display='none'});document.getElementById('vb').className='vbar';document.getElementById('fb').classList.remove('vis');document.getElementById('fbs').style.display='flex';document.getElementById('fd').className='fdone';document.getElementById('eb').style.display='none';document.getElementById('tb').classList.remove('vis');document.getElementById('xbar').classList.remove('vis');clearInterval(TI)}

/* API helper with timeout */
function apiCall(body){
    return new Promise(function(resolve,reject){
        var timeout=setTimeout(function(){reject(new Error('timeout'))},120000);
        fetch("https://api.anthropic.com/v1/messages",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
        }).then(function(r){
            clearTimeout(timeout);
            if(!r.ok){
                return r.text().then(function(txt){
                    try{var j=JSON.parse(txt);reject(new Error(j.error&&j.error.message||'API Error '+r.status))}
                    catch(e){reject(new Error('API Error '+r.status))}
                });
            }
            return r.json().then(resolve);
        }).catch(function(e){clearTimeout(timeout);reject(e)});
    });
}

function getText(data){
    if(!data||!data.content)return '';
    return data.content.filter(function(b){return b.type==='text'}).map(function(b){return b.text}).join('\n');
}

/* System prompts */
function getSys(cons){
    var b=lang==='fr'
        ?"Tu es un expert en mathématiques universitaires couvrant TOUTES les branches.\nCommence par **Branche : [nom]**. Résous étape par étape.\nFormat : $$ display, $ inline, ### par étape, ### Résultat final. Français. Pas de blocs code."
        :"You are a university math expert covering ALL branches.\nStart with **Branch: [name]**. Solve step by step.\nFormat: $$ display, $ inline, ### per step, ### Final Result. English. No code blocks.";
    if(cons)b+='\n\n'+(lang==='fr'?'CONSIGNES':'INSTRUCTIONS')+':\n'+cons;
    return b;
}

/* SOLVE */
function solve(){
    var btn=document.getElementById('sb'),xb=document.getElementById('xb');
    reset();
    var uc=[],hl='',cons='';

    if(M==='text'){
        var txt=document.getElementById('ti').value.trim();
        if(!txt)return;
        uc=[{type:"text",text:(F==='latex'?t('pfxl'):t('pfx'))+txt}];hl=txt;
    }else if(M==='photo'){
        if(!PD){alert(lang==='fr'?"Ajoute une photo":"Add a photo");return}
        var sp=document.getElementById('pei').value.trim();
        cons=document.getElementById('pci').value.trim();
        var ins=sp?t('pis')+sp+'.':t('pi');
        if(cons)ins+='\n\n'+(lang==='fr'?'Consignes':'Instructions')+': '+cons;
        uc=[{type:"image",source:{type:"base64",media_type:PD.mt,data:PD.b64}},{type:"text",text:ins}];
        hl=sp||"📸";
    }else if(M==='file'){
        if(!FD){alert(lang==='fr'?"Ajoute un PDF":"Add a PDF");return}
        var sp2=document.getElementById('fei').value.trim();
        cons=document.getElementById('fci').value.trim();
        var ins2=sp2?t('fis')+sp2+'.':t('fi');
        if(cons)ins2+='\n\n'+(lang==='fr'?'Consignes':'Instructions')+': '+cons;
        uc=[{type:"document",source:{type:"base64",media_type:"application/pdf",data:FD.b64}},{type:"text",text:ins2}];
        hl=sp2||('📄 '+FD.nm);
    }

    LP=uc;LC=cons;GEN++;
    var myG=GEN;
    btn.classList.add('ld');btn.disabled=true;
    xb.classList.add('vis');
    timerOn();

    apiCall({model:"claude-sonnet-4-20250514",max_tokens:4096,system:getSys(cons),messages:[{role:"user",content:uc}]})
    .then(function(data){
        if(myG!==GEN)return;
        var txt=getText(data);
        if(!txt)throw new Error(lang==='fr'?"Réponse vide":"Empty response");
        timerOff(true);xb.classList.remove('vis');
        SR=txt;
        document.getElementById('sb1').textContent=getBr(txt);
        document.getElementById('sb1b').innerHTML=toH(txt);
        document.getElementById('s1').style.display='block';
        rM(document.getElementById('sb1b'));
        addH(hl);
        document.getElementById('s1').scrollIntoView({behavior:'smooth',block:'start'});
        btn.classList.remove('ld');btn.disabled=false;
        verify(txt,uc,myG);
    })
    .catch(function(err){
        if(myG!==GEN)return;
        timerOff(false);xb.classList.remove('vis');
        var msg;
        if(err.message==='Failed to fetch'||err.message==='timeout'){
            var big=(M==='file'&&FD&&FD.sz>2*1024*1024)||(M==='photo'&&PD&&PD.b64&&PD.b64.length>3*1024*1024);
            msg=big?t('ef2'):t('ef1');
        }else{msg=t('eg')+': '+err.message}
        document.getElementById('eb').textContent=msg;
        document.getElementById('eb').style.display='block';
        btn.classList.remove('ld');btn.disabled=false;
    });
}

/* Verify */
function verify(sol,prob,gen){
    var vb=document.getElementById('vb'),vs=document.getElementById('vsp'),vi=document.getElementById('vic'),vt=document.getElementById('vtx');
    vb.className='vbar chk';vs.style.display='';vi.style.display='none';vt.textContent=t('vc');
    var vp=lang==='fr'?"Vérifie. Réponds CORRECT ou ERREURS.":"Verify. Reply CORRECT or ERRORS.";
    apiCall({model:"claude-sonnet-4-20250514",max_tokens:500,system:vp,messages:[{role:"user",content:prob},{role:"assistant",content:sol},{role:"user",content:vp}]})
    .then(function(data){
        if(gen!==GEN)return;
        var r=getText(data).toUpperCase();
        vs.style.display='none';vi.style.display='';
        if(r.indexOf('CORRECT')>=0&&r.indexOf('ERREUR')<0&&r.indexOf('ERROR')<0){vb.className='vbar ok';vi.textContent='✓';vt.textContent=t('vok')}
        else{vb.className='vbar wrn';vi.textContent='⚠';vt.textContent=t('vw')}
    })
    .catch(function(){
        if(gen!==GEN)return;
        vs.style.display='none';vi.style.display='';vb.className='vbar wrn';vi.textContent='—';vt.textContent='—';
    })
    .then(function(){if(gen===GEN)document.getElementById('fb').classList.add('vis')});
}

/* Feedback */
function fbk(type){
    document.getElementById('fbs').style.display='none';
    var d=document.getElementById('fd');
    if(type==='y'){d.className='fdone sh y';d.textContent=t('ftk')}
    else{d.className='fdone sh n';d.textContent=t('fsr');retry()}
}

/* Retry with web */
function retry(){
    var rs=document.getElementById('rs'),st=document.getElementById('rst');
    rs.classList.add('vis');
    st.innerHTML='<div class="st a"><span class="ms"></span> '+t('r1')+'</div><div class="st w">○ '+t('r2')+'</div><div class="st w">○ '+t('r3')+'</div>';
    var cp=LC?'\n'+(lang==='fr'?'CONSIGNES':'INSTRUCTIONS')+': '+LC:'';
    var sp=(lang==='fr'?'Solution incorrecte. ':'Wrong solution. ')+SR.substring(0,1500)+cp+'\n'+(lang==='fr'?'Corrige avec recherche web. **Branche : [nom]**':'Correct with web search. **Branch: [name]**');
    apiCall({model:"claude-sonnet-4-20250514",max_tokens:4096,system:sp,messages:[{role:"user",content:LP}],tools:[{type:"web_search_20250305",name:"web_search"}]})
    .then(function(data){
        st.innerHTML='<div class="st d">✓ '+t('r1d')+'</div><div class="st d">✓ '+t('r2d')+'</div><div class="st d">✓ '+t('r3d')+'</div>';
        var txt=getText(data);
        if(txt){SR2=txt;document.getElementById('sb2').textContent=getBr(txt);document.getElementById('sb2b').innerHTML=toH(txt);document.getElementById('s2').style.display='block';rM(document.getElementById('sb2b'));document.getElementById('fd').textContent=t('fns');document.getElementById('fd').className='fdone sh y';document.getElementById('s2').scrollIntoView({behavior:'smooth',block:'start'})}
    })
    .catch(function(e){st.innerHTML='<div class="st" style="color:var(--red)">✗ '+e.message+'</div>'});
}

/* Copy */
function cpS(n){
    var raw=n===1?SR:SR2;
    var btn=document.querySelector('#s'+n+' .solcpy');
    navigator.clipboard.writeText(raw).then(function(){btn.textContent=t('cpd');setTimeout(function(){btn.textContent=t('cp')},2000)}).catch(function(){});
}

/* History */
function addH(txt){var now=new Date();H.unshift({t:txt,h:now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0')});if(H.length>5)H.pop();mkH()}
function mkH(){var s=document.getElementById('hs'),l=document.getElementById('hl');if(!H.length){s.style.display='none';return}s.style.display='';l.innerHTML='';H.forEach(function(h){var d=document.createElement('div');d.className='hi';d.innerHTML='<span class="hitx">'+h.t+'</span><span class="hitm">'+h.h+'</span>';d.onclick=function(){swM('text',document.querySelector('.tab'));document.getElementById('ti').value=h.t};l.appendChild(d)})}

/* Ctrl+Enter */
document.getElementById('ti').addEventListener('keydown',function(e){if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))solve()});

/* Init */
mkEx();applyI();