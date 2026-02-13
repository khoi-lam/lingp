# Phase 4.2: AI Recommendations - Setup & Testing Guide

## 🚀 Quick Start

### Step 1: Get Hugging Face API Key (5 minutes)

1. **Create Account**:
   - Go to https://huggingface.co/
   - Click "Sign Up" (free, no credit card needed)
   - Verify your email

2. **Generate API Key**:
   - Go to Settings → Access Tokens
   - Click "New token"
   - Name: `bookstore-ai-recommendations`
   - Type: **Read**
   - Click "Generate"
   - Copy the token (starts with `hf_`)

3. **Add to Environment**:
   - Open `/Users/mymac/Bookstore/server/.env`
   - Replace `HF_API_KEY=hf_your_api_key_here` with your actual key
   - Save the file

### Step 2: Restart Backend Server

Since the backend is already running, you need to restart it to load the new environment variable:

1. In the terminal running the backend server, press `Ctrl+C` to stop
2. Run `npm run dev` again to restart with the new API key

### Step 3: Test the Feature

#### Option A: Browser Testing (Recommended)

1. **Navigate to any book**:
   - Go to http://localhost:5173 (or your frontend URL)
   - Click on any book from the shop page
   - Scroll down to the product detail page

2. **Verify AI Recommendations**:
   - You should see a loading spinner with purple color
   - After 2-5 seconds, you should see:
     - "🤖 AI Gợi ý - Powered by Hugging Face" header
     - "Sách được đề xuất cho bạn" title
     - Up to 10 recommended books in a grid
     - Each book has an "AI XX%" badge in the top-right corner

3. **Test Navigation**:
   - Click on a recommended book
   - The page should navigate to that book's detail
   - New AI recommendations should load for that book

#### Option B: API Testing (Advanced)

Test the backend API directly:

```bash
# Get a book ID from your database first
# Then test the recommendations endpoint

curl http://localhost:5000/api/recommendations/books/<BOOK_ID>/ai-recommendations
```

Expected response:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "_id": "...",
        "title": "Book Title",
        "author": "Author Name",
        "price": 150000,
        "images": ["..."],
        "slug": "book-slug",
        "score": 0.85,
        "scoreBreakdown": {
          "ai": 0.51,
          "genre": 0.2,
          "price": 0.08,
          "popularity": 0.06
        }
      }
    ],
    "count": 10,
    "targetBook": {
      "_id": "...",
      "title": "Target Book"
    }
  }
}
```

---

## 🔍 What to Look For

### ✅ Success Indicators

1. **First Load (2-5 seconds)**:
   - Purple spinner appears
   - API call to Hugging Face generates embeddings
   - Recommendations appear with AI scores

2. **Subsequent Loads (< 1 second)**:
   - Much faster (embeddings cached in MongoDB)
   - Same quality recommendations

3. **UI Quality**:
   - Purple theme for AI section (different from red Fahasa theme)
   - AI score badges visible on each book
   - Smooth hover effects
   - Responsive grid (2 columns mobile, 5 columns desktop)

4. **Database**:
   - Check MongoDB `bookembeddings` collection
   - Should see documents with 384-dimensional embedding arrays

### ❌ Common Issues & Solutions

#### Issue 1: "Không thể tải gợi ý AI" error

**Cause**: Invalid or missing Hugging Face API key

**Solution**:
- Verify `HF_API_KEY` in `.env` is correct
- Make sure you restarted the backend server
- Check backend console for error messages

#### Issue 2: Very slow loading (> 10 seconds)

**Cause**: Generating embeddings for many books at once

**Solution**:
- This is normal for the first load
- Subsequent loads will be much faster (cached)
- Consider pre-generating embeddings (see optimization below)

#### Issue 3: No recommendations appear

**Cause**: Not enough books in database or all out of stock

**Solution**:
- Verify you have at least 10 books with `stockQuantity > 0`
- Check browser console for errors
- Check backend logs for API errors

#### Issue 4: Recommendations seem random

**Cause**: Books have very different content or genres

**Solution**:
- This is expected for diverse catalogs
- Hybrid scoring balances AI similarity with genre/price
- Test with books in the same genre for better results

---

## 🎯 Testing Checklist

### Backend Testing
- [ ] Hugging Face API key added to `.env`
- [ ] Backend server restarted successfully
- [ ] No errors in backend console
- [ ] API endpoint responds: `GET /api/recommendations/books/:id/ai-recommendations`
- [ ] Response includes 10 recommendations with scores
- [ ] MongoDB `bookembeddings` collection created
- [ ] Embeddings have 384 dimensions

### Frontend Testing
- [ ] AI recommendations section appears on ProductDetail page
- [ ] Loading spinner shows (purple color)
- [ ] "🤖 AI Gợi ý - Powered by Hugging Face" badge visible
- [ ] 10 books displayed in grid
- [ ] AI score badges show on each book (e.g., "AI 85%")
- [ ] Clicking a recommendation navigates correctly
- [ ] New recommendations load for new book
- [ ] Error message displays if API fails
- [ ] Responsive design works (mobile & desktop)

### Performance Testing
- [ ] First load: 2-5 seconds (acceptable)
- [ ] Cached loads: < 1 second (fast)
- [ ] No memory leaks in browser
- [ ] No excessive API calls to Hugging Face

### Quality Testing
- [ ] Recommendations are relevant to target book
- [ ] Books in same genre score higher
- [ ] Similar price ranges preferred
- [ ] Popular books get slight boost
- [ ] AI scores make sense (70-95% for good matches)

---

## 🚀 Optional: Pre-generate Embeddings

To speed up initial loads, you can pre-generate embeddings for all books:

```javascript
// Create: /server/scripts/generateEmbeddings.js

