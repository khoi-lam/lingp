import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const BASE = 'http://localhost:5000/api';
const R = [];
let token = '';

async function t(name, fn) {
    try { const r = await fn(); R.push([name, '✅', r]); }
    catch (e) { R.push([name, '❌', e.message]); }
}

const post = (url, body, auth) => fetch(BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: 'Bearer ' + token } : {}) },
    body: JSON.stringify(body)
}).then(r => r.json());

const get = (url, auth) => fetch(BASE + url, {
    headers: auth ? { Authorization: 'Bearer ' + token } : {}
}).then(r => r.json());

const put = (url, body) => fetch(BASE + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(body)
}).then(r => r.json());

// ─── CLEANUP ───
console.log('🧹 Cleaning up previous test data...');
const oldUser = await prisma.user.findUnique({ where: { email: 'test@test.com' } });
if (oldUser) {
    await prisma.supportTicket.deleteMany({ where: { userId: oldUser.id } });
    await prisma.orderItem.deleteMany({ where: { order: { userId: oldUser.id } } });
    await prisma.order.deleteMany({ where: { userId: oldUser.id } });
    await prisma.user.delete({ where: { id: oldUser.id } });
}
await prisma.category.deleteMany({ where: { name: { in: ['Test Cat', 'Updated Cat'] } } });
console.log('✅ Cleanup done\n');

// ═══════════════════════════════════════════
// AUTH & USER (1-7)
// ═══════════════════════════════════════════

await t('1. Register', async () => {
    const d = await post('/auth/register', { email: 'test@test.com', password: 'test123', name: 'Test User' });
    if (!d.success) throw Error(d.message);
    token = d.data.accessToken;
    return 'userId=' + d.data.user._id;
});

await t('2. Login', async () => {
    const d = await post('/auth/login', { email: 'test@test.com', password: 'test123' });
    if (!d.success) throw Error(d.message);
    token = d.data.accessToken;
    return 'OK';
});

await t('3. Get Profile', async () => {
    const d = await get('/user/profile', true);
    if (!d.success) throw Error(d.message);
    return `name=${d.data.user.name}, role=${d.data.user.role}`;
});

await t('4. Update Profile', async () => {
    const d = await put('/user/profile', { name: 'Updated User' });
    if (!d.success) throw Error(d.message);
    return `name=${d.data.user.name}`;
});

await t('5. Change Password', async () => {
    const d = await put('/user/change-password', { currentPassword: 'test123', newPassword: 'newpass123' });
    if (!d.success) throw Error(d.message);
    return d.message;
});

await t('6. Login New PW', async () => {
    const d = await post('/auth/login', { email: 'test@test.com', password: 'newpass123' });
    if (!d.success) throw Error(d.message);
    token = d.data.accessToken;
    return 'OK';
});

await t('7. Promote Admin', async () => {
    const d = await put('/user/promote-admin', {});
    if (!d.success) throw Error(d.message);
    // Re-login to get admin token
    const d2 = await post('/auth/login', { email: 'test@test.com', password: 'newpass123' });
    if (!d2.success) throw Error('Re-login failed: ' + d2.message);
    token = d2.data.accessToken;
    return `role=${d.data.user.role}`;
});

// ═══════════════════════════════════════════
// PUBLIC PAGES (8-17)
// ═══════════════════════════════════════════

await t('8. Get Books (paginated)', async () => {
    const d = await get('/books?page=1&limit=5');
    if (!d.success) throw Error('Failed');
    return `total=${d.data.pagination.total}, got=${d.data.books.length}, has_id=${!!d.data.books[0]._id}`;
});

await t('9. Filter genre=3-5-tuoi', async () => {
    const d = await get('/books?genre=3-5-tuoi');
    return `total=${d.data.pagination.total}`;
});

await t('10. Filter origin=lingoland', async () => {
    const d = await get('/books?genre=lingoland');
    return `total=${d.data.pagination.total}`;
});

await t('11. Search books', async () => {
    const d = await get('/books?search=ABC');
    return `total=${d.data.pagination.total}`;
});

await t('12. Sort -soldCount', async () => {
    const d = await get('/books?sort=-soldCount&limit=3');
    const c = d.data.books.map(b => b.soldCount);
    return `[${c}] desc=${c[0] >= c[1]}`;
});

await t('13. Book by ID', async () => {
    const d = await get('/books/1');
    if (!d.success) throw Error(d.message);
    return `title=${d.data.book.title}, _id=${d.data.book._id}`;
});

await t('14. Book by Slug', async () => {
    const d = await get('/books/slug/be-hoc-chu-cai-abc-fun');
    if (!d.success) throw Error(d.message);
    return `title=${d.data.book.title}`;
});

await t('15. Suggest', async () => {
    const d = await get('/books/suggest?q=Ph');
    return `count=${d.data.suggestions.length}`;
});

await t('16. Categories', async () => {
    const d = await get('/categories');
    return `count=${d.data.count}, has_id=${!!d.data.categories[0]._id}`;
});

await t('17. Categories type=genre', async () => {
    const d = await get('/categories?type=genre');
    return `count=${d.data.count}`;
});

// ═══════════════════════════════════════════
// SHOPPING (18-19)
// ═══════════════════════════════════════════

