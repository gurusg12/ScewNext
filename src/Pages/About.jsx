import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, HardHat, Users, Award, Target, Shield, Heart,
  MapPin, Phone, Mail, ChevronRight, Quote, CheckCircle,
  Trophy, Globe, Lightbulb, Handshake,
  ArrowRight, Menu, X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

// --- Animated SVG Components (Kept your logic, optimized paths) ---
const AboutHeroSVG = () => (
  <svg viewBox="0 0 500 400" className="w-full h-full">
    <defs>
      <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <pattern id="grid" patternUnits="userSpaceOnUse" width="20" height="20">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="500" height="400" fill="url(#grid)" />
    <rect x="100" y="150" width="80" height="200" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
    <rect x="190" y="100" width="80" height="250" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
    <rect x="280" y="120" width="80" height="230" fill="#9CA3AF" stroke="#6B7280" strokeWidth="2" />
    <rect x="370" y="80" width="80" height="270" fill="#6B7280" stroke="#4B5563" strokeWidth="2" />
    {[170, 210, 250].map(y => <rect key={`w1-${y}`} x="110" y={y} width="20" height="25" fill="#FCD34D" rx="2" />)}
    {[120, 160, 200, 240].map(y => <rect key={`w2-${y}`} x="200" y={y} width="20" height="25" fill="#FCD34D" rx="2" />)}
    <rect x="420" y="30" width="12" height="240" fill="#4B5563" />
    <rect x="360" y="30" width="70" height="10" fill="#4B5563" />
    <circle cx="426" cy="30" r="8" fill="#F59E0B" />
  </svg>
);

const MissionSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <circle cx="100" cy="100" r="90" fill="#3B82F6" opacity="0.1" />
    <path d="M100 40 L110 80 L150 80 L120 100 L130 140 L100 115 L70 140 L80 100 L50 80 L90 80 Z" fill="#3B82F6" />
  </svg>
);

