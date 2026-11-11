// products page renderer for RollLerd POS
window.renderProductsPage = function () {
  return `<div class="head"><h2>สินค้าและเมนู</h2><button class="primary" onclick="addProduct()">+ เพิ่มเมนู</button></div>${table(['SKU','เมนู','ราคาขาย','ต้นทุนสูตร','จัดการ'],db.products.map((x,i)=>`<tr><td>${x[1]}</td><td>${x[0]}</td><td>${money(x[2])}</td><td>รอผูกสูตร</td><td><button onclick="db.products[${i}][2]=Number(prompt('ราคาใหม่',db.products[${i}][2])||db.products[${i}][2]);save()">แก้ไข</button> <button onclick="del('products',${i})">ลบ</button></td></tr>`).join(''))}<div class="warn">ขั้นต่อไปจะผูกสูตรกับเมนู เพื่อคำนวณต้นทุนต่อกล่องและกำไรต่อเมนูโดยอัตโนมัติ</div>`;
};
