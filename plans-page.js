// plans page renderer for RollLerd POS
window.renderPlansPage = function () {
  return `<div class="head"><h2>แผนงานร้าน</h2><button class="primary" onclick="addPlan()">+ เพิ่มแผน</button></div>${table(['แผน','กำหนดวัน','เป้าหมาย','สถานะ','จัดการ'],db.plans.map((x,i)=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td><td><button onclick="del('plans',${i})">ลบ</button></td></tr>`).join(''))}`;
};