// --- Navbar (Fixed Navigation Logic) ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePath, setActivePath] = useState('/about');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', name: 'Home', icon: Building2 },
    { path: '/about', name: 'About', icon: Users },
    { path: '/services', name: 'Services', icon: HardHat },
    { path: '/projects', name: 'Projects', icon: Award },
    { path: '/contact', name: 'Contact', icon: Phone },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2' : 'bg-white shadow-sm py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-blue-200 shadow-lg group-hover:rotate-12 transition-transform">
            <Building2 size={22} />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">ConstructPro</span>
        </a>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={() => setActivePath(link.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activePath === link.path ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <link.icon size={18} />
              <span className="text-sm">{link.name}</span>
            </a>
          ))}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-600">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t px-4 py-6 space-y-2 shadow-xl"
          >
            {navLinks.map((link) => (
              <a key={link.path} href={link.path} className="flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl transition-colors">
                <link.icon size={20} className="text-blue-600" />
                <span className="font-semibold text-slate-800">{link.name}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- About Hero ---
const AboutHero = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const quotes = [
    { text: "Building excellence through innovation and integrity", author: "Founder's Vision" },
    { text: "Quality isn't just a standard, it's our promise", author: "Quality Statement" },
    { text: "Creating spaces that inspire and endure", author: "Design Philosophy" }
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentQuote(p => (p + 1) % quotes.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
            <HardHat size={16} /> ABOUT OUR LEGACY
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Crafting Tomorrow's <span className="text-blue-600">Landmarks</span> Today
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
            For over two decades, ConstructPro has led with architectural innovation.
            We build more than structures; we build trust through engineering excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <NavLink to='/projects'>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2">
                Our Journey <ArrowRight size={20} />
              </button>
            </NavLink>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative mt-16 lg:mt-0">
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <AboutHeroSVG />
            <div className="absolute  -bottom-10  md:left-0 bg-red-50 p-6 rounded-3xl shadow-2xl border border-slate-50 max-w-xs">
              <Quote className="text-blue-600 mb-3" size={32} />
              <AnimatePresence mode="wait">
                <motion.div key={currentQuote} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-slate-800 font-medium italic mb-2">"{quotes[currentQuote].text}"</p>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">— {quotes[currentQuote].author}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Values & Team (Simplified rendering for performance) ---
const CoreValues = () => {
  const values = [
    { icon: Shield, title: "Integrity", desc: "We pride ourselves on transparency, honesty, and ethical practices.", color: "bg-blue-500" },
    { icon: Trophy, title: "Safety", desc: "Maintaining a safe environment is our top priority for our employees, partners,and clients. ", color: "bg-indigo-500" },
    { icon: Lightbulb, title: "Sustainability: ", desc: "We are committed to using sustainable building practices and materials whenever possible.", color: "bg-purple-500" },
    { icon: Shield, title: "Customer Satisfaction:", desc: "Our clients are at the heart of everything we do. We aim to turn visions into reality while maintaining clear communication throughout the process.", color: "bg-blue-500" },

  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Our Core Pillars</h2>
          <p className="text-slate-500 mt-4">At civinest we don’t just build structures We create long
            lasting relationships and a legacy of quality construction. <span className='text-2xl font-mono font-bold text-sky-600'>From the initial concept to final
              handover,</span>we ensure that every project is completed on
            time, within budget, and to the highest standard.</p>


          <div className="mt-10 px-4 md:px-10">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-center mb-10">
              Why Us
            </h1>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

              {/* Card 1 */}
              <div className="p-6 rounded-2xl bg-emerald-200 border border-slate-900 shadow hover:shadow-lg transition-all">
                <h2 className="text-xl font-bold mb-4">Warranty</h2>
                <ul className="text-slate-700 space-y-2 list-disc list-inside">
                  <li>1 Year Workmanship & Materials</li>
                  <li>10 Years Structural Warranty</li>
                  <li>On-time Delivery</li>
                  <li>Professional Experts</li>
                  <li>Quality Work</li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl bg-emerald-200 border border-slate-900 shadow hover:shadow-lg transition-all">
                <h2 className="text-xl font-bold mb-4">Steps Involved</h2>
                <ul className="text-slate-700 space-y-2 list-disc list-inside">
                  <li>Journey of Construction</li>
                  <li>Let's Get Started</li>
                  <li>Requirement Discussion</li>
                  <li>Design Specification</li>
                </ul>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl bg-emerald-200 border border-slate-900 shadow hover:shadow-lg transition-all">
                <h2 className="text-xl font-bold mb-4">
                  Design & Client Discussion
                </h2>
                <ul className="text-slate-700 space-y-2 list-disc list-inside">
                  <li>Client Agreement</li>
                  <li>Construction Updates</li>
                  <li>Site Visits</li>
                  <li>Project Handover</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i} whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all"
            >
              <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                <v.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{v.title}</h3>
              <p className="text-slate-600 leading-relaxed">{v.desc}</p>
            </motion.div>

          ))}



        </div>
        <div className='bg-slate-100 flex flex-col mt-7 rounded-lg p-2'>
          <div className='w-full bg-slate-100  text-lg p-3 flex justify-start '>
            <span className='text-2xl font-mono font-bold text-orange-500'>Vision:</span> "To be the leading innovator in the construction & Real Estate industry, known for transforming spaces
            that improve lives, enhance communities, and create sustainable futures."
          </div>
          <div className='w-full bg-slate-100 mt-6 text-lg flex justify-start '>
            <span className='text-2xl font-mono font-bold px-3 py-5 text-orange-500'>Mission:</span> "Our mission is to provide exceptional construction services through innovation,
            integrity, and expertise. We are dedicated to delivering high-quality, cost-effective, and sustainable
            projects, while fostering strong relationships with clients, employees, and communities."
          </div>
        </div>

      <div className="bg-gradient-to-b from-sky-50 to-white py-10">

         <div className='w-full  md:w-1/3 flex justify-center items-center p-6 text-center bg-sky-500 text-white font-semibold text-xl'>
      services is what we pursue
    </div>

  {/* SECTION 1 */}
  <div className='flex mt-5 flex-col md:flex-row justify-center items-stretch rounded-2xl shadow-md bg-white mb-8 overflow-hidden'>
    
   <div className=' w-full md:w-1/3 flex justify-center items-center text-center bg-sky-600 text-white font-semibold text-lg '>

   <div className='lg:h-full lg:w-full '>
    <img src="design01.png" alt="design01" className='object-cover h-full w-full lg:object-cover lg:hidden'/>
    <img src="vertical01.png" className='h-full w-full hidden lg:block' alt="" />
   </div>
     
    </div>

    <div className='w-full flex flex-col p-5 sm:p-8 md:p-10'>
      
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 border-l-4 border-sky-500 pl-3">
        DESIGN AND DRAWING (SET OF DRAWINGS)
      </h1>

      <ul className="space-y-2 text-slate-600 text-sm sm:text-base">
        <li>Floor plan (Residential, commercial, industrial, other)</li>
        <li>Architectural drawing</li>
        <li>Structural Details</li>
        <li>Structural Details</li>
        <li>Ventilation specification</li>
        <li>Electrical drawing</li>
        <li>Plumbing drawing</li>
        <li>Estimation</li>
      </ul>
    </div>
  </div>

  {/* SECTION 2 */}
  <div className='flex flex-col md:flex-row justify-center items-stretch rounded-2xl shadow-md bg-white mb-8 overflow-hidden'>
    
    <div className='w-full md:w-1/3 flex justify-center items-center  text-center bg-sky-400 text-white font-semibold text-lg'>
     <img src="design02.png" alt="design01" className='object-cover h-full w-full lg:object-cover lg:hidden'/>
    <img src="vertical02.png" className='h-full w-full hidden lg:block' alt="" />
    </div>

    <div className='w-full flex flex-col p-5 sm:p-8 md:p-10'>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 border-l-4 border-sky-500 pl-3">
        APPROVAL AND DOCUMENTATION
      </h1>

      <ul className="space-y-2 text-slate-600 text-sm sm:text-base">
        <li>Residential</li>
        <li>Commercial</li>
        <li>Industrial</li>
        <li>School, hospital</li>
        <li>Other</li>
      </ul>
    </div>
  </div>

  {/* SECTION 3 */}
  <div className='flex flex-col md:flex-row justify-center items-stretch rounded-2xl shadow-md bg-white overflow-hidden'>
    
     <div className='w-full md:w-1/3 flex justify-center items-center  text-center bg-sky-400 text-white font-semibold text-lg'>
     <img src="vertical03.png" alt="design01" className='object-cover h-full w-full lg:object-cover lg:hidden'/>
    <img src="vertical03.png" className='h-full w-full hidden lg:block' alt="" />
    </div>

    <div className='w-full flex flex-col p-5 sm:p-8 md:p-10'>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 border-l-4 border-sky-500 pl-3">
        CONTRACT AND SUPERVISION
      </h1>

      <ul className="space-y-2 text-slate-600 text-sm sm:text-base">
        <li>BUILDING CONTARCT AND SUPERVISION</li>
        <li>GOVERNMENT CONSTRUCTION CONTRACT</li>
        <li>LABOUR CONTRACT</li>
        <li>EQUIPMENT CONTRACT</li>
      </ul>
    </div>
  </div>




  <div className='flex mt-5 flex-col md:flex-row justify-center items-stretch rounded-2xl shadow-md bg-white overflow-hidden'>
    
     <div className='w-full md:w-1/3 flex justify-center items-center  text-center bg-sky-400 text-white font-semibold text-lg'>
     <img src="vertical04.png" alt="design01" className='object-cover h-full w-full lg:object-cover lg:hidden'/>
    <img src="vertical04.png" className='h-full w-full hidden lg:block' alt="" />
    </div>

    <div className='w-full flex flex-col p-5 sm:p-8 md:p-10'>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 border-l-4 border-sky-500 pl-3">
       REPAIR, MAINTENANCE AND REHABILITATION
      </h1>

      <ul className="space-y-2 text-slate-600 text-sm sm:text-base">
        <li className='font-mono text-lg text-blue-600'>Cracks in roof  , wall  </li>
        <li className='font-mono text-lg text-blue-600'>Sapling and chipping </li>
        <li className='font-mono text-lg text-blue-600'>Efflorescence in brick wall, plaster</li>
        <li>Preventive maintenance  </li>
        <li>Routine maintenance  </li>

      </ul>
    </div>
  </div>


  <div className='mt-5 flex flex-col md:flex-row justify-center items-stretch rounded-2xl shadow-md bg-white overflow-hidden'>
    
  <div className='w-full md:w-1/3 flex justify-center items-center  text-center bg-sky-400 text-white font-semibold text-lg'>
     <img src="vertical05.png" alt="design01" className='object-cover h-full w-full lg:object-cover lg:hidden'/>
    <img src="vertical05.png" className='h-full w-full hidden lg:block' alt="" />
    </div>

    <div className='w-full flex flex-col p-5 sm:p-8 md:p-10'>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 border-l-4 border-sky-500 pl-3">
         N.A LAYOUT  PLANNING AND APPROVAL 
      </h1>

      <ul className="space-y-2 text-slate-600 text-sm sm:text-base">
        <li>Residential </li>
        <li> Commercial </li>
        <li>Industrial</li>
      </ul>
    </div>
  </div>
  

</div>




      </div>




    </section>

  );
};

// --- Footer 

const About = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">

      <AboutHero />
      <CoreValues />
    </div>
  );
};

export default About;