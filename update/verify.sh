#!/bin/bash

echo "=== KIỂM TRA FILES ĐÃ CẬP NHẬT ==="
echo ""

echo "1. Kiểm tra config.js có getImageUrl không:"
grep -n "getImageUrl" client/src/config.js | head -3

echo ""
echo "2. Kiểm tra ProductDetail.jsx có import getImageUrl không:"
grep -n "getImageUrl" client/src/pages/ProductDetail.jsx | head -3

echo ""
echo "3. Kiểm tra Home.jsx có import getImageUrl không:"
grep -n "getImageUrl" client/src/pages/Home.jsx | head -3

echo ""
echo "4. Kiểm tra Shop.jsx có import getImageUrl không:"
grep -n "getImageUrl" client/src/pages/Shop.jsx | head -3

echo ""
echo "5. Kiểm tra server.js có CORS headers đầy đủ không:"
grep -n "Access-Control-Allow-Methods" server/server.js

echo ""
echo "=== KẾT QUẢ ==="
echo "Nếu TẤT CẢ đều có kết quả → Files đã update đúng"
echo "Nếu có dòng nào trống → File chưa được update!"
