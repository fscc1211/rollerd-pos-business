// ingredients page renderer for RollLerd POS
window.renderIngredientsPage = function () {
  return `<div class="head"><h2>วัตถุดิบและราคาซื้อ</h2><button class="primary" onclick="addIngredient()">+ เพิ่มวัตถุดิบ</button></div>${table(['วัตถุดิบ','ราคาซื้อ','ปริมาณแพ็ก','หน่วย','ต้นทุน/หน่วย','หมายเหตุ','แก้ไข'],db.ingredients.map((x,i)=>`<tr><td>${x[0]}</td><td>${money(x[1])}</td><td>${x[2]}</td><td>${x[3]}</td><td>${money(x[1]/x[2])}</td><td>${x[4]}</td><td><button onclick="db.ingredients[${i}][1]=Number(prompt('ราคา',db.ingredients[${i}][1])||db.ingredients[${i}][1]);save()">แก้ราคา</button></td></tr>`).join(''))}<div class="warn">ค่าประมาณที่ยังต้องยืนยัน: ขนาดแพ็กเนย, น้ำหนักผักที่ใช้จริง, ปริมาณน้ำมันที่ใช้ทอดซ้ำ</div>`;
};
