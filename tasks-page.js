// tasks page renderer for RollLerd POS
window.renderTasksPage = function () {
  return `<div class="head"><h2>รายการงาน</h2><button class="primary" onclick="addTask()">+ เพิ่มงาน</button></div>${table(['งาน','ผู้รับผิดชอบ','สถานะ','จัดการ'],db.tasks.map((x,i)=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td><button onclick="db.tasks[${i}][2]=db.tasks[${i}][2]==='เสร็จแล้ว'?'รอดำเนินการ':'เสร็จแล้ว';save()">${x[2]}</button></td><td><button onclick="del('tasks',${i})">ลบ</button></td></tr>`).join(''))}`;
};
