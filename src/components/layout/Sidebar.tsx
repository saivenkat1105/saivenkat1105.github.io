"use client";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

import { Cartpole } from "@/components/Cartpole";

const sections = [
  { name: "Intro", id: "intro" },
  { name: "Tech Stack", id: "skills" },
  { name: "Projects", id: "projects" },
  // { name: "Achievements", id: "achievements" },
  { name: "Blog", id: "blog" },
  { name: "About Me", id: "about" },
  { name: "Contact", id: "contact" }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeSectionFromScroll = useActiveSection(sections.map(s => s.id));
  
  // Override highlight: if we are on any /blog related route, highlight Blog
  const activeSection = pathname.startsWith("/blog") ? "blog" : activeSectionFromScroll;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    // If we're on a sub-page (like a blog article) and click a different section, navigate home first
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
      document.dispatchEvent(new CustomEvent("close-project-modal"));
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-8 relative z-50 bg-transparent">
      <div className="flex flex-col gap-1 text-sm">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => onClick(e, sec.id)}
              className={cn(
                "flex h-8 items-center rounded-md px-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {sec.name}
            </a>
          );
        })}
      </div>
      <Cartpole />
    </aside>
  );
}
