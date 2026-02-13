// Tự động detect backend URL dựa trên hostname hiện tại
const getBackendUrl = () => {
    // Nếu có biến môi trường VITE_API_URL thì dùng
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Nếu đang chạy trên localhost (dev mode)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }

    // Nếu đang truy cập từ máy khác qua IP, dùng IP đó với port 5000
    return `http://${window.location.hostname}:5000`;
};

export const API_BASE_URL = getBackendUrl();
export const API_URL = `${API_BASE_URL}/api`;

export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x600?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    // Ensure the path starts with /
    const sanitizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${sanitizedPath}`;
};
