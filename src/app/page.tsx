"use client";
import { Mail, FileText, ChevronDown, ExternalLink, X, Layers, Code } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { allProjects, getProjectsByType, Project } from "@/data/projects";
import { allBlogPosts } from "@/data/blog";
import { CoverflowCarousel } from "@/components/blog/CoverflowCarousel";
import ReactMarkdown from "react-markdown";
import { asset } from "@/lib/assets";

// Defined strict taxonomy for tagging
const DOMAIN_TAGS = ["RL", "Controls", "ML", "Robotics", "Modelling", "Mechanical Design", "Vibe Coded"];
const TECH_STACK_TAGS = ["Python/C++", "MATLAB", "ROS2", "Gazebo", "MuJoCo", "PyTorch", "Fusion 360"];

const skillsMap = {
  "Frameworks": ["ROS2 (Kilted Kaiju)", "PyTorch", "Scikit-learn", "stable-baselines3", "Gymnasium", "LeRobot"],
  "Software/ Tools": ["MATLAB", "Simulink", "Gazebo", "MuJoCo", "Fusion 360"],
  "Languages": ["Python", "C++"],
  "Skillset": ["Reinforcement Learning", "Controls", "Machine Learning", "Modelling", "Robotics Simulation", "FEA", "Mechanical Design", "3D Printing"]
};

const achievements = [
  {
    year: "2025",
    items: [
      "",
    ]
  },
  {
    year: "2024",
    items: [
      "Graduated with a **GPA of 9.14** in Dual Degree (B.Tech + M.Tech) in Mechanical Engineering from **IIT Madras**.",
    ]
  },
  {
    year: "2020",
    items: [
      "Placed **5th** internationally at the Indian Rover Challenge 2020 with the *Dark Knight* rover.",
    ]
  },
  {
    year: "2019",
    items: [
      "Placed **1st** at the Indian Rover Challenge 2019 and **12th internationally** at the University Rover Challenge 2019 with Team Anveshak, IIT Madras.",
    ]
  }
];

// Slug mapping for Simple Icons
const skillSlugMap: Record<string, string> = {
  "Python": "python",
  "C++": "cplusplus",
  "MATLAB": "mathworks",
  "Simulink": "mathworks",
  "Gazebo": "gazebo",
  "MuJoCo": "openai", // Fallback for specialized robotics
  "Autodesk Fusion 360": "autodesk",
  "ROS2 (Humble)": "ros",
  "Nav2": "ros",
  "SLAM Toolbox": "ros",
  "PyTorch": "pytorch",
  "Scikit-learn": "scikitlearn",
  "RL (PPO, SAC, DQN)": "openai"
};

// Helper to define category-specific styling
const categoryTheme = {
  "Languages": {
    color: "text-blue-600 dark:text-blue-400",
    accent: "bg-blue-500",
  },
  "Software/ Tools": {
    color: "text-emerald-600 dark:text-emerald-400",
    accent: "bg-emerald-500",
  },
  "Frameworks": {
    color: "text-amber-600 dark:text-amber-400",
    accent: "bg-amber-500",
  },
  "Skillset": {
    color: "text-cyan-600 dark:text-cyan-400",
    accent: "bg-cyan-500",
  }
};

// Skills that prioritize local assets from /public/icons/tech/
const LOCAL_ICONS: Record<string, string> = {
  "MATLAB": "png",
  "Simulink": "png",
  "Gazebo": "png",
  "MuJoCo": "png",
  "PyTorch": "png",
  "Scikit-learn": "png",
  "stable-baselines3": "png",
  "Gymnasium": "png",
  "Python": "svg",
  "C++": "svg"
};

