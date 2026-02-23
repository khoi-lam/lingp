import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryMenu = ({ isOpen, onClose }) => {
    const [categories, setCategories] = useState({ origin: [], genres: [] });
    const [activeMain, setActiveMain] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                const cats = res.data.data.categories;
                setCategories({
                    origin: cats.filter(c => c.type === 'origin'),
                    genres: cats.filter(c => c.type === 'genre')
                });
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className="relative w-full max-w-xs md:max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-right">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-vanxuan-dark uppercase tracking-widest">Danh mục sản phẩm</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Origin Section */}
                    <div className="p-6 border-b border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nhóm sản phẩm</p>
                        <div className="grid grid-cols-1 gap-1">
                            {categories.origin.map(cat => (
                                <Link
                                    key={cat._id}
                                    to={`/shop?origin=${cat._id}`}
                                    onClick={onClose}
                                    className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-vanxuan-red/5 hover:text-vanxuan-red transition-all group"
                                >
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-vanxuan-red/10 transition-all">
                                        <span className="text-lg font-bold text-gray-400 group-hover:text-vanxuan-red">{cat.name[0]}</span>
                                    </div>
                                    <span className="font-bold text-sm">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Genres Section */}
                    <div className="p-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Thể loại chi tiết</p>
                        <div className="grid grid-cols-1 gap-1">
                            {categories.genres.map(cat => (
                                <Link
                                    key={cat._id}
                                    to={`/shop?genre=${cat._id}`}
                                    onClick={onClose}
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all group"
                                >
                                    <span className="font-bold text-sm text-gray-600 group-hover:text-vanxuan-dark">{cat.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-vanxuan-red transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <Link
                        to="/shop"
                        onClick={onClose}
                        className="w-full py-4 bg-vanxuan-red text-white flex items-center justify-center rounded-2xl font-black shadow-xl shadow-vanxuan-red/20 hover:bg-vanxuan-red/90 transition-all active:scale-95"
                    >
                        Tất cả sản phẩm
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CategoryMenu;
