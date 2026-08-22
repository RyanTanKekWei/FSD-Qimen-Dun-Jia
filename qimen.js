const PALACES=[
 {n:4,name:"Xun",cn:"巽",dir:"Southeast",el:"Wood"},
 {n:9,name:"Li",cn:"离",dir:"South",el:"Fire"},
 {n:2,name:"Kun",cn:"坤",dir:"Southwest",el:"Earth"},
 {n:3,name:"Zhen",cn:"震",dir:"East",el:"Wood"},
 {n:5,name:"Center",cn:"中",dir:"Center",el:"Earth"},
 {n:7,name:"Dui",cn:"兑",dir:"West",el:"Metal"},
 {n:8,name:"Gen",cn:"艮",dir:"Northeast",el:"Earth"},
 {n:1,name:"Kan",cn:"坎",dir:"North",el:"Water"},
 {n:6,name:"Qian",cn:"乾",dir:"Northwest",el:"Metal"}
];

const STEMS=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const BRANCHES=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const SANQI=["戊","己","庚","辛","壬","癸","丁","丙","乙"];
const XUN_HIDDEN={"甲子":"戊","甲戌":"己","甲申":"庚","甲午":"辛","甲辰":"壬","甲寅":"癸"};
const PALACE_CLOCKWISE=[2,7,6,1,8,3,4,9];
const PALACE_COUNTER=[2,9,4,3,8,1,6,7];
const STAR_SEQ=["Tian Xin","Tian Peng","Tian Ren","Tian Chong","Tian Fu","Tian Ying","Tian Rui","Tian Zhu"];
const STAR_BASE={TianPeng:1,TianRui:2,TianChong:3,TianFu:4,TianQin:5,TianXin:6,TianZhu:7,TianRen:8,TianYing:9};
const GATE_SEQ=["Rest Door","Life Door","Harm Door","Delusion Door","Scenery Door","Death Door","Fear Door","Open Door"];
const GATE_BASE={"Rest Door":1,"Death Door":2,"Harm Door":3,"Delusion Door":4,"Scenery Door":9,"Open Door":6,"Fear Door":7,"Life Door":8};
const DEITIES=["Chief Deity","Surging Snake","Great Yin","Six Harmony","White Tiger","Black Tortoise","Nine Earth","Nine Heaven"];

const CN={
"Tian Peng":"天蓬","Tian Rui":"天芮","Tian Qin/Tian Rui":"天禽/天芮","Tian Qin":"天禽","Tian Chong":"天冲","Tian Fu":"天辅","Tian Ying":"天英","Tian Xin":"天心","Tian Zhu":"天柱","Tian Ren":"天任",
"Rest Door":"休门","Life Door":"生门","Harm Door":"伤门","Delusion Door":"杜门","Scenery Door":"景门","Death Door":"死门","Fear Door":"惊门","Open Door":"开门",
"Chief Deity":"值符","Surging Snake":"腾蛇","Great Yin":"太阴","Six Harmony":"六合","White Tiger":"白虎","Black Tortoise":"玄武","Nine Earth":"九地","Nine Heaven":"九天"
};
const ENSTEM={"甲":"Jia","乙":"Yi","丙":"Bing","丁":"Ding","戊":"Wu","己":"Ji","庚":"Geng","辛":"Xin","壬":"Ren","癸":"Gui"};
const ENBRANCH={"子":"Zi","丑":"Chou","寅":"Yin","卯":"Mao","辰":"Chen","巳":"Si","午":"Wu","未":"Wei","申":"Shen","酉":"You","戌":"Xu","亥":"Hai"};

function mod(a,b){return ((a%b)+b)%b}
function jiaziList(){let a=[];for(let i=0;i<60;i++)a.push(STEMS[i%10]+BRANCHES[i%12]);return a}
const JIAZI=jiaziList();

function findXun(gz){const i=JIAZI.indexOf(gz);return i<0?"甲子":JIAZI[Math.floor(i/10)*10]}
function findYuan(branch){if(["子","午","卯","酉"].includes(branch))return 0;if(["寅","申","巳","亥"].includes(branch))return 1;return 2}
function arrangeEarth(ju,yang){
 const m={};
 SANQI.forEach((s,i)=>{let p=yang?mod(ju-1+i,9)+1:mod(ju-i-1,9)+1;m[p]=s});
 return m
}
function originalStarAt(p){
 const m={1:"Tian Peng",2:"Tian Rui",3:"Tian Chong",4:"Tian Fu",5:"Tian Qin",6:"Tian Xin",7:"Tian Zhu",8:"Tian Ren",9:"Tian Ying"};
 return m[p]
}
function originalGateAt(p){for(const [g,n] of Object.entries(GATE_BASE))if(n===p)return g;return "Rest Door"}
function palaceOfStem(earth,stem){for(const p of Object.keys(earth))if(earth[p]===stem)return Number(p);return 5}
function branchIndex(b){return BRANCHES.indexOf(b)}
function starDisplay(star,isChief){
 // Tian Qin and Tian Rui are always displayed together as one Nine Star label.
 if(star==="Tian Rui" || star==="Tian Qin") return "Tian Qin/Tian Rui";
 return star
}

