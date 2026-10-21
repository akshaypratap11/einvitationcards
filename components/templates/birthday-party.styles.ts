export const BIRTHDAY_PARTY_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Outfit:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

/* Birthday Template Scoped Styling */
.bday-card {
  --font-main: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-title: 'Fredoka', 'Outfit', sans-serif;
  --font-heading: 'Fredoka', 'Outfit', sans-serif;
  --radius-card: 24px;
  --radius-badge: 9999px;
  box-sizing: border-box;
  font-family: var(--font-main);
  line-height: 1.5;
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  color: #ffffff;
  padding-bottom: 80px;
}

.bday-card * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 1. Theme: Kids (Bright, Cartoonish, Bubbly) */
.bday-card.theme-kids {
  background: radial-gradient(circle at 10% 20%, #4c1d95 0%, #1e1b4b 45%, #0f172a 100%);
  --theme-primary: #f59e0b;
  --theme-secondary: #06b6d4;
  --theme-tertiary: #ec4899;
  --theme-accent: #10b981;
  --theme-surface: rgba(255, 255, 255, 0.08);
  --theme-surface-border: rgba(255, 255, 255, 0.18);
  --theme-glow: 0 0 35px rgba(245, 158, 11, 0.45);
  --font-title: 'Fredoka', cursive, sans-serif;
  --font-heading: 'Fredoka', cursive, sans-serif;
}

/* 2. Theme: Adult (Elegant Dark + Gold Champagne) */
.bday-card.theme-adult {
  background: radial-gradient(circle at 50% 10%, #1f1912 0%, #0c0a09 60%, #000000 100%);
  --theme-primary: #d4af37;
  --theme-secondary: #fef08a;
  --theme-tertiary: #fb7185;
  --theme-accent: #e2e8f0;
  --theme-surface: rgba(28, 25, 23, 0.75);
  --theme-surface-border: rgba(212, 175, 55, 0.35);
  --theme-glow: 0 0 35px rgba(212, 175, 55, 0.35);
  --font-title: 'Playfair Display', Georgia, serif;
  --font-heading: 'Outfit', sans-serif;
}

/* 3. Theme: First (Soft Dreamy Pastel) */
.bday-card.theme-first {
  background: radial-gradient(circle at 30% 15%, #2e1065 0%, #1e1b4b 45%, #090d16 100%);
  --theme-primary: #f472b6;
  --theme-secondary: #38bdf8;
  --theme-tertiary: #facc15;
  --theme-accent: #a78bfa;
  --theme-surface: rgba(255, 255, 255, 0.09);
  --theme-surface-border: rgba(244, 114, 182, 0.28);
  --theme-glow: 0 0 35px rgba(244, 114, 182, 0.4);
  --font-title: 'Fredoka', cursive, sans-serif;
  --font-heading: 'Fredoka', cursive, sans-serif;
}

/* Background floating balloons and sparkles */
.bday-bg-decor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.floating-balloon {
  position: absolute;
  width: 44px;
  height: 56px;
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  opacity: 0.22;
  filter: blur(1px);
  animation: floatUp infinite ease-in-out;
}

.floating-balloon::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.4);
}

@keyframes floatUp {
  0% {
    transform: translateY(105vh) rotate(0deg);
  }
  50% {
    transform: translateY(50vh) rotate(8deg);
  }
  100% {
    transform: translateY(-20vh) rotate(-8deg);
  }
}

/* INTRO SCREEN - GIFT BOX POP */
.bday-intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s ease;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.bday-intro-overlay.theme-kids {
  background: radial-gradient(circle at center, #312e81 0%, #1e1b4b 70%, #0f172a 100%);
}
.bday-intro-overlay.theme-adult {
  background: radial-gradient(circle at center, #1c1917 0%, #0c0a09 70%, #000000 100%);
}
.bday-intro-overlay.theme-first {
  background: radial-gradient(circle at center, #3b0764 0%, #1e1b4b 70%, #090d16 100%);
}

.bday-intro-overlay.fade-out {
  opacity: 0;
  pointer-events: none;
  transform: scale(1.08);
}

.gift-box-wrap {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 28px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gift-box-wrap:hover {
  transform: scale(1.06);
}

.gift-box-body {
  position: absolute;
  bottom: 0;
  width: 130px;
  height: 90px;
  left: 5px;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bday-card.theme-kids .gift-box-body {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
}
.bday-card.theme-adult .gift-box-body {
  background: linear-gradient(135deg, #d4af37 0%, #996515 100%);
}
.bday-card.theme-first .gift-box-body {
  background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
}

/* Ribbons */
.gift-ribbon-v {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  background: linear-gradient(180deg, #fef08a 0%, #f59e0b 100%);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.gift-ribbon-h {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 22px;
  background: linear-gradient(90deg, #fef08a 0%, #f59e0b 100%);
}

.gift-box-lid {
  position: absolute;
  top: 30px;
  left: 0;
  width: 140px;
  height: 34px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4);
  transform-origin: left bottom;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.bday-card.theme-kids .gift-box-lid {
  background: linear-gradient(135deg, #fb7185 0%, #f43f5e 100%);
}
.bday-card.theme-adult .gift-box-lid {
  background: linear-gradient(135deg, #fef08a 0%, #d4af37 100%);
}
.bday-card.theme-first .gift-box-lid {
  background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
}

.gift-box-bow {
  position: absolute;
  top: -24px;
  font-size: 32px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

/* Popped gift animation */
.gift-box-wrap.popped .gift-box-lid {
  transform: translateY(-75px) rotate(-35deg) scale(0.9);
  opacity: 0.85;
}

.gift-box-wrap.popped {
  animation: giftBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes giftBounce {
  0% { transform: scale(1); }
  35% { transform: scale(1.22) rotate(-3deg); }
  70% { transform: scale(0.95) rotate(3deg); }
  100% { transform: scale(1.05); }
}

/* Confetti Canvas */
.confetti-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

/* MAIN LAYOUT WRAPPER */
.bday-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 16px;
  position: relative;
  z-index: 2;
}

/* CARD SECTIONS */
.bday-section {
  background: var(--theme-surface);
  border: 1px solid var(--theme-surface-border);
  border-radius: var(--radius-card);
  padding: 28px 22px;
  margin-bottom: 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.bday-section:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

/* HERO SECTION */
.hero-badge-capsule {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: var(--radius-badge);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--theme-surface-border);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--theme-secondary);
  margin-bottom: 16px;
}

.bday-hero-title {
  font-family: var(--font-title);
  font-size: clamp(2.2rem, 8vw, 3.8rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #ffffff 30%, var(--theme-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bday-card.theme-adult .bday-hero-title {
  background: linear-gradient(135deg, #ffffff 20%, #fef08a 60%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Big Age Badge */
.age-badge-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px 0 20px;
}

.age-badge-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-tertiary) 100%);
  box-shadow: var(--theme-glow);
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.85);
  animation: pulseAge 3s infinite ease-in-out;
}

@keyframes pulseAge {
  0%, 100% {
    transform: scale(1);
    box-shadow: var(--theme-glow);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 50px rgba(245, 158, 11, 0.65);
  }
}

.age-badge-number {
  font-family: var(--font-title);
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.age-badge-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #ffffff;
  opacity: 0.95;
}

/* Photo Section */
.photo-frame-wrap {
  position: relative;
  width: 170px;
  height: 170px;
  margin: 0 auto 20px;
}

.photo-frame-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary), var(--theme-tertiary));
  animation: spinSlow 12s linear infinite;
  box-shadow: var(--theme-glow);
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.photo-frame-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #1e1b4b;
  border: 4px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, var(--theme-primary), var(--theme-surface));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.photo-placeholder-initial {
  font-family: var(--font-title);
  font-size: 54px;
  font-weight: 800;
  line-height: 1;
}

/* SECTION HEADINGS */
.section-header {
  text-align: center;
  margin-bottom: 22px;
}

.section-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--theme-primary);
  margin-bottom: 6px;
}

.section-title {
  font-family: var(--font-title);
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

/* COUNTDOWN TILES */
.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 14px;
}

.countdown-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--theme-surface-border);
  border-radius: 18px;
  padding: 14px 6px;
  text-align: center;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05);
}

.countdown-number {
  font-family: var(--font-title);
  font-size: clamp(1.5rem, 4.5vw, 2.2rem);
  font-weight: 800;
  color: var(--theme-secondary);
  line-height: 1;
  margin-bottom: 4px;
}

.countdown-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

/* EVENT CARDS */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event-card {
  display: flex;
  gap: 16px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--theme-surface-border);
  border-radius: 18px;
  padding: 16px;
  align-items: center;
}

