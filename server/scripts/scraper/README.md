# Fahasa Book Scraper & Seeder

## 📋 Overview
Scripts để scrape 100 sách từ Fahasa.com và seed vào MongoDB.

## 🚀 Quick Start

### Step 1: Install Python Dependencies
```bash
cd server/scripts/scraper
pip install -r requirements.txt
```

### Step 2: Run Scraper
```bash
python fahasa_scraper.py
```

Kết quả: File `fahasa_books.json` chứa 100 sách.

### Step 3: Seed vào MongoDB
```bash
cd ../..  # Back to server directory
node scripts/seedBooks.js
```

## 📁 File Structure
```
server/scripts/
├── scraper/
│   ├── fahasa_scraper.py      # Python scraper
│   ├── requirements.txt        # Python dependencies
│   └── fahasa_books.json       # Output (generated)
└── seedBooks.js                # Node.js seeder
```

## ⚙️ Configuration

### Scraper Settings
- **Limit**: 100 books (configurable in `fahasa_scraper.py`)
- **Delay**: 2 seconds between pages
- **User-Agent**: Chrome/120.0.0.0

### Seeder Settings
- **Upload Path**: `server/uploads/books/`
- **Default Stock**: 50
- **Default Categories**: "Trong nước", "Văn học"

## 🔧 Troubleshooting

### Issue: "No books found"
**Solution**: Fahasa có thể đã thay đổi HTML structure. Inspect trang web và update selectors trong `fahasa_scraper.py`.

### Issue: "Image download failed"
**Solution**: Một số images có thể bị block. Script sẽ skip và tiếp tục.

### Issue: "MongoDB connection error"
**Solution**: Kiểm tra `.env` file có `MONGO_URI` đúng không.

## 📊 Expected Output

```
🔍 Starting to scrape 100 books from Fahasa.com...
📄 Scraping page 1: https://www.fahasa.com/sach-trong-nuoc.html?p=1
✅ Found 20 books on page 1
  ✓ [1/100] Nhà Giả Kim...
  ✓ [2/100] Đắc Nhân Tâm...
  ...
✅ Successfully scraped 100 books!
💾 Saved 100 books to fahasa_books.json
```

## 🎯 Next Steps
After seeding, verify in MongoDB:
```javascript
db.books.countDocuments()  // Should be 100+
```
