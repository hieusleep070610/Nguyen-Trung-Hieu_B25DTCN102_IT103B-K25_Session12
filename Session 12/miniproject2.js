
const VALID_CATEGORIES = [
  "Lương",
  "Thưởng",
  "Ăn uống",
  "Di chuyển",
  "Giải trí",
  "Hóa đơn",
  "Sức khỏe",
  "Khác"
];

let transactions = [
  { id: 1, description: "Lương tháng 1", amount: 15000000, type: "Thu nhập", category: "Lương", date: "2026-01-05", note: "" },
  { id: 2, description: "Ăn tối nhà hàng", amount: -450000, type: "Chi tiêu", category: "Ăn uống", date: "2026-01-10", note: "Sinh nhật bạn" },
  { id: 3, description: "Mua thuốc", amount: -300000, type: "Chi tiêu", category: "Sức khỏe", date: "2026-01-15", note: "" },
  { id: 4, description: "Thưởng dự án", amount: 2000000, type: "Thu nhập", category: "Thưởng", date: "2026-02-01", note: "" },
  { id: 5, description: "Đổ xăng", amount: -200000, type: "Chi tiêu", category: "Di chuyển", date: "2026-02-03", note: "" },
  { id: 6, description: "Xem phim", amount: -250000, type: "Chi tiêu", category: "Giải trí", date: "2026-02-10", note: "" },
  { id: 7, description: "Trả tiền điện", amount: -500000, type: "Chi tiêu", category: "Hóa đơn", date: "2026-02-15", note: "" },
  { id: 8, description: "Freelance", amount: 3000000, type: "Thu nhập", category: "Khác", date: "2026-03-01", note: "Làm thêm" }
];

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function normalizeType(type) {
  type = type.toLowerCase();
  if (type === "thu nhập") return "Thu nhập";
  if (type === "chi tiêu") return "Chi tiêu";
  return null;
}

function viewAll() {
  if (transactions.length === 0) {
    alert("Danh sách trống.");
    return;
  }

  transactions.forEach(t => {
    console.log(`ID: ${t.id} | ${t.date} | ${t.category} | ${t.amount}`);
    console.log(`Mô tả: ${t.description} | Ghi chú: ${t.note}`);
    console.log("------------------------------------------------");
  });
}

function addTransaction() {
  let id = +prompt("Nhập ID:");
  if (transactions.some(t => t.id === id)) {
    alert("ID đã tồn tại!");
    return;
  }

  let description = prompt("Nhập mô tả:");
  if (!description) {
    alert("Mô tả không được rỗng!");
    return;
  }

  let amount = +prompt("Nhập số tiền:");
  if (isNaN(amount) || amount === 0) {
    alert("Số tiền không hợp lệ!");
    return;
  }

  let typeInput = prompt("Nhập loại (Thu nhập / Chi tiêu):");
  let type = normalizeType(typeInput);
  if (!type) {
    alert("Loại không hợp lệ!");
    return;
  }

  let category = prompt("Nhập danh mục:");
  if (!VALID_CATEGORIES.includes(category)) {
    alert("Danh mục không hợp lệ!");
    return;
  }

  let date = prompt("Nhập ngày (YYYY-MM-DD):");
  if (!isValidDate(date)) {
    alert("Ngày không hợp lệ!");
    return;
  }

  let note = prompt("Nhập ghi chú (có thể bỏ trống):") || "";

  transactions.push({ id, description, amount, type, category, date, note });

  alert(`Đã thêm giao dịch ${description}`);
}

function removeTransaction() {
  let id = +prompt("Nhập ID cần xóa:");
  let index = transactions.findIndex(t => t.id === id);

  if (index === -1) {
    alert("Không tìm thấy!");
    return;
  }

  let confirmDelete = prompt("Xóa giao dịch này? (có/không)");
  if (confirmDelete.toLowerCase() === "có") {
    transactions.splice(index, 1);
    alert("Đã xóa!");
  }
}

