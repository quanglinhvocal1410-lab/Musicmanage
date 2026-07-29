-- ============================================================
-- Tiệm Dạy Nhạc — bảng lưu trữ dùng chung (key-value)
-- Chạy trong Supabase: Dashboard > SQL Editor > New query > Run
-- ============================================================

create table if not exists public.app_kv (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

-- Cho phép ứng dụng (dùng anon public key) đọc/ghi.
grant all on public.app_kv to anon, authenticated;

-- Bật Row Level Security và mở quyền truy cập.
alter table public.app_kv enable row level security;

drop policy if exists "app_kv_all" on public.app_kv;
create policy "app_kv_all"
  on public.app_kv
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- ============================================================
-- LƯU Ý BẢO MẬT (đọc kỹ):
-- Cấu hình trên cho phép BẤT KỲ AI có link app đều đọc/ghi được dữ liệu.
-- Phù hợp cho trung tâm nhỏ, nội bộ. Mật khẩu học viên đang lưu dạng chữ thường
-- trong dữ liệu -> KHÔNG dùng mật khẩu quan trọng.
-- Khi cần chặt chẽ hơn: chuyển sang Supabase Auth (đăng nhập email thật) và siết policy.
-- ============================================================