function getJieQiName(solar){
 const lunar=solar.getLunar();
 const table=lunar.getJieQiTable();
 let best=null,bestMs=-Infinity;
 for(const [name,jq] of Object.entries(table)){
   const so=jq.getSolar ? jq.getSolar() : jq;
   if(!so)continue;
   const ms=Date.UTC(so.getYear(),so.getMonth()-1,so.getDay(),so.getHour?so.getHour():0,so.getMinute?so.getMinute():0,so.getSecond?so.getSecond():0);
   const target=Date.UTC(solar.getYear(),solar.getMonth()-1,solar.getDay(),solar.getHour(),solar.getMinute(),solar.getSecond());
   if(ms<=target && ms>bestMs){bestMs=ms;best=name}
 }
 return best||lunar.getPrevJie().getName()
}

const YANG_TABLE={
"冬至":[1,7,4],"惊蛰":[1,7,4],"小寒":[2,8,5],"大寒":[3,9,6],"春分":[3,9,6],"立春":[8,5,2],"雨水":[9,6,3],"清明":[4,1,7],"立夏":[4,1,7],"谷雨":[5,2,8],"小满":[5,2,8],"芒种":[6,3,9]
};
const YIN_TABLE={
"夏至":[9,3,6],"白露":[9,3,6],"小暑":[8,2,5],"大暑":[7,1,4],"秋分":[7,1,4],"立秋":[2,5,8],"处暑":[1,4,7],"寒露":[6,9,3],"立冬":[6,9,3],"霜降":[5,8,2],"小雪":[5,8,2],"大雪":[4,7,1]
};

function chaiBu(term,dayGz,hour){
 let ds=STEMS.indexOf(dayGz[0]), db=BRANCHES.indexOf(dayGz[1]);
 if(hour>=23){ds=mod(ds+1,10);db=mod(db+1,12)}
 const fuStem=STEMS[ds%5===0?ds:ds- (ds%5)];
 const fuBranch=BRANCHES[mod(db-(ds%5),12)];
 const yuan=findYuan(fuBranch);
 const yang=!!YANG_TABLE[term], table=yang?YANG_TABLE:YIN_TABLE;
 const ju=(table[term]||[1,7,4])[yuan];
 return {yang,ju,yuanName:["Upper","Middle","Lower"][yuan],fuTou:"甲"+fuBranch}
}

