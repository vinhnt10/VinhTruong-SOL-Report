// ===== Danh sách phòng ban và báo cáo thuộc từng phòng ban (dùng chung cho index.html và phong-ban.html) =====
// Thêm báo cáo mới vào phòng ban = thêm một dòng vào mảng pages của phòng ban đó.
//   href: tên file trang con (cùng thư mục). Để null thì nút hiện "Sắp có" và không bấm được.
// Đổi tên phòng ban 6 đến 9: sửa trường name bên dưới (giữ nguyên id).
const DEPTS = [
  { id: 'van-hanh', name: 'Vận hành', pages: [] },
  { id: 'mkt', name: 'MKT', pages: [
    { name: 'Doanh thu chi tiết theo NH', desc: 'Danh sách bill theo khoảng ngày và chi nhánh, có dòng tổng và tải CSV.', href: 'doanh-thu-nh.html' },
    { name: 'Doanh thu chi tiết theo SDT', desc: 'Tra cứu bill và doanh thu của một số điện thoại khách trong khoảng ngày.', href: 'doanh-thu-sdt.html' },
    { name: 'Tổng doanh thu 6 tháng gom theo SDT', desc: 'Mỗi SDT một dòng: số bill, tổng doanh thu, bill cuối. Tìm theo SDT hoặc tên khách gần đúng.', href: 'doanh-thu-6-thang-theo-sdt.html' },
    { name: 'Tổng doanh thu từng NH theo tháng', desc: 'Số bill, tiền hàng, giảm giá, phí dịch vụ, VAT và doanh thu của từng chi nhánh trong một tháng.', href: 'doanh-thu-nh-theo-thang.html' },
    { name: 'Số lượng KH phát sinh trong tháng', desc: 'Khách hàng tạo mới trong tháng, kèm thẻ thành viên, điểm, doanh số tích luỹ. Lọc theo chi nhánh, loại thẻ, có dùng thẻ.', href: 'so-luong-kh-phat-sinh-thang.html' },
    { name: 'Tổng doanh thu từng NH theo coupon sinh nhật', desc: 'Số bill dùng coupon sinh nhật (giảm 50k, giảm 200k), doanh thu và giảm giá của từng chi nhánh trong một tháng.', href: 'doanh-thu-nh-coupon-sinh-nhat.html' }
  ] },
  { id: 'hr', name: 'HR', pages: [] },
  { id: 'ke-toan', name: 'Kế toán', pages: [] },
  { id: 'ck', name: 'CK', pages: [] },
  { id: 'pb6', name: 'Phòng ban 6', pages: [] },
  { id: 'pb7', name: 'Phòng ban 7', pages: [] },
  { id: 'pb8', name: 'Phòng ban 8', pages: [] },
  { id: 'pb9', name: 'Phòng ban 9', pages: [] },
  { id: 'vinh-truong', name: 'Vinh Trương', pages: [] }
];
