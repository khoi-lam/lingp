import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

dotenv.config();

const createSampleOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get admin user
        const admin = await User.findOne({ email: 'final_admin@gmail.com' });
        if (!admin) {
            console.log('Admin user not found');
            process.exit(1);
        }

        // Get some books
        const books = await Book.find().limit(5);
        if (books.length === 0) {
            console.log('No books found');
            process.exit(1);
        }

        // Create sample orders with different dates
        const orders = [];
        const statuses = ['completed', 'delivered'];

        for (let i = 0; i < 10; i++) {
            const randomBooks = books.slice(0, Math.floor(Math.random() * 3) + 1);
            const items = randomBooks.map(book => ({
                product: book._id,
                title: book.title,
                quantity: Math.floor(Math.random() * 3) + 1,
                price: book.price
            }));

            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Create orders from the past 30 days
            const daysAgo = Math.floor(Math.random() * 30);
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - daysAgo);

            const order = await Order.create({
                user: admin._id,
                items,
                totalAmount,
                shippingAddress: {
                    fullName: 'Nguyễn Văn A',
                    phone: '0123456789',
                    address: '123 Đường ABC',
                    city: 'Hồ Chí Minh'
                },
                paymentMethod: 'cod',
                paymentStatus: 'paid',
                orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: orderDate,
                updatedAt: orderDate
            });

            orders.push(order);
            console.log(`Created order ${i + 1}: #${order._id.toString().slice(-6)} - ${totalAmount.toLocaleString()}đ - ${order.orderStatus}`);
        }

        console.log(`\n✅ Created ${orders.length} sample orders successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createSampleOrders();
