#!/usr/bin/env bash
# ============================================================
# deploy.sh — Đẩy toàn bộ thay đổi lên GitHub (Vercel tự deploy)
# Cách dùng:  bash deploy.sh "nội dung commit"
# Ví dụ:      bash deploy.sh "them nut xoa hoc vien"
# ============================================================
set -e

MSG="${1:-update $(date '+%Y-%m-%d %H:%M')}"

# Lần đầu chưa có git thì khởi tạo
if [ ! -d .git ]; then
  echo "→ Khởi tạo git repo..."
  git init
  git branch -M main
  echo "‼️  Chưa gắn remote GitHub. Chạy 1 lần:"
  echo "    git remote add origin https://github.com/<ten-github>/<ten-repo>.git"
  echo "   rồi chạy lại: bash deploy.sh \"$MSG\""
  exit 1
fi

echo "→ Thêm file thay đổi..."
git add -A

if git diff --cached --quiet; then
  echo "✓ Không có gì thay đổi để đẩy."
  exit 0
fi

echo "→ Commit: $MSG"
git commit -m "$MSG"

echo "→ Push lên GitHub..."
git push origin main

echo ""
echo "✅ Đã đẩy lên GitHub. Vercel sẽ tự động deploy sau vài phút."
echo "   Kiểm tra tại: https://vercel.com/dashboard"
