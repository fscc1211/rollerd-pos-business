// accounts page renderer for RollLerd POS
window.renderAccountsPage = function () {
  return `<div class="head"><h2>บัญชีร้าน</h2><div><button class="primary" onclick="addSale()">+ รายรับ</button> <button onclick="addExpense()">+ รายจ่าย</button></div></div>${table(['วันที่','ประเภท','รายการ','จำนวนเงิน','ผู้บันทึก','จัดการ'],[...db.sales.map((x,i)=>`<tr><td>${x.date}</td><td>รายรับ</td><td>${x.name}</td><td>${money(x.amount)}</td><td>${x.by}</td><td><button onclick="del('sales',${i})">ลบ</button></td></tr>`),...db.expenses.map((x,i)=>`<tr><td>${x.date}</td><td>รายจ่าย</td><td>${x.name}</td><td>${money(x.amount)}</td><td>${x.by}</td><td><button onclick="del('expenses',${i})">ลบ</button></td></tr>`)].join(''))}`;
};
