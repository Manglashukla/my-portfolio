"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import emailjs from '@emailjs/browser';
import dynamic from 'next/dynamic';

// ✨ LOAD LOCAL SPLINE MODEL ✨
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-sm animate-pulse">
      Loading 3D...
    </div>
  ),
});

import { 
  FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt, FaBullhorn, FaTrophy, 
  FaCertificate, FaBuilding, FaLaptopCode, FaExternalLinkAlt, FaJava 
} from 'react-icons/fa';
import { 
  SiNextdotjs, SiTailwindcss, SiMongodb, SiExpress, SiReact, SiNodedotjs,
  SiCplusplus, SiFirebase, SiFlutter, SiOpencv, SiPython 
} from 'react-icons/si';

// --- CUSTOM CURSOR ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
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
      <motion.div className="fixed top-0 left-0 w-4 h-4 bg-purple-500 rounded-full pointer-events-none z-[9999]" style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }} />
      <motion.div className="fixed top-0 left-0 w-12 h-12 border-2 border-purple-400/50 rounded-full pointer-events-none z-[9998] mix-blend-screen" style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }} />
    </>
  );
};

// --- TYPEWRITER ---
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

  return <span className="text-purple-500 font-mono">{`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}</span>;
};

// --- TIMELINE ITEM ---
const TimelineItem = ({ date, title, company, description, icon, isLeft }) => (
  <div className={`mb-8 flex justify-between items-center w-full ${isLeft ? 'flex-row-reverse' : ''}`}>
    <div className="order-1 w-5/12"></div>
    <div className="z-20 flex items-center order-1 bg-purple-600 shadow-xl w-8 h-8 rounded-full justify-center text-white">{icon}</div>
    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`order-1 bg-[#111] rounded-lg shadow-xl w-5/12 px-6 py-4 border border-gray-800 hover:border-purple-500 transition-all ${isLeft ? 'text-right' : ''}`}>
      <h3 className="mb-1 font-bold text-white text-lg">{title}</h3>
      <h4 className="mb-2 text-purple-400 text-sm font-semibold">{company}</h4>
      <p className="text-sm leading-snug text-gray-400 text-opacity-100">{description}</p>
      <span className="text-xs text-gray-500 mt-2 block">{date}</span>
    </motion.div>
  </div>
);

// --- SKILL CARD COMPONENT ---
const SkillCard = ({ skill }) => (
  <div className="w-28 h-28 mx-4 bg-[#111] rounded-xl flex flex-col items-center justify-center border border-gray-800 shadow-lg hover:border-purple-500 hover:shadow-purple-500/20 transition-all cursor-pointer group shrink-0">
    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
    <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{skill.name}</span>
  </div>
);

// --- MAIN PORTFOLIO ---
export default function Portfolio() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = (event.clientX - rect.left) / width - 0.5;
    const mouseYFromCenter = (event.clientY - rect.top) / height - 0.5;
    x.set(mouseXFromCenter);
    y.set(mouseYFromCenter);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs.sendForm('service_ghhiqnh', 'template_e2bht5q', formRef.current, 'fTUznH7Lbg9Xn7pWs')
      .then(() => { setLoading(false); alert("Message Sent Successfully!"); e.target.reset(); }, (error) => { setLoading(false); alert("Error sending message."); console.log(error.text); });
  };

  // --- SKILLS DATA SPLIT INTO TWO ROWS ---
  const skillsRow1 = [
    { name: "React", icon: <SiReact className="text-cyan-400"/> },
    { name: "Node.js", icon: <SiNodedotjs className="text-green-500"/> },
    { name: "Express", icon: <SiExpress className="text-white"/> },
    { name: "MongoDB", icon: <SiMongodb className="text-green-400"/> },
    { name: "Next.js", icon: <SiNextdotjs className="text-white"/> },
    { name: "Tailwind", icon: <SiTailwindcss className="text-cyan-300"/> },
  ];

  const skillsRow2 = [
    { name: "Python", icon: <SiPython className="text-yellow-400"/> },
    { name: "C++", icon: <SiCplusplus className="text-blue-500"/> },
    { name: "Java", icon: <FaJava className="text-red-500"/> },
    { name: "Flutter", icon: <SiFlutter className="text-blue-400"/> },
    { name: "OpenCV", icon: <SiOpencv className="text-green-300"/> },
    { name: "Firebase", icon: <SiFirebase className="text-yellow-500"/> },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden cursor-none">
      
      {/* ✨ CSS FOR MARQUEE ANIMATION ✨ */}
      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 20s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 20s linear infinite;
        }
        /* PAUSE ON HOVER */
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>

      <CustomCursor />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
        <h1 className="text-2xl font-bold">Mangla<span className="text-purple-500">.</span></h1>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#home" className="hover:text-white transition cursor-none">Home</a>
          <a href="#about" className="hover:text-white transition cursor-none">About</a>
          <a href="#experience" className="hover:text-white transition cursor-none">Experience</a>
          <a href="#skills" className="hover:text-white transition cursor-none">Skills</a>
          <a href="#projects" className="hover:text-white transition cursor-none">Projects</a>
        </div>
        <div className="flex gap-4">
            <a href="/ManglaShukla_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 px-6 py-2 border border-gray-700 rounded-full hover:border-purple-500 hover:text-purple-400 transition-all text-sm font-medium cursor-none">Resume</a>
            <a href="#contact" className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-purple-600 hover:text-white transition-all text-sm cursor-none">Hire Me</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 relative pt-20 overflow-hidden perspective-1000">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="md:w-1/2 z-10 space-y-6 text-center md:text-left order-2 md:order-1">
          <h2 className="text-gray-400 text-sm tracking-[0.3em] uppercase">Hello, I am</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-tight">Mangla Shukla</h1>
          <div className="text-xl md:text-3xl font-medium text-gray-300 h-10"><Typewriter words={["Full Stack Developer", "AI/ML Engineer", "MERN Specialist", "Problem Solver"]} /></div>
          <p className="text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed">Aspiring Software Engineer with a background in creating end-to-end applications. Adept at leveraging <b>MERN Stack</b>, <b>Python</b>, and <b>AI Architectures</b>.</p>
          <div className="flex gap-4 justify-center md:justify-start pt-4">
            <a href="https://linkedin.com/in/mangla-shukla" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#0077B5] text-white font-bold hover:bg-[#005582] transition shadow-lg hover:shadow-blue-500/30 cursor-none"><FaLinkedin size={20} /> LinkedIn</a>
            <a href="https://github.com/Manglashukla" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#1a1a1a] text-white font-bold hover:bg-[#333] border border-gray-700 transition shadow-lg hover:shadow-white/10 cursor-none"><FaGithub size={20} /> GitHub</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ rotateX: rotateX, rotateY: rotateY, transformStyle: "preserve-3d" }} className="md:w-1/2 h-[600px] w-full relative flex items-center justify-center order-1 md:order-2">
           {/* LOCAL ROBOT FILE */}
           <Spline scene="/robot.splinecode" />
        </motion.div>
      </section>

      {/* ABOUT ME */}
      <section id="about" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="md:w-1/2 flex justify-center">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-[2rem] rotate-6 opacity-50 blur-lg"></div>
                    <img src="/myphoto.png" alt="Mangla Shukla" className="relative w-full h-full object-cover rounded-[2rem] border-2 border-gray-700 shadow-2xl grayscale hover:grayscale-0 transition duration-500" />
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="md:w-1/2 space-y-6">
                <div className="flex items-center gap-2"><span className="h-1 w-12 bg-purple-500 rounded-full"></span><h2 className="text-3xl font-bold uppercase tracking-wider">About Me</h2></div>
                <h3 className="text-4xl font-bold leading-tight">I'm <span className="text-purple-500">Mangla Shukla</span>, a passionate Full Stack Developer and AI Enthusiast.</h3>
                <p className="text-gray-400 leading-relaxed text-lg">My journey in tech is driven by a curiosity to understand how things work. I specialize in building robust web applications using the <b>MERN Stack</b> and cross-platform mobile experiences.</p>
                <div className="grid grid-cols-3 gap-6 pt-6">
                    <div><h4 className="text-3xl font-bold text-white">&lt;1</h4><p className="text-sm text-gray-500">Year Exp.</p></div>
                    <div><h4 className="text-3xl font-bold text-white">05+</h4><p className="text-sm text-gray-500">Projects</p></div>
                    <div><h4 className="text-3xl font-bold text-white">05+</h4><p className="text-sm text-gray-500">Hackathons</p></div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-24 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto h-full">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold">Experience & <span className="text-purple-500">Education</span></h2></div>
          <div className="relative wrap overflow-hidden p-4 h-full">
            <div className="border-2-2 absolute border-opacity-20 border-purple-500 h-full border" style={{ left: '50%' }}></div>
            <TimelineItem isLeft={true} date="Sep 2025 - Present" title="Campus Ambassador" company="Unstop" icon={<FaBullhorn />} description="Promoting coding culture and organizing hackathons." />
            <TimelineItem isLeft={false} date="2025" title="GDGOC Hackathon Finalist" company="Google Developer Groups" icon={<FaTrophy />} description="Secured Top 10 rank with 'Kumbh Rakshak' project." />
            <TimelineItem isLeft={true} date="Aug 2025" title="Web Dev Intern" company="IBM" icon={<FaBuilding />} description="Developed a full-stack e-commerce platform using MERN." />
            <TimelineItem isLeft={false} date="Summer 2024" title="Python Training" company="UCER" icon={<FaLaptopCode />} description="Intensive summer training in Python & Data Science." />
            <TimelineItem isLeft={true} date="2023 - 2027" title="B.Tech (CSE - AI/ML)" company="UCER" icon={<FaCertificate />} description="Pursuing B.Tech with specialization in AI & ML." />
          </div>
        </div>
      </section>

      {/* SKILLS SECTION (FLOATING MARQUEE EFFECT) */}
      <section id="skills" className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-full mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Technical <span className="text-purple-500">Arsenal</span></h2>
          <p className="text-gray-400 mb-12">Tech that drives innovation.</p>

          {/* 3D CRYSTAL */}
          <div className="h-[400px] w-full flex items-center justify-center mb-12">
             <Spline scene="/crystal.splinecode" />
          </div>
          
          {/* ROW 1: LEFT MARQUEE */}
          <div className="marquee-container w-full overflow-hidden mb-8 relative">
            <div className="flex w-max animate-marquee-left">
              {[...skillsRow1, ...skillsRow1, ...skillsRow1].map((skill, index) => (
                <SkillCard key={`r1-${index}`} skill={skill} />
              ))}
            </div>
          </div>

          {/* ROW 2: RIGHT MARQUEE */}
          <div className="marquee-container w-full overflow-hidden relative">
            <div className="flex w-max animate-marquee-right">
              {[...skillsRow2, ...skillsRow2, ...skillsRow2].map((skill, index) => (
                <SkillCard key={`r2-${index}`} skill={skill} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">Featured <span className="text-purple-500">Projects</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Kumbh Rakshak", desc: "AI crowd safety system using DeepFace & CCTV.", tags: ["Python", "AI"], icon: "🛡️", link: "https://github.com/SaumyaPratapSingh-cyber/Kumbh-Rakshak-Surveillance-System" },
              { title: "Krishi Seva 2.0", desc: "Crop disease detection app for farmers.", tags: ["MERN", "ML"], icon: "🌱", link: "https://github.com/SaumyaPratapSingh-cyber/Krishi-Seva-App-for-to-farmers-" },
              { title: "MudraVani", desc: "Real-time ISL translator using Computer Vision.", tags: ["Python", "OpenCV"], icon: "✋", link: "https://github.com/Manglashukla/MudraVani-AI" },
              { title: "ShoppingKart", desc: "Full-stack E-commerce platform.", tags: ["React", "Node"], icon: "🛒", link: "https://github.com/Manglashukla/shoppingkart" },
              { title: "Expense Tracker", desc: "CLI tool for tracking daily expenses.", tags: ["Python", "Data"], icon: "📊", link: "https://github.com/Manglashukla/Expense-Tracker" }
            ].map((project, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="group bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all shadow-xl relative cursor-none">
                <div className="h-48 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-6xl group-hover:scale-110 transition duration-500">{project.icon}</div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 h-12 overflow-hidden">{project.desc}</p>
                  <div className="flex gap-2 mb-6">
                    {project.tags.map(tag => (<span key={tag} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{tag}</span>))}
                  </div>
                  {project.link !== "#" ? (
                    <a href={project.link} target="_blank" className="flex items-center justify-center gap-2 w-full py-2 bg-purple-600/10 text-purple-400 border border-purple-600/50 rounded-lg hover:bg-purple-600 hover:text-white transition font-bold text-sm cursor-none">View Project <FaExternalLinkAlt size={12}/></a>
                  ) : (<button className="w-full py-2 bg-gray-800 text-gray-500 rounded-lg text-sm font-bold cursor-not-allowed">Coming Soon</button>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto bg-[#111] rounded-3xl p-8 md:p-12 border border-gray-800 flex flex-col md:flex-row gap-12 shadow-2xl">
          <div className="md:w-1/3 space-y-6">
            <h2 className="text-3xl font-bold">Get in <span className="text-purple-500">Touch</span></h2>
            <div className="flex items-center gap-4 text-gray-300"><div className="p-3 bg-gray-800 rounded-full text-purple-400"><FaEnvelope/></div><div><p className="text-xs text-gray-500">Email</p><p className="font-medium">mangalashukla170@gmail.com</p></div></div>
            <div className="flex items-center gap-4 text-gray-300"><div className="p-3 bg-gray-800 rounded-full text-purple-400"><FaPhoneAlt/></div><div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">+91 9026728894</p></div></div>
          </div>
          <form ref={formRef} onSubmit={sendEmail} className="md:w-2/3 space-y-4">
            <input type="text" name="user_name" placeholder="Your Name" required className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white focus:border-purple-500 outline-none transition cursor-none" />
            <input type="email" name="user_email" placeholder="Your Email" required className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white focus:border-purple-500 outline-none transition cursor-none" />
            <textarea name="message" rows="4" placeholder="Your Message" required className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white focus:border-purple-500 outline-none transition cursor-none"></textarea>
            <button disabled={loading} className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-purple-600 hover:text-white transition cursor-none">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-900"><p>© 2027 Mangla Shukla. Built with Next.js.</p></footer>
    </div>
  );
}