function updateTransaction() {
  let id = +prompt("Nhập ID cần sửa:");
  let t = transactions.find(t => t.id === id);

  if (!t) {
    alert("Không tìm thấy!");
    return;
  }

  let newDesc = prompt("Mô tả mới:", t.description);
  let newAmount = +prompt("Số tiền mới:", t.amount);
  let newCategory = prompt("Danh mục mới:", t.category);
  let newDate = prompt("Ngày mới:", t.date);
  let newNote = prompt("Ghi chú mới:", t.note);

  if (!newDesc || isNaN(newAmount) || !VALID_CATEGORIES.includes(newCategory) || !isValidDate(newDate)) {
    alert("Dữ liệu không hợp lệ!");
    return;
  }

  t.description = newDesc;
  t.amount = newAmount;
  t.category = newCategory;
  t.date = newDate;
  t.note = newNote;

  alert(`Đã cập nhật giao dịch ID ${id}`);
}

function searchTransactions() {
  let keyword = prompt("Nhập từ khóa:");
  let minAmount = +prompt("Nhập |amount| tối thiểu (có thể bỏ qua):") || 0;

  let result = transactions.filter(t =>
    (t.description.toLowerCase().includes(keyword.toLowerCase()) ||
     t.note.toLowerCase().includes(keyword.toLowerCase())) &&
    Math.abs(t.amount) >= minAmount
  );

  if (result.length === 0) {
    alert("Không tìm thấy");
    return;
  }

  console.table(result);
}

function filterTransactions() {
  let choice = prompt("Lọc theo: 1.Type  2.Category");

  let result = [];

  if (choice === "1") {
    let type = normalizeType(prompt("Nhập loại:"));
    result = transactions.filter(t => t.type === type);
  } else {
    let category = prompt("Nhập danh mục:");
    result = transactions.filter(t => t.category === category);
  }

  if (result.length === 0) {
    alert("Không có dữ liệu");
    return;
  }

  let total = result.reduce((sum, t) => sum + t.amount, 0);

  console.table(result);
  alert(`Tổng tiền: ${total}\nSố lượng: ${result.length}`);
}

function sortTransactions() {
  let choice = prompt("1. Theo ngày mới nhất\n2. Theo |amount| giảm dần");

  let copy = [...transactions];

  if (choice === "1") {
    copy.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    copy.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  }

  console.table(copy);
}

function generateReport() {
  let totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  let totalExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  let balance = totalIncome + totalExpense;

  // Danh mục chi nhiều nhất
  let expenseByCategory = {};
  transactions
    .filter(t => t.amount < 0)
    .forEach(t => {
      expenseByCategory[t.category] =
        (expenseByCategory[t.category] || 0) + Math.abs(t.amount);
    });

  let maxCategory = Object.keys(expenseByCategory)
    .reduce((a, b) =>
      expenseByCategory[a] > expenseByCategory[b] ? a : b
    );

  // Tháng chi vượt 70%
  let monthly = {};
  transactions.forEach(t => {
    let month = t.date.slice(0, 7);
    if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };

    if (t.amount > 0) monthly[month].income += t.amount;
    else monthly[month].expense += Math.abs(t.amount);
  });

  let over70 = Object.values(monthly)
    .some(m => m.expense > m.income * 0.7);

  let allHaveNote = transactions.every(t => t.note !== "");

  alert(`
TỔNG THU: ${totalIncome}
TỔNG CHI: ${totalExpense}
SỐ DƯ: ${balance}
Danh mục chi nhiều nhất: ${maxCategory}
Có tháng chi >70% thu? ${over70 ? "Có" : "Không"}
Tất cả giao dịch có note? ${allHaveNote ? "Có" : "Không"}
`);
}

function startApp() {
  while (true) {
    let choice = prompt(`
QUẢN LÝ THU CHI CÁ NHÂN
1. Xem tất cả
2. Thêm
3. Xóa
4. Sửa
5. Tìm kiếm
6. Lọc
7. Sắp xếp
8. Báo cáo
0. Thoát
`);

    switch (choice) {
      case "1": viewAll(); break;
      case "2": addTransaction(); break;
      case "3": removeTransaction(); break;
      case "4": updateTransaction(); break;
      case "5": searchTransactions(); break;
      case "6": filterTransactions(); break;
      case "7": sortTransactions(); break;
      case "8": generateReport(); break;
      case "0": return;
      default: alert("Lựa chọn không hợp lệ!");
    }
  }
}


startApp();
