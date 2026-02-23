import { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder, disabled, labelKey = 'name', valueKey = 'code' }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);
    const inputRef = useRef(null);

    const selected = options.find(o => String(o[valueKey]) === String(value));
    const filtered = search
        ? options.filter(o => o[labelKey].toLowerCase().includes(search.toLowerCase()))
        : options;

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);
    useEffect(() => { if (!open) setSearch(''); }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(o => !o)}
                className={`w-full rounded-2xl border border-gray-200 bg-[#FAF5EB] py-3 px-4 pr-10 text-left focus:border-[#4CAF50] focus:ring-[#4CAF50] focus:outline-none disabled:opacity-50 ${selected ? 'text-[#2B3A67]' : 'text-gray-400'}`}
            >
                {selected ? selected[labelKey] : placeholder}
            </button>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">
                {open ? 'expand_less' : 'expand_more'}
            </span>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg">search</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 border-none focus:outline-none focus:ring-1 focus:ring-[#4CAF50] text-sm text-[#2B3A67]"
                            />
                        </div>
                    </div>

                    {/* Options list */}
                    <div className="max-h-48 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-400 text-center">Không tìm thấy kết quả</p>
                        ) : (
                            filtered.map(o => (
                                <button
                                    key={o[valueKey]}
                                    type="button"
                                    onClick={() => { onChange(String(o[valueKey])); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#E8F5E9] transition-colors ${String(o[valueKey]) === String(value) ? 'bg-[#E8F5E9] text-[#2E7D32] font-bold' : 'text-[#2B3A67]'}`}
                                >
                                    {o[labelKey]}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
