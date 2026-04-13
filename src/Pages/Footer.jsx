import React from 'react'
import { Zap } from 'lucide-react';
  import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div> <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <Zap className="w-6 h-6" />
            <span className="font-bold text-lg">CIVINEST BUILDERS & DEVELOPERS LLP</span>
          </div>
          <p className="text-sm">© 2026 CIVINEST BUILDERS & DEVELOPERS LLP. All rights reserved</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>        
<Link to="/#contact" className="hover:text-white transition-colors">
  Contact
</Link>
          </div>
        </div>
      </footer></div>
  )
}

export default Footer