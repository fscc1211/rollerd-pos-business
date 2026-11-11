// sales page renderer for RollLerd POS
window.renderSalesPage = function () {
  return `<div class="head"><h2>ยอดขาย</h2><button class="primary" onclick="addSale()">+ บันทึกยอดขาย</button></div>${table(['วันที่','เมนู','จำนวนกล่อง','ยอดขาย','ผู้บันทึก','จัดการ'],db.sales.map((x,i)=>`<tr><td>${x.date}</td><td>${x.name}</td><td>${x.qty}</td><td>${money(x.amount)}</td><td>${x.by}</td><td><button onclick="del('sales',${i})">ลบ</button></td></tr>`).join(''))}`;
};