await t('18. Create Order', async () => {
    const d = await post('/orders', {
        items: [{ product: 1, title: 'Test', price: 89000, quantity: 2 }],
        totalAmount: 178000,
        shippingAddress: { fullName: 'Test User', phone: '0123456789', address: '123 Street', city: 'HCM' },
        paymentMethod: 'cod'
    }, true);
    if (!d.success) throw Error(d.message || JSON.stringify(d));
    return `orderId=${d.data.order._id}, status=${d.data.order.orderStatus}`;
});

await t('19. My Orders', async () => {
    const d = await get('/orders/my-orders', true);
    if (!d.success) throw Error(d.message);
    return `count=${d.data.orders.length}`;
});

// ═══════════════════════════════════════════
// ADMIN (20-27)
// ═══════════════════════════════════════════

await t('20. Dashboard Stats', async () => {
    const d = await get('/stats/dashboard', true);
    if (!d.success) throw Error(d.message);
    const s = d.data.stats;
    return `products=${s.totalProducts}, orders=${s.totalOrders}, users=${s.totalUsers}, revenue=${s.totalRevenue}`;
});

await t('21. Admin All Orders', async () => {
    const d = await get('/orders/admin/all', true);
    if (!d.success) throw Error(d.message || JSON.stringify(d));
    return `count=${d.data.orders.length}`;
});

await t('22. Admin Order Stats', async () => {
    const d = await get('/orders/admin/stats', true);
    if (!d.success) throw Error(d.message);
    return `total=${d.data.totalOrders}, revenue=${d.data.totalRevenue}`;
});

await t('23. Admin Users', async () => {
    const d = await get('/user/admin/all', true);
    if (!d.success) throw Error(d.message || JSON.stringify(d));
    return `count=${d.data.users.length}`;
});

await t('24. Create Category', async () => {
    const d = await post('/categories', { name: 'Test Cat', type: 'genre', description: 'test desc' }, true);
    if (!d.success) throw Error(d.message);
    return `id=${d.data.category._id}, slug=${d.data.category.slug}`;
});

await t('25. Update Category', async () => {
    const cats = await get('/categories');
    const id = cats.data.categories.find(c => c.name === 'Test Cat')?._id;
    if (!id) throw Error('Test Cat not found');
    const d = await put('/categories/' + id, { name: 'Updated Cat' });
    if (!d.success) throw Error(d.message);
    return `name=${d.data.category.name}, slug=${d.data.category.slug}`;
});

await t('26. Delete Category', async () => {
    const cats = await get('/categories');
    const id = cats.data.categories.find(c => c.name === 'Updated Cat')?._id;
    if (!id) throw Error('Updated Cat not found');
    const r = await fetch(BASE + '/categories/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
    const d = await r.json();
    if (!d.success) throw Error(d.message);
    return d.message;
});

await t('27. Update Order Status', async () => {
    const orders = await get('/orders/admin/all', true);
    const orderId = orders.data.orders[0]?._id;
    if (!orderId) throw Error('No order found');
    const d = await put('/orders/' + orderId + '/status', { status: 'shipping' });
    if (!d.success) throw Error(d.message);
    return `status=${d.data.order.orderStatus}`;
});

// ═══════════════════════════════════════════
// OTHER (28-33)
// ═══════════════════════════════════════════

await t('28. Search API', async () => {
    const d = await get('/search?q=phieu+luu');
    return `type=${d.data.searchType}, count=${d.data.count}`;
});

await t('29. Settings GET', async () => {
    const d = await get('/settings', true);
    return `keys=${Object.keys(d.data.settings).length}`;
});

await t('30. Settings UPDATE', async () => {
    const d = await put('/settings', { bankName: 'Test Bank' });
    if (!d.success) throw Error(d.message);
    return d.message;
});

await t('31. Support Create', async () => {
    const d = await post('/support', { type: 'support', title: 'Test ticket', content: 'Test content' }, true);
    if (!d.success) throw Error(d.message || JSON.stringify(d));
    return `id=${d.data.request._id}`;
});

await t('32. Support List', async () => {
    const d = await get('/support', true);
    if (!d.success) throw Error(d.message);
    return `count=${d.data.requests.length}`;
});

await t('33. Recommendations', async () => {
    const d = await get('/recommendations/books/2/ai-recommendations');
    if (!d.success) throw Error(d.message);
    return `count=${d.data.count}, target=${d.data.targetBook.title}`;
});

await t('34. Health', async () => {
    const d = await fetch('http://localhost:5000/health').then(r => r.json());
    return d.message;
});

// ═══════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════
console.log('\n══════════════════════════════════════════');
console.log('  FULL TEST RESULTS');
console.log('══════════════════════════════════════════\n');
const passed = R.filter(r => r[1] === '✅').length;
const failed = R.filter(r => r[1] === '❌').length;

R.forEach(r => console.log(`${r[1]} ${r[0]}: ${r[2]}`));

console.log(`\n──────────────────────────────────────────`);
console.log(`  ${passed}/${R.length} passed, ${failed} failed`);
console.log(`──────────────────────────────────────────`);

await prisma.$disconnect();
pool.end();
process.exit(failed > 0 ? 1 : 0);