.event-badge-time {
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-tertiary) 100%);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.event-info {
  flex: 1;
}

.event-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2px;
}

.event-tagline {
  font-size: 12px;
  color: var(--theme-secondary);
  margin-bottom: 4px;
}

.event-venue {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* GALLERY - POLAROID / CELEBRATION CARDS */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

@media (min-width: 540px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid var(--theme-surface-border);
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.45);
  border-color: var(--theme-secondary);
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-img {
  transform: scale(1.06);
}

/* VENUE & MAP */
.map-embed-wrapper {
  width: 100%;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--theme-surface-border);
  margin-bottom: 16px;
  background: #111;
}

.map-embed-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.action-buttons-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-tertiary) 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  padding: 13px 18px;
  border-radius: 14px;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 13px 18px;
  border-radius: 14px;
  text-decoration: none;
  border: 1px solid var(--theme-surface-border);
  transition: background 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
}

/* CONTACT & RSVP */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.contact-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--theme-surface-border);
  padding: 14px 10px;
  border-radius: 16px;
  text-decoration: none;
  color: #ffffff;
  transition: transform 0.2s ease, background 0.2s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
}

.contact-icon {
  font-size: 24px;
}

.contact-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-secondary);
}

/* FLOATING SHARE BUTTON */
.floating-share-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-tertiary) 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 18px;
  border-radius: 9999px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
}

.floating-share-btn:hover {
  transform: scale(1.05);
}

/* TOAST */
.bday-toast {
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: #10b981;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  animation: toastFade 2.4s ease forwards;
}

@keyframes toastFade {
  0% { opacity: 0; transform: translate(-50%, 15px); }
  15% { opacity: 1; transform: translate(-50%, 0); }
  80% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -15px); }
}

/* FOOTER BRANDING */
.bday-footer {
  text-align: center;
  padding: 24px 16px 40px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.bday-footer a {
  color: var(--theme-secondary);
  text-decoration: none;
  font-weight: 600;
}

/* ACCESSIBILITY: PREFERS REDUCED MOTION */
@media (prefers-reduced-motion: reduce) {
  .floating-balloon {
    animation: none !important;
    display: none;
  }
  .gift-box-wrap.popped .gift-box-lid {
    transform: none !important;
  }
  .gift-box-wrap.popped {
    animation: none !important;
  }
  .age-badge-circle {
    animation: none !important;
  }
  .photo-frame-ring {
    animation: none !important;
  }
  .gallery-item:hover {
    transform: none !important;
  }
  .gallery-item:hover .gallery-img {
    transform: none !important;
  }
  .floating-share-btn:hover {
    transform: none !important;
  }
}
`;