import mongoose from 'mongoose';
import Book from '../models/Book.js';
import BookEmbedding from '../models/BookEmbedding.js';
import { config } from '../config/env.js';

// Copy the generateEmbedding and getOrCreateEmbedding functions
// from recommendationController.js here

const generateAllEmbeddings = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');

        const books = await Book.find({});
        console.log(`Found ${books.length} books`);

        for (let i = 0; i < books.length; i++) {
            const book = books[i];
            console.log(`[${i + 1}/${books.length}] Processing: ${book.title}`);
            
            try {
                await getOrCreateEmbedding(book);
                console.log('✓ Embedding generated');
            } catch (error) {
                console.error('✗ Error:', error.message);
            }
            
            // Add delay to avoid rate limiting (if any)
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

generateAllEmbeddings();
```

Run with:
```bash
cd /Users/mymac/Bookstore/server
node scripts/generateEmbeddings.js
```

---

## 📊 Expected Results

### Sample AI Recommendations for "Harry Potter và Hòn Đá Phù Thủy"

Should recommend:
1. Other fantasy novels (high AI + genre score)
2. Young adult fiction (high AI score)
3. Books in similar price range (price boost)
4. Popular books (popularity boost)

### Sample Scores

| Book | AI Score | Genre | Price | Popularity | Total |
|------|----------|-------|-------|------------|-------|
| Similar fantasy | 0.54 | 0.20 | 0.08 | 0.05 | **0.87** |
| Different genre | 0.48 | 0.10 | 0.09 | 0.03 | **0.70** |
| Very different | 0.30 | 0.00 | 0.02 | 0.01 | **0.33** |

---

## 🎉 Success!

If all tests pass, you have successfully implemented AI-powered book recommendations using Hugging Face! 

The system will:
- ✅ Generate semantic embeddings for books
- ✅ Cache embeddings for 7 days
- ✅ Use hybrid scoring for relevance
- ✅ Display beautiful UI with AI badges
- ✅ Work seamlessly with existing Fahasa design

Next steps: Phase 4.3 (Admin Order Management) or Phase 4.4 (Advanced Search)
