import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UploadCloud, Trash2, PlusCircle, X, ChevronLeft, ChevronRight, ZoomIn, RotateCw } from 'lucide-react';

const Filter = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // States for Lightbox
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1); // 🔥 New state for Zoom

    const [inputs, setInputs] = useState({
        title: "",
        num: "",
        desc: "",
        files: []
    });

    // Handle Zoom with Mouse Wheel
    const handleWheel = (e) => {
        if (!selectedGallery) return;
        if (e.deltaY < 0) {
            setScale(prev => Math.min(prev + 0.2, 4)); // Max zoom 4x
        } else {
            setScale(prev => Math.max(prev - 0.2, 0.5)); // Min zoom 0.5x
        }
    };

    const openLightbox = (files, index) => {
        setSelectedGallery(files);
        setCurrentImgIdx(index);
        setRotation(0);
        setScale(1); // Reset zoom
    };

    const closeLightbox = () => {
        setSelectedGallery(null);
        setRotation(0);
        setScale(1);
    };

    const nextImg = () => {
        setCurrentImgIdx(prev => (prev < selectedGallery.length - 1 ? prev + 1 : 0));
        setRotation(0);
        setScale(1);
    };

    const prevImg = () => {
        setCurrentImgIdx(prev => (prev > 0 ? prev - 1 : selectedGallery.length - 1));
        setRotation(0);
        setScale(1);
    };

    // Rest of your standard handlers...
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const fileHandler = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({ preview: URL.createObjectURL(file) }));
        setInputs(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputs.title || !inputs.num || !inputs.desc || inputs.files.length === 0) return alert("Missing fields");
        setData(prev => [{ ...inputs, id: Date.now() }, ...prev]);
        setInputs({ title: "", num: "", desc: "", files: [] });
    };

    const deleteItem = (id) => setData(prev => prev.filter(item => item.id !== id));

    const filteredItems = data.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.num.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10 font-sans">

            {/* 🔥 ADVANCED LIGHTBOX: ZOOM + ROTATE */}
            <AnimatePresence>
                {selectedGallery && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-xl"
                        onWheel={handleWheel} // Attach zoom to wheel
                    >
                        {/* Top Bar Controls */}
                        <div className="absolute top-6 w-full px-10 flex justify-between items-center z-[110]">
                            <div className="flex gap-4 items-center bg-white/5 p-2 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 px-3 border-r border-white/10 text-slate-400">
                                    <RotateCw size={16} /> <span className="text-xs font-bold">{rotation}°</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 text-slate-400">
                                    <ZoomIn size={16} /> <span className="text-xs font-bold">{Math.round(scale * 100)}%</span>
                                </div>
                            </div>

                            <button onClick={closeLightbox} className="p-3 bg-white/10 hover:bg-red-500 rounded-full transition-all">
                                <X size={28} />
                            </button>
                        </div>

                        {/* Instruction Tag */}
                        <p className="absolute bottom-32 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                            Click to Rotate • Scroll to Zoom • Drag to Pan
                        </p>

                        <div className="relative w-full max-w-5xl h-[65vh] flex items-center justify-center">
                            {/* Navigation */}
                            <button onClick={prevImg} className="absolute -left-12 lg:-left-20 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all z-50">
                                <ChevronLeft size={40} />
                            </button>

                            {/* THE IMAGE CONTAINER */}
                            <div className="relative cursor-move overflow-hidden w-full h-full flex items-center justify-center">
                                <motion.img
                                    key={currentImgIdx}
                                    src={selectedGallery[currentImgIdx].preview}
                                    animate={{
                                        rotate: rotation,
                                        scale: scale
                                    }}
                                    drag={scale > 1} // Only allow dragging if zoomed in
                                    dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    onClick={() => setRotation(prev => prev + 90)}
                                    className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
                                />
                            </div>

                            <button onClick={nextImg} className="absolute -right-12 lg:-right-20 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all z-50">
                                <ChevronRight size={40} />
                            </button>
                        </div>

                        {/* Thumbnail Navigation */}
                        <div className="mt-10 flex gap-3 overflow-x-auto max-w-3xl p-4 no-scrollbar">
                            {selectedGallery.map((img, i) => (
                                <img
                                    key={i}
                                    src={img.preview}
                                    onClick={() => { setCurrentImgIdx(i); setRotation(0); setScale(1); }}
                                    className={`h-14 w-14 shrink-0 object-cover rounded-xl cursor-pointer border-2 transition-all ${currentImgIdx === i ? 'border-indigo-500 scale-110' : 'border-transparent opacity-30'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
                {/* Form and List code remains exactly the same as previous version */}
                {/* ... (Copy-paste the Form Sidebar and Asset List from the previous code block) ... */}

                {/* Simplified Sidebar for context */}
                <div className="w-full lg:w-[380px] shrink-0">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PlusCircle /> Add Asset</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="title" value={inputs.title} onChange={handleChange} placeholder="Title" className="w-full p-4 rounded-xl bg-slate-800 outline-none" />
                            <input name="num" value={inputs.num} onChange={handleChange} placeholder="ID" className="w-full p-4 rounded-xl bg-slate-800 outline-none" />
                            <textarea name="desc" value={inputs.desc} onChange={handleChange} placeholder="Desc" className="w-full p-4 rounded-xl bg-slate-800 outline-none" />
                            <div className="border-2 border-dashed border-slate-700 p-6 rounded-xl text-center relative">
                                <input type="file" multiple onChange={fileHandler} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <UploadCloud className="mx-auto text-slate-500" />
                            </div>
                            <button className="w-full bg-indigo-600 p-4 rounded-xl font-bold">Submit</button>
                        </form>
                    </div>
                </div>

                <div className="flex-1">
                    <input type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-5 rounded-2xl bg-slate-900 border border-slate-800 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 group">
                                <div className="h-60 bg-slate-950 grid grid-cols-2 gap-0.5">
                                    {item.files.slice(0, 4).map((img, i) => (
                                        <div key={i} onClick={() => openLightbox(item.files, i)} className="cursor-zoom-in overflow-hidden relative">
                                            <img src={img.preview} className="h-full w-full object-cover rotate-90 " />
                                            {i === 3 && item.files.length > 4 && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xl font-bold">+{item.files.length - 4}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;