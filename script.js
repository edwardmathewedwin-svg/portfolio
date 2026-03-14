/* ============================================================
   E. EDWARD ARUL MATHEW — PORTFOLIO SCRIPT
   ============================================================ */

// ── CUSTOM CURSOR ──────────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  if (dot && ring) {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ── BACKGROUND CANVAS ─────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [], lines = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.a  = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,255' : '0,119,255';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Floating geometric shapes
class FloatShape {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.size = Math.random() * 60 + 20;
    this.vy   = (Math.random() * 0.2 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
    this.vx   = (Math.random() - 0.5) * 0.1;
    this.a    = Math.random() * 0.06 + 0.01;
    this.rot  = Math.random() * Math.PI * 2;
    this.drot = (Math.random() - 0.5) * 0.005;
    this.type = Math.floor(Math.random() * 3);
    this.color= Math.random() > 0.5 ? '0,245,255' : '123,47,255';
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.rot += this.drot;
    if (this.y < -100 || this.y > H + 100) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.strokeStyle = `rgba(${this.color},${this.a})`;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    if (this.type === 0) {
      ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
    } else if (this.type === 1) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        i === 0 ? ctx.moveTo(Math.cos(a)*this.size/2, Math.sin(a)*this.size/2)
                : ctx.lineTo(Math.cos(a)*this.size/2, Math.sin(a)*this.size/2);
      }
      ctx.closePath();
    } else {
      ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();
  }
}

const shapes = [];
for (let i = 0; i < 18; i++) shapes.push(new FloatShape());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${0.04 * (1 - d/100)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

function renderBG() {
  ctx.clearRect(0, 0, W, H);
  shapes.forEach(s => { s.update(); s.draw(); });
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(renderBG);
}
renderBG();

// ── NAVBAR SCROLL ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── MOBILE MENU ───────────────────────────────────────────
const navToggle  = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
navToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(l =>
  l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── SKILL BAR ANIMATION ───────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-grid').forEach(g => skillObs.observe(g));

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCount(el, target, dur = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el =>
        animateCount(el, parseInt(el.dataset.target))
      );
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.hero-stats').forEach(g => counterObs.observe(g));

// ── AI CHATBOT ────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the AI assistant for E. Edward Arul Mathew — a first-year Computer Science student at Sri Venkateswaraa College of Technology (SVCT). You answer questions about Edward in a friendly, engaging way. 

Here are the key facts about Edward:

NAME: E. Edward Arul Mathew
ROLE: AI & Prompt Engineering Enthusiast
COLLEGE: Sri Venkateswaraa College of Technology (SVCT)
YEAR: 1st Year (2024 intake, graduating 2028)

SKILLS:
- C Programming (75%)
- Python (85%) — used for AI/ML and scripting
- Java (Basic, 55%)
- Frontend Development: HTML, CSS, JavaScript (80%)
- Prompt Engineering (90%) — his CORE skill and passion
- Communication Skills (88%) — multilingual, presentations

PROJECT — NCERT AI Chatbot (Tanglish & Hinglish Learning Assistant):
- An AI-powered educational chatbot for Indian students
- Supports questions in Tanglish (Tamil + English) and Hinglish (Hindi + English)
- Helps students understand NCERT curriculum topics in casual, mixed-language format
- Built with HTML, CSS, JavaScript, and creative prompt engineering
- GitHub: https://github.com/edwardmathewedwin-svg/QuantumPixels/blob/main/index.html
- Key achievement: makes AI-powered education accessible to students who communicate in code-switched languages

ACHIEVEMENTS:
1. Built and deployed the NCERT AI Chatbot independently as a first-year student
2. Mastered Prompt Engineering — chain-of-thought, few-shot, role-based, constraint-based prompting
3. Solved a real multilingual education challenge in India using AI

PROMPT ENGINEERING SKILLS:
Edward uses advanced prompting techniques including:
- Role-based prompting (giving AI a specific persona/character)
- Chain-of-thought (step-by-step reasoning prompts)
- Few-shot learning (providing examples in the prompt)
- Constraint-based prompting (setting guardrails for AI behavior)

PERSONALITY: Curious, self-driven, passionate about democratizing education through AI. Believes technology should break barriers, not create them. Interested in NLP, multilingual AI, and educational technology.

When answering questions:
- Be enthusiastic and positive about Edward's achievements
- Emphasize that his accomplishments are impressive for a first-year student
- If asked about contact/hire, direct them to GitHub
- Keep responses concise but informative (2-4 sentences typically)
- Use a friendly, conversational tone
- You can use occasional emojis 🤖✨`;

const chatMessages    = document.getElementById('chat-messages');
const chatInput       = document.getElementById('chat-input');
const chatSend        = document.getElementById('chat-send');
const chatSuggestions = document.getElementById('chat-suggestions');
let conversationHistory = [];

function addMessage(role, text) {
  const msg  = document.createElement('div');
  msg.className = 'msg ' + (role === 'assistant' ? 'bot' : 'user');
  const av = document.createElement('div');
  av.className = 'msg-avatar';
  av.textContent = role === 'assistant' ? 'AI' : 'YOU';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  msg.append(av, bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

function showTyping() {
  const msg  = document.createElement('div');
  msg.className = 'msg bot'; msg.id = 'typing-msg';
  const av = document.createElement('div');
  av.className = 'msg-avatar'; av.textContent = 'AI';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';
  bubble.appendChild(dots); msg.append(av, bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-msg');
  if (t) t.remove();
}

async function sendMessage(userText) {
  if (!userText.trim()) return;
  chatInput.value = '';
  chatSuggestions.style.display = 'none';
  addMessage('user', userText);
  conversationHistory.push({ role: 'user', content: userText });
  showTyping();
  chatSend.disabled = true;

  const API_KEY = 'YOUR_API_KEY';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory
        ]
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      removeTyping();
      addMessage('assistant', `Error ${res.status}: ${errData?.error?.message || 'Something went wrong. Check your Groq API key!'}`);
      chatSend.disabled = false;
      return;
    }

    const data = await res.json();
    removeTyping();
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble connecting right now. Please try again!";
    conversationHistory.push({ role: 'assistant', content: reply });
    addMessage('assistant', reply);
  } catch (err) {
    removeTyping();
    addMessage('assistant', `Connection error: ${err.message}`);
  }
  chatSend.disabled = false;
  chatInput.focus();
}

chatSend.addEventListener('click', () => sendMessage(chatInput.value));
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(chatInput.value); });
document.querySelectorAll('.suggestion').forEach(btn =>
  btn.addEventListener('click', () => sendMessage(btn.dataset.q))
);

// ── FALLBACK REVEAL (for local file:// usage) ────────────
setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}, 500);

// ── ACTIVE NAV LINK ───────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// ── HERO STAGGERED REVEAL ─────────────────────────────────
document.querySelectorAll('.hero-left .reveal').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.12) + 's';
  setTimeout(() => el.classList.add('visible'), 300 + i * 120);
});
document.querySelectorAll('.hero-right .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 600 + i * 120);
});
