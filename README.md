# Tiệm Dạy Nhạc — Ứng dụng quản lý dạy thanh nhạc

React + Vite. Quản lý học viên, giáo viên, giáo án AI, KPI, lịch học, kho bài tập, ghi âm.

---

## ❓ Làm sao cho HỌC VIÊN truy cập được?

Đây là phần quan trọng nhất. App có **2 chế độ lưu trữ**, tự chọn theo biến môi trường:

| Chế độ | Khi nào | Học viên thấy gì |
|---|---|---|
| **Cục bộ (IndexedDB)** | KHÔNG đặt biến Supabase | Mỗi trình duyệt một dữ liệu **riêng, rỗng** → chỉ hợp để demo, không dùng thật được |
| **Chung (Supabase)** ✅ | CÓ đặt `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` | **Tất cả** admin/giáo viên/học viên dùng **chung một dữ liệu** |

➡️ **Muốn học viên truy cập thật thì bắt buộc bật chế độ Supabase** (xem Bước 3). Sau đó bạn chỉ cần **gửi link Vercel** cho học viên; các em đăng nhập bằng tài khoản bạn tạo trong app là thấy đúng lịch, giáo trình, bài tập của mình.

---

## Bước 1 — Chạy thử ở máy (tuỳ chọn)

Cần **Node.js 18+**.

```bash
npm install
npm run dev
```

Mở http://localhost:5173 . Chưa có Supabase thì chạy chế độ cục bộ.

Tài khoản mẫu: `admin` / `admin`. Hoặc nút **Xem thử vai trò**.

---

## Bước 2 — Đưa lên GitHub

Tạo repo trống trên GitHub (ví dụ tên `tiem-day-nhac`), rồi trong thư mục dự án:

```bash
git init
git add .
git commit -m "Tiem Day Nhac - initial"
git branch -M main
git remote add origin https://github.com/<tên-github>/tiem-day-nhac.git
git push -u origin main
```

---

## Bước 3 — Tạo cơ sở dữ liệu Supabase (để dùng chung)

1. Vào https://supabase.com → tạo project (miễn phí).
2. Mở **SQL Editor** → dán toàn bộ nội dung file **`supabase-schema.sql`** → **Run**.
3. Vào **Project Settings → API**, lấy 2 giá trị:
   - **Project URL** → dùng cho `VITE_SUPABASE_URL`
   - **anon public key** → dùng cho `VITE_SUPABASE_ANON_KEY`

---

## Bước 4 — Deploy Vercel

1. Vào https://vercel.com → **Add New… → Project** → chọn repo vừa push.
2. Vercel tự nhận **Vite** (Build: `vite build`, Output: `dist`) — không cần chỉnh.
3. Mở **Environment Variables**, thêm 2 biến (lấy ở Bước 3):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Bấm **Deploy**. Xong bạn được một link dạng `https://tiem-day-nhac.vercel.app`.

> Nếu thêm biến sau khi deploy: vào **Deployments → … → Redeploy** để build lại.

---

## Bước 5 — Cho học viên vào

1. Bạn đăng nhập `admin`, tạo giáo viên và học viên (đặt **tài khoản** cho từng người).
2. Gửi **link Vercel** cho học viên.
3. Học viên mở link → nhập tài khoản; **lần đầu gõ mật khẩu sẽ tự lưu**.
4. Học viên chỉ thấy hồ sơ, lịch, lịch sử, bài tập của chính mình.

**Khoá AI (Gemini):** vào **Cài đặt → Gemini API Key** dán key của bạn (lưu theo trình duyệt admin). Không nhúng key vào mã nguồn.

---

## Ghi chú kỹ thuật & giới hạn

- **HTTPS**: Vercel cấp sẵn — cần thiết để **micro (ghi âm)** và **dán ảnh** hoạt động.
- **Ghi âm / ảnh** lưu dạng base64 trong Supabase (khoá `rec_*`, `img_*`). Trung tâm nhỏ dùng ổn; nếu nhiều file lớn nên chuyển sang Supabase **Storage** (bucket).
- **Đồng bộ**: dữ liệu ghi theo kiểu "ghi sau đè ghi trước". Với 1 admin nhập liệu thì ổn; nhiều người sửa cùng lúc có thể đè nhau. Chưa cập nhật realtime — học viên tải lại trang để thấy dữ liệu mới.
- **Bảo mật**: mật khẩu đang lưu dạng chữ thường trong dữ liệu chung → **đừng dùng mật khẩu quan trọng**. Muốn chắc chắn: chuyển sang **Supabase Auth** (đăng nhập email thật) và siết RLS — mình có thể làm giúp ở bước sau.

## Lệnh

```bash
npm run dev       # chạy local
npm run build     # build ra thư mục dist
npm run preview   # xem thử bản build
```
