// Landing page
// src/pages/Landing.jsx
import React, { useEffect, useState, useRef } from "react";

/**
 * Landing.jsx
 * Self-contained landing page with:
 *  - Animated hero (gradient + floating blobs)
 *  - Role selector (Learner / Employer / Institution)
 *  - Demo verification card (cycles trust statuses)
 *  - Modal with simulated verification (loading -> result)
 *  - Scroll-reveal animations via IntersectionObserver
 *
 * Requires Tailwind available in the project. Additional CSS is injected on mount.
 */

const STATUS_ORDER = ["verified", "onchain_verified", "pending", "revoked"];
const STATUS_META = {
  verified: { label: "Verified", color: "green", description: "Certificate is valid." },
  onchain_verified: { label: "On-chain", color: "blue", description: "Attestation confirmed on-chain." },
  pending: { label: "Pending", color: "amber", description: "Verification in progress." },
  revoked: { label: "Revoked", color: "red", description: "This credential has been revoked." },
};

function TrustBadge({ status = "unknown" }) {
  const meta = STATUS_META[status] || { label: "Unknown", color: "gray" };
  const colorMap = {
    green: "bg-green-100 text-green-800",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-700",
  };
  const pill = colorMap[meta.color] || colorMap.gray;

  const dotColor = {
    green: "bg-green-600",
    amber: "bg-amber-600",
    blue: "bg-blue-600",
    red: "bg-red-600",
    gray: "bg-gray-500",
  }[meta.color];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${pill} shadow-sm`}
      aria-label={`Trust status: ${meta.label}`}
      role="status"
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} aria-hidden />
      {meta.label}
    </span>
  );
}

function RoleSelector({ value, onChange }) {
  const roles = [
    { key: "learner", label: "Learner", desc: "View credentials, wallet & profile" },
    { key: "employer", label: "Employer", desc: "Search & verify candidates" },
    { key: "institution", label: "Institution", desc: "Issue & manage credentials" },
  ];

  return (
    <div className="flex gap-3 bg-white/30 backdrop-blur-md p-1 rounded-full shadow-md">
      {roles.map((r) => {
        const active = value === r.key;
        return (
          <button
            key={r.key}
            onClick={() => onChange(r.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 transform ${
              active
                ? "scale-105 shadow-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                : "text-gray-700 hover:scale-105"
            }`}
            aria-pressed={active}
            aria-label={`Select role ${r.label}`}
            title={r.desc}
          >
            <div
              className={`w-3 h-3 rounded-full ${active ? "bg-white/90" : "bg-gray-300"}`}
              aria-hidden
            />
            <span className="text-sm font-medium">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Landing() {
  // UI state
  const [role, setRole] = useState("learner");
  const [statusIndex, setStatusIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [query, setQuery] = useState("");
  const revealRef = useRef(null);

  // Sample certificate used by demo card
  const SAMPLE_CERT = {
    id: "CREDS-0001-2025",
    name: "Full Stack Web Development — Diploma",
    issuer: "CredsOne Institute",
    issuedOn: "2025-09-20",
    validity: "2028-09-20",
  };

  // Inject extra CSS for animations & decorative blobs (so no external CSS file)
  useEffect(() => {
    const css = `
      /* Floating blobs */
      .blob {
        position: absolute;
        filter: blur(40px);
        opacity: 0.75;
        transform: translate3d(0,0,0);
        mix-blend-mode: screen;
      }
      .float-anim {
        animation: floaty 8s ease-in-out infinite;
      }
      .float-anim.slow { animation-duration: 12s; }
      .float-anim.fast { animation-duration: 6s; }
      @keyframes floaty {
        0% { transform: translateY(0) translateX(0) scale(1); }
        50% { transform: translateY(-18px) translateX(8px) scale(1.05); }
        100% { transform: translateY(0) translateX(0) scale(1); }
      }

      /* Reveal animation */
      .reveal { opacity: 0; transform: translateY(20px) scale(.995); transition: all 700ms cubic-bezier(.2,.9,.3,1); }
      .reveal.show { opacity: 1; transform: translateY(0) scale(1); }

      /* Glassy button hover pulse */
      .btn-glow { transition: box-shadow .25s, transform .15s; }
      .btn-glow:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(99,102,241,.15); }

      /* Fancy certificate card tilt on hover */
      .tilt { transition: transform .35s cubic-bezier(.2,.9,.3,1), box-shadow .35s; transform-origin: center; }
      .tilt:hover { transform: perspective(900px) rotateX(6deg) rotateY(-6deg) translateY(-6px); box-shadow: 0 30px 60px rgba(0,0,0,.12); }

      /* Modal backdrop blur */
      .modal-backdrop { backdrop-filter: blur(6px); background: rgba(2,6,23,0.45); }
    `;
    const style = document.createElement("style");
    style.id = "landing-extra-styles";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return () => {
      const s = document.getElementById("landing-extra-styles");
      if (s) s.remove();
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  // Cycle trust statuses
  function cycleStatus() {
    setStatusIndex((i) => (i + 1) % STATUS_ORDER.length);
  }

  // Simulate verification API call for modal
  function startVerify(certIdOrQuery) {
    setModalOpen(true);
    setVerifying(true);
    setVerifyResult(null);

    // simulate network latency and probabilistic result
    setTimeout(() => {
      setVerifying(false);
      // pretend logic: if query includes "rev", make it revoked; if "chain", onchain; else pick by statusIndex
      const q = (certIdOrQuery || "").toLowerCase();
      let status = STATUS_ORDER[statusIndex];
      if (q.includes("rev")) status = "revoked";
      else if (q.includes("chain")) status = "onchain_verified";
      else if (q.includes("pend")) status = "pending";
      // make a rich result
      setVerifyResult({
        id: certIdOrQuery || SAMPLE_CERT.id,
        name: SAMPLE_CERT.name,
        issuer: SAMPLE_CERT.issuer,
        issuedOn: SAMPLE_CERT.issuedOn,
        validity: SAMPLE_CERT.validity,
        status,
      });
    }, 1100 + Math.random() * 900);
  }

  // small helper to format date
  function fmtDate(d) {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  }

  const currentStatus = STATUS_ORDER[statusIndex];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative gradient blobs (absolute positioned) */}
      <div aria-hidden className="pointer-events-none">
        <div className="blob float-anim slow" style={{ left: "-8%", top: "-8%", width: 360, height: 360, background: "radial-gradient(circle at 20% 20%, #ff80bf, transparent 30%), radial-gradient(circle at 80% 80%, #8ea7ff, transparent 30%)", borderRadius: "50%" }} />
        <div className="blob float-anim fast" style={{ right: "-6%", top: "10%", width: 300, height: 300, background: "radial-gradient(circle at 30% 30%, #7af3d7, transparent 30%), radial-gradient(circle at 70% 70%, #ffd36e, transparent 30%)", borderRadius: "50%" }} />
        <div className="blob float-anim" style={{ left: "20%", bottom: "-12%", width: 420, height: 420, background: "radial-gradient(circle at 30% 70%, #b98bff, transparent 30%), radial-gradient(circle at 70% 30%, #ff9ba3, transparent 30%)", borderRadius: "50%" }} />
      </div>

      {/* Hero */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-7/12 reveal" ref={revealRef}>
            <div className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-orange-400 p-1 rounded-3xl shadow-2xl">
              <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
                      CredsOne — <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-100">verify & trust</span> credentials instantly
                    </h1>
                    <p className="mt-4 text-white/85 max-w-xl">
                      Fast, transparent credential verification for learners, employers, and institutions. Try the demo verification below — cycle trust badges, open details, and simulate on-chain proof.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                      <RoleSelector value={role} onChange={setRole} />
                      <button
                        onClick={() => {
                          // quick navigate hint: if we were using router we'd navigate to /verify
                          startVerify(SAMPLE_CERT.id);
                        }}
                        className="ml-2 btn-glow inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow hover:scale-105"
                      >
                        Try Demo Verify
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-7 flex gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-white/10 ring-1 ring-white/10">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 21h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-sm text-white/90">
                          <div className="font-semibold">Secure & Transparent</div>
                          <div className="text-xs text-white/70">End-to-end auditable verifications</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-white/10 ring-1 ring-white/10">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 3v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 21H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-sm text-white/90">
                          <div className="font-semibold">Role-based UX</div>
                          <div className="text-xs text-white/70">Tailored flows for each user type</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right-side small stats / preview */}
                  <div className="w-80 hidden md:block">
                    <div className="tilt p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-white/80">Sample Credential</div>
                          <div className="text-white font-bold">Full Stack Diploma</div>
                        </div>
                        <div>
                          <TrustBadge status={currentStatus} />
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-white/80 space-y-1">
                        <div>Issuer: <span className="font-medium">CredsOne Institute</span></div>
                        <div>Issued: <span className="font-medium">{fmtDate(SAMPLE_CERT.issuedOn)}</span></div>
                        <div>Valid till: <span className="font-medium">{fmtDate(SAMPLE_CERT.validity)}</span></div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button onClick={() => startVerify(SAMPLE_CERT.id)} className="flex-1 py-2 rounded-md bg-white text-indigo-700 font-semibold">Verify</button>
                        <button onClick={cycleStatus} className="px-3 py-2 rounded-md border border-white/10 text-white/90">Demo</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* small features bar */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="reveal bg-white/5 p-3 rounded-xl flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                <div className="text-sm text-white/90">
                  <div className="font-semibold">Instant Verification</div>
                  <div className="text-xs text-white/70">Real-time check within seconds</div>
                </div>
              </div>

              <div className="reveal bg-white/5 p-3 rounded-xl flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
                <div className="text-sm text-white/90">
                  <div className="font-semibold">On-chain Evidence</div>
                  <div className="text-xs text-white/70">Tamper-evident proofs</div>
                </div>
              </div>

              <div className="reveal bg-white/5 p-3 rounded-xl flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-red-400" />
                <div className="text-sm text-white/90">
                  <div className="font-semibold">Role Controls</div>
                  <div className="text-xs text-white/70">Custom dashboards & workflows</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Demo card + search */}
          <div className="w-full md:w-5/12 reveal">
            <div className="p-6 rounded-2xl bg-white/90 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-700">Demo Verification</h3>
                  <p className="text-sm text-slate-500">Enter an ID or scan QR to preview verification flow.</p>
                </div>
                <div className="text-xs text-slate-400">Interactive · No backend</div>
              </div>

              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter credential ID (e.g. CREDS-0001-2025)"
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    aria-label="Credential ID"
                  />
                  <button
                    onClick={() => startVerify(query || SAMPLE_CERT.id)}
                    className="px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow btn-glow"
                    aria-label="Start verification"
                  >
                    Verify
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-white to-white/80 border border-slate-100 tilt">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-slate-500">Credential</div>
                      <div className="text-lg font-semibold text-slate-700">{SAMPLE_CERT.name}</div>
                      <div className="mt-2 text-sm text-slate-500">ID: <span className="font-mono text-slate-600">{SAMPLE_CERT.id}</span></div>
                      <div className="mt-3 flex items-center gap-3">
                        <TrustBadge status={currentStatus} />
                        <button onClick={cycleStatus} className="text-sm px-3 py-1 rounded-md border text-slate-600">Cycle</button>
                      </div>
                    </div>

                    <div className="w-28 h-28 rounded-lg bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center border border-slate-100">
                      {/* Decorative QR-like box */}
                      <div className="w-16 h-16 bg-white rounded shadow-inner grid grid-cols-3 grid-rows-3 gap-1 p-1">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className={`w-full h-full ${i % 2 ? "bg-slate-100" : "bg-slate-300"} rounded-sm`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button onClick={() => startVerify(SAMPLE_CERT.id)} className="flex-1 py-2 rounded-md bg-emerald-500 text-white font-semibold">Open Details</button>
                    <button onClick={() => alert("Pretend to download certificate PNG")} className="px-3 py-2 rounded-md border">Download</button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400">
                Tip: click <strong>Cycle</strong> to preview different trust statuses (Verified, On-chain, Pending, Revoked).
              </div>
            </div>

            {/* Extra small callouts */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/95 rounded-xl shadow hover:scale-102 transition-transform">
                <div className="text-sm font-semibold text-slate-700">Open APIs</div>
                <div className="text-xs text-slate-500">Integrate verification into your systems</div>
              </div>
              <div className="p-4 bg-white/95 rounded-xl shadow">
                <div className="text-sm font-semibold text-slate-700">Privacy-first</div>
                <div className="text-xs text-slate-500">Minimal data sharing & cryptographic proofs</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section className="relative z-10 bg-white/5 py-16">
        <div className="max-w-6xl mx-auto px-6 reveal" ref={revealRef}>
          <h2 className="text-3xl font-bold text-white mb-6">Why CredsOne?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Fast verification"
              body="Lookup and verify credentials in < 2s with caching & tamper-proof checks."
              icon="⚡"
            />
            <FeatureCard
              title="On-chain proofs"
              body="Anchor attestations on-chain for immutable evidence."
              icon="⛓️"
            />
            <FeatureCard
              title="Role-based flows"
              body="Custom dashboards & issuance flows for institutions and employers."
              icon="🧭"
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-extrabold text-white">Ready to get started?</h3>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">Create an account, issue a demo credential, or run verification tests right away.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg">Get Started</button>
            <button className="px-5 py-3 rounded-full border border-white/10 text-white/90">Explore Docs</button>
          </div>
        </div>
      </footer>

      {/* Verification Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => {
                setModalOpen(false);
                setVerifyResult(null);
                setVerifying(false);
              }}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="flex gap-6 items-start">
              <div className="w-36 h-36 rounded-lg bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center border">
                <div className="w-24 h-24 bg-white rounded shadow-inner grid grid-cols-3 grid-rows-3 gap-1 p-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`w-full h-full ${i % 2 ? "bg-slate-100" : "bg-slate-300"} rounded-sm`} />
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Verification</div>
                    <div className="text-lg font-bold text-slate-800">{verifyResult?.name || SAMPLE_CERT.name}</div>
                    <div className="text-xs text-slate-400">ID: <span className="font-mono">{verifyResult?.id || SAMPLE_CERT.id}</span></div>
                  </div>
                  <div>
                    {verifying ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600">Checking…</div>
                    ) : verifyResult ? (
                      <TrustBadge status={verifyResult.status} />
                    ) : (
                      <TrustBadge status={currentStatus} />
                    )}
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  {verifying && <div>Contacting verification nodes and secure caches…</div>}
                  {!verifying && verifyResult && (
                    <div className="space-y-2">
                      <div><strong>Issuer:</strong> {verifyResult.issuer}</div>
                      <div><strong>Issued:</strong> {fmtDate(verifyResult.issuedOn)}</div>
                      <div><strong>Valid till:</strong> {fmtDate(verifyResult.validity)}</div>
                      <div className="mt-2 text-sm text-slate-500">{STATUS_META[verifyResult.status]?.description}</div>
                    </div>
                  )}
                  {!verifying && !verifyResult && (
                    <div>Provide an ID above or try the demo credential to see how verification reports look.</div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (!verifying) startVerify(query || SAMPLE_CERT.id);
                    }}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold"
                  >
                    {verifying ? "Verifying…" : "Re-run verification"}
                  </button>
                  <button onClick={() => alert("Open audit trail (fake)")} className="px-4 py-2 rounded-md border">View Audit</button>
                  <button onClick={() => alert("Copy link (fake)")} className="px-4 py-2 rounded-md border">Share</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small presentational FeatureCard (internal) ---------- */
function FeatureCard({ title, body, icon }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 tilt reveal">
      <div className="text-3xl">{icon}</div>
      <h4 className="mt-3 text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm text-white/80">{body}</p>
      <div className="mt-4">
        <button className="px-3 py-2 rounded-full bg-white/10 text-white text-sm">Learn more</button>
      </div>
    </div>
  );
}
