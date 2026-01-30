"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import emailjs from '@emailjs/browser';
import dynamic from 'next/dynamic';

// ✨ DYNAMIC SPLINE LOADER ✨
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-cyan-500 font-mono text-xs animate-pulse">
      INITIALIZING SYSTEMS...
    </div>
  ),
});

import { 
  FaGithub, FaLinkedin, FaEnvelope, FaJava, FaBullhorn, FaTrophy, FaBuilding, FaLaptopCode, FaCertificate, FaFileDownload, FaExternalLinkAlt 
} from 'react-icons/fa';
import { 
  SiNextdotjs, SiTailwindcss, SiMongodb, SiExpress, SiReact, SiNodedotjs,
  SiCplusplus, SiFirebase, SiFlutter, SiOpencv, SiPython 
} from 'react-icons/si';

// --- COMPONENT: STARFIELD BACKGROUND (FIXED HYDRATION ERROR) ---
const Starfield = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate stars ONLY on the client side to fix Hydration Error
    const generatedStars = new Array(50).fill(0).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 3}s`
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black overflow-hidden">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-0 animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            animationIterationCount: 'infinite'
          }}
        />
      ))}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px]" />
    </div>
  );
};

// --- COMPONENT: CUSTOM SPACE CURSOR ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Checking window availability for safe SSR
  useEffect(() => {
    if (typeof window !== "undefined") {
        cursorX.set(window.innerWidth / 2);
        cursorY.set(window.innerHeight / 2);
    }
  }, []);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] shadow-[0_0_15px_#22d3ee]" style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }} />
      <motion.div className="fixed top-0 left-0 w-8 h-8 border border-cyan-500/50 rounded-full pointer-events-none z-[9998]" style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }} />
    </>
  );
};

// --- COMPONENT: TYPEWRITER TEXT ---
const Typewriter = ({ words, wait = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => { setBlink((prev) => !prev); }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) { setReverse(true); return; }
    if (subIndex === 0 && reverse) { setReverse(false); setIndex((prev) => (prev + 1) % words.length); return; }
    const timeout = setTimeout(() => { setSubIndex((prev) => prev + (reverse ? -1 : 1)); }, Math.max(reverse ? 75 : subIndex === words[index].length ? wait : 150, parseInt(Math.random() * 350)));
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, wait]);

  return <span className="text-cyan-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">{`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}</span>;
};

// --- COMPONENT: EXPERIENCE TIMELINE ITEM ---
const TimelineItem = ({ date, title, company, description, icon, isLeft }) => (
    <div className={`mb-8 flex justify-between items-center w-full ${isLeft ? 'flex-row-reverse' : ''} relative`}>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-cyan-900/50 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.3)] w-10 h-10 rounded-full justify-center text-cyan-300 backdrop-blur-md">
        {icon}
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`order-1 bg-white/5 backdrop-blur-md rounded-lg shadow-xl w-5/12 px-6 py-4 border border-cyan-500/20 hover:border-cyan-500/50 transition-all ${isLeft ? 'text-right' : ''}`}
      >
        <h3 className="mb-1 font-bold text-white text-lg font-mono">{title}</h3>
        <h4 className="mb-2 text-cyan-400 text-sm font-semibold tracking-wider">{company}</h4>
        <p className="text-sm leading-snug text-gray-400">{description}</p>
        <span className="text-xs text-cyan-500/70 mt-2 block font-mono">{date}</span>
      </motion.div>
    </div>
);