function buildChart(year,month,day,hour,minute){
 if(typeof Solar==="undefined")throw new Error("Calendar engine did not load. Please open the website while connected to the internet.");
 const solar=Solar.fromYmdHms(year,month,day,hour,minute,0);
 const lunar=solar.getLunar();
 const ec=lunar.getEightChar();
 const dayGz=lunar.getDayInGanZhi();
 const hourGz=lunar.getTimeInGanZhi();
 const term=getJieQiName(solar);
 const cb=chaiBu(term,dayGz,hour);

 const hourStem=hourGz[0],hourBranch=hourGz[1];
 const xun=findXun(hourGz), hidden=XUN_HIDDEN[xun]||"戊";
 const earth=arrangeEarth(cb.ju,cb.yang);

 // Chief Star: find the hidden Jia stem on Earth Plate.
 const zhiFuRaw=palaceOfStem(earth,hidden);
 const chiefStar=originalStarAt(zhiFuRaw);
 // Tian Qin lodges in Kun 2 for gate purposes.
 const chiefGateBase=(chiefStar==="Tian Qin")?2:zhiFuRaw;

 // Chief Star follows the actual hour stem on the Earth Plate.
 const actualHourStem=hourStem==="甲"?hidden:hourStem;
 const zhiFuPalRaw=palaceOfStem(earth,actualHourStem);
 const zhiFuPal=zhiFuPalRaw===5?2:zhiFuPalRaw;
 const tianYiStar=originalStarAt(zhiFuPalRaw);

 // Chief Gate follows the Xun-head palace to the hour branch.
 // Special mQimen handling: Tian Qin/Center keeps Death Door at Kun 2.
 let zhiShiGate=originalGateAt(chiefGateBase);
 let zhiShiPal;
 if(chiefStar==="Tian Qin"){
   zhiShiGate="Death Door"; zhiShiPal=2;
 }else{
   const xunPal=chiefGateBase;
   const steps=mod(branchIndex(hourBranch)-branchIndex(xun[1]),12);
   let p=xunPal;
   for(let i=0;i<steps;i++)p=cb.yang?(p===9?1:p+1):(p===1?9:p-1);
   zhiShiPal=p===5?2:p;
 }

 // Heaven Plate stars and Heaven Stems.
 const stars={},heaven={};
 const effectiveChief=chiefStar==="Tian Qin"?"Tian Rui":chiefStar;
 const starIdx=STAR_SEQ.indexOf(effectiveChief);
 const startIdx=PALACE_CLOCKWISE.indexOf(zhiFuPal);
 for(let i=0;i<8;i++){
   const p=PALACE_CLOCKWISE[mod(startIdx+i,8)];
   const s=STAR_SEQ[mod(starIdx+i,8)];
   const origin=STAR_BASE[s==="Tian Rui"?2:s.replace("Tian ","Tian")];
   const originMap={"Tian Peng":1,"Tian Rui":2,"Tian Ren":8,"Tian Chong":3,"Tian Fu":4,"Tian Ying":9,"Tian Xin":6,"Tian Zhu":7};
   heaven[p]=earth[originMap[s]||2]||"";
   stars[p]=s;
 }
 // Center carries Tian Qin and its Earth Stem.
 stars[5]="Tian Qin"; heaven[5]=earth[5]||"";

 // Gates rotate from Chief Gate palace using the fixed gate sequence.
 const gates={};
 const gateIdx=GATE_SEQ.indexOf(zhiShiGate);
 const gateStart=PALACE_CLOCKWISE.indexOf(zhiShiPal);
 for(let i=0;i<8;i++)gates[PALACE_CLOCKWISE[mod(gateStart+i,8)]]=GATE_SEQ[mod(gateIdx+i,8)];

 // Eight Gods: Yin reverse, Yang forward, following the Chief Deity.
 const gods={};
 const ring=cb.yang?PALACE_CLOCKWISE:PALACE_COUNTER;
 const godStart=ring.indexOf(zhiFuPal);
 for(let i=0;i<8;i++)gods[ring[mod(godStart+i,8)]]=DEITIES[i];

 // Void from the current hour Xun.
 const xunIdx=Math.floor(JIAZI.indexOf(hourGz)/10)*10;
 const voidBranches=[BRANCHES[mod(xunIdx+10,12)],BRANCHES[mod(xunIdx+11,12)]];
 const branchPal={子:1,丑:8,寅:8,卯:3,辰:4,巳:4,午:9,未:2,申:2,酉:7,戌:6,亥:6};
 const voidPal=[...new Set(voidBranches.map(b=>branchPal[b]))];

 const result={year,month,day,hour,minute,solar,lunar,ec,dayGz,hourGz,term,cb,xun,hidden,earth,heaven,stars,gates,gods,zhiFuRaw,zhiFuPal,zhiFuPalRaw,tianYiStar,chiefStar,zhiShiPal,zhiShiGate,voidBranches,voidPal};
 return result;
}


function palaceColorClass(n){
 if(n===1) return "palace-blue";      // Kan
 if(n===9) return "palace-red";       // Li
 if([2,5,8].includes(n)) return "palace-brown"; // Kun, Center, Gen
 if([4,3].includes(n)) return "palace-green";   // Xun, Zhen
 if([7,6].includes(n)) return "palace-grey";    // Dui, Qian
 return "";
}