function getIconForSkill(skill: string) {
  // Direct overrides for skills with special characters in names or custom logos
  if (skill === "ROS2 (Kilted Kaiju)") {
    return <img src={asset("/icons/tech/ros2.svg")} alt="ROS2" className="w-4 h-4 object-contain" />;
  }
  if (skill === "LeRobot") {
    return <img src={asset("/icons/tech/lerobot.png")} alt="LeRobot" className="w-4 h-4 object-contain" />;
  }

  const slug = skillSlugMap[skill];

  // 1. Priority Local Load for high-fidelity brand icons
  if (LOCAL_ICONS[skill]) {
    const ext = LOCAL_ICONS[skill];
    return (
      <img
        src={asset(`/icons/tech/${skill}.${ext}`)}
        alt={skill}
        className="w-4 h-4 object-contain"
        onError={(e) => {
          // Final fallback to CDN or Avatar if local file is missing
          const target = e.target as HTMLImageElement;
          if (slug) {
            target.src = `https://cdn.simpleicons.org/${slug}`;
          } else {
            target.src = `https://ui-avatars.com/api/?name=${skill}&background=white&color=black&size=32&bold=true`;
          }
        }}
      />
    );
  }

  if (!slug) return <Code className="w-4 h-4 text-black" />;

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={skill}
      className="w-4 h-4 object-contain"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${skill}&background=white&color=black&size=32&bold=true`;
      }}
    />
  );
}

export default function Home() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [projectPage, setProjectPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Listen for navigation events to safely discard the modal popup
  useEffect(() => {
    const handleClose = () => setSelectedProject(null);
    document.addEventListener("close-project-modal", handleClose);
    return () => {
      document.removeEventListener("close-project-modal", handleClose);
    };
  }, []);

  const toggleTag = (tag: string) => {
    setProjectPage(0);
    if (tag === "All") {
      setActiveTags([]);
      return;
    }
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Snap between short full-page sections (intro + tech stack)

  const getFilteredAndSorted = (projects: Project[]) => {
    let result = projects;

    if (activeTags.length > 0) {
      result = projects
        .map(p => ({ project: p, matches: activeTags.filter(tag => p.tags.includes(tag)).length }))
        .filter(p => p.matches > 0)
        .sort((a, b) => b.matches - a.matches)
        .map(p => p.project);
    }

    const engineering = result.filter(p => p.type !== 'vibe');
    const vibe = result.filter(p => p.type === 'vibe');
    return [...engineering, ...vibe];
  };

  const filteredProjects = getFilteredAndSorted(allProjects);

  return (
    <div className="flex flex-col pb-24">
      {/* 1. Crisp Intro */}
      <section id="intro" className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-start relative pt-4 pb-24 scroll-mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(260px,320px)] gap-16 items-center w-full"
        >
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl/tight">
                Sai Venkat Gunda
              </h1>
              <h2 className="mt-3 text-lg font-bold tracking-tight text-primary sm:text-xl">
                Advanced Controls & ML Engineer @ JLR
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Developing <span className="text-primary font-semibold">Advanced Control Algorithms</span> (MPC, EKF) for thermal management systems and <span className="text-primary font-semibold">deployable ML models</span> at
                <span className="text-primary font-semibold"> Jaguar Land Rover</span> to improve vehicle range and performance.
                Experienced in handling the entire <span className="text-primary font-semibold">engineering life cycle </span> taking concepts through ideation → simulation → deployment.

              </p>
              <p>
                Making inanimate objects think and move aka <span className="text-primary font-semibold">Robotics</span> fascinates me.
                Specialized in <span className="text-primary font-semibold">RL, Controls, ML</span> with current focus on <span className="text-primary font-semibold">Robot Learning</span>.
                Experience in building robots from scratch both in simulation and real.


                Excited about <span className="text-primary font-semibold">Physical AI </span> and looking to contribute in this space.
              </p>
              <p>
                Love solving hard problems. High agency. Always curious. I thrive under pressure. I prefer failing fast and iterating over planning the perfect solution.
              </p>
              <p>My free time is for ♟️, 🏸,  🏖️, 🏔️, 🍜, 😴. Also 📚 and 🎬. Sometimes 👨‍🍳.
                Always up to learn something new.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-primary font-semibold text-base">Highlights</p>
              <ul className="space-y-2.5">
                {[
                  { text: "Developed industry's **first energy based thermal controller** @ JLR - improving range by 10%" },
                  { text: "**Patent** - GB202402518D0 - a personalized thermal comfort controller" },
                  { text: "Top 100 teams internationally in **AI for Industry Challenge 2026** by Intrinsic" },
                  { text: "Multiple robotics projects and competitions - won some, lost some but learnt and enjoyed from all of them." },
                  { text: "M.Tech and B.Tech(Hons.) from IIT Madras with a 9.14 GPA" },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <span>{children}</span>,
                        strong: ({ children }) => <strong className="text-primary font-semibold">{children}</strong>,
                      }}
                    >
                      {item.text}
                    </ReactMarkdown>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold tracking-wide text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
              >
                <FileText className="mr-2 h-4 w-4" /> View Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl border border-input bg-card px-6 py-4 text-sm font-bold tracking-wide shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105"
              >
                <Mail className="mr-2 h-4 w-4" /> Get in Touch
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 mt-8 lg:mt-0">
            <div className="w-64 md:w-full aspect-square rounded-[2rem] bg-muted border border-border shadow-xl overflow-hidden relative rotate-2 hover:rotate-0 transition-transform duration-500 will-change-transform group">
              <img src="profile.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Casual Look" />
              <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white text-xs font-bold tracking-widest uppercase">The Casual Look</span>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]" />
            </div>
            <div className="w-48 aspect-square rounded-[2rem] bg-muted border border-border shadow-xl overflow-hidden relative -mt-24 lg:-mt-16 ml-32 lg:-ml-12 -rotate-6 hover:rotate-0 transition-transform duration-500 hidden md:block group z-10 hover:z-20">
              <img src="profile_2.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Ready to fly away" />
              <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white text-xs font-bold tracking-widest uppercase">Ready to fly away</span>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]" />
            </div>
          </div>
        </motion.div>


      </section>

      {/* 2. Skills & Tools Tile Layout */}
      <section id="skills" className="pt-8 scroll-mt-14">
        <div className="space-y-4 mb-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tech Stack</h1>
          <p className="text-xl md:text-2xl font-bold text-muted-foreground/80">What I am good at</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 md:gap-12">
          {/* Column 1: Skillset */}
          <div className="space-y-8">
            {Object.entries(skillsMap)
              .filter(([category]) => category === "Skillset")
              .map(([category, skills]) => {
                const theme = categoryTheme[category as keyof typeof categoryTheme];
                return (
                  <div key={category} className={`p-6 rounded-[2rem] border border-border bg-card/50 transition-all hover:bg-card hover:shadow-md relative overflow-hidden group h-full`}>
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${theme?.accent} opacity-20 group-hover:opacity-100 transition-opacity`} />
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`h-1.5 w-8 rounded-full ${theme?.accent}`} />
                        <h3 className="text-lg font-bold tracking-tighter text-foreground">
                          {category}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {skills.map((skill) => (
                          <motion.div
                            key={skill}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-4 py-2 bg-white border border-border shadow-sm rounded-lg group cursor-default"
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              {getIconForSkill(skill)}
                            </div>
                            <span className="ml-3 text-black text-sm font-medium tracking-tighter">
                              {skill}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Column 2: Others */}
          <div className="flex flex-col gap-6 md:gap-8">
            {Object.entries(skillsMap)
              .filter(([category]) => category !== "Skillset")
              .map(([category, skills]) => {
                const theme = categoryTheme[category as keyof typeof categoryTheme];
                return (
                  <div key={category} className={`p-5 rounded-[2rem] border border-border bg-card/50 transition-all hover:bg-card hover:shadow-md relative overflow-hidden group`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${theme?.accent} opacity-20 group-hover:opacity-100 transition-opacity`} />
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-1 w-6 rounded-full ${theme?.accent}`} />
                        <h3 className="text-lg font-bold tracking-tighter text-foreground">
                          {category}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {skills.map((skill) => (
                          <motion.div
                            key={skill}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-4 py-2 bg-white border border-border shadow-sm rounded-lg group cursor-default"
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              {getIconForSkill(skill)}
                            </div>
                            <span className="ml-3 text-black text-sm font-medium tracking-tighter">
                              {skill}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* 3. Filterable Projects Engine — paginated, full-viewport */}
      <section id="projects" className="pt-16 scroll-mt-8 flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">

        {/* Header & Filters Row */}
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-4 mb-4 shrink-0">
          {/* Header */}
          <div className="space-y-1 shrink-0">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">Projects</h1>
            <p className="text-base font-bold text-muted-foreground/80">Everything I am up to ...</p>
          </div>

          {/* Filter rows */}
          <div className="flex flex-col gap-2 shrink-0 xl:items-end">
            {/* Domains row */}
            <div className="flex items-center gap-2 flex-wrap xl:justify-end">
              <button
                onClick={() => toggleTag("All")}
                className={`px-3 py-0.5 rounded-full text-xs font-semibold border transition-all ${activeTags.length === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
                  }`}
              >All</button>
              {DOMAIN_TAGS.map(tag => {
                const isActive = activeTags.includes(tag);
                return (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-0.5 rounded-full text-xs font-semibold border transition-all ${isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
                      }`}
                  >{tag}</button>
                );
              })}
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest shrink-0 border-r-2 border-primary/40 pr-2 ml-2">Domains</span>
            </div>
            {/* Tech Stack row */}
            <div className="flex items-center gap-2 flex-wrap xl:justify-end">
              {TECH_STACK_TAGS.map(tag => {
                const isActive = activeTags.includes(tag);
                return (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-0.5 rounded-full text-xs font-semibold border transition-all ${isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
                      }`}
                  >{tag}</button>
                );
              })}
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest shrink-0 border-r-2 border-primary/40 pr-2 ml-2">Tech Stack</span>
            </div>
          </div>
        </div>

        {/* Grid + pagination — grows to fill remaining height */}
        <div className="flex-1 flex flex-col min-h-0">
          {filteredProjects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center rounded-[2rem] border border-dashed border-border">
              <p className="text-muted-foreground">No projects match those filters.</p>
              <button onClick={() => toggleTag("All")} className="mt-3 text-sm text-primary hover:underline">Clear Filters</button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={projectPage}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-4"
                >
                  {filteredProjects.slice(projectPage * 4, projectPage * 4 + 4).map((project) => {
                    const isVibe = project.type === 'vibe';
                    return (
                      <button
                        key={project.slug}
                        onClick={() => setSelectedProject(project)}
                        className={`text-left flex flex-row w-full h-full rounded-[1.5rem] border border-border shadow-sm transition-all group hover:-translate-y-1 overflow-hidden min-h-0 ${isVibe ? "bg-gradient-to-br from-card to-muted hover:shadow-xl border-l-4 border-l-primary" : "bg-card hover:shadow-xl hover:border-primary/50"
                          }`}
                      >
                        {/* Text content — left side */}
                        <div className="flex flex-col flex-1 min-w-0 p-4 h-full">
                          <div className="flex justify-between items-start mb-1 w-full shrink-0">
                            <h3 className="text-base font-bold group-hover:text-primary transition-colors pr-2 leading-tight">{project.title}</h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                          </div>
                          <p className={`text-[10px] font-mono mb-3 shrink-0 ${isVibe ? 'text-primary' : 'text-muted-foreground'}`}>{project.date}</p>
                          <div className="text-muted-foreground text-sm leading-relaxed flex-1 overflow-y-auto no-scrollbar">
                            <ReactMarkdown components={{ p: ({ children }) => <>{children}</>, strong: ({ children }) => <strong className="text-primary font-semibold">{children}</strong> }}>
                              {project.shortDescription}
                            </ReactMarkdown>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.tags.map(tag => (
                              <span key={tag} className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${activeTags.includes(tag) ? "bg-primary border-primary text-primary-foreground" : "border-border/50 bg-background text-muted-foreground"
                                }`}>{tag}</span>
                            ))}
                          </div>
                        </div>

                        {/* Media — right side, full height */}
                        {(() => {
                          const coverSrc = project.coverImage ?? null;
                          const mediaSrc = project.images?.[0] ?? project.image ?? null;
                          const videoSrc = project.video ?? null;

                          if (coverSrc) {
                            return (
                              <div className="w-2/5 shrink-0 overflow-hidden bg-muted">
                                <img src={asset(coverSrc)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                            );
                          }
                          if (videoSrc) {
                            return (
                              <div className="w-2/5 shrink-0 overflow-hidden bg-muted">
                                <video src={asset(videoSrc)} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                              </div>
                            );
                          }
                          if (mediaSrc) {
                            return (
                              <div className="w-2/5 shrink-0 overflow-hidden bg-muted">
                                <img src={asset(mediaSrc)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                            );
                          }
                          return (
                            <div className={`w-2/5 shrink-0 ${isVibe ? "bg-gradient-to-b from-primary/10 to-muted" : "bg-gradient-to-b from-muted to-muted/40"}`} />
                          );
                        })()}
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination — right below the grid */}
              {filteredProjects.length > 4 && (
                <div className="flex items-center justify-between mt-3 shrink-0">
                  <button
                    onClick={() => setProjectPage(p => Math.max(0, p - 1))}
                    disabled={projectPage === 0}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >← Prev</button>
                  <div className="flex gap-1.5 items-center">
                    {Array.from({ length: Math.ceil(filteredProjects.length / 4) }).map((_, i) => (
                      <button key={i} onClick={() => setProjectPage(i)}
                        className={`h-1.5 rounded-full transition-all ${i === projectPage ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/50"}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setProjectPage(p => Math.min(Math.ceil(filteredProjects.length / 4) - 1, p + 1))}
                    disabled={projectPage >= Math.ceil(filteredProjects.length / 4) - 1}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 5. Achievements */}
      {false && (
        <section id="achievements" className="pt-24 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4 mb-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Achievements</h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground/80">What I can brag about ...</p>
            </div>

            <div className="relative pl-8 md:pl-12 border-l border-border/60 space-y-12 ml-4 md:ml-8">
              {achievements.map((group, groupIdx) => (
                <motion.div
                  key={groupIdx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-12 md:-left-[3.25rem] top-1.5 h-6 w-6 rounded-full bg-background border-2 border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] z-10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  {/* Year Label */}
                  <div className="mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                      {group.year}
                    </span>
                  </div>

                  {/* Achievement Cards */}
                  <div className="grid gap-4">
                    {group.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="group bg-card hover:bg-accent/40 p-5 rounded-2xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                          <span className="text-sm md:text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <span>{children}</span>,
                                strong: ({ children }) => <strong className="text-primary font-extrabold">{children}</strong>,
                              }}
                            >
                              {item}
                            </ReactMarkdown>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 6. Blog */}
      <section id="blog" className="pt-24 scroll-mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Blog</h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground/80">The nonsense that I spew...</p>
            </div>
            <a
              href="/blog"
              className="text-sm font-semibold text-primary hover:underline shrink-0 pb-1"
            >
              All Articles →
            </a>
          </div>

          <div className="mt-10">
            <CoverflowCarousel posts={allBlogPosts} />
          </div>
        </motion.div>
      </section>

      {/* 7. About Me — Detailed */}
      <section id="about" className="pt-24 scroll-mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">About Me</h1>
            <p className="text-xl md:text-2xl font-bold text-muted-foreground/80">The longer version.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,340px)] gap-12 items-start">
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                Hey there! Welcome to <span className="text-primary font-semibold">my space</span>. I really want to tell you that this is not your
                regular portfolio page that you haven't seen already but unfortunately it is.
              </p>
              <p>

                I have always loved machines. The idea that some inanimate objects can do intelligent tasks constantly amazes and excites me.
                That pushed me towards <span className="text-primary font-semibold">robotics</span> . I worked on some amazing projects like <span className="text-primary font-semibold">building rovers, autonomous wheelchairs,
                  and pipeline robots</span> in university.
                Then life took a different turn and I ended up
                in the automobile industry which was equally exciting, but a small part of me always stayed with robotics.
              </p>
              <p>
                I am a fan of automation. I will spend 2 hours automating a task that can be done 1 hour if it means
                I dont have to do something mundane. I am always full of ideas and <span className="text-primary font-semibold">vibe coding</span> has given  me a new lease of life
                to build everything that I can think of. Most of them are useless but I am proud of every single vib-coded project I have worked on.
                I am always up for discussing anything under the Sun, be it politics, technology, my chess ELO, how I think the world is a simulation,
                or how I believe that the world is like the Truman show with me being the main character.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-6 rounded-[2rem] border border-border bg-card/50 space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Currently</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Controls & ML Engineer @ <span className="text-foreground font-semibold">Jaguar Land Rover</span>
                </p>
              </div>
              <div className="p-6 rounded-[2rem] border border-border bg-card/50 space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Education</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Dual Degree B.Tech + M.Tech, Mechanical Engineering<br />
                  <span className="text-foreground font-semibold">IIT Madras</span> · GPA 9.14
                </p>
              </div>
              <div className="p-6 rounded-[2rem] border border-border bg-card/50 space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Interests</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Physical AI · Robotics · Chess · Travel · Movies · Badminton · Books
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 8. Contact Section */}
      <section id="contact" className="pt-32 pb-4 scroll-mt-14 mt-12 border-t border-border">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto py-16 bg-card rounded-[3rem] border border-border shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
          <h1 className="text-5xl font-extrabold tracking-tight z-10">Get in Touch</h1>
          <p className="text-muted-foreground text-lg z-10 max-w-md px-4">
            Always open for a chat about physical AI systems, robotics, or life.
          </p>
          <a href="mailto:1105saivenkat@gmail.com" className="z-10 px-8 py-4 bg-primary text-primary-foreground font-bold tracking-wide rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
            Drop an Email
          </a>

          <div className="pt-12 text-sm text-muted-foreground flex gap-8 z-10">
            <a href="https://github.com/saivenkat1105" target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors font-medium">
              <GithubIcon className="w-4 h-4 mr-2" /> GitHub
            </a>
            <a href="https://linkedin.com/in/sai-venkat-gunda" target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors font-medium">
              <LinkedinIcon className="w-4 h-4 mr-2" /> LinkedIn
            </a>
            <a href="resume.pdf" target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors font-medium">
              <FileText className="w-4 h-4 mr-2" /> Resume
            </a>
          </div>
        </div>

        <div className="mt-16 text-center text-xs text-muted-foreground/60 flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>Built with Next.js & Tailwind CSS.</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Static Deployment via GitHub Actions.</span>
        </div>
      </section>

      {/* 8. Project Detail Overlay Popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-14 bottom-0 left-0 right-0 z-40 flex justify-end"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/50 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedProject(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:max-w-2xl lg:max-w-4xl h-full bg-background border-l border-border shadow-[0_0_80px_rgba(0,0,0,0.1)] flex flex-col"
            >
              {/* Sticky Header with Close Button */}
              <div className="sticky top-0 z-20 flex justify-end items-center p-4 md:px-6 md:py-4 bg-background/90 backdrop-blur-xl border-b border-border/40 shrink-0">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:rotate-90 pointer-events-auto"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content layout */}
              <div className="p-4 md:p-6 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
                {(() => {
                  const hasLinks = !!selectedProject.repo || (selectedProject.links && selectedProject.links.length > 0);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)_auto] gap-4 h-full max-w-5xl mx-auto">

                      {/* Block 1: Intro */}
                      <div className="flex flex-col space-y-3 p-6 rounded-[2rem] bg-card border border-border shadow-sm overflow-hidden flex-1 min-h-0">
                        <h1 className="text-2xl font-extrabold tracking-tight xl:text-3xl shrink-0">{selectedProject.title}</h1>
                        <p className="font-mono text-xs text-muted-foreground shrink-0">{selectedProject.date}</p>
                        <div className="text-muted-foreground mt-2 leading-relaxed overflow-y-auto text-base shrink pr-2">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="text-primary font-extrabold">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc pl-4 mb-4 space-y-1">{children}</ul>,
                              li: ({ children }) => <li>{children}</li>,
                            }}
                          >
                            {selectedProject.longDescription}
                          </ReactMarkdown>
                        </div>
                      </div>

                      {/* Block 2: Visual */}
                      <div className={`relative w-full rounded-[2rem] bg-muted border border-border overflow-hidden group h-full min-h-[300px] ${!hasLinks ? "md:row-span-2" : ""}`}>
                        {selectedProject.images && selectedProject.images.length > 1 ? (
                          <div className="flex flex-col space-y-4 p-4 h-full overflow-y-auto custom-scrollbar">
                            {selectedProject.images.slice(0, 3).map((img, idx) => (
                              <div key={idx} className="relative w-full aspect-video flex-shrink-0 bg-background/30 rounded-xl overflow-hidden border border-border/50">
                                <img
                                  src={asset(img)}
                                  className="absolute inset-0 w-full h-full object-contain"
                                  alt={`${selectedProject.title} screenshot ${idx + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        ) : selectedProject.video ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                            <video
                              src={asset(selectedProject.video ?? "")}
                              className="w-full h-full object-contain"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          </div>
                        ) : selectedProject.image || (selectedProject.images && selectedProject.images.length === 1) ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                            <img
                              src={asset(selectedProject.image || (selectedProject.images && selectedProject.images[0]) || "")}
                              className="w-full h-full object-contain"
                              alt={selectedProject.title}
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent to-background opacity-50" />
                            <Layers className="h-16 w-16 text-muted-foreground opacity-20 group-hover:scale-110 transition-transform duration-500 ease-out" />
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                              <span className="text-xs font-semibold px-3 py-1.5 bg-background/50 backdrop-blur-md rounded-full text-foreground border border-border/50">Media Placeholder</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Block 3: Tech Stack */}
                      <div className="p-6 rounded-[2rem] bg-card border border-border shadow-sm flex flex-col space-y-4 overflow-hidden h-full">
                        <div className="flex items-center space-x-2 shrink-0">
                          <Code className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-bold tracking-tight">Tech Stack</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 overflow-y-auto content-start pr-2">
                          {selectedProject.tags.map((tech) => {
                            const isHighlighted = activeTags.includes(tech);
                            return (
                              <div key={tech} className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center shadow-sm transition-colors ${isHighlighted
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary text-secondary-foreground border-border/50"
                                }`}>
                                <span>{tech}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Block 4: Links - Conditionally Rendered */}
                      {hasLinks && (
                        <div className="p-6 rounded-[2rem] bg-card border border-border shadow-sm flex flex-col space-y-4">
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold tracking-tight">Launch Links</h3>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {selectedProject.repo && (
                              <a href={selectedProject.repo} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground text-sm font-bold rounded-xl border border-border hover:bg-accent transition-all">
                                GitHub Code <GithubIcon className="ml-2 h-4 w-4" />
                              </a>
                            )}
                            {selectedProject.links?.map((customLink, idx) => {
                              const isPdf = customLink.url.toLowerCase().endsWith('.pdf');
                              return (
                                <a key={idx} href={customLink.url} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground text-sm font-bold rounded-xl border border-border hover:bg-accent transition-all">
                                  {customLink.text} {isPdf ? <FileText className="ml-2 h-4 w-4" /> : <ExternalLink className="ml-2 h-4 w-4" />}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
