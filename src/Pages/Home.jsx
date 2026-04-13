import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, HardHat, Ruler, Award, Users,
    Phone, Mail, Quote,
    CheckCircle, ArrowRight, Play, Pause, Hammer,

    Menu, X,
    User
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

// --- SVG Components ---
const ConstructionSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
        </defs>
        <rect width="400" height="300" fill="transparent" />
        <rect x="50" y="150" width="80" height="120" fill="#9CA3AF" />
        <rect x="140" y="100" width="80" height="170" fill="#6B7280" />
        <rect x="230" y="120" width="80" height="150" fill="#4B5563" />
        <rect x="320" y="80" width="70" height="190" fill="#374151" />
        {[60, 90, 110].map(y => <rect key={y} x="60" y={y} width="20" height="25" fill="#FCD34D" />)}
        {[150, 180, 210].map(y => <rect key={y} x="150" y={y} width="20" height="25" fill="#FCD34D" />)}
        {[240, 270].map(y => <rect key={y} x="240" y={y} width="20" height="25" fill="#FCD34D" />)}
        <rect x="350" y="30" width="15" height="220" fill="#4B5563" />
        <rect x="280" y="30" width="85" height="12" fill="#4B5563" />
        <circle cx="357" cy="30" r="10" fill="#F59E0B" />
    </svg>
);



