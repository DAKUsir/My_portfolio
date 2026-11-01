"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProjectVisual } from "./project-visual";

type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  number: string;
  category: string;
  name: string;
  type: string;
  description: string;
  impact: string;
  stack: string[];
  visual: string;
  links: ProjectLink[];
};

const filters = [
  "All",
  "AI products",
  "Machine learning",
  "Computer vision",
  "NLP",
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [desktopLayout, setDesktopLayout] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);
  const reelRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const visibleProjects = projects.filter(
    (project) => activeFilter === "All" || project.category === activeFilter,
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measureReel = () => {
      const isDesktop = window.matchMedia("(min-width: 941px)").matches;
      setDesktopLayout((current) => (current === isDesktop ? current : isDesktop));

      const distance = isDesktop
        ? Math.max(0, track.scrollWidth - viewport.clientWidth)
        : 0;
      setScrollDistance((current) => (current === distance ? current : distance));
    };

    const resizeObserver = new ResizeObserver(measureReel);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    window.addEventListener("resize", measureReel);
    measureReel();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureReel);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: reelRef,
    offset: ["start start", "end end"],
  });
  const { scrollXProgress } = useScroll({
    container: viewportRef,
    axis: "x",
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);
  const smoothX = useSpring(rawX, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });
  const reelProgress = useSpring(desktopLayout ? scrollYProgress : scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const trackX = prefersReducedMotion ? rawX : smoothX;
  const reelStyle = desktopLayout
    ? { height: `calc(100svh + ${scrollDistance + 96}px)` }
    : undefined;

  return (
    <>
      <div className="project-filter-row">
        <div className="project-filters" role="group" aria-label="Filter projects">
          {filters.map((filter) => {
            const count =
              filter === "All"
                ? projects.length
                : projects.filter((project) => project.category === filter).length;
            const isActive = activeFilter === filter;

            return (
              <motion.button
                aria-pressed={isActive}
                className={`project-filter${isActive ? " is-active" : ""}`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
                whileTap={{ scale: 0.97 }}
              >
                {filter}
                <span>{count}</span>
              </motion.button>
            );
          })}
        </div>
        <p className="project-count" aria-live="polite">
          Showing <b>{visibleProjects.length}</b> of {projects.length} projects
        </p>
      </div>

      <div className="project-reel" ref={reelRef} style={reelStyle}>
        <div className="project-reel-viewport">
          <div className="project-reel-cue" aria-hidden="true">
            <span className="project-reel-kicker"><i /> PROJECT REEL</span>
            <div className="project-reel-progress">
              <motion.span className="project-reel-progress-fill" style={{ scaleX: reelProgress }} />
            </div>
            <span className="project-reel-instruction project-reel-instruction-desktop">
              SCROLL VERTICALLY TO ADVANCE
            </span>
            <span className="project-reel-instruction project-reel-instruction-mobile">
              SWIPE HORIZONTALLY TO EXPLORE
            </span>
          </div>

          <div
            className="project-reel-window"
            ref={viewportRef}
            role="region"
            aria-label="Selected projects, horizontal reel"
            tabIndex={0}
          >
            <motion.div
              className="project-track"
              ref={trackRef}
              style={{ x: desktopLayout ? trackX : 0 }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {visibleProjects.map((project) => {
                  return (
                    <motion.article
                      className="project-card project-card-reel"
                      key={project.number}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        layout: { type: "spring", stiffness: 280, damping: 30 },
                        opacity: { duration: 0.2 },
                        y: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                      }}
                      whileHover={{ y: -5, borderColor: "rgba(40, 106, 85, 0.32)" }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <ProjectVisual kind={project.visual} />
                      <div className="project-body">
                        <div className="project-meta">
                          <span>{project.type}</span>
                          <span>{project.number}</span>
                        </div>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <p className="project-impact">
                          <span />
                          {project.impact}
                        </p>
                        <ul className="tag-list" aria-label={`${project.name} technologies`}>
                          {project.stack.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <div className="project-links">
                          {project.links.map((link) => (
                            <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                              {link.label}
                              <ArrowUpRight />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
