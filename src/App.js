import { useState, useEffect, useRef } from "react";

const C = {
  bg:      "#080C14",
  bg2:     "#0C1220",
  surface: "#111827",
  card:    "#1A2540",
  accent:  "#38BDF8",
  green:   "#4ADE80",
  amber:   "#FCD34D",
  purple:  "#C084FC",
  text:    "#F8FAFC",
  body:    "#CBD5E1",
  muted:   "#94A3B8",
  faint:   "#64748B",
  border:  "#1E293B",
  borderHov: "#334155",
};

const F = {
  display: "'Plus Jakarta Sans', sans-serif",
  body:    "'Inter', sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

function GS() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; font-size: 16px; }
      body { background: ${C.bg}; color: ${C.text}; font-family: ${F.body}; -webkit-font-smoothing: antialiased; line-height: 1.6; }
      input, textarea, button, select { font-family: inherit; }
      a { color: inherit; }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
      @keyframes rise  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      @keyframes count { from{opacity:0} to{opacity:1} }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: ${C.bg}; }
      ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return null;
}

/* Counter */
function Counter({ to, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = null;
      const tick = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setN(Math.floor(ease * to));
        if (p < 1) requestAnimationFrame(tick); else setN(to);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* Tag pill */
function Tag({ children, color }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: F.mono, fontSize: 11, fontWeight: 400,
      color: color || C.muted,
      background: color ? color + "15" : C.card,
      border: `1px solid ${color ? color + "30" : C.border}`,
      padding: "3px 10px", borderRadius: 6,
    }}>{children}</span>
  );
}

/* Section label */
function Label({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12,
    }}>
      <div style={{ width: 20, height: 1.5, background: C.accent, borderRadius: 1 }} />
      <span style={{
        fontFamily: F.mono, fontSize: 11, fontWeight: 500,
        color: C.accent, letterSpacing: "2px", textTransform: "uppercase",
      }}>{children}</span>
    </div>
  );
}

/* Section heading */
function H2({ children, sub }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{
        fontFamily: F.display, fontWeight: 800,
        fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
        color: C.text, lineHeight: 1.15,
        letterSpacing: "-0.75px", marginBottom: sub ? 14 : 0,
      }}>{children}</h2>
      {sub && <p style={{
        fontFamily: F.body, fontSize: 17, fontWeight: 400,
        color: C.body, lineHeight: 1.7, maxWidth: 600,
      }}>{sub}</p>}
    </div>
  );
}

