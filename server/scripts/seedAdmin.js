import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function seedAdmin() {
    const email = 'admin@lingoland.com';
    const password = 'admin123';
    const hashed = await bcrypt.hash(password, 10);

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        console.log('✅ Admin already exists, skipping.');
    } else {
        await pool.query(
            `INSERT INTO users (email, password, name, role, addresses, "isBlocked", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            [email, hashed, 'Admin', 'admin', '[]', false]
        );
        console.log('✅ Admin seeded: admin@lingoland.com / admin123');
    }

    await pool.end();
}

seedAdmin().catch(e => { console.error(e); process.exit(1); });
