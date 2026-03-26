import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Grid3X3,
  Film,
  Image as ImageIcon,
  ExternalLink,
  Search
} from "lucide-react";

// --- Media Type Detection ---
const getMediaType = (file) => {
  if (!file) return 'unknown';
  
  // Check explicit type
  if (file.type?.startsWith('video/')) return 'video';
  if (file.type?.startsWith('image/')) return 'image';
  
  // Check URL patterns
  const url = file.preview || file.src || file.url || '';
  const ext = url.split('.').pop()?.toLowerCase();
  
  // Video extensions
  if (['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi'].includes(ext)) return 'video';
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  
  // Vimeo
  if (url.includes('vimeo.com')) return 'vimeo';
  
  // Image extensions
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
  
  // Default to image if has preview
  return file.preview ? 'image' : 'unknown';
};

// Extract YouTube ID
const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Extract Vimeo ID
const getVimeoID = (url) => {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const Projects = () => {
  const [media, setMedia] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [direction, setDirection] = useState(0);

  // Transform states for images
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  
  // Video states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleMotion = useMotionValue(1);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  const scaleSpring = useSpring(scaleMotion, springConfig);

  const lightboxRef = useRef(null);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  // --- Data Loading ---
  useEffect(() => {
    const stored = localStorage.getItem("gallery_files");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = Array.isArray(parsed) ? parsed : [parsed];
        
        // Normalize and detect media types
        const withTypes = normalized.map((item, idx) => ({
          ...item,
          id: item.id || `project-${idx}`,
          files: item.files?.map((f, fidx) => {
            const type = getMediaType(f);
            return {
              ...f,
              id: f.id || `file-${idx}-${fidx}`,
              mediaType: type,
              // Extract video IDs for embeds
              youtubeId: type === 'youtube' ? getYouTubeID(f.preview || f.src) : null,
              vimeoId: type === 'vimeo' ? getVimeoID(f.preview || f.src) : null,
            };
          }) || []
        }));
        
        setMedia(withTypes);
      } catch (e) {
        console.error("Error parsing gallery data", e);
        setMedia([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Cleanup video progress interval
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
    setCurrentImgIdx((prev) => (prev + 1) % selectedGallery.length);
    resetTransform();
    resetVideoState();
  }, [selectedGallery, resetTransform, resetVideoState]);

  const prevImg = useCallback((e) => {
    e?.stopPropagation();
    if (!selectedGallery?.length) return;
    
    setDirection(-1);
    setCurrentImgIdx((prev) => 
      prev === 0 ? selectedGallery.length - 1 : prev - 1
    );
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
        videoRef.current.play();
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
      // Auto-play muted videos
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked, keep paused
      });
    }
  }, []);

  // --- Keyboard Support ---
  useEffect(() => {
    if (!selectedGallery) return;
    
    const handleKey = (e) => {
      const currentMedia = selectedGallery[currentImgIdx];
      const isVideo = currentMedia?.mediaType === 'video';
      
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
        case "f":
        case "F":
          if (!document.fullscreenElement) {
            lightboxRef.current?.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
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

  // --- Zoom Handlers (Images only) ---
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
    return {
      left: -range,
      right: range,
      top: -range,
      bottom: range
    };
  }, [scale]);

  // --- Preload ---
  useEffect(() => {
    if (!selectedGallery?.length) return;
    
    const preloadIndices = [
      (currentImgIdx + 1) % selectedGallery.length,
      (currentImgIdx - 1 + selectedGallery.length) % selectedGallery.length
    ];
    
    preloadIndices.forEach(idx => {
      const media = selectedGallery[idx];
      if (media?.mediaType === 'image') {
        const img = new Image();
        img.src = media.preview;
      }
    });
  }, [currentImgIdx, selectedGallery]);

  // --- Search Filter ---
  const filteredMedia = useMemo(() => {
    if (!searchTerm.trim()) return media;
    const term = searchTerm.toLowerCase();
    return media.filter(project => 
      project.title?.toLowerCase().includes(term) ||
      project.files?.some(f => f.name?.toLowerCase().includes(term))
    );
  }, [media, searchTerm]);

  const currentMedia = selectedGallery?.[currentImgIdx];
  const currentProject = media.find(p => p.files === selectedGallery);
  const isVideo = currentMedia?.mediaType === 'video';
  const isYouTube = currentMedia?.mediaType === 'youtube';
  const isVimeo = currentMedia?.mediaType === 'vimeo';
  const isImage = currentMedia?.mediaType === 'image' || !currentMedia?.mediaType;

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const lightboxVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { 
      opacity: 1, backdropFilter: "blur(20px)",
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, backdropFilter: "blur(0px)",
      transition: { duration: 0.2 }
    }
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0, opacity: 1, scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    })
  };

  // Format time
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10 font-sans">
      {/* Header with Search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Our Projects 
          </h1>
          <p className="text-white/40 mt-2 text-lg">
            {filteredMedia.length} {filteredMedia.length === 1 ? 'project' : 'projects'} • {filteredMedia.reduce((acc, p) => acc + (p.files?.length || 0), 0)} items
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-slate-900/80 backdrop-blur-sm rounded-xl p-2 border border-slate-800 focus-within:border-blue-500 transition-colors shadow-lg w-full md:w-96">
          <Search className="ml-2 mr-2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-white placeholder-slate-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="p-1 hover:bg-slate-800 rounded-full transition-colors mr-1"
            >
              <X size={16} className="text-slate-400" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Empty State */}
      {media.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-white/40"
        >
          <Grid3X3 size={48} className="mb-4 opacity-20" />
          <p className="text-xl">No projects found</p>
          <p className="text-sm mt-2">Add images or videos to localStorage</p>
        </motion.div>
      )}

      {/* No Search Results */}
      {media.length > 0 && filteredMedia.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-white/40"
        >
          <Search size={48} className="mb-4 opacity-20" />
          <p className="text-xl">No projects match "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear search
          </button>
        </motion.div>
      )}

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredMedia.map((project) => {
          const videoCount = project.files?.filter(f => 
            ['video', 'youtube', 'vimeo'].includes(f.mediaType)
          ).length || 0;
          
          return (
            <motion.div 
              key={project.id} 
              variants={itemVariants}
              layoutId={`project-${project.id}`}
              className="group bg-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-white/90 group-hover:text-white transition-colors line-clamp-1">
                  {project.title || "Untitled Project"}
                </h3>
                <div className="flex items-center gap-2">
                  {videoCount > 0 && (
                    <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                      <Film size={10} />
                      {videoCount}
                    </span>
                  )}
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-full">
                    {project.files?.length || 0}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {project.files?.slice(0, 4).map((file, i) => {
                  const isVideoThumb = ['video', 'youtube', 'vimeo'].includes(file.mediaType);
                  
                  return (
                    <motion.div
                      key={file.id || `file-${i}`}
                      layoutId={`image-${file.id || i}`}
                      onClick={() => openLightbox(project.files, i)}
                      className="relative cursor-pointer overflow-hidden rounded-xl aspect-square bg-slate-800 group/image"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isVideoThumb ? (
                        <>
                          <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-slate-900 flex items-center justify-center">
                            {file.preview && !file.preview.includes('youtube') && !file.preview.includes('vimeo') ? (
                              <img
                                src={file.preview}
                                alt={file.name || `Video ${i + 1}`}
                                className="w-full h-full object-cover opacity-80"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-slate-800" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover/image:bg-white/30 transition-all">
                                <Play size={20} className="text-white ml-1" fill="white" />
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/60 rounded px-1.5 py-0.5">
                            <Film size={10} className="text-white/80" />
                          </div>
                        </>
                      ) : (
                        <>
                          <motion.img
                            src={file.preview}
                            alt={file.name || `Image ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                          />
                          <motion.div 
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center"
                          >
                            <Maximize2 size={20} className="text-white/80" />
                          </motion.div>
                        </>
                      )}
                      
                      {i === 3 && project.files.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white/90">
                            +{project.files.length - 4}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence mode="wait">
        {selectedGallery && currentMedia && (
          <motion.div
            ref={lightboxRef}
            variants={lightboxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
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
                  {isVideo ? <Film size={14} /> : isYouTube ? <ExternalLink size={14} /> : <ImageIcon size={14} />}
                  {currentImgIdx + 1} / {selectedGallery.length}
                </span>
                {currentProject?.title && (
                  <span className="text-white/40 text-sm hidden sm:block max-w-xs truncate">
                    {currentProject.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Image Controls */}
                {!isVideo && !isYouTube && !isVimeo && (
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1">
                    <button 
                      onClick={handleZoomOut}
                      disabled={scale <= 0.5}
                      className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30"
                      aria-label="Zoom out"
                    >
                      <ZoomOut size={18} />
                    </button>
                    <span className="text-xs w-12 text-center tabular-nums">
                      {Math.round(scale * 100)}%
                    </span>
                    <button 
                      onClick={handleZoomIn}
                      disabled={scale >= 5}
                      className="p-2 hover:bg-white/20 rounded-full transition disabled:opacity-30"
                      aria-label="Zoom in"
                    >
                      <ZoomIn size={18} />
                    </button>
                  </div>
                )}

                {!isVideo && !isYouTube && !isVimeo && (
                  <button 
                    onClick={rotateImg}
                    className="p-2 hover:bg-white/20 rounded-full transition bg-white/10 backdrop-blur-md"
                    aria-label="Rotate image"
                  >
                    <RotateCw size={18} />
                  </button>
                )}

                <button 
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className={`p-2 hover:bg-white/20 rounded-full transition bg-white/10 backdrop-blur-md ${showThumbnails ? 'bg-white/30' : ''}`}
                  aria-label="Toggle thumbnails"
                >
                  <Grid3X3 size={18} />
                </button>

                <button 
                  onClick={closeLightbox}
                  className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition bg-white/10 backdrop-blur-md ml-2"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4 md:p-20">
              {/* Navigation */}
              <button 
                onClick={prevImg}
                className="absolute left-4 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft size={28} />
              </button>

              <button 
                onClick={nextImg}
                className="absolute right-4 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                aria-label="Next"
              >
                <ChevronRight size={28} />
              </button>

              {/* Media Display */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentImgIdx}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative max-h-full max-w-full flex items-center justify-center"
                  onWheel={!isVideo && !isYouTube && !isVimeo ? handleWheel : undefined}
                >
                  {/* HTML5 Video */}
                  {isVideo && (
                    <div className="relative max-w-[90vw] max-h-[80vh]">
                      <video
                        ref={videoRef}
                        src={currentMedia.preview || currentMedia.src}
                        poster={currentMedia.poster}
                        className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                        onTimeUpdate={handleVideoTimeUpdate}
                        onLoadedMetadata={handleVideoLoaded}
                        onEnded={() => setIsPlaying(false)}
                        playsInline
                        muted={isMuted}
                      />
                      
                      {/* Video Controls Overlay */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg"
                      >
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-white/60 tabular-nums w-10">
                            {formatTime(videoProgress)}
                          </span>
                          <input
                            type="range"
                            min={0}
                            max={videoDuration || 100}
                            value={videoProgress}
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                          />
                          <span className="text-xs text-white/60 tabular-nums w-10">
                            {formatTime(videoDuration)}
                          </span>
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={togglePlay}
                            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition backdrop-blur-sm"
                          >
                            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
                          </button>
                          
                          <button
                            onClick={toggleMute}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                          >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                          </button>
                        </div>
                      </motion.div>
                      
                      {/* Play Overlay (when paused) */}
                      {!isPlaying && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          onClick={togglePlay}
                        >
                          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
                            <Play size={32} fill="white" className="ml-2" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* YouTube Embed */}
                  {isYouTube && currentMedia.youtubeId && (
                    <div className="relative w-[90vw] max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                      <iframe
                        src={`https://www.youtube.com/embed/${currentMedia.youtubeId}?autoplay=1&mute=1&rel=0`}
                        title="YouTube video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Vimeo Embed */}
                  {isVimeo && currentMedia.vimeoId && (
                    <div className="relative w-[90vw] max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                      <iframe
                        src={`https://player.vimeo.com/video/${currentMedia.vimeoId}?autoplay=1&muted=1`}
                        title="Vimeo video"
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Image */}
                  {isImage && (
                    <motion.img
                      src={currentMedia.preview}
                      alt={currentMedia.name || "Gallery image"}
                      drag={scale > 1}
                      dragConstraints={dragConstraints}
                      dragElastic={0.1}
                      style={{
                        x: xSpring,
                        y: ySpring,
                        scale: scaleSpring,
                        rotate: rotation,
                        cursor: scale > 1 ? "grab" : "zoom-in",
                      }}
                      whileDrag={{ cursor: "grabbing" }}
                      onDoubleClick={handleDoubleClick}
                      className="max-h-[80vh] max-w-[90vw] object-contain select-none shadow-2xl rounded-lg"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Instructions */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                delay={1}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs flex gap-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full pointer-events-none"
              >
                {isVideo ? (
                  <>
                    <span>Space to play/pause</span>
                    <span>•</span>
                    <span>M to mute</span>
                  </>
                ) : isYouTube || isVimeo ? (
                  <span>Use player controls</span>
                ) : (
                  <>
                    <span>Scroll to zoom</span>
                    <span>•</span>
                    <span>Drag to pan</span>
                    <span>•</span>
                    <span>Double-click to reset</span>
                  </>
                )}
              </motion.div>
            </div>

            {/* Thumbnails Strip */}
            <AnimatePresence>
              {showThumbnails && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="h-24 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center gap-2 px-4 overflow-x-auto scrollbar-hide"
                >
                  {selectedGallery.map((file, idx) => {
                    const isVideoThumb = ['video', 'youtube', 'vimeo'].includes(file.mediaType);
                    
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
                            {file.preview && !file.preview.includes('youtube') && !file.preview.includes('vimeo') ? (
                              <img src={file.preview} alt="" className="w-full h-full object-cover opacity-80" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play size={14} className="text-white" fill="white" />
                            </div>
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
      `}</style>
    </div>
  );
};

export default Projects;