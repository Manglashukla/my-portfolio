"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import emailjs from '@emailjs/browser';
import dynamic from 'next/dynamic';
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaBullhorn, FaTrophy, FaBuilding, FaLaptopCode, FaCertificate, FaFileDownload, FaExternalLinkAlt 
} from 'react-icons/fa';
import { 
  SiNextdotjs, SiTailwindcss, SiMongodb, SiExpress, SiReact, SiNodedotjs,
  SiCplusplus, SiFirebase, SiFlutter, SiOpencv, SiPython, SiTensorflow, SiPostman, SiGit
} from 'react-icons/si';

// --- DYNAMIC SPLINE LOADER ---
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-amber-500 font-mono text-xs animate-pulse">
      CONJURING 3D ELEMENTS...
    </div>
  ),
});

// --- COMPONENT: ROYAL EMBERS & GRADIENT BACKGROUND ---
const EmbersAndDiyas = () => {
  const [embers, setEmbers] = useState([]);

  useEffect(() => {
    const generatedEmbers = new Array(35).fill(0).map(() => ({
      left: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 4}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 8}s`
    }));
    setEmbers(generatedEmbers);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#220202] via-[#0d0101] to-[#040000] overflow-hidden">
      {/* Drifting embers */}
      {embers.map((ember, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-t from-amber-500 via-red-500 to-red-600 rounded-full opacity-0 animate-drift"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
            animationIterationCount: 'infinite',
            boxShadow: '0 0 10px #f59e0b, 0 0 20px #dc2626'
          }}
        />
      ))}
      {/* Soft Palace Ambient Glows (Highly aesthetic reddish-gold lighting) */}
      <div className="absolute top-[-5%] right-[-5%] w-[700px] h-[700px] bg-red-800/20 rounded-full blur-[140px] mix-blend-screen" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[700px] h-[700px] bg-amber-800/15 rounded-full blur-[140px] mix-blend-screen" />
      <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-red-900/15 rounded-full blur-[120px] mix-blend-screen" />
    </div>
  );
};

// --- COMPONENT: CUSTOM CURSOR ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
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
      <motion.div className="fixed top-0 left-0 w-2 h-2 bg-amber-500 rounded-full pointer-events-none z-[9999] shadow-[0_0_15px_#f59e0b]" style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }} />
      <motion.div className="fixed top-0 left-0 w-8 h-8 border border-amber-500/50 rounded-full pointer-events-none z-[9998]" style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }} />
    </>
  );
};

// --- COMPONENT: TYPEWRITER ---
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

  return <span className="text-amber-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">{`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}</span>;
};

// --- COMPONENT: TIMELINE ITEM ---
const TimelineItem = ({ date, title, company, description, icon, isLeft }) => (
    <div className={`mb-8 flex justify-between items-center w-full ${isLeft ? 'flex-row-reverse' : ''} relative`}>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-red-950/80 border border-amber-500/40 shadow-[0_0_15px_rgba(212,175,55,0.3)] w-10 h-10 rounded-full justify-center text-amber-400 backdrop-blur-md">
        {icon}
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`order-1 bg-white/5 backdrop-blur-md rounded-lg shadow-xl w-5/12 px-6 py-4 border border-amber-500/20 hover:border-amber-500/50 transition-all ${isLeft ? 'text-right' : ''}`}
      >
        <h3 className="mb-1 font-bold text-white text-lg font-royal-subheading tracking-wide">{title}</h3>
        <h4 className="mb-2 text-amber-400 text-sm font-semibold tracking-wider">{company}</h4>
        <p className="text-sm leading-snug text-gray-300 font-body">{description}</p>
        <span className="text-xs text-amber-500/70 mt-2 block font-mono">{date}</span>
      </motion.div>
    </div>
);

// --- COMPONENT: PROJECT CARD ---
const ProjectCard = ({ project }) => (
  <motion.div whileHover={{ y: -5, boxShadow: "0 0 25px rgba(245,158,11,0.15)" }} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all cursor-none flex flex-col h-full">
    <div className="h-40 bg-gradient-to-br from-[#1c0505] to-black flex items-center justify-center text-5xl group-hover:text-amber-400 transition">{project.icon}</div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-amber-400 font-royal-subheading tracking-wide">{project.title}</h3>
      <p className="text-gray-300 text-sm mb-4 flex-grow font-body">{project.desc}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map(tag => (<span key={tag} className="text-[10px] bg-red-950/40 text-amber-300 px-2 py-1 rounded font-mono border border-amber-500/20">{tag}</span>))}
      </div>
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-2 bg-amber-500/10 border border-amber-500/30 text-center rounded text-amber-300 font-mono text-xs hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2 cursor-none">
        VISIT ARCHIVE <FaExternalLinkAlt />
      </a>
    </div>
  </motion.div>
);

