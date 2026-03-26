import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
    Search, Trash2, PlusCircle, X, Edit2, Check, RotateCw,
    ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Grid3X3,
    Film, Image as ImageIcon, Play, Pause, Volume2, VolumeX,
    Save
} from 'lucide-react';

// --- Media Type Detection ---
const getMediaType = (file) => {
    if (!file?.type) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'image';
    return 'image';
};

const Filter = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [direction, setDirection] = useState(0);

    // Edit mode state
    const [editingId, setEditingId] = useState(null);
    const [editInputs, setEditInputs] = useState({ title: "", num: "", desc: "", files: [] });

    // Transform states
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    
    // Video states
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [showThumbnails, setShowThumbnails] = useState(false);

    // Motion values for smooth zoom/pan
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scaleMotion = useMotionValue(1);
    
    const springConfig = { damping: 25, stiffness: 300 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);
    const scaleSpring = useSpring(scaleMotion, springConfig);

    const fileInputRef = useRef(null);
    const editFileInputRef = useRef(null);
    const videoRef = useRef(null);
    const progressInterval = useRef(null);

    const [inputs, setInputs] = useState({
        title: "",
        num: "",
        desc: "",
        files: []
    });

    // LOAD DATA
    useEffect(() => {
        const saved = localStorage.getItem("gallery_files");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                console.error("Error parsing gallery data", e);
                setData([]);
            }
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, []);

    // --- Transform Controls ---
    const resetTransform = useCallback(() => {
        setRotation(0);
        setScale(1);
        scaleMotion.set(1);
        x.set(0);
        y.set(0);
    }, [scaleMotion, x, y]);

    const resetVideoState = useCallback(() => {
        setIsPlaying(false);
        setVideoProgress(0);
        setVideoDuration(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, []);

    const closeLightbox = useCallback(() => {
        setSelectedGallery(null);
        setCurrentImgIdx(0);
        setShowThumbnails(false);
        resetTransform();
        resetVideoState();
    }, [resetTransform, resetVideoState]);

    // --- Navigation ---
    const nextImg = useCallback((e) => {
        e?.stopPropagation();
        if (!selectedGallery?.length) return;
        
        setDirection(1);
        setCurrentImgIdx(prev => (prev + 1) % selectedGallery.length);
        resetTransform();
        resetVideoState();
    }, [selectedGallery, resetTransform, resetVideoState]);

    const prevImg = useCallback((e) => {
        e?.stopPropagation();
        if (!selectedGallery?.length) return;
        
        setDirection(-1);
        setCurrentImgIdx(prev => (prev === 0 ? selectedGallery.length - 1 : prev - 1));
        resetTransform();
        resetVideoState();
    }, [selectedGallery, resetTransform, resetVideoState]);

    const goToImage = useCallback((index) => {
        setDirection(index > currentImgIdx ? 1 : -1);
        setCurrentImgIdx(index);
        resetTransform();
        resetVideoState();
    }, [currentImgIdx, resetTransform, resetVideoState]);

    // --- Video Controls ---
    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(() => {});
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const handleVideoTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setVideoProgress(videoRef.current.currentTime);
            setVideoDuration(videoRef.current.duration || 0);
        }
    }, []);

    const handleSeek = useCallback((e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setVideoProgress(time);
        }
    }, []);

    const handleVideoLoaded = useCallback(() => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration || 0);
        }
    }, []);

    // --- Keyboard Control ---
    useEffect(() => {
        if (!selectedGallery) return;
        
        const handleKey = (e) => {
            const currentMedia = selectedGallery[currentImgIdx];
            const isVideo = currentMedia?.type?.startsWith('video');
            
            switch(e.key) {
                case "ArrowRight":
                    e.preventDefault();
                    nextImg();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    prevImg();
                    break;
                case "Escape":
                    closeLightbox();
                    break;
                case " ":
                    if (isVideo) {
                        e.preventDefault();
                        togglePlay();
                    } else {
                        setShowThumbnails(prev => !prev);
                    }
                    break;
                case "m":
                case "M":
                    if (isVideo) toggleMute();
                    break;
                case "r":
                case "R":
                    if (!isVideo) setRotation(r => (r + 90) % 360);
                    break;
                case "0":
                    if (!isVideo) resetTransform();
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [selectedGallery, currentImgIdx, nextImg, prevImg, closeLightbox, togglePlay, toggleMute, resetTransform]);

    // --- Open Lightbox ---
    const openLightbox = useCallback((files, index) => {
        if (!files?.length) return;
        setSelectedGallery(files);
        setCurrentImgIdx(index);
        resetTransform();
        resetVideoState();
    }, [resetTransform, resetVideoState]);

    // --- Zoom Handlers ---
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(scale * delta, 0.5), 5);
        setScale(newScale);
        scaleMotion.set(newScale);
    }, [scale, scaleMotion]);

    const handleDoubleClick = useCallback((e) => {
        e.stopPropagation();
        if (scale > 1) {
            resetTransform();
        } else {
            setScale(2.5);
            scaleMotion.set(2.5);
        }
    }, [scale, resetTransform, scaleMotion]);

    const handleZoomIn = useCallback(() => {
        const newScale = Math.min(scale + 0.5, 5);
        setScale(newScale);
        scaleMotion.set(newScale);
    }, [scale, scaleMotion]);

    const handleZoomOut = useCallback(() => {
        const newScale = Math.max(scale - 0.5, 0.5);
        setScale(newScale);
        scaleMotion.set(newScale);
    }, [scale, scaleMotion]);

    const rotateImg = useCallback(() => {
        setRotation(prev => (prev + 90) % 360);
    }, []);

    // --- Drag Constraints ---
    const dragConstraints = useMemo(() => {
        if (scale <= 1) return { left: 0, right: 0, top: 0, bottom: 0 };
        const range = 500 * (scale - 1);
        return { left: -range, right: range, top: -range, bottom: -range };
    }, [scale]);

    // --- Form Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditInputs(prev => ({ ...prev, [name]: value }));
    };

    // File handling with unique IDs
    const processFiles = async (fileList) => {
        const files = Array.from(fileList);
        if (!files.length) return [];

        const filePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({
                    preview: reader.result,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                });
                reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
                reader.readAsDataURL(file);
            });
        });

        return await Promise.all(filePromises);
    };

    const fileHandler = async (e) => {
        try {
            const newFiles = await processFiles(e.target.files);
            setInputs(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
        } catch (error) {
            console.error("File processing error:", error);
            alert("Some files failed to load. Please try again.");
        }
    };

    const editFileHandler = async (e) => {
        try {
            const newFiles = await processFiles(e.target.files);
            setEditInputs(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
        } catch (error) {
            console.error("File processing error:", error);
            alert("Some files failed to load. Please try again.");
        }
    };

    const removeFileFromPreview = (index) => {
        setInputs(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const removeFileFromEdit = (index) => {
        setEditInputs(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputs.title.trim() || !inputs.num.trim() || inputs.files.length === 0) {
            return alert("Please provide a Title, ID, and at least one file.");
        }

        const newItem = { 
            ...inputs, 
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const updated = [newItem, ...data];

        setData(updated);
        localStorage.setItem("gallery_files", JSON.stringify(updated));
        setInputs({ title: "", num: "", desc: "", files: [] });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- Edit Functions ---
    const startEdit = (item) => {
        setEditingId(item.id);
        setEditInputs({
            title: item.title || "",
            num: item.num || "",
            desc: item.desc || "",
            files: [...(item.files || [])]
        });
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // const cancelEdit = () => {
    //     setEditingId(null);
    //     setEditInputs({ title: "", num: "", desc: "", files: [] });
    //     if (editFileInputRef.current) editFileInputRef.current.value = "";
    // };

    const saveEdit = (e) => {
        e.preventDefault();
        if (!editInputs.title.trim() || !editInputs.num.trim() || editInputs.files.length === 0) {
            return alert("Please provide a Title, ID, and at least one file.");
        }

        const updated = data.map(item => {
            if (item.id === editingId) {
                return {
                    ...item,
                    title: editInputs.title,
                    num: editInputs.num,
                    desc: editInputs.desc,
                    files: editInputs.files,
                    updatedAt: new Date().toISOString()
                };
            }
            return item;
        });

        setData(updated);
        localStorage.setItem("gallery_files", JSON.stringify(updated));
        setEditingId(null);
        setEditInputs({ title: "", num: "", desc: "", files: [] });
        if (editFileInputRef.current) editFileInputRef.current.value = "";
    };

    const deleteItem = (id) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;
        const updated = data.filter(item => item.id !== id);
        setData(updated);
        localStorage.setItem("gallery_files", JSON.stringify(updated));
        // Close lightbox if viewing deleted item
        if (selectedGallery && data.find(d => d.id === id)?.files === selectedGallery) {
            closeLightbox();
        }
    };

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const term = searchTerm.toLowerCase();
        return data.filter(item =>
            item.title?.toLowerCase().includes(term) ||
            item.num?.toLowerCase().includes(term) ||
            item.desc?.toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    // --- Current Media ---
    const currentMedia = selectedGallery?.[currentImgIdx];
    const isVideo = currentMedia?.type?.startsWith('video');
    const isImage = !isVideo;

    // Format time
    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Animation variants
    const lightboxVariants = {
        hidden: { opacity: 0, backdropFilter: "blur(0px)" },
        visible: { opacity: 1, backdropFilter: "blur(20px)", transition: { duration: 0.3 } },
        exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.2 } }
    };

    const imageVariants = {
        enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0, scale: 0.9 }),
        center: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0, scale: 0.9, transition: { duration: 0.2 } })
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10 font-sans">

            {/* SEARCH */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center bg-slate-900 rounded-xl p-3 border border-slate-800 focus-within:border-blue-500 transition-colors shadow-lg"
            >
                <Search className="mr-3 text-slate-400" size={20} />
                <input
                    className="bg-transparent outline-none w-full text-lg"
                    placeholder="Search by title, ID, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-white">
                        <X size={18} />
                    </button>
                )}
            </motion.div>

            {/* LIGHTBOX */}
            <AnimatePresence mode="wait">
                {selectedGallery && currentMedia && (
                    <motion.div
                        variants={lightboxVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/95 z-[100] flex flex-col"
                        onClick={(e) => e.target === e.currentTarget && closeLightbox()}
                    >
                        {/* Toolbar */}
                        <motion.div 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-white/60 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                                    {isVideo ? <Film size={14} /> : <ImageIcon size={14} />}
                                    {currentImgIdx + 1} / {selectedGallery.length}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {!isVideo && (
                                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1">
                                        <button onClick={handleZoomOut} disabled={scale <= 0.5} className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30">
                                            <ZoomOut size={18} />
                                        </button>
                                        <span className="text-xs w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
                                        <button onClick={handleZoomIn} disabled={scale >= 5} className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30">
                                            <ZoomIn size={18} />
                                        </button>
                                    </div>
                                )}

                                {!isVideo && (
                                    <button onClick={rotateImg} className="p-2 hover:bg-white/20 rounded-full transition bg-white/10 backdrop-blur-md">
                                        <RotateCw size={18} />
                                    </button>
                                )}

                                <button onClick={() => setShowThumbnails(!showThumbnails)} className={`p-2 hover:bg-white/20 rounded-full transition bg-white/10 backdrop-blur-md ${showThumbnails ? 'bg-white/30' : ''}`}>
                                    <Grid3X3 size={18} />
                                </button>

                                <button onClick={closeLightbox} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition bg-white/10 backdrop-blur-md ml-2">
                                    <X size={18} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4 md:p-20">
                            <button onClick={prevImg} className="absolute left-4 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all hover:scale-110 active:scale-95">
                                <ChevronLeft size={28} />
                            </button>

                            <button onClick={nextImg} className="absolute right-4 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all hover:scale-110 active:scale-95">
                                <ChevronRight size={28} />
                            </button>

                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentImgIdx}
                                    custom={direction}
                                    variants={imageVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="relative max-h-full max-w-full flex items-center justify-center"
                                    onWheel={isImage ? handleWheel : undefined}
                                >
                                    {isVideo ? (
                                        <div className="relative max-w-[90vw] max-h-[80vh]">
                                            <video
                                                ref={videoRef}
                                                src={currentMedia.preview}
                                                poster={currentMedia.poster}
                                                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                                                onTimeUpdate={handleVideoTimeUpdate}
                                                onLoadedMetadata={handleVideoLoaded}
                                                onEnded={() => setIsPlaying(false)}
                                                playsInline
                                                muted={isMuted}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-xs text-white/60 tabular-nums w-10">{formatTime(videoProgress)}</span>
                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={videoDuration || 100}
                                                        value={videoProgress}
                                                        onChange={handleSeek}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                                    />
                                                    <span className="text-xs text-white/60 tabular-nums w-10">{formatTime(videoDuration)}</span>
                                                </div>
                                                
                                                <div className="flex items-center justify-center gap-4">
                                                    <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition backdrop-blur-sm">
                                                        {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                                                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {!isPlaying && (
                                                <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
                                                        <Play size={32} fill="white" className="ml-2" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <motion.img
                                            src={currentMedia.preview}
                                            alt={currentMedia.name || "Gallery image"}
                                            drag={scale > 1}
                                            dragConstraints={dragConstraints}
                                            dragElastic={0.1}
                                            onDoubleClick={handleDoubleClick}
                                            style={{ x: xSpring, y: ySpring, scale: scaleSpring, rotate: rotation, cursor: scale > 1 ? "grab" : "zoom-in" }}
                                            whileDrag={{ cursor: "grabbing" }}
                                            className="max-h-[80vh] max-w-[90vw] object-contain select-none shadow-2xl rounded-lg"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs flex gap-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full pointer-events-none">
                                {isVideo ? (
                                    <><span>Space to play/pause</span><span>•</span><span>M to mute</span></>
                                ) : (
                                    <><span>Scroll to zoom</span><span>•</span><span>Drag to pan</span></>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <AnimatePresence>
                            {showThumbnails && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    className="h-24 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center gap-2 px-4 overflow-x-auto scrollbar-hide"
                                >
                                    {selectedGallery.map((file, idx) => {
                                        const isVideoThumb = file.type?.startsWith('video');
                                        return (
                                            <motion.button
                                                key={file.id || idx}
                                                onClick={() => goToImage(idx)}
                                                className={`relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden transition-all ${idx === currentImgIdx ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-50 hover:opacity-80'}`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {isVideoThumb ? (
                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                        <video src={file.preview} className="w-full h-full object-cover opacity-80" />
                                                        <div className="absolute inset-0 flex items-center justify-center"><Play size={14} className="text-white" fill="white" /></div>
                                                    </div>
                                                ) : (
                                                    <img src={file.preview} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ADD NEW ENTRY FORM */}
            {!editingId && (
                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit} 
                    className="mb-10 bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl space-y-4 border border-slate-800 shadow-xl"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PlusCircle size={24} className="text-blue-500" />
                        Add New Entry
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Title *</label>
                            <input name="title" value={inputs.title} onChange={handleChange} placeholder="Enter title" className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-blue-500 outline-none transition-colors" required />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Record ID *</label>
                            <input name="num" value={inputs.num} onChange={handleChange} placeholder="e.g. 001" className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-blue-500 outline-none transition-colors" required />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Description</label>
                        <textarea name="desc" value={inputs.desc} onChange={handleChange} placeholder="Optional description..." className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-blue-500 outline-none h-24 transition-colors resize-none" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-slate-400">Upload Media (Images & Videos):</label>
                        <input type="file" multiple accept="image/*,video/*" ref={fileInputRef} onChange={fileHandler} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-colors" />
                    </div>

                    {inputs.files.length > 0 && (
                        <div className="flex gap-3 flex-wrap p-3 bg-slate-800/50 rounded-lg">
                            {inputs.files.map((f, i) => (
                                <div key={f.id || i} className="relative group">
                                    {f.type?.startsWith('video') ? (
                                        <div className="relative w-20 h-20">
                                            <video src={f.preview} className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"><Play size={16} className="text-white" fill="white" /></div>
                                        </div>
                                    ) : (
                                        <img src={f.preview} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
                                    )}
                                    <button onClick={() => removeFileFromPreview(i)} type="button" className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" disabled={!inputs.title || !inputs.num || inputs.files.length === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg">
                        <PlusCircle size={18} /> Save Entry
                    </button>
                </motion.form>
            )}

            {/* EDIT FORM */}
            {editingId && (
                <motion.form 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={saveEdit} 
                    className="mb-10 bg-amber-900/20 backdrop-blur-sm p-6 rounded-2xl space-y-4 border border-amber-700/50 shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
                            <Edit2 size={24} />
                            Edit Entry
                        </h2>
                        {/* <button type="button" onClick={cancelEdit} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm">
                            <Cancel size={16} /> Cancel
                        </button> */}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Title *</label>
                            <input name="title" value={editInputs.title} onChange={handleEditChange} placeholder="Enter title" className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-amber-500 outline-none transition-colors" required />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Record ID *</label>
                            <input name="num" value={editInputs.num} onChange={handleEditChange} placeholder="e.g. 001" className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-amber-500 outline-none transition-colors" required />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Description</label>
                        <textarea name="desc" value={editInputs.desc} onChange={handleEditChange} placeholder="Optional description..." className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-amber-500 outline-none h-24 transition-colors resize-none" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-slate-400">Add More Files:</label>
                        <input type="file" multiple accept="image/*,video/*" ref={editFileInputRef} onChange={editFileHandler} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 file:transition-colors" />
                    </div>

                    {editInputs.files.length > 0 && (
                        <div className="flex gap-3 flex-wrap p-3 bg-slate-800/50 rounded-lg">
                            {editInputs.files.map((f, i) => (
                                <div key={f.id || i} className="relative group">
                                    {f.type?.startsWith('video') ? (
                                        <div className="relative w-20 h-20">
                                            <video src={f.preview} className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"><Play size={16} className="text-white" fill="white" /></div>
                                        </div>
                                    ) : (
                                        <img src={f.preview} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
                                    )}
                                    <button onClick={() => removeFileFromEdit(i)} type="button" className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 transition-colors px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg flex-1">
                            <Save size={18} /> Save Changes
                        </button>
                        {/* <button type="button" onClick={cancelEdit} className="bg-slate-700 hover:bg-slate-600 transition-colors px-6 py-3 rounded-lg flex items-center gap-2 font-medium">
                            <X size={18} /> Cancel
                        </button> */}
                    </div>
                </motion.form>
            )}

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                    <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all group shadow-lg ${editingId === item.id ? 'ring-2 ring-amber-500 border-amber-700/50' : 'border-slate-800 hover:border-slate-600'}`}
                    >
                        <div className="grid grid-cols-2 gap-1 bg-slate-800 p-1">
                            {item.files.slice(0, 4).map((f, i) => {
                                const isVideoFile = f.type?.startsWith('video');
                                return (
                                    <div key={f.id || i} onClick={() => openLightbox(item.files, i)} className="cursor-pointer overflow-hidden aspect-square relative group/media">
                                        {isVideoFile ? (
                                            <div className="relative w-full h-full">
                                                <video src={f.preview} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/media:bg-black/40 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                        <Play size={14} className="text-white ml-0.5" fill="white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <img src={f.preview} alt="item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                        )}
                                        {i === 3 && item.files.length > 4 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-sm font-bold">+{item.files.length - 4} More</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-slate-100 truncate pr-2" title={item.title}>{item.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">ID: {item.num}</p>
                                </div>
                            </div>
                            
                            {item.desc && <p className="text-xs text-slate-400 mb-3 line-clamp-2">{item.desc}</p>}
                            
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => startEdit(item)}
                                    disabled={editingId !== null}
                                    className="flex-1 bg-slate-800 hover:bg-amber-600/20 hover:text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-all py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium border border-slate-700 hover:border-amber-500/30"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => deleteItem(item.id)}
                                    disabled={editingId !== null}
                                    className="flex-1 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-all py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium border border-slate-700 hover:border-red-500/30"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                            
                            {item.updatedAt && item.updatedAt !== item.createdAt && (
                                <p className="text-[10px] text-slate-600 mt-2 text-right">
                                    Edited {new Date(item.updatedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredItems.length === 0 && data.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-slate-500">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No entries found matching "{searchTerm}"</p>
                </motion.div>
            )}

            {data.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-slate-500">
                    <PlusCircle size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No entries yet. Add your first project above!</p>
                </motion.div>
            )}

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default Filter;