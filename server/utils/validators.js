export const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateRegisterInput = (email, password, name) => {
    const errors = [];

    if (!email || !validateEmail(email)) {
        errors.push('Email không hợp lệ');
    }

    if (!password || !validatePassword(password)) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    if (!name || name.trim().length === 0) {
        errors.push('Tên là bắt buộc');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateLoginInput = (email, password) => {
    const errors = [];

    if (!email || !validateEmail(email)) {
        errors.push('Email không hợp lệ');
    }

    if (!password) {
        errors.push('Mật khẩu là bắt buộc');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
