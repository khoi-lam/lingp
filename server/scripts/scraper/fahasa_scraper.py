"""
Fahasa.com Book Scraper
Scrapes 100 books from Fahasa.com with images and metadata
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os
from urllib.parse import urljoin

def extract_price(price_text):
    """Extract numeric price from text like '150.000đ'"""
    try:
        return int(price_text.replace('.', '').replace('đ', '').replace(',', '').strip())
    except:
        return 100000  # Default price

def scrape_fahasa_books(limit=100):
    """Scrape books from Fahasa.com"""
    books = []
    base_url = "https://www.fahasa.com/sach-trong-nuoc.html"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    print(f"🔍 Starting to scrape {limit} books from Fahasa.com...")
    
    page = 1
    while len(books) < limit:
        try:
            url = f"{base_url}?p={page}"
            print(f"\n📄 Scraping page {page}: {url}")
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all product items (adjust selectors based on actual Fahasa HTML)
            book_items = soup.find_all('div', class_='product-item-info')
            
            if not book_items:
                print("⚠️  No books found on this page. Trying alternative selector...")
                book_items = soup.find_all('li', class_='item product product-item')
            
            if not book_items:
                print("❌ No books found. Stopping.")
                break
            
            print(f"✅ Found {len(book_items)} books on page {page}")
            
            for idx, item in enumerate(book_items):
                if len(books) >= limit:
                    break
                
                try:
                    # Extract book data
                    title_elem = item.find('a', class_='product-item-link') or item.find('a', class_='product-name')
                    title = title_elem.text.strip() if title_elem else f"Book {len(books) + 1}"
                    
                    # Author
                    author_elem = item.find('div', class_='author') or item.find('p', class_='product-author')
                    author = author_elem.text.strip() if author_elem else "Tác giả không rõ"
                    
                    # Price
                    price_elem = item.find('span', class_='price') or item.find('p', class_='price')
                    price_text = price_elem.text.strip() if price_elem else "100.000đ"
                    price = extract_price(price_text)
                    
                    # Image
                    img_elem = item.find('img', class_='product-image-photo')
                    image_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else None
                    
                    if image_url and not image_url.startswith('http'):
                        image_url = urljoin('https://www.fahasa.com', image_url)
                    
                    # Publisher (try to extract from detail page or use default)
                    publisher = "Fahasa"
                    
                    # Description (placeholder - would need to fetch detail page)
                    description = f"Sách {title} của tác giả {author}. Một tác phẩm đáng đọc với nội dung phong phú và hấp dẫn."
                    
                    book = {
                        'title': title,
                        'author': author,
                        'price': price,
                        'image_url': image_url,
                        'description': description,
                        'publisher': publisher,
                        'categories': {
                            'origins': ['Trong nước'],
                            'genres': ['Văn học', 'Tiểu thuyết']  # Default genres
                        },
                        'stock': 50,
                        'soldCount': 0
                    }
                    
                    books.append(book)
                    print(f"  ✓ [{len(books)}/{limit}] {title[:50]}...")
                    
                except Exception as e:
                    print(f"  ⚠️  Error parsing book {idx + 1}: {str(e)}")
                    continue
            
            # Delay to avoid being blocked
            time.sleep(2)
            page += 1
            
        except requests.RequestException as e:
            print(f"❌ Error fetching page {page}: {str(e)}")
            break
        except Exception as e:
            print(f"❌ Unexpected error on page {page}: {str(e)}")
            break
    
    print(f"\n✅ Successfully scraped {len(books)} books!")
    return books[:limit]

def save_to_json(books, filename='fahasa_books.json'):
    """Save scraped books to JSON file"""
    os.makedirs(os.path.dirname(filename) if os.path.dirname(filename) else '.', exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Saved {len(books)} books to {filename}")

if __name__ == '__main__':
    # Scrape 100 books
    books_data = scrape_fahasa_books(limit=100)
    
    # Save to JSON
    output_file = 'fahasa_books.json'
    save_to_json(books_data, output_file)
    
    print(f"\n🎉 Done! Check {output_file} for results.")
