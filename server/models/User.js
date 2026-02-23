import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email là bắt buộc'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
        },
        password: {
            type: String,
            required: [true, 'Mật khẩu là bắt buộc'],
            minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
        },
        name: {
            type: String,
            required: [true, 'Tên là bắt buộc'],
            trim: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        addresses: [
            {
                street: String,
                city: String,
                province: String,
                zipCode: String,
                isDefault: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
