const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const User = require('./models/User'); // Mới thêm
const Order = require('./models/Order'); // Mới thêm

const app = express();
app.use(cors());
app.use(express.json());

// KẾT NỐI MONGODB
mongoose.connect('mongodb://127.0.0.1:27017/foodpro_db')
  .then(() => console.log('🟢 Đã kết nối thành công với MongoDB!'))
  .catch(err => console.error('🔴 Lỗi MongoDB:', err));

// ==========================================
// ==========================================
// 1. API SẢN PHẨM (PRODUCTS)
// ==========================================
// Cũ: Lấy danh sách món ăn
app.get('/api/products', async (req, res) => res.json(await Product.find().sort({ _id: -1 })));

// MỚI: Thêm món ăn mới vào MongoDB
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save(); // Lệnh này sẽ lưu vĩnh viễn vào Database
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lưu món mới', error: error.message });
  }
});
// MỚI: Cập nhật trạng thái Bán/Hết hàng
app.put('/api/products/:id/status', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy món' });

    product.isAvailable = !product.isAvailable; // Đảo ngược trạng thái
    await product.save(); // Lưu vĩnh viễn vào MongoDB

    res.json({ success: true, isAvailable: product.isAvailable });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
// MỚI: API Sửa toàn bộ thông tin món ăn
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true } // Yêu cầu MongoDB trả về data sau khi đã sửa xong
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi sửa món' });
  }
});

// MỚI: API Xóa vĩnh viễn món ăn
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa món' });
  }
});
// ==========================================
// 2. API TÀI KHOẢN (USERS) & AUTH
// ==========================================
app.get('/api/users', async (req, res) => res.json(await User.find()));

app.post('/api/auth/register', async (req, res) => {
  const { username, password, fullName } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'Trùng tên' });
  
  const newUser = new User({ id: 'USER_' + Date.now(), username, password, fullName });
  await newUser.save();
  res.json(newUser);
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password, isActive: true });
  if (user) res.json(user);
  else res.status(401).json({ message: 'Sai thông tin' });
});

app.put('/api/users/:id/role', async (req, res) => {
  await User.findOneAndUpdate({ id: req.params.id }, { role: req.body.role });
  res.json({ success: true });
});

app.put('/api/users/:id/status', async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true });
});

// Lệnh bơm dữ liệu Món Ăn mẫu
app.get('/api/seed', async (req, res) => {
  try {
    // Xóa data cũ để tránh trùng lặp
    await Product.deleteMany({});
    
    // Mảng món ăn mẫu
    const seedProducts = [
      { id: 'c1', name: 'Combo Độc Ẩm', description: '1 Gà rán + 1 Khoai tây + 1 Pepsi', price: 69000, originalPrice: 95000, category: 'Combo', isAvailable: true, isBestSeller: true, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500' }, // Đã fix ảnh Combo
    { id: 'c2', name: 'Combo Cặp Đôi', description: '1 Pizza M + 2 Burger + 2 Trà đào', price: 189000, category: 'Combo', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
    { id: 'c3', name: 'Combo Phá Cỗ (4 Người)', description: '1 Pizza L + 4 Gà rán + 4 Nước + Salad', price: 350000, originalPrice: 420000, category: 'Combo', isAvailable: true, isBestSeller: true, imageUrl: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=500' },

    // ĐỒ UỐNG (DRINKS)
    { id: 'd1', name: 'Trà Sữa Trân Châu Đường Đen', description: 'Trân châu dẻo mềm, sữa tươi thanh mát', price: 35000, category: 'Drink', isAvailable: true, isBestSeller: true, imageUrl: 'https://images.unsplash.com/photo-1622595522218-f318265a40f4?w=500' },
    { id: 'd2', name: 'Hồng Trà Macchiato', description: 'Lớp kem mặn béo ngậy', price: 40000, category: 'Drink', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500' }, // Đã fix ảnh Hồng Trà
    { id: 'd3', name: 'Trà Đào Cam Sả', description: 'Chua ngọt giải nhiệt mùa hè', price: 30000, originalPrice: 45000, category: 'Drink', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500' },
    { id: 'd4', name: 'Coca Cola Khổng Lồ', description: 'Ly 1 Lít uống ngập mặt', price: 25000, category: 'Drink', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500' },
    { id: 'd5', name: 'Cà phê Đen Đá', description: 'Tỉnh táo tức thì', price: 20000, category: 'Drink', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500' }, // Đã fix ảnh Cà phê

    // CHIÊN RÁN (FRIED)
    { id: 'f1', name: 'Gà Rán Giòn Cay (3 miếng)', description: 'Tẩm sốt cay Hàn Quốc', price: 85000, originalPrice: 105000, category: 'Fried', isAvailable: true, isBestSeller: true, imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500' },
    { id: 'f2', name: 'Khoai Tây Chiên Lắc Phô Mai', description: 'Phô mai Cheddar béo ngậy', price: 45000, category: 'Fried', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500' },
    { id: 'f3', name: 'Mực Vòng Chiên Xù', description: 'Mực tươi giòn rụm', price: 75000, category: 'Fried', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500' },
    { id: 'f4', name: 'Phô Mai Quế (Cheese Stick)', description: 'Keo sợi siêu dài', price: 55000, originalPrice: 70000, category: 'Fried', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=500' },

    // PIZZA & BURGER
    { id: 'p1', name: 'Pizza Hải Sản (Size L)', description: 'Tôm, mực, phô mai dẻo', price: 180000, category: 'Pizza', isAvailable: true, isBestSeller: true, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
    { id: 'p2', name: 'Pizza Bò Dứa (Size M)', description: 'Sự kết hợp gây tranh cãi', price: 120000, originalPrice: 150000, category: 'Pizza', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
    { id: 'b1', name: 'Burger Bò Kobe Ngập Phô Mai', description: 'Thịt bò nhập khẩu mềm tan', price: 85000, category: 'Burger', isAvailable: true, isBestSeller: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: 'b2', name: 'Burger Gà Giòn', description: 'Thịt gà ta giòn tan', price: 55000, category: 'Burger', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500' }, // Đã fix ảnh Burger Gà
    { id: 'b3', name: 'Burger Tôm Thượng Hạng', description: 'Nhân tôm biển tươi', price: 95000, originalPrice: 110000, category: 'Burger', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500' },

    // ĐỒ ĂN NHẸ & KHÁC
    { id: 'o1', name: 'Mì Ý Thịt Viên Sốt Cà', price: 110000, category: 'Pasta', description: 'Công thức chuẩn Ý', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=500' }, // Đã fix ảnh Mì Ý
    { id: 'o2', name: 'Salad Tôm Bơ', price: 65000, originalPrice: 85000, category: 'Healthy', description: 'Healthy cho vóc dáng', isAvailable: true, isBestSeller: true, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
    { id: 'o3', name: 'Cơm Chiên Hải Sản', price: 75000, category: 'Fried', description: 'Chắc bụng cho dân cày', isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' }
    ];

    await Product.insertMany(seedProducts);
    res.json({ message: 'Đã bơm dữ liệu món ăn thành công vào MongoDB!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. API ĐƠN HÀNG (ORDERS)
// ==========================================
app.get('/api/orders', async (req, res) => res.json(await Order.find().sort({ createdAt: -1 })));

app.post('/api/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json(newOrder);
});
app.post('/api/products', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json(newOrder);
});

app.put('/api/orders/:id/status', async (req, res) => {
  await Order.findOneAndUpdate({ id: req.params.id }, { status: req.body.status });
  res.json({ success: true });
});

app.listen(3000, () => console.log(`🚀 Backend Server chạy tại http://localhost:3000`));