function qmColor(value, type=""){
 const v=(value||"").trim();

 // Black Tortoise is always blue, regardless of other classifications.
 if(v==="Black Tortoise") return "qm-black-tortoise";

 // Red: Surging Snake, Tian Ying, Scenery Door, Bing, Ding, Li Palace
 if(["Surging Snake","Tian Ying","Scenery Door","Bing","Ding","Li"].includes(v)) return "qm-red";

 // Blue: Gui, Ren, Rest Door
 if(["Gui","Ren","Rest Door"].includes(v)) return "qm-blue";

 // Green: Chief Deity, Delusion Door, Harm Door, Tian Fu,
 // Six Harmony, Tian Chong, Yi, Jia, Xun Palace, Zhen Palace
 if(["Chief Deity","Delusion Door","Harm Door","Tian Fu","Six Harmony","Tian Chong","Yi","Jia","Xun","Zhen"].includes(v)) return "qm-green";

 // Brown: Ji, Tian Rui, Tian Qin, Death Door, Wu, Nine Earth,
 // Tian Ren, Life Door, Gen Palace, Kun Palace
 if(["Ji","Tian Rui","Tian Qin","Tian Qin/Tian Rui","Death Door","Wu","Nine Earth","Tian Ren","Life Door","Gen","Kun"].includes(v)) return "qm-brown";

 // Grey: Xin, Geng, Great Yin, Fear Door, Dui Palace, Tian Xin,
 // Open Door, Qian Palace, White Tiger, Tian Zhu, Nine Heaven
 if(["Xin","Geng","Great Yin","Fear Door","Dui","Tian Xin","Open Door","Qian","White Tiger","Tian Zhu","Nine Heaven"].includes(v)) return "qm-grey";

 return "";
}
function qmSpan(value, cn="", type=""){
 const cls=qmColor(value,type);
 return `<span class="${cls}">${value||""}${cn?` <span class="cn ${cls}">${cn}</span>`:""}</span>`;
}


function isTomb(heavenStem, palaceNumber){
 const rules = {
   4: ["Xin","Ren"],                  // Xun 巽
   8: ["Ding","Ji","Geng"],           // Gen 艮
   2: ["Gui"],                        // Kun 坤
   6: ["Wu","Bing","Yi"]              // Qian 乾
 };
 return (rules[palaceNumber] || []).includes(heavenStem);
}

function isDoorCompel(palaceNumber, door){
 const rules = {
   4: ["Fear Door","Open Door"],          // Xun 巽
   9: ["Rest Door"],                      // Li 离
   2: ["Harm Door","Delusion Door"],      // Kun 坤
   8: ["Harm Door","Delusion Door"],      // Gen 艮
   7: ["Scenery Door"],                   // Dui 兑
   6: ["Scenery Door"],                   // Qian 乾
   1: ["Life Door","Death Door"],         // Kan 坎
   3: ["Fear Door","Open Door"]           // Zhen 震
 };
 return (rules[palaceNumber] || []).includes(door);
}

function isPalaceCompel(palaceNumber, door){
 const rules = {
   4: ["Life Door","Death Door"],       // Xun 巽
   3: ["Life Door","Death Door"],       // Zhen 震
   9: ["Fear Door","Open Door"],         // Li 离
   2: ["Rest Door"],                     // Kun 坤
   7: ["Harm Door","Delusion Door"],     // Dui 兑
   6: ["Harm Door","Delusion Door"],     // Qian 乾
   1: ["Scenery Door"],                 // Kan 坎
   8: ["Rest Door"]                      // Gen 艮
 };
 return (rules[palaceNumber] || []).includes(door);
}