/* Button */
function Btn({ children, primary, onClick, style: extra }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: primary ? C.accent : "transparent",
        color: primary ? C.bg : hov ? C.text : C.body,
        border: primary ? "none" : `1.5px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 9, padding: "12px 26px",
        fontFamily: F.display, fontWeight: 700, fontSize: 14,
        cursor: "pointer", transition: "all .18s",
        opacity: hov && primary ? 0.88 : 1,
        ...extra,
      }}>{children}</button>
  );
}

/* ─── NAV ─── */
function Nav({ active }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const links = [
    { id: "story",    label: "Journey"  },
    { id: "work",     label: "Work"     },
    { id: "clients",  label: "Clients"  },
    { id: "skills",   label: "Skills"   },
    { id: "projects", label: "Projects" },
    { id: "contact",  label: "Contact"  },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: sc ? "rgba(8,12,20,.92)" : "transparent",
      backdropFilter: sc ? "blur(20px)" : "none",
      borderBottom: sc ? `1px solid ${C.border}` : "none",
      transition: "all .3s", padding: "0 clamp(1rem,5vw,3rem)",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.accent}, ${C.green})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.display, fontWeight: 800, fontSize: 16, color: "#080C14",
          }}>S</div>
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 16, color: C.text }}>
            Shikhar<span style={{ color: C.accent }}>.</span>
          </span>
        </div>
        {/* Links */}
        <div style={{ display: "flex", gap: 4 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} style={{
              background: active === l.id ? C.accent + "15" : "transparent",
              border: `1px solid ${active === l.id ? C.accent + "40" : "transparent"}`,
              borderRadius: 7, padding: "6px 14px",
              fontFamily: F.body, fontWeight: 500, fontSize: 13.5,
              color: active === l.id ? C.accent : C.muted,
              cursor: "pointer", transition: "all .18s",
            }}
              onMouseEnter={e => { if (active !== l.id) e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { if (active !== l.id) e.currentTarget.style.color = C.muted; }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  const stats = [
    { to: 4, suffix: ".5+", label: "Years of Experience"   },
    { to: 1, suffix: "M+",  label: "USD Revenue Generated" },
    { to: 7, suffix: "+",   label: "Global MNC Clients"    },
    { to: 40, suffix: "+",  label: "Professionals Led"      },
  ];
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "110px clamp(1.25rem,5vw,3rem) 80px",
      background: `radial-gradient(ellipse 90% 55% at 50% -5%, rgba(56,189,248,.11) 0%, transparent 68%), ${C.bg}`,
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", width: "100%" }}>

        {/* Status chip */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 99, padding: "6px 16px",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%",
            background: C.green, animation: "blink 2.4s ease-in-out infinite" }} />
          <span style={{ fontFamily: F.mono, fontSize: 12, color: C.green, letterSpacing: ".5px" }}>
            Open to roles anywhere in India · Currently in Noida
          </span>
        </div>

        {/* Name + title */}
        <h1 style={{
          fontFamily: F.display, fontWeight: 800,
          fontSize: "clamp(3rem, 7vw, 5rem)",
          color: C.text, lineHeight: 1.0, letterSpacing: "-2.5px",
          marginBottom: 16,
        }}>
          Shikhar<br />
          <span style={{ color: C.accent }}>Mittal</span>
        </h1>

        <p style={{
          fontFamily: F.body, fontWeight: 600, fontSize: 18,
          color: C.muted, letterSpacing: ".5px", marginBottom: 22,
        }}>
          Team Lead &amp; Senior Accessibility Consultant
        </p>

        {/* Intro paragraph */}
        <p style={{
          fontFamily: F.body, fontWeight: 400, fontSize: 17,
          color: C.body, lineHeight: 1.8,
          maxWidth: 580, marginBottom: 38,
        }}>
          4.5+ years making enterprise digital products accessible to everyone —
          from Barclays' banking apps to Meta's AR/VR devices. Expert in WCAG 2.2,
          Section 508, and ADA compliance at global MNC scale.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
          <Btn primary onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}>
            Read My Story ↓
          </Btn>
          <Btn onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
            View Work
          </Btn>
          <a
            href="/Shikhar_Mittal_Resume.pdf"
            download="Shikhar_Mittal_Resume.pdf"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent",
              color: C.body,
              border: `1.5px solid ${C.border}`,
              borderRadius: 9, padding: "12px 26px",
              fontFamily: F.display, fontWeight: 700, fontSize: 14,
              textDecoration: "none", transition: "all .18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.body; }}
          >
            ↓ Download CV
          </a>
          <Btn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Get In Touch
          </Btn>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "22px 20px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${C.accent}88, transparent)` }} />
              <div style={{
                fontFamily: F.display, fontWeight: 800,
                fontSize: "2rem", color: C.accent, lineHeight: 1, marginBottom: 8,
              }}>
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div style={{
                fontFamily: F.body, fontWeight: 500, fontSize: 13,
                color: C.body, lineHeight: 1.4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── JOURNEY ─── */
const chapters = [
  {
    badge: "Chapter 1",
    period: "Aug 2021 – Aug 2022",
    headline: "Where it all began.",
    role: "Accessibility Test Engineer — Intern",
    org: "HCLTech",
    color: C.amber,
    story: [
      "Every career has a defining first year. Mine started at HCLTech as an intern, and the assignment was anything but entry-level: validating web and desktop applications for Microsoft against their own accessibility standards — MAS and WCAG 2.1.",
      "I wasn't just ticking boxes on a checklist. I was learning to experience the web the way a screen reader user does — sequentially, without visual shortcuts. That shift in perspective became the foundation of everything I've built since.",
      "I also wrote automation scripts in Java, Selenium WebDriver, and TestNG — building the technical depth that would later help me generate real business value through POCs.",
    ],
    highlights: [
      "Microsoft accessibility validation (MAS + WCAG 2.1)",
      "Java, Selenium WebDriver, TestNG automation",
      "First exposure to enterprise-scale accessibility at a global MNC",
    ],
  },
  {
    badge: "Chapter 2",
    period: "Sep 2022 – Sep 2024",
    headline: "Going global.",
    role: "Software Engineer — Senior Accessibility Auditor",
    org: "HCLTech",
    color: C.accent,
    story: [
      "Two years in, and the work scaled to a level I hadn't imagined when I started. I was now leading end-to-end accessibility audits for Meta, Sony, Wolters Kluwer, and Microsoft — across web, mobile, and AR/VR platforms including the Meta Portal and Ray-Ban Stories.",
      "AR/VR accessibility was a barely-defined field at the time. Testing mixed-reality interfaces for accessibility wasn't something you could look up in a manual — you had to think from first principles, figure out what 'accessible' even meant for a device without a traditional screen, and build frameworks on the fly. I was one of the people helping define that.",
      "I authored 6+ VPATs — the documents that determine whether enterprise software is accessible enough for government and institutional procurement. And through technical POCs that demonstrated real depth in accessibility engineering, I contributed to generating approximately USD 1 million in new project revenue for HCLTech.",
    ],
    highlights: [
      "Global audits: Meta, Sony, Wolters Kluwer, Microsoft",
      "AR/VR accessibility — Meta Portal and Ray-Ban Stories",
      "6+ VPATs authored for enterprise procurement",
      "~USD 1M revenue contribution through technical POCs",
      "Game Accessibility Guidelines (GAG) training delivery",
    ],
  },
  {
    badge: "Chapter 3",
    period: "Oct 2024 – Feb 2026",
    headline: "Leading the team.",
    role: "Lead Engineer",
    org: "HCLTech",
    color: C.green,
    story: [
      "The move from individual contributor to team lead is where many engineers lose their way. I didn't. As Lead Engineer at HCLTech, I took on primary consulting responsibility for Barclays Bank and Scholastic — two demanding clients with very different accessibility needs.",
      "At the same time, I was managing a team of 10+ engineers. I standardised our testing processes with checklists and frameworks that measurably improved team productivity by 20%. Mobile accessibility — real-device testing on iOS and Android through SeeTest and BrowserStack — became one of our strongest service areas.",
      "Barclays formally recognised me as their Knowledge Champion for my contribution to team capability and knowledge transfer. That recognition, from a client of that calibre, meant more than any internal promotion. It confirmed that leading people and leading projects could coexist — and that I was capable of both.",
    ],
    highlights: [
      "Primary consultant: Barclays Bank and Scholastic",
      "Managed 10+ engineers with 20% productivity improvement",
      "Mobile testing: real devices, SeeTest, BrowserStack",
      "Barclays 'Knowledge Champion' — formal client recognition",
      "PDF, Word, and PowerPoint document remediation",
    ],
  },
  {
    badge: "Chapter 4",
    period: "Feb 2026 – Present",
    headline: "Building what's next.",
    role: "Team Lead",
    org: "MagicEDTech",
    color: C.purple,
    story: [
      "Today I lead accessibility at MagicEDTech as Team Lead, with primary consulting responsibility for Edmentum Learning — one of the largest K-12 digital education platforms in the United States. My scope spans client consultation, audit strategy, leadership of 40+ accessibility professionals, remediation collaboration, and knowledge transfer delivery.",
      "The scale is bigger, the stakes are higher, and the problems are more complex. But the foundation is the same one I built four years ago: see the product through the eyes of the person who needs it most, and fix what's broken.",
      "I'm currently pursuing CPACC certification, building AI-powered accessibility tools, and working toward the intersection of machine learning and inclusive design. The next chapter is still being written.",
    ],
    highlights: [
      "Team Lead across 40+ accessibility professionals",
      "Primary client: Edmentum Learning (US K-12 EdTech)",
      "Full audit strategy: Web, Mobile, and Documents",
      "WCAG 2.2, Section 508, ADA, and EAA compliance",
      "CPACC certification in progress",
    ],
  },
];

function JourneySection() {
  return (
    <section id="story" style={{ padding: "96px clamp(1.25rem,5vw,3rem)", background: C.bg2 }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Label>The Journey</Label>
        <H2 sub="From intern to team lead. From one client to the world's biggest technology companies. This is how it happened — told the way it deserves to be.">
          Four chapters. One direction.
        </H2>

        <div style={{ position: "relative" }}>
          {/* Timeline spine */}
          <div style={{
            position: "absolute", left: 20, top: 8, bottom: 0, width: 1.5,
            background: `linear-gradient(to bottom, ${C.accent}55, ${C.purple}33)`,
          }} />

          {chapters.map((ch, i) => (
            <div key={i} style={{ display: "flex", gap: 32, marginBottom: i < chapters.length - 1 ? 60 : 0 }}>

              {/* Dot */}
              <div style={{ flexShrink: 0, width: 42, paddingTop: 4, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: ch.color, border: `3px solid ${C.bg2}`,
                  boxShadow: `0 0 14px ${ch.color}55`,
                }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                {/* Meta row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: 11, fontWeight: 500,
                    color: ch.color, background: ch.color + "18",
                    padding: "3px 10px", borderRadius: 99,
                  }}>{ch.badge}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 11, color: C.faint }}>{ch.period}</span>
                </div>

                {/* Headline */}
                <h3 style={{
                  fontFamily: F.display, fontWeight: 800,
                  fontSize: "clamp(1.3rem, 2.8vw, 1.7rem)",
                  color: C.text, lineHeight: 1.2, marginBottom: 4,
                }}>{ch.headline}</h3>

                {/* Role */}
                <p style={{
                  fontFamily: F.body, fontWeight: 600, fontSize: 14,
                  color: ch.color, marginBottom: 20,
                }}>{ch.role} · {ch.org}</p>

                {/* Story paragraphs */}
                <div style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${ch.color}`,
                  borderRadius: "0 12px 12px 0",
                  padding: "24px 28px", marginBottom: 20,
                }}>
                  {ch.story.map((para, j) => (
                    <p key={j} style={{
                      fontFamily: F.body, fontWeight: 400, fontSize: 15.5,
                      color: C.body, lineHeight: 1.85,
                      marginBottom: j < ch.story.length - 1 ? 16 : 0,
                    }}>{para}</p>
                  ))}
                </div>

                {/* Highlights */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ch.highlights.map(h => (
                    <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{
                        color: ch.color, fontSize: 13, fontWeight: 700,
                        flexShrink: 0, marginTop: 1,
                      }}>✓</span>
                      <span style={{
                        fontFamily: F.body, fontWeight: 500, fontSize: 14.5,
                        color: C.body, lineHeight: 1.5,
                      }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WORK ─── */
const clients = [
  {
    name: "Barclays Bank", sector: "Fintech · Banking",
    scope: "Web · iOS · Android", era: "HCLTech · 2024–2026", color: "#60A5FA",
    badge: "Knowledge Champion Award",
    desc: "Served as primary accessibility consultant for Barclays Bank — conducting end-to-end WCAG 2.2, ADA, and EAA audits across their banking web platform and mobile apps (iOS and Android). Carried out real-device testing via SeeTest and BrowserStack. Formally recognised by Barclays as 'Knowledge Champion' for exceptional knowledge transfer and team capability building.",
    tags: ["WCAG 2.2", "ADA", "EAA", "iOS", "Android", "SeeTest", "BrowserStack", "Document Remediation"],
  },
  {
    name: "Meta", sector: "Big Tech · AR/VR",
    scope: "Web · Mobile · AR/VR Hardware", era: "HCLTech · 2022–2024", color: "#818CF8",
    badge: "AR/VR Accessibility Pioneer",
    desc: "Conducted full accessibility audits across Meta's web and mobile products, and their AR/VR hardware — Meta Portal and Ray-Ban Stories. This was emerging territory: testing immersive mixed-reality interfaces for accessibility required building testing frameworks from first principles. I was among the first accessibility professionals to formalise systematic approaches for these platforms.",
    tags: ["WCAG 2.1", "AR/VR", "Meta Portal", "Ray-Ban Stories", "Mobile", "Usability Testing"],
  },
  {
    name: "Microsoft", sector: "Big Tech · Enterprise",
    scope: "Web · Desktop Applications", era: "HCLTech · 2021–2024", color: "#34D399",
    badge: "MAS Compliance Delivery",
    desc: "Validated web and desktop applications against Microsoft Accessibility Standards (MAS) and WCAG 2.1 across two separate engagement periods — first as an intern learning the craft, then as a senior auditor leading delivery. Also contributed test automation using Java, Selenium WebDriver, and TestNG to improve regression coverage.",
    tags: ["MAS", "WCAG 2.1", "Desktop", "Web", "Java", "Selenium", "TestNG"],
  },
  {
    name: "Sony", sector: "Consumer Electronics",
    scope: "Web · Mobile", era: "HCLTech · 2022–2024", color: "#F472B6",
    badge: "Global Audit",
    desc: "Global accessibility audit engagement for Sony's digital products — covering web and mobile platforms. Delivered within HCLTech's enterprise audit programme using cross-browser validation and Agile/Scrum delivery cycles.",
    tags: ["WCAG 2.1", "Web", "Mobile", "Cross-browser", "Agile/Scrum"],
  },
  {
    name: "Wolters Kluwer", sector: "Legal · Finance · Healthcare",
    scope: "Web · Documents", era: "HCLTech · 2022–2024", color: "#FB923C",
    badge: "VPAT Delivery",
    desc: "Accessibility auditing and VPAT authorship for Wolters Kluwer's enterprise digital products — serving markets where accessibility compliance directly affects procurement eligibility. Delivered conformance reports supporting their legal, financial, and healthcare platform offerings.",
    tags: ["WCAG 2.1", "VPAT", "Section 508", "Web", "Documents", "Compliance Reporting"],
  },
  {
    name: "Scholastic", sector: "Publishing · Education",
    scope: "Web · Mobile · Documents", era: "HCLTech · 2024–2026", color: "#F9A8D4",
    badge: "Education Platform Audit",
    desc: "Accessibility audit and compliance review for Scholastic's digital education products — ensuring children's learning content meets WCAG 2.2 and ADA standards across web, mobile, and document formats.",
    tags: ["WCAG 2.2", "ADA", "Web", "Mobile", "Education", "Document Remediation"],
  },
  {
    name: "Edmentum Learning", sector: "EdTech · US K-12",
    scope: "Web · Mobile · Documents", era: "MagicEDTech · 2026–Present", color: "#38BDF8",
    badge: "Current Engagement",
    desc: "Current primary client as Team Lead at MagicEDTech. Responsible for end-to-end accessibility audit strategy for one of the largest K-12 digital learning platforms in the United States — covering web, mobile, and document platforms against WCAG 2.2, Section 508, ADA, and EAA compliance requirements.",
    tags: ["WCAG 2.2", "Section 508", "ADA", "EAA", "Web", "Mobile", "Documents"],
  },
];

function WorkSection() {
  const [sel, setSel] = useState(0);
  const cl = clients[sel];
  return (
    <section id="work" style={{ padding: "96px clamp(1.25rem,5vw,3rem)", background: C.bg }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Label>Client Work</Label>
        <H2 sub="A selection of enterprise accessibility engagements — spanning fintech, big tech, education, legal, and consumer electronics.">
          Work that ships at scale.
        </H2>

        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16, alignItems: "start" }}>

          {/* Left list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {clients.map((c, i) => (
              <button key={c.name} onClick={() => setSel(i)} style={{
                background: sel === i ? C.surface : "transparent",
                border: sel === i ? `1px solid ${C.border}` : "1px solid transparent",
                borderLeft: `3px solid ${sel === i ? c.color : "transparent"}`,
                borderRadius: "0 9px 9px 0", padding: "12px 16px",
                textAlign: "left", cursor: "pointer", transition: "all .18s",
              }}>
                <div style={{
                  fontFamily: F.body, fontWeight: 600, fontSize: 14,
                  color: sel === i ? C.text : C.muted, marginBottom: 2,
                }}>{c.name}</div>
                <div style={{
                  fontFamily: F.body, fontWeight: 400, fontSize: 12,
                  color: C.faint,
                }}>{c.sector}</div>
              </button>
            ))}
          </div>

          {/* Right detail */}
          <div key={sel} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderTop: `3px solid ${cl.color}`,
            borderRadius: "0 12px 12px 12px", padding: "32px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
              <h3 style={{
                fontFamily: F.display, fontWeight: 800,
                fontSize: "1.5rem", color: C.text, lineHeight: 1.2,
              }}>{cl.name}</h3>
              <span style={{
                fontFamily: F.mono, fontSize: 11, fontWeight: 500,
                color: cl.color, background: cl.color + "18",
                border: `1px solid ${cl.color}33`,
                padding: "4px 12px", borderRadius: 99, whiteSpace: "nowrap",
              }}>{cl.badge}</span>
            </div>

            <p style={{
              fontFamily: F.body, fontWeight: 500, fontSize: 13,
              color: C.faint, marginBottom: 4,
            }}>{cl.scope}</p>
            <p style={{
              fontFamily: F.mono, fontSize: 11, color: C.faint, marginBottom: 24,
            }}>{cl.era}</p>

            <p style={{
              fontFamily: F.body, fontWeight: 400, fontSize: 15.5,
              color: C.body, lineHeight: 1.85, marginBottom: 24,
            }}>{cl.desc}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {cl.tags.map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CLIENTS OVERVIEW ─── */
const achievements = [
  { title: "Barclays Knowledge Champion", color: "#60A5FA",
    desc: "Formally recognised by Barclays Bank for exceptional knowledge transfer and team capability building." },
  { title: "Remediation Excellence Award", color: C.green,
    desc: "Commended by multiple clients for precise HTML, CSS, and ARIA code-level remediation of critical accessibility bugs." },
  { title: "~USD 1M Revenue Contributed", color: C.amber,
    desc: "Generated new project revenue for HCLTech through technical Proof of Concepts demonstrating deep accessibility engineering expertise." },
  { title: "6+ VPATs Authored", color: C.purple,
    desc: "Authored Voluntary Product Accessibility Templates for global enterprise technology clients supporting government and institutional procurement." },
];

function ClientsSection() {
  return (
    <section id="clients" style={{ padding: "96px clamp(1.25rem,5vw,3rem)", background: C.bg2 }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Label>Clients &amp; Recognition</Label>
        <H2 sub="Trusted by some of the world's most recognised technology and financial brands.">
          Trusted globally.
        </H2>

        {/* Client grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10, marginBottom: 40 }}>
          {clients.map(c => (
            <div key={c.name} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "20px 18px", textAlign: "center",
              transition: "border-color .18s, transform .18s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}>
              <div style={{
                fontFamily: F.display, fontWeight: 700,
                fontSize: 15, color: C.text, marginBottom: 5,
              }}>{c.name}</div>
              <div style={{
                fontFamily: F.body, fontWeight: 400, fontSize: 12,
                color: C.muted, marginBottom: 10,
              }}>{c.sector}</div>
              <span style={{
                fontFamily: F.mono, fontSize: 10, color: c.color,
                background: c.color + "15", border: `1px solid ${c.color}30`,
                padding: "2px 8px", borderRadius: 99,
              }}>{c.era.split("·")[0].trim()}</span>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
          {achievements.map(a => (
            <div key={a.title} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${a.color}`,
              borderRadius: "0 10px 10px 0", padding: "20px 22px",
            }}>
              <div style={{
                fontFamily: F.display, fontWeight: 700,
                fontSize: 15, color: C.text, marginBottom: 8,
              }}>{a.title}</div>
              <p style={{
                fontFamily: F.body, fontWeight: 400, fontSize: 14,
                color: C.body, lineHeight: 1.7,
              }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ─── */
const certs = [
  { name: "Section 508", full: "Certified Trusted Tester", org: "U.S. Dept of Homeland Security", color: C.green,  status: "Certified"      },
  { name: "CPACC",        full: "Certified Professional in Accessibility Core Competencies", org: "IAAP", color: C.accent, status: "In Progress"    },
  { name: "WAS",          full: "Web Accessibility Specialist", org: "IAAP", color: "#818CF8", status: "Planned · 2026" },
  { name: "CPWA",         full: "Certified Professional in Web Accessibility", org: "IAAP", color: C.purple, status: "Planned · 2027" },
];

const skillGroups = [
  { cat: "Standards & Compliance",
    items: ["WCAG 2.0 / 2.1 / 2.2", "Section 508", "ADA", "EN 301 549", "EAA", "MAS", "PDF/UA", "VPAT Creation"] },
  { cat: "Assistive Technology",
    items: ["JAWS", "NVDA", "VoiceOver (iOS/macOS)", "TalkBack (Android)", "ZoomText", "Dragon NaturallySpeaking"] },
  { cat: "Testing Tools",
    items: ["axe", "WAVE", "Lighthouse", "Accessibility Insights", "ARC Toolkit", "BrowserStack", "SeeTest", "Color Contrast Analyser"] },
  { cat: "Automation & Development",
    items: ["HTML5", "CSS", "WAI-ARIA", "Java", "Selenium WebDriver", "TestNG", "JIRA", "Azure DevOps", "CI/CD"] },
  { cat: "Document Accessibility",
    items: ["Adobe Acrobat Pro", "PDF Remediation", "Word Accessibility", "PowerPoint Accessibility", "VPAT Authoring"] },
  { cat: "Methodologies",
    items: ["Manual Testing", "Screen Reader Testing", "Usability Testing", "Shift-left Accessibility", "Agile / Scrum", "Compliance Reporting"] },
];

function SkillsSection() {
  return (
    <section id="skills" style={{ padding: "96px clamp(1.25rem,5vw,3rem)", background: C.bg }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Label>Skills &amp; Certifications</Label>
        <H2 sub="Industry certifications alongside deep technical expertise across standards, tools, and methodologies.">
          What I bring to the table.
        </H2>

        {/* Certs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, marginBottom: 36 }}>
          {certs.map(c => (
            <div key={c.name} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "22px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: c.color }} />
              <div style={{
                fontFamily: F.display, fontWeight: 800,
                fontSize: 24, color: c.color, marginBottom: 6,
              }}>{c.name}</div>
              <div style={{
                fontFamily: F.body, fontWeight: 500, fontSize: 13,
                color: C.body, lineHeight: 1.5, marginBottom: 4,
              }}>{c.full}</div>
              <div style={{
                fontFamily: F.body, fontWeight: 400, fontSize: 12,
                color: C.muted, marginBottom: 14,
              }}>{c.org}</div>
              <span style={{
                fontFamily: F.mono, fontSize: 11,
                color: c.status === "Certified" ? C.green : c.status === "In Progress" ? C.accent : C.faint,
                background: c.status === "Certified" ? C.green + "18" : c.status === "In Progress" ? C.accent + "18" : C.card,
                border: `1px solid ${c.status === "Certified" ? C.green + "33" : c.status === "In Progress" ? C.accent + "33" : C.border}`,
                padding: "3px 10px", borderRadius: 99,
              }}>{c.status}</span>
            </div>
          ))}
        </div>

        {/* Skill groups */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 12 }}>
          {skillGroups.map(g => (
            <div key={g.cat} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "22px",
            }}>
              <div style={{
                fontFamily: F.body, fontWeight: 700, fontSize: 13,
                color: C.text, marginBottom: 14,
                paddingBottom: 10, borderBottom: `1px solid ${C.border}`,
              }}>{g.cat}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {g.items.map(i => <Tag key={i}>{i}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ─── */
const projects = [
  { name: "PDF Accessibility Checker", status: "Building", color: C.accent,
    desc: "A Python tool that scans any PDF document and flags WCAG violations — missing structure tags, null alt text, and incorrect reading order — then generates a clean, formatted compliance report.",
    tech: ["Python", "pdfplumber", "pypdf", "PDF/UA"] },
  { name: "Accessibility Audit Dashboard", status: "Planned", color: C.green,
    desc: "A Streamlit dashboard that ingests axe-core JSON results and visualises WCAG compliance by criterion, page, and severity. Designed for non-technical MNC stakeholders who need clear data, not raw reports.",
    tech: ["Python", "Streamlit", "axe-core", "Pandas"] },
  { name: "AI Alt Text Generator", status: "Planned", color: "#818CF8",
    desc: "A computer vision and Claude API tool that generates contextually accurate, WCAG-compliant alt text for enterprise image libraries — reducing manual effort while improving quality.",
    tech: ["Claude API", "CNN", "Python", "WCAG 1.1.1"] },
  { name: "Plain Language Simplifier", status: "Planned", color: C.purple,
    desc: "An NLP model that rewrites complex legal, medical, or government text to a target reading level — directly addressing WCAG Success Criterion 3.1.5 for users with cognitive disabilities.",
    tech: ["NLP", "LLM Fine-tuning", "Python", "WCAG 3.1.5"] },
];

function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: "96px clamp(1.25rem,5vw,3rem)", background: C.bg2 }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Label>Projects</Label>
        <H2 sub="Open-source tools at the intersection of accessibility expertise and AI automation.">
          Building the future of accessible AI.
        </H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
          {projects.map(p => (
            <div key={p.name} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "26px",
              display: "flex", flexDirection: "column", gap: 14,
              transition: "border-color .18s, transform .18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <h3 style={{
                  fontFamily: F.display, fontWeight: 700,
                  fontSize: 16, color: C.text, lineHeight: 1.3, flex: 1,
                }}>{p.name}</h3>
                <span style={{
                  fontFamily: F.mono, fontSize: 11, flexShrink: 0,
                  color: p.status === "Building" ? C.green : C.faint,
                  background: p.status === "Building" ? C.green + "18" : C.card,
                  border: `1px solid ${p.status === "Building" ? C.green + "33" : C.border}`,
                  padding: "3px 10px", borderRadius: 99,
                }}>{p.status}</span>
              </div>
              <p style={{
                fontFamily: F.body, fontWeight: 400, fontSize: 14.5,
                color: C.body, lineHeight: 1.8, margin: 0,
              }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
                {p.tech.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const inp = {
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 9, padding: "13px 16px", fontFamily: F.body, fontWeight: 400,
    fontSize: 15, color: C.text, outline: "none",
    transition: "border-color .18s", resize: "vertical",
  };
  return (
    <section id="contact" style={{ padding: "96px clamp(1.25rem,5vw,3rem)", background: C.bg }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label>Contact</Label>
        <H2 sub="Open to senior accessibility roles, consulting engagements, freelance audits, and speaking opportunities — anywhere in India.">
          Let's work together.
        </H2>

        {/* Contact details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 36 }}>
          {[
            { label: "Email",    val: "shikharfzdmittal@gmail.com",        href: "mailto:shikharfzdmittal@gmail.com"              },
            { label: "Phone",    val: "+91 8979859044",                     href: "tel:+918979859044"                              },
            { label: "LinkedIn", val: "linkedin.com/in/shikhar-mittal-a11yqa", href: "https://linkedin.com/in/shikhar-mittal-a11yqa" },
            { label: "Location", val: "Noida · Open to anywhere in India",  href: null                                             },
          ].map(r => (
            <div key={r.label} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "16px 18px",
            }}>
              <div style={{
                fontFamily: F.mono, fontSize: 10.5, color: C.faint,
                marginBottom: 5, textTransform: "uppercase", letterSpacing: "1px",
              }}>{r.label}</div>
              {r.href
                ? <a href={r.href} style={{
                    fontFamily: F.body, fontWeight: 500, fontSize: 14,
                    color: C.accent, textDecoration: "none",
                  }}>{r.val}</a>
                : <span style={{
                    fontFamily: F.body, fontWeight: 500, fontSize: 14, color: C.body,
                  }}>{r.val}</span>}
            </div>
          ))}
        </div>

        {/* Form */}
        {sent ? (
          <div style={{
            background: C.green + "12", border: `1px solid ${C.green}44`,
            borderRadius: 12, padding: "36px", textAlign: "center",
          }}>
            <div style={{
              fontFamily: F.display, fontWeight: 800, fontSize: 22,
              color: C.green, marginBottom: 10,
            }}>Message sent ✓</div>
            <p style={{
              fontFamily: F.body, fontWeight: 400, fontSize: 15, color: C.body,
            }}>Thanks for reaching out — I'll reply within 24 hours.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { n: "name",  l: "Your Name",      t: "text",  ph: "Your full name"       },
              { n: "email", l: "Email Address",   t: "email", ph: "your@company.com"     },
            ].map(f => (
              <div key={f.n}>
                <label style={{
                  fontFamily: F.body, fontWeight: 600, fontSize: 13,
                  color: C.body, display: "block", marginBottom: 7,
                }}>{f.l}</label>
                <input name={f.n} type={f.t} value={form[f.n]}
                  placeholder={f.ph}
                  onChange={e => setForm({ ...form, [f.n]: e.target.value })}
                  style={inp}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.border} />
              </div>
            ))}
            <div>
              <label style={{
                fontFamily: F.body, fontWeight: 600, fontSize: 13,
                color: C.body, display: "block", marginBottom: 7,
              }}>Message</label>
              <textarea name="message" rows={5} value={form.message}
                placeholder="Tell me about the role, project, or opportunity you have in mind..."
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={inp}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <Btn primary onClick={() => {
              if (form.name && form.email && form.message) setSent(true);
            }}>Send Message →</Btn>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── APP ─── */
export default function App() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const ids = ["hero","story","work","clients","skills","projects","contact"];
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <GS />
      <Nav active={active} />
      <main>
        <Hero />
        <JourneySection />
        <WorkSection />
        <ClientsSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <footer style={{
        background: C.bg2, borderTop: `1px solid ${C.border}`,
        padding: "28px clamp(1.25rem,5vw,3rem)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: F.body, fontWeight: 500, fontSize: 13, color: C.muted }}>
          © 2026 Shikhar Mittal · Senior Accessibility Consultant · Noida, India
        </span>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.accent }}>
          Accessibility-first, always.
        </span>
      </footer>
    </>
  );
}