// --- COMPONENT: ORBITING SKILL ICON ---
const OrbitingSkill = ({ skill, radius, duration, reverse }) => {
  return (
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        animation: `spin ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'}`,
      }}
    >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{
           animation: `spin ${duration}s linear infinite ${reverse ? 'normal' : 'reverse'}`, 
        }}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-xl md:text-3xl text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-125 hover:border-cyan-400 hover:shadow-[0_0_20px_#22d3ee] transition-all cursor-pointer">
          {skill.icon}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: PROJECT CARD ---
const ProjectCard = ({ project }) => (
  <motion.div whileHover={{ y: -5, boxShadow: "0 0 25px rgba(34,211,238,0.1)" }} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-none flex flex-col h-full">
    <div className="h-40 bg-gradient-to-br from-[#0f172a] to-black flex items-center justify-center text-5xl group-hover:text-cyan-400 transition">{project.icon}</div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 font-mono">{project.title}</h3>
      <p className="text-gray-400 text-sm mb-4 flex-grow">{project.desc}</p>
      <div className="flex gap-2 mb-4">
        {project.tags.map(tag => (<span key={tag} className="text-[10px] bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded font-mono border border-cyan-500/20">{tag}</span>))}
      </div>
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-2 bg-cyan-500/10 border border-cyan-500/30 text-center rounded text-cyan-300 font-mono text-xs hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2 cursor-none">
        INITIATE MISSION <FaExternalLinkAlt />
      </a>
    </div>
  </motion.div>
);

// --- MAIN PORTFOLIO COMPONENT ---
export default function Portfolio() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  // --- ASTRONAUT TILT & FLOAT ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-25deg", "25deg"]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs.sendForm('service_ghhiqnh', 'template_e2bht5q', formRef.current, 'fTUznH7Lbg9Xn7pWs')
      .then(() => { setLoading(false); alert("Signal Transmitted!"); e.target.reset(); }, () => { setLoading(false); alert("Transmission Failed."); });
  };

  const innerOrbitSkills = [
    { name: "React", icon: <SiReact className="text-cyan-400"/> },
    { name: "Node", icon: <SiNodedotjs className="text-green-500"/> },
    { name: "Mongo", icon: <SiMongodb className="text-green-400"/> },
    { name: "Next", icon: <SiNextdotjs className="text-white"/> },
    { name: "Tailwind", icon: <SiTailwindcss className="text-cyan-300"/> },
  ];
  const outerOrbitSkills = [
    { name: "Python", icon: <SiPython className="text-yellow-400"/> },
    { name: "Java", icon: <FaJava className="text-red-500"/> },
    { name: "Cpp", icon: <SiCplusplus className="text-blue-500"/> },
    { name: "Flutter", icon: <SiFlutter className="text-blue-400"/> },
    { name: "OpenCV", icon: <SiOpencv className="text-green-300"/> },
    { name: "Firebase", icon: <SiFirebase className="text-yellow-500"/> },
  ];

  // --- SEPARATE PROJECT ARRAYS ---
  const groupProjects = [
    { title: "Kumbh Rakshak", desc: "AI crowd safety protocol using DeepFace & CCTV.", tags: ["Python", "AI"], icon: "🛡️", link: "https://github.com/SaumyaPratapSingh-cyber/Kumbh-Rakshak-Surveillance-System" },
    { title: "Krishi Seva 2.0", desc: "Terraforming & Crop Analysis for farmers.", tags: ["MERN", "ML"], icon: "🌱", link: "https://github.com/SaumyaPratapSingh-cyber/Krishi-Seva-App-for-to-farmers-" },
  ];

  const personalProjects = [
    { title: "MudraVani", desc: "Universal Sign Language Translator.", tags: ["Python", "OpenCV"], icon: "✋", link: "https://github.com/Manglashukla/MudraVani-AI" },
    { title: "ShoppingKart", desc: "Galactic E-commerce System.", tags: ["React", "Node"], icon: "🛒", link: "https://github.com/Manglashukla/shoppingkart" },
    { title: "Expense Tracker", desc: "Resource Logistics & Tracking.", tags: ["Python", "Data"], icon: "📊", link: "https://github.com/Manglashukla/Expense-Tracker" }
  ];

  return (
    <div className="text-white min-h-screen font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden cursor-none">
      <Starfield />
      <CustomCursor />

      <style jsx global>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .animate-twinkle { animation-name: twinkle; }
        @keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        /* Floating Animation */
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-sm bg-black/10 border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-tighter">MANGLA<span className="text-cyan-400">.GALAXY</span></h1>
        <div className="hidden md:flex gap-8 text-xs font-mono tracking-widest text-cyan-100/70">
          <a href="#home" className="hover:text-cyan-400 transition cursor-none">[BASE]</a>
          <a href="#about" className="hover:text-cyan-400 transition cursor-none">[ABOUT]</a>
          <a href="#experience" className="hover:text-cyan-400 transition cursor-none">[LOGS]</a>
          <a href="#skills" className="hover:text-cyan-400 transition cursor-none">[SYSTEMS]</a>
          <a href="#projects" className="hover:text-cyan-400 transition cursor-none">[MISSIONS]</a>
        </div>
        
        <div className="flex gap-4">
            <a href="/ManglaShukla_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 px-6 py-2 border border-cyan-500/50 text-cyan-400 font-mono text-xs rounded hover:bg-cyan-900/20 transition-all cursor-none">
              <FaFileDownload /> RESUME_FILE
            </a>
            <a href="#contact" className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-mono text-xs rounded hover:bg-cyan-500 hover:text-black transition-all cursor-none">
              CONNECT_UPLINK
            </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 relative pt-20 overflow-hidden perspective-1000">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="md:w-1/2 z-10 space-y-6 text-center md:text-left order-2 md:order-1">
          <h2 className="text-cyan-500 text-xs font-mono tracking-[0.3em]">/// EXPLORER ID: 21230510</h2>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-slate-600">
            MANGLA
          </h1>
          <div className="text-lg md:text-2xl font-mono text-cyan-200/80 h-8">
            <Typewriter words={["SPACE_DEV", "AI_PIONEER", "SYSTEM_ARCHITECT"]} />
          </div>
          <p className="text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
            Traversing the digital cosmos. Specialized in <b className="text-white">MERN Systems</b> and <b className="text-white">Artificial Intelligence</b> protocols.
          </p>
          <div className="flex gap-4 justify-center md:justify-start pt-4">
            <a href="https://linkedin.com/in/mangla-shukla" target="_blank" className="flex items-center gap-2 px-8 py-3 rounded bg-white text-black font-bold hover:bg-cyan-400 transition cursor-none"><FaLinkedin /> LINKEDIN</a>
            <a href="https://github.com/Manglashukla" target="_blank" className="flex items-center gap-2 px-8 py-3 rounded border border-white/20 hover:border-cyan-400 hover:text-cyan-400 transition cursor-none"><FaGithub /> GITHUB</a>
          </div>
        </motion.div>
        
        {/* ASTRONAUT - REFINED MASK & FLOAT ANIMATION */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={{ rotateX: rotateX, rotateY: rotateY, transformStyle: "preserve-3d" }} 
            className="md:w-1/2 h-[600px] w-full relative flex items-center justify-center order-1 md:order-2"
        >
           {/* Added soft gradient mask and float animation */}
           <div className="w-full h-full [mask-image:radial-gradient(circle_at_center,white_40%,transparent_80%)] animate-[float_6s_ease-in-out_infinite]">
              {/* ✨ REMOVED 'backgroundColor' PROP TO FIX ERROR ✨ */}
              <Spline scene="/astro.splinecode" className="w-full h-full" />
           </div>
        </motion.div>
      </section>

      {/* ABOUT ME */}
      <section id="about" className="py-24 px-6 relative z-10 bg-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="md:w-1/2 flex justify-center"
            >
                <div className="relative w-80 h-80 md:w-96 md:h-96 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-[2rem] rotate-6 opacity-50 blur-lg group-hover:rotate-12 transition-all duration-500"></div>
                    <img src="/myphoto.png" alt="Mangla Shukla" className="relative w-full h-full object-cover rounded-[2rem] border-2 border-white/10 shadow-2xl grayscale hover:grayscale-0 transition duration-500"/>
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="md:w-1/2 space-y-6">
                <div className="flex items-center gap-2">
                    <span className="h-1 w-12 bg-cyan-500 rounded-full"></span>
                    <h2 className="text-3xl font-bold uppercase tracking-wider text-white">About Profile</h2>
                </div>
                <h3 className="text-4xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                    I'm <span className="text-cyan-400">Mangla Shukla</span>, navigating the frontiers of Code & AI.
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg font-light">
                    My mission is to engineer robust digital systems. I specialize in building full-stack applications using the <b>MERN Stack</b> and developing intelligent models with <b>Python & AI</b>.
                </p>
                <div className="grid grid-cols-3 gap-6 pt-6 font-mono text-sm">
                    <div className="p-4 bg-white/5 rounded border border-white/10"><h4 className="text-2xl font-bold text-white">&lt;1</h4><p className="text-cyan-500">Year Exp.</p></div>
                    <div className="p-4 bg-white/5 rounded border border-white/10"><h4 className="text-2xl font-bold text-white">05+</h4><p className="text-cyan-500">Projects</p></div>
                    <div className="p-4 bg-white/5 rounded border border-white/10"><h4 className="text-2xl font-bold text-white">05+</h4><p className="text-cyan-500">Hackathons</p></div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto h-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2 text-white">MISSION <span className="text-cyan-500">LOGS</span></h2>
            <p className="text-gray-500 font-mono text-sm">/// EXPERIENCE & EDUCATION</p>
          </div>
          <div className="relative wrap overflow-hidden p-4 h-full">
            <div className="border-2-2 absolute border-opacity-20 border-cyan-500/30 h-full border" style={{ left: '50%' }}></div>
            <TimelineItem isLeft={true} date="Sep 2025 - Present" title="Campus Ambassador" company="Unstop" icon={<FaBullhorn />} description="Promoting coding culture and organizing hackathons." />
            <TimelineItem isLeft={false} date="2025" title="GDGOC Hackathon Finalist" company="Google Developer Groups" icon={<FaTrophy />} description="Secured Top 10 rank with 'Kumbh Rakshak' project." />
            <TimelineItem isLeft={true} date="Aug 2025" title="Web Dev Intern" company="IBM" icon={<FaBuilding />} description="Developed a full-stack e-commerce platform using MERN." />
            <TimelineItem isLeft={false} date="Summer 2024" title="Python Training" company="UCER" icon={<FaLaptopCode />} description="Intensive summer training in Python & Data Science." />
            <TimelineItem isLeft={true} date="2023 - 2027" title="B.Tech (CSE - AI/ML)" company="UCER" icon={<FaCertificate />} description="Pursuing B.Tech with specialization in AI & ML." />
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="min-h-screen py-24 relative flex flex-col items-center justify-center overflow-hidden z-10">
        <div className="text-center z-10 mb-20">
          <h2 className="text-3xl font-bold mb-2 text-white">ORBITAL <span className="text-cyan-500">SYSTEMS</span></h2>
          <p className="text-gray-500 font-mono text-sm">/// TECH_STACK_ROTATION</p>
        </div>

        <div className="relative w-[800px] h-[800px] flex items-center justify-center">
          
          {/* ✨ SUN REFINED: Added rounded-full & Glow ✨ */}
          <div className="absolute z-10 w-[280px] h-[280px] rounded-full overflow-hidden shadow-[0_0_80px_rgba(253,186,116,0.8)]">
             {/* ✨ REMOVED 'backgroundColor' PROP & ADDED INNER SHADOW FOR BLENDING ✨ */}
             <div className="w-full h-full rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)' }}>
                <Spline scene="/sun.splinecode" className="w-full h-full scale-110" />
             </div>
          </div>
          
          <div className="absolute w-[450px] h-[450px] border border-cyan-500/20 rounded-full animate-[spin_25s_linear_infinite]" />
          {innerOrbitSkills.map((skill, i) => (
               <div key={i} className="absolute w-[450px] h-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: `translate(-50%, -50%) rotate(${i * (360/innerOrbitSkills.length)}deg)` }}>
                 <OrbitingSkill skill={skill} radius={225} duration={25} reverse={false} />
               </div>
          ))}
          <div className="absolute w-[700px] h-[700px] border border-purple-500/20 rounded-full" />
          {outerOrbitSkills.map((skill, i) => (
             <div key={i} className="absolute w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: `translate(-50%, -50%) rotate(${i * (360/outerOrbitSkills.length)}deg)` }}>
                 <OrbitingSkill skill={skill} radius={350} duration={40} reverse={true} />
             </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">COMPLETED <span className="text-cyan-500">MISSIONS</span></h2>
          
          {/* GROUP PROJECTS SECTION */}
          <div className="mb-16">
            <h3 className="text-xl font-mono text-cyan-300 mb-8 border-b border-cyan-500/30 pb-2 inline-block">🚀 SQUADRON MISSIONS (Group Projects)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupProjects.map((project, i) => (
                    <ProjectCard key={i} project={project} />
                ))}
            </div>
          </div>

          {/* PERSONAL PROJECTS SECTION */}
          <div>
            <h3 className="text-xl font-mono text-purple-300 mb-8 border-b border-purple-500/30 pb-2 inline-block">👤 SOLO EXPEDITIONS (Personal Projects)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {personalProjects.map((project, i) => (
                    <ProjectCard key={i} project={project} />
                ))}
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">OPEN <span className="text-cyan-500">CHANNEL</span></h2>
            <p className="text-gray-400 text-sm font-mono mt-2">Ready to initiate collaboration?</p>
          </div>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="user_name" placeholder="IDENTIFIER (NAME)" required className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-cyan-500 outline-none font-mono text-sm" />
              <input type="email" name="user_email" placeholder="FREQUENCY (EMAIL)" required className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-cyan-500 outline-none font-mono text-sm" />
            </div>
            <textarea name="message" rows="4" placeholder="TRANSMISSION DATA..." required className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-cyan-500 outline-none font-mono text-sm"></textarea>
            <button disabled={loading} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded font-mono transition cursor-none">
              {loading ? "SENDING SIGNAL..." : "TRANSMIT"}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-xs font-mono border-t border-white/5 relative z-10"><p>SYSTEM STATUS: ONLINE // 2027 MANGLA SHUKLA</p></footer>
    </div>
  );
}