function render(c){
 document.getElementById("summary").innerHTML=
 `<span class="badge"><b>${c.cb.yang?"Yang Dun":"Yin Dun"}</b></span>
  <span class="badge"><b>${c.cb.ju} Ju</b></span>
  <span class="badge">Solar Term: <b>${c.term}</b></span>
  <span class="badge">Yuan: <b>${c.cb.yuanName}</b></span>
  <span class="badge">Xun Head: <b>${c.xun}</b></span>
  <span class="badge">Chief Star: <b>${starDisplay(c.chiefStar,true)}</b></span>
  <span class="badge">Chief Gate: <b>${c.zhiShiGate}</b></span>`;

 let out="";
 for(const p of PALACES){
   if(p.n===5){
     out+=`<div class="palace center"><div class="p-num">5</div><div class="p-palace-name palace-brown">Center <span>中宫</span></div><div class="centerbox"><div class="taiji">☯</div><div class="centerstem">${qmSpan(ENSTEM[c.earth[5]]||"",c.earth[5]||"","stem")}</div><div class="status">Center Palace</div></div></div>`;
     continue;
   }
   const star=starDisplay(c.stars[p.n],c.stars[p.n]===c.chiefStar);
   const god=c.gods[p.n]||"";
   const door=c.gates[p.n]||"";
   const voidMark=c.voidPal.includes(p.n);
   const palaceCompel=isPalaceCompel(p.n,door);
   const doorCompel=isDoorCompel(p.n,door);
   const tomb=isTomb(ENSTEM[c.heaven[p.n]]||"",p.n);
   const chiefHere=(god==="Chief Deity");
   out+=`<div class="palace">
    <div class="p-num">${p.n}</div>
    <div class="p-palace-name ${palaceColorClass(p.n)}">${p.name} <span>${p.cn}</span></div>
    ${doorCompel?'<div class="door-compel">DOOR COMPEL • 门迫</div>':""}
    ${tomb?'<div class="tomb-marker">TOMB • 入墓</div>':""}
    <div class="p-item p-deity">
      <span class="p-value">${qmSpan(god,CN[god]||"","deity")}</span>
      ${""}
    </div>
    <div class="p-item p-door">
      <span class="p-value">${qmSpan(door,CN[door]||"","door")}</span>
    </div>
    ${palaceCompel?'<div class="palace-compel">PALACE COMPEL • 宫迫</div>':""}
    <div class="p-item p-star">
      <span class="p-value">${qmSpan(star,CN[star]||"","star")}</span>
    </div>
    <div class="p-item p-heaven">
      <span class="p-label">Heaven Stem</span>
      <span class="p-value">${qmSpan(ENSTEM[c.heaven[p.n]]||"",c.heaven[p.n]||"","stem")}</span>
    </div>
    <div class="p-item p-earth">
      <span class="p-label">Earth Stem</span>
      <span class="p-value">${qmSpan(ENSTEM[c.earth[p.n]]||"",c.earth[p.n]||"","stem")}</span>
    </div>
    ${voidMark?`<div class="p-item p-void"><span class="void-circle">Void<br>空亡</span></div>`:""}
   </div>`;
 } document.getElementById("chart").innerHTML=out;
 document.getElementById("details").innerHTML=
 `<tr><th>Item</th><th>Value</th></tr>
 <tr><td>Date / Time</td><td>${String(c.day).padStart(2,"0")}/${String(c.month).padStart(2,"0")}/${c.year} ${String(c.hour).padStart(2,"0")}:${String(c.minute).padStart(2,"0")} (+8)</td></tr>
 <tr><td>Four Pillars</td><td>${c.ec.getYearGan()+c.ec.getYearZhi()} · ${c.ec.getMonthGan()+c.ec.getMonthZhi()} · ${c.ec.getDayGan()+c.ec.getDayZhi()} · ${c.ec.getTimeGan()+c.ec.getTimeZhi()}</td></tr>
 <tr><td>Yin / Yang Dun</td><td>${c.cb.yang?"Yang Dun":"Yin Dun"}</td></tr>
 <tr><td>Ju</td><td>${c.cb.ju}</td></tr>
 <tr><td>Solar Term</td><td>${c.term}</td></tr>
 <tr><td>Yuan</td><td>${c.cb.yuanName}</td></tr>
 <tr><td>Xun Head</td><td>${c.xun} → ${hiddenText(c.hidden)}</td></tr>
 <tr><td>Chief Deity</td><td>${starDisplay(c.chiefStar,true)} · Palace ${c.zhiFuPal}</td></tr>
 <tr><td>Chief Gate</td><td>${c.zhiShiGate} · Palace ${c.zhiShiPal}</td></tr>
 <tr><td>Palace Compel</td><td>${PALACES.filter(p=>p.n!==5 && isPalaceCompel(p.n,c.gates[p.n])).map(p=>p.name+" Palace").join(", ") || "None"}</td></tr>
 <tr><td>Door Compel</td><td>${PALACES.filter(p=>p.n!==5 && isDoorCompel(p.n,c.gates[p.n])).map(p=>p.name+" Palace").join(", ") || "None"}</td></tr>
 <tr><td>Tomb • 入墓</td><td>${PALACES.filter(p=>p.n!==5 && isTomb(ENSTEM[c.heaven[p.n]]||"",p.n)).map(p=>p.name+" Palace").join(", ") || "None"}</td></tr>
 <tr><td>Tian Yi</td><td>${starDisplay(c.tianYiStar,true)} · Palace ${c.zhiFuPalRaw}</td></tr>
 <tr><td>Void</td><td>${c.voidBranches.join(" / ")}</td></tr>`;
}
function hiddenText(s){return ENSTEM[s]+" "+s}

function cast(){
 try{
   const d=document.getElementById("date").value,t=document.getElementById("time").value;
   if(!d||!t)throw new Error("Please select a date and time.");
   const [y,m,day]=d.split("-").map(Number),[h,min]=t.split(":").map(Number);
   const c=buildChart(y,m,day,h,min);render(c);
 }catch(e){
   document.getElementById("summary").innerHTML=`<span class="badge">${e.message||"Unable to generate chart."}</span>`;
   document.getElementById("chart").innerHTML="";
 }
}
(function(){
 const now=new Date();
 document.getElementById("date").value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
 document.getElementById("time").value=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
 document.getElementById("date").value="2026-08-21";document.getElementById("time").value="11:08";
 setTimeout(cast,50);
})();