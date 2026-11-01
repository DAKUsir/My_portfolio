import { MotionAnchor, MotionArt } from "./components/motion";
import { ProjectGallery } from "./components/project-gallery";

const profileLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/aditya-chauhan-async" },
  { label: "GitHub", href: "https://github.com/DAKUsir" },
  { label: "Hugging Face", href: "https://huggingface.co/DakuSir" },
  { label: "LeetCode", href: "https://leetcode.com/u/aditya_chauhan_7/" },
];

const projects = [
  {
    number: "01",
    category: "AI products",
    name: "FinishIt",
    type: "AI product · Full stack",
    description:
      "An AI-powered competitive learning platform that turns study plans into an adaptive, social workflow.",
    impact: "6 AI learning features",
    stack: ["React", "FastAPI", "MongoDB", "Socket.IO"],
    visual: "finishit",
    links: [
      { label: "Live demo", href: "https://finishit-tau.vercel.app/" },
      {
        label: "Source",
        href: "https://github.com/DAKUsir/AI-driven-orchestration-platform",
      },
    ],
  },
  {
    number: "02",
    category: "AI products",
    name: "Krishi Bazar",
    type: "AI for agriculture · Full stack",
    description:
      "A farmer-to-buyer platform pairing crop insights and an LLM farming assistant with a digital marketplace.",
    impact: "Built for accessible farm support",
    stack: ["React", "FastAPI", "MongoDB", "Llama 3"],
    visual: "krishi",
    links: [
      { label: "Source", href: "https://github.com/DAKUsir/krishi-bazar" },
    ],
  },
  {
    number: "03",
    category: "Machine learning",
    name: "Cancer Risk Prediction",
    type: "Explainable machine learning",
    description:
      "A screening prototype benchmarking nine classifiers, with interpretable predictions and a Gradio interface.",
    impact: "9 models compared",
    stack: ["scikit-learn", "SHAP", "LIME", "Gradio"],
    visual: "cancer",
    links: [
      {
        label: "Live demo",
        href: "https://huggingface.co/spaces/DakuSir/Cancer_Ml",
      },
    ],
  },
  {
    number: "04",
    category: "Computer vision",
    name: "The Eye of Machine",
    type: "Computer vision · Deep learning",
    description:
      "A glaucoma-detection study comparing six vision models and combining local CNN features with ViT context.",
    impact: "CNN–ViT hybrid reached 90%+ accuracy",
    stack: ["PyTorch", "CNN", "Vision Transformer", "Gradio"],
    visual: "eye",
    links: [
      {
        label: "Live demo",
        href: "https://huggingface.co/spaces/DakuSir/The-Eye-of-Machine",
      },
    ],
  },
  {
    number: "05",
    category: "NLP",
    name: "GPT-2 Language Model Suite",
    type: "Natural language processing",
    description:
      "A custom fine-tuning workflow for spam classification and text interpretation, tuned for stable training.",
    impact: "85%+ F1 on spam classification",
    stack: ["Python", "Hugging Face", "TensorFlow", "Colab"],
    visual: "gpt",
    links: [
      {
        label: "Colab notebook",
        href: "https://colab.research.google.com/drive/1--52KiyFpOEEA54YiH3xDKUaSvsAe6JD?usp=sharing",
      },
    ],
  },
];

