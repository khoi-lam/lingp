import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    addresses: user.addresses,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { name, addresses } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        if (name) user.name = name.trim();
        if (addresses) user.addresses = addresses;

        await user.save();

        res.json({
            success: true,
            message: 'Cập nhật profile thành công',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    addresses: user.addresses
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/user/password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            });
        }

        const user = await User.findById(req.user.userId).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Promote user to admin (TEMPORARY - for first admin setup)
// @route   PUT /api/user/promote-admin
// @access  Private
export const promoteToAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        // Update role to admin
        user.role = 'admin';
        await user.save();

        res.json({
            success: true,
            message: 'Đã promote thành admin thành công',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
