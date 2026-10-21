export const GHAR_FUNCTION_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Rozha+One&display=swap');

/* Ghar Function Scoped Styling */
.ghar-card {
  --color-marigold: #f97316;
  --color-marigold-light: #fed7aa;
  --color-kumkum: #831843;
  --color-kumkum-deep: #450a0a;
  --color-haldi: #eab308;
  --color-haldi-glow: rgba(234, 179, 8, 0.45);
  --color-cream: #fefce8;
  --color-gold: #d4af37;
  --color-gold-light: #fef08a;
  --color-surface: rgba(69, 10, 10, 0.72);
  --color-surface-border: rgba(212, 175, 55, 0.35);
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-devotional: 'Rozha One', 'Cinzel', serif;
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-sub: 'Cormorant Garamond', Georgia, serif;

  box-sizing: border-box;
  font-family: var(--font-body);
  line-height: 1.6;
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  color: var(--color-cream);
  background: radial-gradient(circle at 50% 15%, #581c87 0%, #450a0a 40%, #2e0814 75%, #180208 100%);
  padding-bottom: 90px;
}

.ghar-card * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Background Mandala & Traditional Rangoli Patterns */
.ghar-bg-decor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  opacity: 0.12;
}

.mandala-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed #d4af37;
  transform: translate(-50%, -50%);
  animation: rotateMandala 120s linear infinite;
}

@keyframes rotateMandala {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* INTRO SCREEN - KALASH & DIYA LIGHTING */
.ghar-intro-overlay {
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
  background: radial-gradient(circle at center, #581c87 0%, #450a0a 60%, #1c0309 100%);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s ease;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.ghar-intro-overlay.fade-out {
  opacity: 0;
  pointer-events: none;
  transform: scale(1.05);
}

/* Kalash & Diya Container */
.kalash-diya-wrap {
  position: relative;
  width: 160px;
  height: 170px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.kalash-svg-container {
  width: 110px;
  height: 110px;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6));
  transition: transform 0.3s ease;
}

.kalash-diya-wrap:hover .kalash-svg-container {
  transform: scale(1.05);
}

/* Diya Lamp at bottom of kalash */
.diya-base {
  position: absolute;
  bottom: 0;
  width: 60px;
  height: 22px;
  background: linear-gradient(180deg, #ca8a04 0%, #854d0e 100%);
  border-radius: 0 0 30px 30px;
  border-top: 2px solid #fef08a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
}

.diya-wick {
  position: absolute;
  top: -8px;
  width: 3px;
  height: 8px;
  background: #451a03;
  border-radius: 2px;
}

.diya-flame {
  position: absolute;
  top: -26px;
  width: 14px;
  height: 22px;
  background: radial-gradient(ellipse at bottom, #ffffff 15%, #fef08a 45%, #f97316 80%, rgba(239, 68, 68, 0) 100%);
  border-radius: 50% 50% 35% 35% / 60% 60% 40% 40%;
  opacity: 0;
  transform: scale(0.3);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 20px #f59e0b, 0 0 40px #f97316;
}

.kalash-diya-wrap.lit .diya-flame {
  opacity: 1;
  transform: scale(1);
  animation: diyaFlicker 1.5s infinite alternate ease-in-out;
}

@keyframes diyaFlicker {
  0% { transform: scale(1) rotate(-1deg); filter: brightness(1); }
  50% { transform: scale(1.06, 0.96) rotate(2deg); filter: brightness(1.15); }
  100% { transform: scale(0.96, 1.04) rotate(-2deg); filter: brightness(1.05); }
}

.kalash-halo {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(234, 179, 8, 0.25) 0%, rgba(234, 179, 8, 0) 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.kalash-diya-wrap.lit .kalash-halo {
  opacity: 1;
}

/* MAIN LAYOUT WRAPPER */
.ghar-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 16px;
  position: relative;
  z-index: 2;
}

/* SECTION CARD */
.ghar-section {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: 24px;
  padding: 28px 22px;
  margin-bottom: 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(254, 240, 138, 0.15);
  position: relative;
  overflow: hidden;
}

.ghar-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d4af37, #f97316, #d4af37, transparent);
}

/* TOP SHLOKA BANNER */
.top-shloka-banner {
  text-align: center;
  padding: 12px 0 20px;
}

.shloka-text {
  font-family: var(--font-devotional);
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  letter-spacing: 2px;
  color: var(--color-gold-light);
  text-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

/* HERO SECTION */
.hero-tagline {
  font-family: var(--font-sub);
  font-size: 17px;
  font-style: italic;
  color: var(--color-marigold-light);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.hero-function-title {
  font-family: var(--font-devotional);
  font-size: clamp(2.4rem, 8vw, 3.6rem);
  font-weight: 700;
  line-height: 1.1;
  color: #ffffff;
  background: linear-gradient(135deg, #ffffff 20%, #fef08a 60%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.hero-family-name {
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 4.5vw, 1.8rem);
  font-weight: 600;
  color: var(--color-gold-light);
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.ornamental-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px auto;
  width: 80%;
  color: var(--color-gold);
  opacity: 0.8;
}

.ornamental-divider::before,
.ornamental-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

/* HERO PHOTO / MANDIR PHOTO */
.ghar-photo-frame {
  position: relative;
  width: 100%;
  max-width: 480px;
  margin: 20px auto 0;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid var(--color-surface-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  background: #20040c;
}

.ghar-photo-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}

/* SHUBH MUHURAT / DATE & TIME BOX */
.muhurat-badge-box {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%);
  border: 1px solid rgba(234, 179, 8, 0.45);
  border-radius: 18px;
  padding: 16px 20px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.muhurat-label {
  font-family: var(--font-devotional);
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fef08a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 6px;
}

.muhurat-time-text {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 4vw, 1.4rem);
  font-weight: 700;
  color: #ffffff;
}

/* DATE & VENUE CARDS */
.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 500px) {
  .details-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-card-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-surface-border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.detail-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316 0%, #b91c1c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.detail-card-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-gold-light);
  display: block;
}

.detail-card-val {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-top: 2px;
}

/* COUNTDOWN TILES */
.ghar-countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 14px;
}

.ghar-countdown-box {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--color-surface-border);
  border-radius: 16px;
  padding: 12px 6px;
  text-align: center;
}