const skillGroups = [
  {
    title: "Languages",
    items: ["Python", "C++", "JavaScript", "SQL"],
  },
  {
    title: "AI / machine learning",
    items: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "Transformers",
      "OpenCV",
      "SHAP / LIME",
    ],
  },
  {
    title: "Product engineering",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "FastAPI",
      "MongoDB",
      "Tailwind CSS",
    ],
  },
  {
    title: "Tools & delivery",
    items: [
      "Git / GitHub",
      "Gradio",
      "Hugging Face Hub",
      "Jupyter",
      "Vercel",
      "Render",
    ],
  },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2v11m-4-4 4 4 4-4" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="site-shell" id="top">
      <header className="site-header page-wrap">
        <a className="brand" href="#top" aria-label="Aditya Chauhan, home">
          <span className="brand-mark">AC</span>
          <span className="brand-name">Aditya Chauhan<span>AI / ML · SOFTWARE</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a className="nav-contact" href="#contact">Let&apos;s talk <ArrowUpRight /></a>
        </nav>
      </header>

      <section className="hero page-wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="availability-dot" /> AI / ML ENGINEERING <span className="eyebrow-divider">·</span> FULL-STACK DEVELOPMENT</p>
          <h1 id="hero-title">I turn machine learning into <em>useful products.</em></h1>
          <p className="hero-description">
            I&apos;m Aditya, a computer science undergraduate building AI-enabled
            applications and taking ideas from model experiments to polished,
            working software.
          </p>
          <div className="hero-actions">
            <MotionAnchor className="button button-primary" href="#work">
              Explore my work <ArrowDown />
            </MotionAnchor>
            <a className="button button-quiet" href="/Aditya_Chauhan_Resume.pdf" target="_blank" rel="noreferrer">
              View resume <ArrowUpRight />
            </a>
          </div>
          <div className="social-row" aria-label="Professional profiles">
            {profileLinks.map((link) => (
              <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                {link.label}<ArrowUpRight />
              </a>
            ))}
          </div>
        </div>

        <MotionArt className="hero-art-wrap">
          <aside className="hero-art" aria-label="AI and software engineering profile illustration">
            <div className="art-header"><span>ADITYA / ENGINEER PROFILE</span><span>BLR · IN</span></div>
            <div className="orbit-stage" aria-hidden="true">
              <div className="orbit orbit-one"><i /></div>
              <div className="orbit orbit-two"><i /></div>
              <div className="orbit orbit-three"><i /></div>
              <div className="orbit-core"><span>AC</span><small>BUILDING<br />INTELLIGENT<br />SOFTWARE</small></div>
              <div className="orbit-label orbit-label-top"><i /> MACHINE LEARNING</div>
              <div className="orbit-label orbit-label-bottom"><i /> PRODUCT ENGINEERING</div>
            </div>
            <div className="art-footer"><span>From notebook</span><span className="art-footer-line" /><span>to real-world use</span></div>
          </aside>
        </MotionArt>
      </section>

      <section className="proof-strip page-wrap" aria-label="Highlights">
        <div><span className="proof-number">2027</span><span className="proof-label">CSE graduate<br />PES College of Engineering</span></div>
        <div><span className="proof-number">3<sup>rd</sup></span><span className="proof-label">Technovate for India<br />AI for social impact</span></div>
        <div><span className="proof-number">6</span><span className="proof-label">ML models deployed<br />on Hugging Face Hub</span></div>
        <a href="https://coursera.org/share/bd84fe212ded8e521142c021195e3486" target="_blank" rel="noreferrer">
          <span className="proof-number proof-link">↗</span><span className="proof-label">Deep Learning<br />Specialization</span>
        </a>
      </section>

      <section className="section-block page-wrap" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <div><p className="section-kicker">SELECTED WORK <span>01 — 05</span></p><h2 id="work-title">A little of what I&apos;ve been building.</h2></div>
          <p className="section-intro">Products, models, and experiments — shaped around real problems and real people.</p>
        </div>
        <ProjectGallery projects={projects} />
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-grid page-wrap">
          <div className="about-heading"><p className="section-kicker">A BIT ABOUT ME <span>01</span></p><h2 id="about-title">Curious by nature.<br /><em>Practical by design.</em></h2></div>
          <div className="about-copy">
            <p className="about-lead">The best technical work makes someone&apos;s day a little easier.</p>
            <p>I&apos;m pursuing a B.E. in Computer Science and Engineering at PES College of Engineering, graduating in May 2027. I enjoy the full path from exploring data and training a model to designing an API and building the interface around it.</p>
            <p>I&apos;m currently looking for AI/ML or software engineering internship opportunities where I can keep learning, contribute to a team, and ship useful things.</p>
            <a className="text-link" href="mailto:chauhan.aditya.tech@gmail.com">chauhan.aditya.tech@gmail.com <ArrowUpRight /></a>
          </div>
        </div>
        <div className="education-card page-wrap">
          <div className="education-icon" aria-hidden="true">PES</div>
          <div className="education-detail"><span>EDUCATION</span><h3>PES College of Engineering, Mandya</h3><p>B.E. Computer Science and Engineering</p></div>
          <div className="education-date"><span>EXPECTED GRADUATION</span><b>May 2027</b><small>CGPA 7.85 / 10</small></div>
        </div>
      </section>

      <section className="skills-section section-block page-wrap" id="skills" aria-labelledby="skills-title">
        <div className="section-heading">
          <div><p className="section-kicker">TOOLS OF THE TRADE <span>02</span></p><h2 id="skills-title">A toolkit that moves across the stack.</h2></div>
          <p className="section-intro">I like connecting strong technical foundations with thoughtful product details.</p>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <div className="skill-group" key={group.title}>
              <span className="skill-index">0{index + 1}</span><h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="recognition-section page-wrap" aria-labelledby="recognition-title">
        <div className="recognition-heading"><p className="section-kicker">BEYOND THE BUILD <span>03</span></p><h2 id="recognition-title">Things I&apos;m proud of.</h2></div>
        <div className="recognition-list">
          <div><span className="recognition-symbol">✳</span><p><b>3rd place</b> at Technovate for India Conclave, a national AI-for-social-impact ideathon.</p></div>
          <div><span className="recognition-symbol">↗</span><p><b>Top 10 of 200+ teams</b> at Innovate-a-thon and Fin-A-thon.</p></div>
          <div><span className="recognition-symbol">⌁</span><p><b>1st place in college powerlifting</b> in the under-75 kg category, two years running.</p></div>
        </div>
      </section>

      <section className="contact-section page-wrap" id="contact" aria-labelledby="contact-title">
        <div className="contact-card">
          <div className="contact-orbit contact-orbit-one" /><div className="contact-orbit contact-orbit-two" />
          <div className="contact-content">
            <p className="section-kicker">HAVE A GOOD PROBLEM?</p>
            <h2 id="contact-title">Let&apos;s build<br /><em>something useful.</em></h2>
            <p>I&apos;m open to internships, collaborations, and conversations about applied AI and software engineering.</p>
            <MotionAnchor className="button button-light" href="mailto:chauhan.aditya.tech@gmail.com">
              Get in touch <ArrowUpRight />
            </MotionAnchor>
          </div>
          <div className="contact-aside"><span>BASED IN</span><b>Bengaluru, India</b><span>FOCUS</span><b>AI / ML · Full stack</b><a href="/Aditya_Chauhan_Resume.pdf" target="_blank" rel="noreferrer">Download my resume <ArrowUpRight /></a></div>
        </div>
      </section>

      <footer className="site-footer page-wrap">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">AC</span><span className="brand-name">Aditya Chauhan<span>AI / ML · SOFTWARE</span></span></a>
        <p>Thoughtfully made in Bengaluru <span>© 2026</span></p>
        <div>{profileLinks.slice(0, 2).map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight /></a>)}</div>
      </footer>
    </main>
  );
}
