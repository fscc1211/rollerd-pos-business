// staff page renderer for RollLerd POS
window.renderStaffPage = function () {
  return `<div class="head"><h2>พนักงานและค่าแรง</h2><button class="primary" onclick="addStaff()">+ เพิ่มพนักงาน</button></div>${table(['ชื่อ','ตำแหน่ง','ค่าแรง/ชม.','ชั่วโมง','ค่าแรงรวม','จัดการ'],db.staff.map((x,i)=>`<tr><td>${x.name}</td><td>${x.job}</td><td>${money(x.rate)}</td><td>${x.hours}</td><td>${money(x.rate*x.hours)}</td><td><button onclick="del('staff',${i})">ลบ</button></td></tr>`).join(''))}<div class="warn">เจ้าของจัดการบัญชีและสิทธิ์ผู้ใช้เท่านั้น พนักงานดูข้อมูลร้านตามสิทธิ์ที่กำหนด</div>`;
};