// --- COMPONENT: PERFECTLY ALIGNED ORBITAL SKILL ---
const OrbitingSkill = ({ skill, diameter, duration, reverse, initialAngle }) => {
  return (
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        transform: `translate(-50%, -50%) rotate(${initialAngle}deg)`, 
      }}
    >
      <div 
        className="w-full h-full absolute top-0 left-0"
        style={{
            animation: `spin ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'}`,
        }}
      >
        <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
                animation: `spin ${duration}s linear infinite ${reverse ? 'normal' : 'reverse'}`,
            }}
        >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/80 backdrop-blur-md border border-amber-500/30 rounded-full flex items-center justify-center text-xl md:text-3xl text-white shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:scale-125 hover:border-amber-400 hover:shadow-[0_0_25px_#f59e0b] transition-all cursor-pointer z-50">
            {skill.icon}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: MYSTERY RED CURTAIN (PARDA) REVEAL ---
const CurtainReveal = ({ src, alt }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="relative w-80 h-80 md:w-96 md:h-96 rounded-[2rem] overflow-hidden border-2 border-amber-500/30 shadow-2xl cursor-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Image (User Photo) */}
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />

      {/* Crimson Left Curtain Panel */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: hovered ? "-100%" : "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-800 via-red-950 to-red-900 border-r border-amber-500/40 z-20 flex justify-end items-center"
        style={{ transformOrigin: "left" }}
      >
        {/* Gold Handle/Tassel on Left Curtain */}
        <div className="w-1.5 h-16 bg-gradient-to-b from-amber-400 via-amber-200 to-amber-600 rounded-full mr-2 shadow-[0_0_10px_rgba(245,158,11,0.5)] flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-amber-400 border border-red-950" />
        </div>
      </motion.div>

      {/* Crimson Right Curtain Panel */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-800 via-red-950 to-red-900 border-l border-amber-500/40 z-20 flex justify-start items-center"
        style={{ transformOrigin: "right" }}
      >
        {/* Gold Handle/Tassel on Right Curtain */}
        <div className="w-1.5 h-16 bg-gradient-to-b from-amber-400 via-amber-200 to-amber-600 rounded-full ml-2 shadow-[0_0_10px_rgba(245,158,11,0.5)] flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-amber-400 border border-red-950" />
        </div>
      </motion.div>

      {/* Ambient overlay */}
      <div className="absolute inset-0 bg-red-950/10 pointer-events-none mix-blend-overlay z-10" />

      {/* Decorative Ornate Corner Borders */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/40 pointer-events-none z-30" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/40 pointer-events-none z-30" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400/40 pointer-events-none z-30" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 pointer-events-none z-30" />
    </div>
  );
};

// --- MAIN PORTFOLIO COMPONENT ---
export default function Portfolio() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs.sendForm('service_ghhiqnh', 'template_e2bht5q', formRef.current, 'fTUznH7Lbg9Xn7pWs')
      .then(() => { setLoading(false); alert("Summon Dispatch Success!"); e.target.reset(); }, () => { setLoading(false); alert("Dispatch Failed."); });
  };

  const innerOrbitSkills = [
    { name: "React", icon: <SiReact className="text-cyan-400"/> },
    { name: "Node", icon: <SiNodedotjs className="text-green-500"/> },
    { name: "Mongo", icon: <SiMongodb className="text-green-400"/> },
    { name: "Next", icon: <SiNextdotjs className="text-white"/> },
    { name: "Express", icon: <SiExpress className="text-amber-200"/> },
  ];
  const outerOrbitSkills = [
    { name: "Python", icon: <SiPython className="text-yellow-400"/> },
    { name: "Cpp", icon: <SiCplusplus className="text-blue-500"/> },
    { name: "OpenCV", icon: <SiOpencv className="text-green-300"/> },
    { name: "TensorFlow", icon: <SiTensorflow className="text-orange-500"/> },
    { name: "Firebase", icon: <SiFirebase className="text-yellow-500"/> },
    { name: "Git", icon: <SiGit className="text-red-500"/> },
  ];

  const hackathonProjects = [
    { title: "PrepXtra", desc: "A modern, advanced learning system featuring an AI-driven 3D interviewer to simulate real-world technical assessments, evaluating developer capabilities dynamically.", tags: ["Next.js", "AI Agent", "Three.js", "WebRTC"], icon: "🤖", link: "https://github.com/SaumyaPratapSingh-cyber/PrepXtra" },
    { title: "Kumbh Rakshak", desc: "Podium-winning security and crowd safety platform designed for the Kumbh Mela. Automatically monitors real-time feeds from 1000+ security cameras using AI object tracking to find missing persons and map dense pedestrian flows.", tags: ["Computer Vision", "AI Tracking", "Node.js", "Mapbox"], icon: "👁️", link: "https://github.com/SaumyaPratapSingh-cyber/Kumbh-Rakshak-Surveillance-System" },
    { title: "Krishi Seva 2.0", desc: "Crop analysis platform integrating Machine Learning models with 85% accuracy in soil health analysis and real-time recommendation, improving yield predictions by 15% for local farmers.", tags: ["Flutter", "Firebase", "Machine Learning", "GCP"], icon: "🌱", link: "https://github.com/SaumyaPratapSingh-cyber/Krishi-Seva-App-for-to-farmers-" },
  ];

  const personalProjects = [
    { title: "Satyamev-Chain", desc: "Decentralized blockchain application for transparent civic data management, processing immutable records that improved local data accountability by an estimated 40% for targeted user groups.", tags: ["Blockchain", "Web3", "Full-Stack"], icon: "⛓️", link: "https://github.com/Manglashukla/Yantriq" },
    { title: "Mudra-Vani", desc: "Accessible sign language translator using computer vision, recognizing 50+ distinct gestures with low latency (<200ms per frame) to convert hand movements to text.", tags: ["Python", "OpenCV", "MediaPipe", "TensorFlow"], icon: "✋", link: "https://github.com/Manglashukla/MudraVani-AI" },
    { title: "ShoppingKart", desc: "Advanced MERN stack e-commerce platform with secure JWT authentication, Stripe payment integration, Cloudinary media hosting, and an admin analytics dashboard.", tags: ["MERN Stack", "JWT", "Stripe", "Cloudinary"], icon: "🛒", link: "https://github.com/Manglashukla/shoppingkart" }
  ];

  return (
    <div className="text-white min-h-screen font-sans selection:bg-red-800 selection:text-amber-300 overflow-x-hidden cursor-none">
      <EmbersAndDiyas />
      <CustomCursor />

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-black/30 border-b border-amber-500/10">
        <h1 className="text-xl font-royal-heading font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600 royal-glow-gold">
          MANGLA<span className="text-red-500 font-sans font-medium text-base ml-1">SHUKLA</span>
        </h1>
        <div className="hidden md:flex gap-8 text-xs font-mono tracking-widest text-amber-100/60">
          <a href="#home" className="hover:text-amber-400 transition cursor-none">[COURTYARD]</a>
          <a href="#about" className="hover:text-amber-400 transition cursor-none">[CHRONICLES]</a>
          <a href="#experience" className="hover:text-amber-400 transition cursor-none">[LEGACY]</a>
          <a href="#skills" className="hover:text-amber-400 transition cursor-none">[TALENTS]</a>
          <a href="#projects" className="hover:text-amber-400 transition cursor-none">[CREATIONS]</a>
          <a href="#achievements" className="hover:text-amber-400 transition cursor-none">[GLORY]</a>
        </div>
        
        <div className="flex gap-4">
            <a href="/Mangla Shukla_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 px-6 py-2 border border-amber-500/50 text-amber-400 font-mono text-xs rounded hover:bg-amber-500/10 transition-all cursor-none royal-glow-gold">
              <FaFileDownload /> RESUME
            </a>
            <a href="#contact" className="px-6 py-2 bg-red-950/40 border border-amber-500/50 text-amber-400 font-mono text-xs rounded hover:bg-amber-500 hover:text-black transition-all cursor-none">
              SUMMON_COURT
            </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 relative pt-24 overflow-hidden perspective-1000">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="md:w-1/2 z-10 space-y-6 text-center md:text-left order-2 md:order-1">
          <h2 className="text-amber-500 text-xs font-mono tracking-[0.3em]">/// COURT DESIGNATION: FULL-STACK ARCHITECT & AI ENGINEER</h2>
          <h1 className="text-4xl md:text-7xl font-black font-royal-heading tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-100 to-amber-600 royal-glow-gold">
            MANGLA SHUKLA
          </h1>
          <div className="text-lg md:text-2xl font-mono text-amber-200/80 h-8">
            <Typewriter words={["TECH_MAESTRO", "FULL_STACK_ARCHITECT", "AI_CRAFTSMAN"]} />
          </div>
          <p className="text-gray-300 max-w-lg mx-auto md:mx-0 leading-relaxed font-light font-body">
            Crafting scalable software kingdoms. Specialized in the <b className="text-amber-400">MERN Stack</b>, <b className="text-amber-400">Artificial Intelligence</b> protocols, and algorithmic logic.
          </p>
          <div className="flex gap-4 justify-center md:justify-start pt-4">
            <a href="https://www.linkedin.com/in/mangla-shukla/" target="_blank" className="flex items-center gap-2 px-8 py-3 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition cursor-none"><FaLinkedin /> LINKEDIN</a>
            <a href="https://github.com/Manglashukla" target="_blank" className="flex items-center gap-2 px-8 py-3 rounded border border-amber-500/20 hover:border-amber-400 hover:text-amber-400 transition cursor-none"><FaGithub /> GITHUB</a>
          </div>
        </motion.div>
        
        {/* USER SPECIFIED 3D SPLINE CANVAS WITH Dedicated backglow aura */}
        <div className="md:w-1/2 w-full h-[550px] relative flex items-center justify-center order-1 md:order-2">
          {/* Rich Crimson and Gold Backdrop Auras */}
          <div className="absolute w-[450px] h-[450px] bg-red-800/25 rounded-full blur-[90px] pointer-events-none mix-blend-screen" />
          <div className="absolute w-[300px] h-[300px] bg-amber-600/15 rounded-full blur-[70px] pointer-events-none mix-blend-screen" />
          
          <div className="w-full h-full [mask-image:radial-gradient(circle_at_center,white_60%,transparent_90%)] animate-[float_6s_ease-in-out_infinite] pt-4 z-10">
            <Spline scene="https://prod.spline.design/k3zEjNgimy9bmYC2/scene.splinecode" className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* ABOUT ME - [CHRONICLES] */}
      <section id="about" className="py-24 px-6 relative z-10 bg-black/40 border-t border-b border-amber-500/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="md:w-1/2 flex justify-center"
            >
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-red-700 rounded-[2rem] rotate-6 opacity-30 blur-lg group-hover:rotate-12 transition-all duration-500"></div>
                    <CurtainReveal src="/myphoto.png" alt="Mangla Shukla" />
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="md:w-1/2 space-y-6">
                <div className="flex items-center gap-2">
                    <span className="h-1 w-12 bg-amber-500 rounded-full"></span>
                    <h2 className="text-3xl font-royal-heading font-bold uppercase tracking-wider text-white">About Profile</h2>
                </div>
                <h3 className="text-3xl font-royal-subheading leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-200">
                    I'm <span className="text-amber-400">Mangla Shukla</span>, Architect of Web Systems and Intelligent Engines.
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg font-light font-body">
                  Dynamic Full-Stack Developer and AI Engineer specializing in the MERN Stack and Artificial Intelligence protocols. Experienced in creating scalable end-to-end applications with strong problem-solving skills rooted in Data Structures and Algorithms.
                </p>
                <div className="grid grid-cols-3 gap-6 pt-6 font-mono text-sm">
                    <div className="p-4 bg-white/5 rounded border border-amber-500/10"><h4 className="text-2xl font-bold text-white">2027</h4><p className="text-amber-500">B.Tech Grad</p></div>
                    <div className="p-4 bg-white/5 rounded border border-amber-500/10"><h4 className="text-2xl font-bold text-white">06+</h4><p className="text-amber-500">Creations</p></div>
                    <div className="p-4 bg-white/5 rounded border border-amber-500/10"><h4 className="text-2xl font-bold text-white">GFG #1</h4><p className="text-amber-500">DSA Rank</p></div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* EXPERIENCE & EDUCATION - [LEGACY] */}
      <section id="experience" className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto h-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-royal-heading font-bold mb-2 text-white">CHRONICLES OF <span className="text-amber-400">LEGACY</span></h2>
            <p className="text-gray-500 font-mono text-sm">/// EXPERIENCE & EDUCATION PATHWAY</p>
          </div>
          <div className="relative wrap overflow-hidden p-4 h-full">
            <div className="border-2-2 absolute border-opacity-20 border-amber-500/30 h-full border" style={{ left: '50%' }}></div>
            
            <TimelineItem 
              isLeft={true} 
              date="Sep 2025 - Present" 
              title="Campus Ambassador" 
              company="Unstop" 
              icon={<FaBullhorn />} 
              description="Spearheaded the organization of 5+ technical events and hackathons. Led communication strategies on campus, boosting student engagement by 30%." 
            />
            
            <TimelineItem 
              isLeft={false} 
              date="Jun 2025 - Aug 2025" 
              title="Web Development Intern" 
              company="IBM (Remote)" 
              icon={<FaBuilding />} 
              description="Collaborated in a cross-functional team to engineer a scalable MERN stack e-commerce platform optimized for 500+ concurrent users. Built secure authentication and RESTful APIs, reducing data retrieval latency by 20%." 
            />

            <TimelineItem 
              isLeft={true} 
              date="Jan 2025" 
              title="GDGOC Hackathon 3rd Place" 
              company="Google Developer Groups" 
              icon={<FaTrophy />} 
              description="Podium finish (3rd Position) for the innovative civic project 'Kumbh Rakshak', which optimized public tracking systems during massive gatherings." 
            />

            <TimelineItem 
              isLeft={false} 
              date="2023 - 2027" 
              title="B.Tech (CSE - AI & ML)" 
              company="United College of Engineering and Research" 
              icon={<FaLaptopCode />} 
              description="Pursuing B.Tech specialization in Artificial Intelligence & Machine Learning. Relevant coursework: Data Structures, OOP, DBMS, OS, and ML foundations." 
            />

            <TimelineItem 
              isLeft={true} 
              date="Jul 2023" 
              title="Python Programming Certification" 
              company="UCER" 
              icon={<FaCertificate />} 
              description="Completed rigorous training in Python development, focusing on data science and structural scripting protocols." 
            />

            <TimelineItem 
              isLeft={false} 
              date="Completed May 2023" 
              title="Intermediate (Class XII)" 
              company="UP Board (PCM Stream)" 
              icon={<FaCertificate />} 
              description="Scored 87% in Intermediate exams, establishing a solid mathematical and technical foundation." 
            />
          </div>
        </div>
      </section>

      {/* SKILLS - [TALENTS] - PERFECTLY ALIGNED ORBITS */}
      <section id="skills" className="min-h-screen py-24 relative flex flex-col items-center justify-center overflow-hidden z-10 bg-black/20">
        <div className="text-center z-10 mb-20">
          <h2 className="text-3xl font-royal-heading font-bold mb-2 text-white">ORBITAL <span className="text-amber-400">TALENTS</span></h2>
          <p className="text-gray-500 font-mono text-sm">/// TECHNICAL ORBIT SYSTEMS</p>
        </div>

        {/* CONTAINER FOR THE SYSTEM */}
        <div className="relative w-[800px] h-[800px] flex items-center justify-center scale-90 md:scale-100">
          
          {/* ROYAL GOLDEN MANDALA (Center) */}
          <div className="absolute z-10 w-[240px] h-[240px] flex items-center justify-center animate-[spin_60s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" fill="none" stroke="currentColor" strokeWidth="0.8">
              <circle cx="50" cy="50" r="48" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="44" />
              {Array.from({ length: 12 }).map((_, i) => (
                <path key={i} d="M50 50 C40 30 60 30 50 10 C40 30 60 30 50 50" transform={`rotate(${i * 30} 50 50)`} />
              ))}
              {Array.from({ length: 24 }).map((_, i) => (
                <circle key={i} cx="50" cy="18" r="1.2" transform={`rotate(${i * 15} 50 50)`} fill="currentColor" />
              ))}
              <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="20" />
              {Array.from({ length: 8 }).map((_, i) => (
                <path key={i} d="M50 50 C45 40 55 40 50 30" transform={`rotate(${i * 45} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="8" fill="currentColor" className="opacity-20" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
            </svg>
          </div>
          
          {/* INNER ORBIT SYSTEM (Diameter 450px) */}
          <div className="absolute w-[450px] h-[450px] border border-amber-500/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          {innerOrbitSkills.map((skill, i) => (
             <OrbitingSkill 
                key={i} 
                skill={skill} 
                diameter={450} 
                duration={25} 
                reverse={false} 
                initialAngle={i * (360 / innerOrbitSkills.length)}
             />
          ))}

          {/* OUTER ORBIT SYSTEM (Diameter 700px) */}
          <div className="absolute w-[700px] h-[700px] border border-red-800/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          {outerOrbitSkills.map((skill, i) => (
             <OrbitingSkill 
                key={i} 
                skill={skill} 
                diameter={700} 
                duration={40} 
                reverse={true} 
                initialAngle={i * (360 / outerOrbitSkills.length)}
             />
          ))}

        </div>
      </section>

      {/* PROJECTS - [CREATIONS] */}
      <section id="projects" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-royal-heading font-bold mb-16 text-center">LEGACY <span className="text-amber-400">CREATIONS</span></h2>
          
          {/* HACKATHON MISSIONS */}
          <div className="mb-16">
            <h3 className="text-lg font-mono text-amber-300 mb-8 border-b border-amber-500/30 pb-2 inline-block">🏆 HACKATHON MISSIONS</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hackathonProjects.map((project, i) => (
                    <ProjectCard key={i} project={project} />
                ))}
            </div>
          </div>

          {/* SOLO EXPEDITIONS */}
          <div>
            <h3 className="text-lg font-mono text-red-300 mb-8 border-b border-red-500/30 pb-2 inline-block">👤 SOLO EXPEDITIONS</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {personalProjects.map((project, i) => (
                    <ProjectCard key={i} project={project} />
                ))}
            </div>
          </div>

        </div>
      </section>

      {/* ACHIEVEMENTS & CERTIFICATIONS - [GLORY] */}
      <section id="achievements" className="py-24 px-6 relative z-10 bg-black/40 border-t border-b border-amber-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-royal-heading font-bold mb-2 text-white">COURT OF <span className="text-amber-400">GLORY</span></h2>
            <p className="text-gray-500 font-mono text-sm">/// ACHIEVEMENTS & RECOGNITIONS</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side achievements */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-white/5 border border-amber-500/20 rounded-2xl space-y-6"
            >
              <h3 className="text-xl font-royal-subheading font-bold text-amber-400 border-b border-amber-500/20 pb-2 flex items-center gap-2">
                <FaTrophy /> Major Milestones
              </h3>
              
              <ul className="space-y-4 font-body text-sm text-gray-300">
                <li className="flex gap-3 items-start">
                  <span className="text-amber-500 mt-1">✦</span>
                  <div>
                    <strong className="text-white">3rd Position: GDGOC Hackathon 2025</strong>
                    <p className="text-gray-400 text-xs">Awarded by Google Developer Groups for the project 'Kumbh Rakshak'.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-amber-500 mt-1">✦</span>
                  <div>
                    <strong className="text-white">1st Rank: GeeksforGeeks DSA Contest</strong>
                    <p className="text-gray-400 text-xs">Secured absolute 1st position in Week 3 & Week 7 competitive algorithmic challenges.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-amber-500 mt-1">✦</span>
                  <div>
                    <strong className="text-white">Hackathon Participations</strong>
                    <p className="text-gray-400 text-xs">Actively competed in NASA Space Apps Challenge, HackDiwas 2.0 & 3.0 (United University), Yukti 1.0 (BBS), and Zennovatio Hackathon (Chandigarh University).</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Right side certifications */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-white/5 border border-amber-500/20 rounded-2xl space-y-6"
            >
              <h3 className="text-xl font-royal-subheading font-bold text-amber-400 border-b border-amber-500/20 pb-2 flex items-center gap-2">
                <FaCertificate /> Credentials & Extracurriculars
              </h3>
              
              <ul className="space-y-4 font-body text-sm text-gray-300">
                <li className="flex gap-3 items-start">
                  <span className="text-amber-500 mt-1">✦</span>
                  <div>
                    <strong className="text-white">MERN Stack Development Certification [IBM]</strong>
                    <p className="text-gray-400 text-xs">August 2024. Comprehensive training on Mongo, Express, React, and Node systems.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-amber-500 mt-1">✦</span>
                  <div>
                    <strong className="text-white">Python Programming Certification [UCER]</strong>
                    <p className="text-gray-400 text-xs">July 2023. Core training in programming constructs, algorithms, and libraries.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-amber-500 mt-1">✦</span>
                  <div>
                    <strong className="text-white">Music & Athletics</strong>
                    <p className="text-gray-400 text-xs">Active member of the College Music Band. Runner-up team player in the intercollege cricket tournament.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT - [SUMMON] */}
      <section id="contact" className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto bg-[#180404]/80 backdrop-blur-lg rounded-2xl p-8 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.05)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-royal-heading font-bold text-white">SUMMON THE <span className="text-amber-400">MAESTRO</span></h2>
            <p className="text-gray-400 text-sm font-mono mt-2">Ready to initiate collaboration or request a project?</p>
          </div>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="user_name" placeholder="IDENTIFIER (NAME)" required className="w-full bg-black/50 border border-amber-500/10 rounded p-3 text-white focus:border-amber-500 outline-none font-mono text-sm" />
              <input type="email" name="user_email" placeholder="FREQUENCY (EMAIL)" required className="w-full bg-black/50 border border-amber-500/10 rounded p-3 text-white focus:border-amber-500 outline-none font-mono text-sm" />
            </div>
            <textarea name="message" rows="4" placeholder="TRANSMISSION DATA..." required className="w-full bg-black/50 border border-amber-500/10 rounded p-3 text-white focus:border-amber-500 outline-none font-mono text-sm"></textarea>
            <button disabled={loading} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded font-mono transition cursor-none shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              {loading ? "TRANSMITTING..." : "DISPATCH SUMMONS"}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-xs font-mono border-t border-amber-500/10 relative z-10">
        <p>COURT REGISTRY: ONLINE // 2027 MANGLA SHUKLA // ALL GLORY SECURED</p>
      </footer>
    </div>
  );
}