.ghar-countdown-val {
  font-family: var(--font-serif);
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--color-gold-light);
  line-height: 1;
  margin-bottom: 4px;
}

.ghar-countdown-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(254, 252, 232, 0.7);
}

/* SACRED RITUALS / EVENTS LIST */
.rituals-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ritual-item-card {
  display: flex;
  gap: 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-surface-border);
  border-radius: 18px;
  padding: 16px;
  align-items: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.ritual-item-card:hover {
  transform: translateY(-2px);
  border-color: rgba(234, 179, 8, 0.6);
}

.ritual-time-badge {
  background: linear-gradient(135deg, #f97316 0%, #b91c1c 100%);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.ritual-info {
  flex: 1;
}

.ritual-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2px;
}

.ritual-tagline {
  font-size: 12px;
  color: var(--color-marigold-light);
  margin-bottom: 3px;
}

.ritual-venue {
  font-size: 12px;
  color: rgba(254, 252, 232, 0.7);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* GALLERY */
.ghar-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 520px) {
  .ghar-gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.ghar-gallery-item {
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid var(--color-surface-border);
  background: #20040c;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.ghar-gallery-item:hover {
  transform: scale(1.03);
  border-color: var(--color-gold);
}

.ghar-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ACTIONS BUTTONS */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.btn-ghar-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #f97316 0%, #b91c1c 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  padding: 13px 18px;
  border-radius: 14px;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-ghar-primary:hover {
  transform: translateY(-2px);
}

.btn-ghar-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 13px 18px;
  border-radius: 14px;
  text-decoration: none;
  border: 1px solid var(--color-surface-border);
  transition: background 0.2s ease;
  cursor: pointer;
}

.btn-ghar-secondary:hover {
  background: rgba(255, 255, 255, 0.16);
}

/* CONTACTS */
.contact-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.contact-card-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-surface-border);
  padding: 14px 10px;
  border-radius: 16px;
  text-decoration: none;
  color: #ffffff;
  transition: transform 0.2s ease;
}

.contact-card-btn:hover {
  transform: translateY(-2px);
}

/* HUM AAPKA INTEZAAR KARENGE FOOTER */
.ghar-devotional-footer {
  text-align: center;
  padding: 32px 16px 20px;
}

.intezaar-title {
  font-family: var(--font-devotional);
  font-size: clamp(1.2rem, 4.5vw, 1.6rem);
  font-weight: 700;
  color: var(--color-gold-light);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.intezaar-desc {
  font-family: var(--font-sub);
  font-size: 16px;
  font-style: italic;
  color: var(--color-marigold-light);
  max-width: 480px;
  margin: 0 auto 16px;
  line-height: 1.5;
}

.darshan-host {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #ffffff;
}

/* TOAST */
.ghar-toast {
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: #b91c1c;
  color: #ffffff;
  padding: 10px 22px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  border: 1px solid #fef08a;
  animation: gharToast 2.4s ease forwards;
}

@keyframes gharToast {
  0% { opacity: 0; transform: translate(-50%, 15px); }
  15% { opacity: 1; transform: translate(-50%, 0); }
  80% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -15px); }
}

/* FLOATING SHARE BUTTON */
.ghar-share-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f97316 0%, #b91c1c 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 18px;
  border-radius: 9999px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  border: 1.5px solid #fef08a;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ghar-share-btn:hover {
  transform: scale(1.05);
}

/* ACCESSIBILITY */
@media (prefers-reduced-motion: reduce) {
  .mandala-circle {
    animation: none !important;
  }
  .diya-flame {
    animation: none !important;
  }
  .ghar-share-btn:hover {
    transform: none !important;
  }
}
`;
