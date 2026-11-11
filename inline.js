
const $=x=>document.getElementById(x), money=n=>'฿'+Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:2});
const seed={
tasks:[['ตรวจวัตถุดิบและวันหมดอายุ','เจ้าของร้าน','รอดำเนินการ'],['เตรียมไส้และเครื่องเคียง','ทีมครัว','รอดำเนินการ'],['เตรียมบรรจุภัณฑ์','ทีมหน้าร้าน','รอดำเนินการ'],['สรุปยอดขายหลังปิดร้าน','เจ้าของร้าน','รอดำเนินการ']],
plans:[['ทดลองขาย 4 วัน','กำหนดภายหลัง','20 กล่อง/วัน · 80 กล่องรวม','วางแผน']],
products:[['ปอเปี๊ยะธรรมดา','RL-N01',55],['ปอเปี๊ยะชีส','RL-C01',65],['ปอเปี๊ยะข้าวซอย','RL-K01',65]],
ingredients:[
['แผ่นปอเปี๊ยะ 8.5 นิ้ว',83,40,'แผ่น','ราคาแจ้งแล้ว'],['อกไก่',96,1000,'กรัม','1 กก.'],['หมูบด',132,1000,'กรัม','1 กก.'],['แครอท',10,1,'ลูก','ต่อลูก'],['กะหล่ำปลี',32,1000,'กรัม','ราคาต่อกก.; น้ำหนักใช้เป็นสมมติฐาน'],['วุ้นเส้นต้นสน',8,40,'กรัม','ห่อ 40 กรัม'],['เนย',129,2000,'กรัม','ขนาด 2 กก. เป็นสมมติฐาน'],['หอมใหญ่',37,1000,'กรัม','น้ำหนักใช้เป็นสมมติฐาน'],['น้ำมันพืช',270,5000,'มล.','ถัง 5 ลิตร; ปริมาณใช้จริงรอยืนยัน'],['พริก',105,1000,'กรัม','ต่อกก.'],['น้ำตาล',23,1000,'กรัม','ต่อกก.'],['น้ำส้มสายชู',45,1000,'มล.','ขวด 1 ลิตร'],['เชดด้าชีส',785,2000,'กรัม','แพ็ก 2 กก.'],['พาร์เมซาน',339,500,'กรัม','แพ็ก 500 กรัม'],['พริกแกงข้าวซอย',169,500,'กรัม','แพ็ก 500 กรัม'],['หอมแดง',29,500,'กรัม','แพ็ก 500 กรัม'],['หัวกะทิ',73,1000,'มล.','ประมาณการ 73 บาท/ลิตร'],['หางกะทิ',73,1000,'มล.','ประมาณการ 73 บาท/ลิตร'],['มะนาว',5.5,1,'ลูก','ต่อลูก'],['ผักสลัด',35,300,'กรัม','แพ็ก 300 กรัม'],['ผักดอง',73,1000,'กรัม','ต่อกก.'],['หอมเจียว',95,500,'กรัม','แพ็ก 500 กรัม'],['เส้นทอด',55,500,'กรัม','แพ็ก 500 กรัม'],['กล่องอาหาร',1.5,1,'ใบ','ราคาต่อใบ']],
recipes:[{name:'ไส้ปอเปี๊ยะพื้นฐาน',yield:40,unit:'ชิ้น',note:'สูตรต่อ 40 ชิ้น; น้ำหนักผักบางรายการเป็นสมมติฐาน',lines:[['อกไก่',330],['หมูบด',400],['แครอท',1],['กะหล่ำปลี',150],['วุ้นเส้นต้นสน',40],['เนย',30],['หอมใหญ่',225]]},{name:'น้ำจิ้มธรรมดา',yield:520,unit:'กรัม',note:'Yield 520g เป็นสมมติฐาน รอชั่งจริง',lines:[['พริก',300],['น้ำตาล',200],['น้ำส้มสายชู',20]]},{name:'ซอสข้าวซอย',yield:1415,unit:'กรัม',note:'Yield 1,415g เป็นสมมติฐาน; ปริมาณต่อกล่องเคยระบุทั้ง 60g และ 80g ต้องยืนยัน',lines:[['พริกแกงข้าวซอย',100],['หอมแดง',40],['หัวกะทิ',375],['หางกะทิ',375]]}],
sales:[],expenses:[],stock:[],staff:[]};
let db=JSON.parse(localStorage.getItem('rolllerd_full')||'null')||seed, page='dashboard',role='owner';
db.purchasePlan=db.purchasePlan||{};db.stock=db.stock||[];
db.ingredients.forEach(x=>{if(!db.purchasePlan[x[0]])db.purchasePlan[x[0]]={plannedQty:0,purchased:false,purchaseDate:'',buyer:'',receivedQty:0,unit:x[3]};});
function stockQty(name){return db.stock.filter(x=>x.name===name).reduce((s,x)=>s+Number(x.qty||0),0)}
function receivePurchase(name){const p=db.purchasePlan[name],old=Number(p.receivedQty||0),raw=prompt('จำนวนที่รับเข้าจริง ('+p.unit+')',String(old));if(raw===null)return;const next=Number(raw);if(!Number.isFinite(next)||next<0){alert('กรุณาใส่จำนวนที่ถูกต้อง');return;}const delta=next-old;if(delta!==0){let s=db.stock.find(x=>x.name===name);if(!s){s={name,qty:0,unit:p.unit};db.stock.push(s)}s.qty=Number(s.qty||0)+delta;}p.receivedQty=next;if(!p.purchased){p.purchased=true;p.purchaseDate=new Date().toISOString().slice(0,10);p.buyer='เจ้าของร้าน';}save();}
function markPurchased(name,checked){const p=db.purchasePlan[name];p.purchased=checked;if(checked){if(!p.purchaseDate)p.purchaseDate=new Date().toISOString().slice(0,10);if(!p.buyer)p.buyer='เจ้าของร้าน';}else if(Number(p.receivedQty||0)>0){alert('รับของเข้าสต็อกแล้ว กรุณาปรับจำนวนรับเป็น 0 ก่อนยกเลิก');p.purchased=true;return;}save();}
function editPurchase(name){const p=db.purchasePlan[name],q=prompt('จำนวนที่วางแผนซื้อ ('+p.unit+')',String(p.plannedQty||0));if(q===null)return;p.plannedQty=Math.max(0,Number(q)||0);const d=prompt('วันที่ซื้อ (YYYY-MM-DD)',p.purchaseDate||new Date().toISOString().slice(0,10));if(d===null)return;p.purchaseDate=d;const b=prompt('ใครเป็นคนซื้อ',p.buyer||'เจ้าของร้าน');if(b===null)return;p.buyer=b;save();}
const names={dashboard:'ภาพรวมร้าน',tasks:'สิ่งที่ต้องทำ',plans:'แผนงาน',products:'สินค้าและเมนู',ingredients:'วัตถุดิบและราคา',recipes:'สูตรอาหารและ Yield',purchases:'แผนซื้อของ',sales:'ยอดขาย',stock:'สต็อก',accounts:'บัญชีรายรับ-รายจ่าย',finance:'การเงินและกำไร',staff:'พนักงานและค่าแรง',reports:'รายงาน',settings:'ตั้งค่าร้าน'};
let cloudVersion=null,cloudReady=false,cloudQueue=Promise.resolve();
function save(){localStorage.setItem('rolllerd_full',JSON.stringify(db));render();if(cloudReady){const snapshot=JSON.parse(JSON.stringify(db));cloudQueue=cloudQueue.then(()=>window.RollLerdCloud.saveState(snapshot,cloudVersion)).then(v=>{cloudVersion=v.version;setCloudStatus('บันทึกและซิงก์ข้อมูลแล้ว')}).catch(e=>{setCloudStatus('บันทึกออนไลน์ไม่สำเร็จ: '+(e.message||e));});}}
function total(a){return a.reduce((s,x)=>s+Number(x.amount||0),0)}
function cost(name,q){let x=db.ingredients.find(v=>v[0]===name);return x?x[1]*q/x[2]:0}
function recipeCost(r){return r.lines.reduce((s,x)=>s+cost(x[0],x[1]),0)}
function table(h,rows){return `<div class="tablewrap"><table class="table"><thead><tr>${h.map(x=>'<th>'+x+'</th>').join('')}</tr></thead><tbody>${rows||'<tr><td colspan="'+h.length+'" class="empty">ยังไม่มีข้อมูล</td></tr>'}</tbody></table></div>`}
function del(k,i){if(confirm('ยืนยันลบ?')){db[k].splice(i,1);save()}}
function addTask(){let n=prompt('ชื่องาน');if(n)db.tasks.push([n,prompt('ผู้รับผิดชอบ')||'-','รอดำเนินการ']);save()}
function addPlan(){let n=prompt('ชื่อแผน');if(n)db.plans.push([n,prompt('กำหนดวัน')||'-',prompt('เป้าหมาย')||'-','วางแผน']);save()}
function addProduct(){let n=prompt('ชื่อเมนู');if(n)db.products.push([n,'NEW-'+Date.now(),Number(prompt('ราคาขายบาท')||0)]);save()}
function addIngredient(){let n=prompt('ชื่อวัตถุดิบ');if(n){let u=prompt('หน่วย')||'กรัม';db.ingredients.push([n,Number(prompt('ราคาซื้อ')||0),Number(prompt('ปริมาณแพ็ก')||1),u,'เพิ่มเอง']);db.purchasePlan[n]={plannedQty:0,purchased:false,purchaseDate:'',buyer:'',receivedQty:0,unit:u};}save()}
function addRecipe(){let n=prompt('ชื่อสูตร');if(n)db.recipes.push({name:n,yield:Number(prompt('Yield')||1),unit:prompt('หน่วย')||'กรัม',note:'สูตรใหม่',lines:[]});save()}
function addSale(){let n=prompt('เมนูที่ขาย');if(n)db.sales.push({name:n,qty:Number(prompt('จำนวนกล่อง')||1),amount:Number(prompt('ยอดขายบาท')||0),date:new Date().toLocaleDateString('th-TH'),by:role});save()}
function addExpense(){let n=prompt('รายการจ่าย');if(n)db.expenses.push({name:n,amount:Number(prompt('จำนวนเงิน')||0),date:new Date().toLocaleDateString('th-TH'),by:role});save()}
function addStock(){let n=prompt('วัตถุดิบ');if(n)db.stock.push({name:n,qty:Number(prompt('จำนวน')||0),unit:prompt('หน่วย')||'-'});save()}
function addStaff(){let n=prompt('ชื่อพนักงาน');if(n)db.staff.push({name:n,job:prompt('ตำแหน่ง')||'พนักงาน',rate:Number(prompt('ค่าแรง/ชม.')||0),hours:Number(prompt('ชั่วโมง')||0)});save()}
function render(){
$('title').textContent=names[page];document.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('active',b.dataset.p===page));
let rev=total(db.sales),exp=total(db.expenses),html='';
if(page==='dashboard')html=window.renderDashboardPage();
if(page==='tasks')html=window.renderTasksPage();
if(page==='plans')html=window.renderPlansPage();
if(page==='products')html=window.renderProductsPage();
if(page==='ingredients')html=window.renderIngredientsPage();
if(page==='recipes')html=window.renderRecipesPage();
if(page==='purchases')html=window.renderPurchasesPage();
if(page==='sales')html=window.renderSalesPage();
if(page==='stock')html=window.renderStockPage();
if(page==='accounts')html=window.renderAccountsPage();
if(page==='finance')html=window.renderFinancePage();
if(page==='staff')html=window.renderStaffPage();
if(page==='reports')html=window.renderReportsPage();
if(page==='settings')html=window.renderSettingsPage();
$('content').innerHTML=html;if(role==='staff')document.querySelectorAll('.owner-only').forEach(x=>x.style.display='none');
}
$('date').textContent=new Date().toLocaleDateString('th-TH',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
$('nav').onclick=e=>{let b=e.target.closest('[data-p]');if(b){page=b.dataset.p;render()}};

$('add').onclick=()=>({tasks:addTask,plans:addPlan,products:addProduct,ingredients:addIngredient,recipes:addRecipe,sales:addSale,stock:addStock,accounts:addExpense,finance:addExpense,staff:addStaff}[page]||addSale)();
$('lang').onclick=()=>alert('กำลังเตรียมคำแปลภาษาอังกฤษครบทุกหน้าในขั้นต่อไป');
function setCloudStatus(msg){const el=$('authStatus');if(el)el.textContent=msg;}
async function startOwnerSession(){
 if(!window.RollLerdCloud)throw new Error('ไม่พบ cloud.js กรุณาตรวจว่า cloud.js อยู่โฟลเดอร์เดียวกับ index.html และชื่อไฟล์ตรงกัน');
 try{
  setCloudStatus('กำลังโหลดข้อมูลร้านจากฐานข้อมูล...');
  const remote=await window.RollLerdCloud.loadState();
  if(remote){db=remote.data;cloudVersion=remote.version;localStorage.setItem('rolllerd_full',JSON.stringify(db));}
  else {cloudVersion=0;await window.RollLerdCloud.saveState(db,cloudVersion).then(v=>cloudVersion=v.version);}
  cloudReady=true;$('authGate').classList.add('hidden');render();setCloudStatus('เชื่อมต่อฐานข้อมูลแล้ว');
 }catch(e){cloudReady=false;setCloudStatus('เชื่อมต่อไม่สำเร็จ: '+(e.message||e));$('authGate').classList.remove('hidden');}
}
$('authLogin').onclick=async()=>{if(!window.RollLerdCloud){setCloudStatus('ไม่พบ cloud.js กรุณาตรวจตำแหน่งไฟล์');return;}const email=$('authEmail').value.trim(),password=$('authPassword').value;if(!email||!password){setCloudStatus('กรุณากรอกอีเมลและรหัสผ่าน');return;}try{$('authLogin').disabled=true;setCloudStatus('กำลังเข้าสู่ระบบ...');await window.RollLerdCloud.signIn(email,password);await startOwnerSession();}catch(e){setCloudStatus('เข้าสู่ระบบไม่สำเร็จ: '+(e.message||e));}finally{$('authLogin').disabled=false;}};
$('signOut').onclick=async()=>{if(!confirm('ออกจากระบบเจ้าของร้าน?'))return;try{cloudReady=false;await window.RollLerdCloud.signOut();$('authGate').classList.remove('hidden');setCloudStatus('ออกจากระบบแล้ว');}catch(e){setCloudStatus('ออกจากระบบไม่สำเร็จ: '+(e.message||e));}};
(async()=>{try{await window.RollLerdCloud.init();const session=await window.RollLerdCloud.getSession();if(session)await startOwnerSession();else{$('authGate').classList.remove('hidden');setCloudStatus('กรุณาเข้าสู่ระบบเจ้าของร้าน');}}catch(e){$('authGate').classList.remove('hidden');setCloudStatus('ตั้งค่า Supabase ไม่ครบ: '+(e.message||e));}})();