const HeroSection = () => {
    const [currentQuote, setCurrentQuote] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const quotes = [
        { text: "Building dreams, one brick at a time", author: "John Anderson, CEO" },
        { text: "Quality is not an act, it's a habit", author: "Aristotle" },
        { text: "The best way to predict the future is to build it", author: "Peter Drucker" },
        { text: "Excellence in every detail, perfection in every project", author: "Team ConstructPro" }
    ];

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentQuote((prev) => (prev + 1) % quotes.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, quotes.length]);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <div className="flex flex-col items-start gap-2 mb-6">
                            {/* <HardHat className="text-yellow-400" size={32} /> */}
                            <img src="logohome.jpg" className='h-28 rounded-md w-28' alt="" />
                            <span className="text-yellow-400 text-2xl font-semibold tracking-wide uppercase"> builders & developers, LLP.</span>
                        </div>

                        <h1 className="text-3xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            We build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">Dreams....</span>
                        </h1>

                        <p className='text-xl text-lime-300 font-mono'>ARCHITECT’S   STRUCTURAL   ENGINEERS    CONTRACTOR  </p>

                        <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
                            Welcome to civinest Builders & developers LLP company (incoroported in feb 2026)  a
                            leading provider of comprehensive construction services. Established in 2015 , we specialize
                            in delivering high-quality residential, commercial, and industrial projects that exceed our
                            clients' expectations.
                        </p>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
                            With a proven track record of successful builds, we have earned a reputation for
                            excellence, innovation, and commitment to both efficiency and safety. Our team consists of
                            skilled professionals who are dedicated to providing superior craftsmanship, attention to
                            detail, and unparalleled customer service on every project.
                        </p>



                        <div className="flex flex-wrap gap-4">
                            {/* <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold flex items-center gap-2 shadow-xl">
                                <a href="#contact" className='flex justify-center items-center'> Get Connect <ArrowRight size={20} /></a>
                            </motion.button> */}

                            <a href="#contact" className='flex justify-center items-center'> <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold flex items-center gap-2 shadow-xl">
                                <a href="#contact" className='flex justify-center items-center gap-4'> Get Started <ArrowRight size={20} /></a>
                            </motion.button></a>
                            <NavLink to='/projects'>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/10">
                                    View Projects <Play size={20} />
                                </motion.button>
                            </NavLink>
                        </div>
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full   flex justify-center"
                            >
                                <div className="flex m-auto w-full lg:ml-60  justify-around  items-center gap-28 md:gap-20 text-center">

                                    {/* Projects */}
                                    <div className="flex flex-col items-center">
                                        <img
                                            src="logohome.jpg"
                                            alt="Projects"
                                            className="h-10 w-10 rounded mb-2"
                                        />
                                        <div className="text-2xl font-bold text-white">50+</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                                            Projects
                                        </div>
                                    </div>

                                    {/* Clients */}
                                    <div className="flex flex-col items-center">
                                        <Users className="text-blue-400 mb-2" size={24} />

                                        <div className="text-2xl font-bold text-white">50+</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                                            Clients
                                        </div>
                                    </div>

                                    {/* Years */}
                                    <div className="flex flex-col items-center">
                                        <Award className="text-blue-400 mb-2" size={24} />
                                        <div className="text-2xl font-bold text-white">5+</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                                            Years
                                        </div>
                                    </div>

                                </div>
                            </motion.div>




                            {/* {[
                                { value: "50+", label: "Projects", icon: Building2 },
                                { value: "50+", label: "Clients", icon: Users },
                                { value: "5+", label: "Years", icon: Award }
                            ].map((stat, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.1 }}>
                                    <stat.icon className="text-blue-400 mb-2" size={24} />
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-tighter">{stat.label}</div>
                                </motion.div>
                            ))} */}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative hidden lg:block">
                        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                            <ConstructionSVG />
                            <div className="absolute -bottom-10 left-10 right-10 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100">
                                <div className="flex items-start gap-4">
                                    <Quote className="text-blue-600 flex-shrink-0" size={28} />
                                    <div className="flex-1">
                                        <AnimatePresence mode="wait">
                                            <motion.div key={currentQuote} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                <p className="text-slate-800 font-medium italic mb-2">"{quotes[currentQuote].text}"</p>
                                                <p className="text-slate-500 text-xs">— {quotes[currentQuote].author}</p>
                                            </motion.div>
                                        </AnimatePresence>
                                        <div className="flex gap-1.5 mt-4 items-center">
                                            <button onClick={() => setIsPlaying(!isPlaying)} className="p-1 hover:bg-slate-100 rounded-full transition">
                                                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                            {quotes.map((_, idx) => (
                                                <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentQuote ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ServicesSection = () => {
    const services = [
        {
            icon: Building2, title: "Residential-Construction:", description: `From custom homes to multi-family complexes, we 
deliver exceptional designs and quality. `, features: ["Custom Designs", "Smart Homes"], color: "from-blue-500 to-cyan-500"
        },
        {
            icon: HardHat, title: "Commercial-Construction:", description: `We handle office buildings, retail spaces, and industrial 
facilities with expertise in both design and execution. `, features: ["Fast Track", "Turnkey Solutions"], color: "from-indigo-500 to-purple-500"
        },
        {
            icon: Hammer, title: "Renovations & Remodeling:", description: `Whether updating an existing structure or 
transforming a space, we ensure all projects meet the highest standards.`, features: ["Modern Upgrades", "Structural"], color: "from-purple-500 to-pink-500"
        },
        { icon: Ruler, title: "Design", description: "Innovative designs that combine aesthetics with functionality.", features: ["3D Rendering", "Planning"], color: "from-pink-500 to-red-500" }
    ];

    return (
        <section id="services" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Our Services</span>
                <h2 className="text-4xl font-bold mt-2">Professional Solutions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {services.map((s, i) => (
                        <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left">
                            <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                                <s.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                            <p className="text-slate-500 text-sm mb-6">{s.description}</p>
                            <ul className="space-y-2">
                                {s.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <CheckCircle size={14} className="text-green-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// const ProjectsShowcase = () => {
//     const projects = [
//         { title: "Luxury Villa", category: "Residential", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600", stats: { area: "5,000 sq ft", duration: "12 mo", cost: "$2.5M" } },
//         { title: "Office Tower", category: "Commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600", stats: { area: "50k sq ft", duration: "18 mo", cost: "$15M" } },
//         { title: "Eco Housing", category: "Sustainable", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600", stats: { area: "3,200 sq ft", duration: "8 mo", cost: "$1.8M" } }
//     ];

//     return (
//         <section id="projects" className="py-24 bg-white">
//             <div className="max-w-7xl mx-auto px-4">
//                 <div className="text-center mb-16">
//                     <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Portfolio</span>
//                     <h2 className="text-4xl font-bold mt-2">Recent Masterpieces</h2>
//                 </div>
//                 <div className="grid md:grid-cols-3 gap-8">
//                     {projects.map((p, i) => (
//                         <motion.div key={i} whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-3xl shadow-lg aspect-[4/5]">
//                             <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
//                             <div className="absolute bottom-0 left-0 p-8 text-white w-full">
//                                 <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 inline-block">{p.category}</span>
//                                 <h3 className="text-2xl font-bold">{p.title}</h3>
//                                 <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <div><p className="text-white/50">Area</p><p>{p.stats.area}</p></div>
//                                     <div><p className="text-white/50">Time</p><p>{p.stats.duration}</p></div>
//                                     <div><p className="text-white/50">Cost</p><p>{p.stats.cost}</p></div>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

const ContactSection = () => {
    return (
        <section id="contact" className="pb-24 bg-slate-50 flex flex-col justify-between items-center">

            <div className='flex flex-col items-center lg:gap-4 py-4'>
                <span className="text-blue-600 font-bold text-lg  uppercase tracking-widest">
                        Contact Us
                    </span>

                                        <h2 className="text-3xl font-bold mt-2 mb-6">Let's Build Together</h2>


            </div>

            
              
            <div className="max-w-7xl mx-auto px-4 py-3 bg-zinc-100 grid lg:grid-cols-2 gap-16">
                
                <div>
                  

                    <div className="space-y-6 flex flex-col justify-around h-full items-center">

                        {/* PHONE */}
                        <div className="flex w-64 flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className="lg:flex lg:flex-col text-start w-full  flex flex-wrap gap-3 lg:items-start justify-around">
                                <p className="text-xs text-slate-600 font-bold uppercase">
                                    Er: Vinod Patil BE (civil)
                                </p>


                                <a href="tel:+918380099008" className="font-bold text-blue-800 hover:text-blue-600">
                                    8380099008
                                </a>

                                <p className="text-xs text-slate-600 font-bold uppercase">
                                    Er: Chetan Guttedara BE (civil)
                                </p>

                                <a href="tel:+918296321942" className="font-bold text-blue-800 hover:text-blue-600">
                                    8296321942
                                </a>
                                <p className="text-xs text-slate-600 font-bold uppercase">
                                    Er: Praveen Dasama BE (civil)
                                </p>

                                <a href="tel:+919538779666" className="font-bold text-blue-800 hover:text-blue-600">
                                    9538779666
                                </a>
                            </div>
                        </div>

                        {/* EMAIL + OFFICE */}
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Mail size={20} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                                <a
                                    href="mailto:civinest@gmail.com"
                                    className="font-bold text-slate-800 hover:text-blue-600"
                                >
                                    civinest@gmail.com
                                </a>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Office</p>
                                <a
                                    href="tel:+916360008440"
                                    className="font-bold text-slate-800 hover:text-blue-600"
                                >
                                    6360008440
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* FORM (unchanged) */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <form className="space-y-4">
                        <input type="text" placeholder="Name" className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        <textarea placeholder="Message" rows="4" className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition"></textarea>
                        <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

// const Footer = () => (

// );

// --- MAIN HOME COMPONENT ---
const Home = () => {
    return (
        <div className="font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
            {/* <Navbar /> */}
            <HeroSection />
            <ServicesSection />
            {/* <ProjectsShowcase /> */}
            <ContactSection />
        </div>
    );
};

export default Home;
