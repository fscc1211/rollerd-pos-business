// reports page renderer for RollLerd POS
window.renderReportsPage = function () {
  return `<div class="grid"><div class="card">ยอดขาย<div class="metric">${money(rev)}</div></div><div class="card">รายจ่าย<div class="metric">${money(exp)}</div></div><div class="card">ออเดอร์<div class="metric">${db.sales.length}</div></div><div class="card">วัตถุดิบ<div class="metric">${db.ingredients.length}</div></div></div>${table(['เมนู','ราคาขาย'],db.products.map(x=>`<tr><td>${x[0]}</td><td>${money(x[2])}</td></tr>`).join(''))}`;
};
