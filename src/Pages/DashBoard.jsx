import React, { useState, useEffect, useCallback } from "react";
import { 
  Camera, Video, MapPin, Clock, Send, Trash2, X, 
  Image as ImageIcon, ChevronLeft, ChevronRight, 
  RotateCw, ZoomIn, ZoomOut, FlipHorizontal, Edit3, Check, RotateCcw, PlayCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashBoard = () => {
  const [entries, setEntries] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "" });

  // Gallery Viewer State
  const [viewingGallery, setViewingGallery] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [viewerTools, setViewerTools] = useState({ zoom: 1, rotate: 0, flip: false });

  useEffect(() => {
    const saved = localStorage.getItem("construction_logs_v5");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setTempFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempFiles.length === 0 && !formData.title) return;
    const newEntry = { 
      id: Date.now(), 
      ...formData, 
      timestamp: new Date().toLocaleString(), 
      media: tempFiles 
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("construction_logs_v5", JSON.stringify(updated));
    setFormData({ title: "", description: "" });
    setTempFiles([]);
  };

  // Logic to open gallery at a SPECIFIC index
  const openViewer = (mediaArray, index) => {
    setViewerTools({ zoom: 1, rotate: 0, flip: false });
    setViewingGallery(mediaArray);
    setCurrentIdx(index);
  };

  const closeViewer = () => setViewingGallery(null);

  const navigate = useCallback((direction) => {
    setViewerTools({ zoom: 1, rotate: 0, flip: false }); // Reset zoom on slide
    if (direction === "next") {
      setCurrentIdx(prev => (prev < viewingGallery.length - 1 ? prev + 1 : 0));
    } else {
      setCurrentIdx(prev => (prev > 0 ? prev - 1 : viewingGallery.length - 1));
    }
  }, [viewingGallery]);

  return (
    <div className="min-h-screen bg-[#0b141a] text-slate-100 p-3 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: UPLOAD SECTION */}
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#111b21] border border-slate-800 p-6 rounded-[2rem] shadow-2xl sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <Camera size={24} />
              </div>
              <h2 className="text-xl font-bold">Log Site Media</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="min-h-[220px] w-full border-2 border-dashed border-slate-700 rounded-3xl bg-[#202c33]/20 hover:bg-[#202c33]/40 transition-all p-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {tempFiles.map((file) => (
                      <motion.div key={file.id} layout initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5">
                        {file.type === "video" ? (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                              <Video size={20} className="text-emerald-500" />
                           </div>
                        ) : (
                          <img src={file.url} className="w-full h-full object-cover" />
                        )}
                        <button type="button" onClick={() => setTempFiles(tempFiles.filter(f => f.id !== file.id))} className="absolute top-1 right-1 bg-black/80 backdrop-blur-md p-1.5 rounded-full hover:bg-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <label className="aspect-square border-2 border-slate-700 border-dotted rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-slate-500 hover:text-emerald-400">
                    <ImageIcon size={32} />
                    <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Add</span>
                    <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <input placeholder="Project Title" className="w-full bg-[#2a3942] p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                <textarea placeholder="Site details / Description..." rows="4" className="w-full bg-[#2a3942] p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-900/20">
                <Send size={20} /> Publish
              </button>
            </form>
          </motion.div>
        </div>

        {/* RIGHT: HISTORY FEED */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Site Field History</h2>
            <span className="text-slate-600 text-xs font-mono">{entries.length} Logs</span>
          </div>

          <div className="space-y-8 pb-32">
            {entries.map((log) => (
              <motion.div key={log.id} layout className="bg-[#111b21] rounded-[2.5rem] overflow-hidden border border-slate-800/50 shadow-xl">
                {/* Optimized Media Grid */}
                <div className={`grid gap-1 ${log.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {log.media.map((m, idx) => (
                    <div 
                      key={m.id} 
                      onClick={() => openViewer(log.media, idx)}
                      className="relative aspect-video sm:aspect-square bg-slate-900 cursor-zoom-in overflow-hidden group"
                    >
                      {m.type === "video" ? (
                        <div className="w-full h-full relative">
                           <video src={m.url} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                              <PlayCircle className="text-white opacity-80" size={40} />
                           </div>
                        </div>
                      ) : (
                        <img src={m.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      {editingId === log.id ? (
                        <input className="w-full bg-[#2a3942] p-3 rounded-xl text-emerald-400 font-bold text-2xl outline-none ring-2 ring-emerald-500" value={editValues.title} onChange={(e) => setEditValues({...editValues, title: e.target.value})} />
                      ) : (
                        <h3 className="text-white font-bold text-2xl tracking-tight">{log.title || "Untitled Report"}</h3>
                      )}
                      <div className="flex items-center gap-4 text-slate-500 text-xs mt-2 uppercase tracking-widest font-semibold">
                        <span className="flex items-center gap-1"><Clock size={14}/> {log.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {editingId === log.id ? (
                        <button onClick={() => {
                          const updated = entries.map(e => e.id === log.id ? {...e, ...editValues} : e);
                          setEntries(updated);
                          localStorage.setItem("construction_logs_v5", JSON.stringify(updated));
                          setEditingId(null);
                        }} className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/20"><Check size={20}/></button>
                      ) : (
                        <button onClick={() => { setEditingId(log.id); setEditValues({title: log.title, description: log.description}); }} className="bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-emerald-400 transition-all"><Edit3 size={20}/></button>
                      )}
                      <button onClick={() => setEntries(entries.filter(e => e.id !== log.id))} className="bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
                    </div>
                  </div>

                  <div className="bg-[#202c33]/30 p-5 rounded-2xl border border-white/5">
                    {editingId === log.id ? (
                      <textarea className="w-full bg-[#2a3942] p-4 rounded-xl text-slate-300 outline-none" rows="4" value={editValues.description} onChange={(e) => setEditValues({...editValues, description: e.target.value})} />
                    ) : (
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{log.description || "No description provided."}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* OPTIMIZED FULL-SCREEN VIEWER */}
      <AnimatePresence>
        {viewingGallery && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[999] bg-black/98 flex flex-col select-none">
            {/* Control Bar */}
            <div className="p-4 flex items-center justify-between bg-black/60 backdrop-blur-xl border-b border-white/10">
              <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
                <button onClick={() => setViewerTools(t => ({...t, zoom: Math.min(t.zoom + 0.5, 5)}))} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><ZoomIn size={20}/></button>
                <button onClick={() => setViewerTools(t => ({...t, zoom: Math.max(t.zoom - 0.5, 0.5)}))} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><ZoomOut size={20}/></button>
                <button onClick={() => setViewerTools(t => ({...t, rotate: t.rotate + 90}))} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><RotateCw size={20}/></button>
                <button onClick={() => setViewerTools(t => ({...t, flip: !t.flip}))} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><FlipHorizontal size={20}/></button>
                <button onClick={() => setViewerTools({zoom: 1, rotate: 0, flip: false})} className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-all"><RotateCcw size={20}/></button>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-sm font-mono text-slate-500 hidden sm:block">{currentIdx + 1} / {viewingGallery.length}</span>
                 <button onClick={closeViewer} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={24}/></button>
              </div>
            </div>
            
            {/* Stage */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden touch-none">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIdx}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: viewerTools.zoom, 
                    rotate: viewerTools.rotate,
                    scaleX: viewerTools.flip ? -viewerTools.zoom : viewerTools.zoom,
                    x: 0
                  }}
                  exit={{ opacity: 0, scale: 1.1, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="max-h-full max-w-full p-4 flex items-center justify-center"
                >
                  {viewingGallery[currentIdx].type === "video" ? (
                    <video src={viewingGallery[currentIdx].url} controls autoPlay playsInline className="max-h-[85vh] w-auto rounded-lg shadow-2xl" />
                  ) : (
                    <img src={viewingGallery[currentIdx].url} className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl pointer-events-none" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {viewingGallery.length > 1 && (
                <>
                  <button onClick={() => navigate("prev")} className="absolute left-6 top-1/2 -translate-y-1/2 p-5 bg-black/40 hover:bg-emerald-500 transition-all rounded-full border border-white/10 backdrop-blur-md text-white z-10">
                    <ChevronLeft size={32}/>
                  </button>
                  <button onClick={() => navigate("next")} className="absolute right-6 top-1/2 -translate-y-1/2 p-5 bg-black/40 hover:bg-emerald-500 transition-all rounded-full border border-white/10 backdrop-blur-md text-white z-10">
                    <ChevronRight size={32}/>
                  </button>
                </>
              )}
            </div>

            {/* Bottom Status (Mobile) */}
            <div className="sm:hidden p-4 text-center text-xs tracking-widest text-slate-500 font-bold bg-black/40">
              LOG MEDIA {currentIdx + 1} OF {viewingGallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashBoard;