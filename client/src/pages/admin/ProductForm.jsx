import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        description: '',
        price: '',
        stockQuantity: '',
        origin: '',
        genres: []
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState({ origins: [], genres: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
        if (isEdit) {
            loadProduct();
        }
    }, [id]);

    const loadCategories = async () => {
        try {
            const [originsRes, genresRes] = await Promise.all([
                categoryService.getCategories('origin'),
                categoryService.getCategories('genre')
            ]);
            setCategories({
                origins: originsRes.data.categories,
                genres: genresRes.data.categories
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadProduct = async () => {
        try {
            const response = await bookService.getBookById(id);
            const book = response.data.book;
            setFormData({
                title: book.title,
                author: book.author,
                publisher: book.publisher || '',
                isbn: book.isbn || '',
                description: book.description || '',
                price: book.price,
                stockQuantity: book.stockQuantity,
                origin: book.categories?.origin?._id || '',
                genres: book.categories?.genres?.map((g) => g._id) || []
            });
        } catch (error) {
            console.error('Error loading product:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('author', formData.author);
            data.append('publisher', formData.publisher);
            data.append('isbn', formData.isbn);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stockQuantity', formData.stockQuantity);
            data.append('origin', formData.origin);
            data.append('genres', JSON.stringify(formData.genres));

            // Append images
            images.forEach((image) => {
                data.append('images', image);
            });

            if (isEdit) {
                await bookService.updateBook(id, data);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await bookService.createBook(data);
                alert('Tạo sản phẩm thành công!');
            }

            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleGenreToggle = (genreId) => {
        setFormData({
            ...formData,
            genres: formData.genres.includes(genreId)
                ? formData.genres.filter((id) => id !== genreId)
                : [...formData.genres, genreId]
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <h2 className="text-2xl font-semibold mb-6">
                    {isEdit ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
                </h2>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sách *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tác giả *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhà xuất bản
                            </label>
                            <input
                                type="text"
                                value={formData.publisher}
                                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ISBN
                            </label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượng
                            </label>
                            <input
                                type="number"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xuất xứ
                        </label>
                        <select
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">-- Chọn xuất xứ --</option>
                            {categories.origins.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thể loại
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.genres.map((genre) => (
                                <label key={genre._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.genres.includes(genre._id)}
                                        onChange={() => handleGenreToggle(genre._id)}
                                        className="mr-2"
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hình ảnh
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        {images.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-vanxuan-red text-white rounded-xl font-bold hover:bg-vanxuan-red/90 transition-all shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ProductForm;
