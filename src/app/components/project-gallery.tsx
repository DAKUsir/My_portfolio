"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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
  const visibleProjects = projects.filter(
    (project) => activeFilter === "All" || project.category === activeFilter,
  );

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

      <motion.div className="project-grid" layout>
        <AnimatePresence initial={false} mode="popLayout">
          {visibleProjects.map((project) => {
            const featured = activeFilter === "All" && project.number === "01";

            return (
              <motion.article
                className={`project-card${featured ? " project-card-featured" : ""}`}
                key={project.number}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
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
    </>
  );
}
