// finance page renderer for RollLerd POS
window.renderFinancePage = function () {
  return `<div class="grid"><div class="card">รายรับ<div class="metric">${money(rev)}</div></div><div class="card">รายจ่าย<div class="metric">${money(exp)}</div></div><div class="card">คงเหลือจากรายการ<div class="metric">${money(rev-exp)}</div></div><div class="card owner-only">บัญชีส่วนตัวเจ้าของ<div class="metric">แยกสิทธิ์</div></div></div><div class="warn">กำไรสุทธิต้องหักต้นทุนขายตามสูตร ค่าแรง ค่าเช่า ค่าขนส่ง และค่าใช้จ่ายอื่นให้ครบ ข้อมูลส่วนตัวเจ้าของไม่แสดงแก่พนักงาน</div><button class="primary" onclick="addExpense()">+ เพิ่มรายจ่าย</button>`;
};
