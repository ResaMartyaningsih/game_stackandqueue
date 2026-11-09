const fs = require('fs');
const path = require('path');

const responsiveCSS = `/* ==========================================================================
   responsive.css - Comprehensive Multi-Device Responsive Design System
   Google Antigravity / LarasLogika - Computational Thinking Media
   Supports: Mobile (320px-480px), Phablets (481px-767px), Tablets (768px-1024px),
   Laptops (1025px-1440px), and Large Desktops / 4K (1441px+)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. GLOBAL FLUID RESETS & SAFE GUARDS (Prevents horizontal overflow)
   -------------------------------------------------------------------------- */
html {
    box-sizing: border-box;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
}

*, *::before, *::after {
    box-sizing: inherit;
}

body {
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100vw !important;
    position: relative;
    -webkit-font-smoothing: antialiased;
}

img, video, iframe, canvas, svg {
    max-width: 100% !important;
    height: auto;
}

/* Universal Table Responsive Scroller */
.table-responsive-wrapper,
.prof-table-wrapper,
.guidelines-table-wrapper {
    width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    margin-bottom: 1rem !important;
}

/* Minimum Touch Target for Mobile Ergonomics */
button, 
.btn, 
.nav-link, 
.bottom-nav-item, 
.learn-tab-btn, 
.task-level-chip, 
.task-option-btn,
.gp-hots-option-btn,
.gp-tf-btn {
    touch-action: manipulation;
}

/* --------------------------------------------------------------------------
   2. HEADER & NAVIGATION BAR RESPONSIVENESS
   -------------------------------------------------------------------------- */
.app-header {
    width: 100% !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 900 !important;
}

.header-container {
    width: 100% !important;
    max-width: 1240px !important;
    margin: 0 auto !important;
    padding: 0.65rem 1.25rem !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 0.75rem !important;
}

.header-brand {
    display: flex !important;
    align-items: center !important;
    gap: 0.65rem !important;
    flex-shrink: 0 !important;
}

.brand-logo-icon {
    width: 40px !important;
    height: 40px !important;
    font-size: 1.4rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
}

.brand-text h1 {
    font-size: clamp(1.15rem, 3.2vw, 1.45rem) !important;
    line-height: 1.2 !important;
    margin: 0 !important;
    white-space: nowrap !important;
}

.header-user-badge {
    max-width: 220px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-size: 0.85rem !important;
    padding: 0.45rem 0.85rem !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 0.35rem !important;
    flex-shrink: 0 !important;
}

/* --------------------------------------------------------------------------
   3. MOBILE BOTTOM NAVIGATION (Smooth Scrollable Touch Bar)
   -------------------------------------------------------------------------- */
.mobile-bottom-nav {
    display: none;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    z-index: 999 !important;
    background: #FAF8F5 !important;
    border-top: 1.5px solid #D8D4BC !important;
    box-shadow: 0 -4px 18px rgba(113, 66, 54, 0.12) !important;
    padding: 0.35rem 0.5rem calc(0.35rem + env(safe-area-inset-bottom, 0px)) 0.5rem !important;
    overflow-x: auto !important;
    flex-wrap: nowrap !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
    justify-content: flex-start !important;
    gap: 0.3rem !important;
}

.mobile-bottom-nav::-webkit-scrollbar {
    display: none !important;
}

.bottom-nav-item {
    flex: 0 0 auto !important;
    min-width: 62px !important;
    padding: 0.35rem 0.5rem !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 2px !important;
    border-radius: 8px !important;
    color: #714236 !important;
    font-family: 'Space Mono', monospace !important;
    font-size: 0.72rem !important;
    font-weight: 700 !important;
    border: 1px solid transparent !important;
    background: transparent !important;
    text-decoration: none !important;
    transition: all 0.15s ease !important;
}

.bottom-nav-item .nav-icon {
    font-size: 1.25rem !important;
    line-height: 1 !important;
}

.bottom-nav-item.active {
    background: #FAF6ED !important;
    color: #891A10 !important;
    border-color: #E76814 !important;
    box-shadow: 0 2px 6px rgba(231, 104, 20, 0.15) !important;
}

/* --------------------------------------------------------------------------
   4. MAIN WRAPPER & CONTAINER FLUIDITY
   -------------------------------------------------------------------------- */
.main-wrapper {
    width: 100% !important;
    max-width: 1240px !important;
    margin: 0 auto !important;
    padding: 1.5rem 1.25rem 5rem 1.25rem !important;
    box-sizing: border-box !important;
}

.academic-page-container,
.learning-container,
.group-project-container,
.result-container {
    width: 100% !important;
    max-width: 1180px !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
}

.academic-card {
    border-radius: 16px !important;
    padding: clamp(1.2rem, 3vw, 2.25rem) !important;
    margin-bottom: 1.5rem !important;
    box-sizing: border-box !important;
    width: 100% !important;
}

/* --------------------------------------------------------------------------
   5. SCREEN 1: BERANDA / HOME FLUIDITY
   -------------------------------------------------------------------------- */
.studio-hero-section {
    padding: clamp(1.75rem, 4vw, 4rem) clamp(1rem, 3vw, 2.5rem) !important;
    border-radius: 18px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.studio-hero-grid,
.hero-split-grid {
    display: grid !important;
    grid-template-columns: 1.15fr 0.85fr !important;
    gap: clamp(1.5rem, 3vw, 3rem) !important;
    align-items: center !important;
    width: 100% !important;
}

.hero-editorial-title {
    font-size: clamp(1.85rem, 5.5vw, 3.8rem) !important;
    line-height: 1.12 !important;
    word-break: break-word !important;
}

.hero-lead-text {
    font-size: clamp(0.92rem, 2vw, 1.15rem) !important;
    line-height: 1.65 !important;
}

.hero-actions-group {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 0.75rem !important;
}

.problem-split-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 1.75rem !important;
    width: 100% !important;
}

.studio-duel-cards-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 1.75rem !important;
    width: 100% !important;
}

.ct-pillars-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)) !important;
    gap: 1rem !important;
    width: 100% !important;
}

/* --------------------------------------------------------------------------
   6. SCREENS 2-4: MATERI PEMAHAMAN AWAL, STACK & QUEUE
   -------------------------------------------------------------------------- */
.learn-tabs-bar {
    display: flex !important;
    overflow-x: auto !important;
    flex-wrap: nowrap !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
    gap: 0.5rem !important;
    padding-bottom: 0.65rem !important;
    margin: 1rem 0 1.5rem 0 !important;
    border-bottom: 2px solid #D8D4BC !important;
    width: 100% !important;
}

.learn-tabs-bar::-webkit-scrollbar {
    display: none !important;
}

.learn-tab-btn {
    flex: 0 0 auto !important;
    white-space: nowrap !important;
    padding: 0.6rem 1.15rem !important;
    font-size: 0.88rem !important;
}

.concept-media-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 1.5rem !important;
    width: 100% !important;
}

.video-container,
.video-wrapper {
    position: relative !important;
    width: 100% !important;
    aspect-ratio: 16 / 9 !important;
    overflow: hidden !important;
    border-radius: 12px !important;
}

.video-container video,
.video-container iframe,
.video-wrapper video,
.video-wrapper iframe {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
}

.operation-cards-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)) !important;
    gap: 1rem !important;
    width: 100% !important;
}

.simulator-stage-grid {
    display: grid !important;
    grid-template-columns: 1fr 340px !important;
    gap: 1.5rem !important;
    align-items: start !important;
    width: 100% !important;
}

.sim-stack-chamber {
    max-width: 240px !important;
    width: 100% !important;
    min-height: 280px !important;
    margin: 0 auto !important;
}

.sim-queue-lane {
    width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
}

/* --------------------------------------------------------------------------
   7. SCREEN 5: TUGAS INDIVIDU 4 LEVEL
   -------------------------------------------------------------------------- */
.task-level-selector,
.academic-stepper {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 0.65rem !important;
    width: 100% !important;
    margin-bottom: 1.25rem !important;
}

.task-level-chip {
    padding: 0.65rem 0.85rem !important;
    font-size: 0.84rem !important;
    text-align: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

#individual-attempt-tracker,
#group-attempt-tracker {
    width: 100% !important;
    box-sizing: border-box !important;
}

.task-option-btn,
.gp-hots-option-btn {
    width: 100% !important;
    padding: 0.85rem 1.15rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 0.75rem !important;
    font-size: 0.92rem !important;
    text-align: left !important;
    word-break: break-word !important;
    box-sizing: border-box !important;
}

/* --------------------------------------------------------------------------
   8. SCREEN 6: LKPD TUGAS KELOMPOK
   -------------------------------------------------------------------------- */
.gp-workflow-steps {
    display: flex !important;
    overflow-x: auto !important;
    flex-wrap: nowrap !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
    gap: 0.5rem !important;
    padding: 0.65rem 0.85rem !important;
    margin-bottom: 1.25rem !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.gp-workflow-steps::-webkit-scrollbar {
    display: none !important;
}

.gp-step-item {
    flex: 0 0 auto !important;
    white-space: nowrap !important;
    font-size: 0.8rem !important;
    padding: 0.35rem 0.75rem !important;
}

.gp-member-row {
    width: 100% !important;
    box-sizing: border-box !important;
}

#gp-cases-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
    gap: 1.25rem !important;
    width: 100% !important;
}

.gp-textarea-modern {
    width: 100% !important;
    min-height: 110px !important;
    box-sizing: border-box !important;
    font-size: 0.92rem !important;
    line-height: 1.5 !important;
}

.gp-action-bar {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 0.75rem !important;
    width: 100% !important;
}

/* --------------------------------------------------------------------------
   9. SCREEN 11: PROFIL & RAPOR DIGITAL SISWA
   -------------------------------------------------------------------------- */
#prof-components-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important;
    gap: 1.25rem !important;
    width: 100% !important;
}

#prof-stages-table-container {
    width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
}

#prof-stages-table-container table {
    min-width: 580px !important;
}

/* --------------------------------------------------------------------------
   10. MODALS & DIALOGS RESPONSIVENESS
   -------------------------------------------------------------------------- */
.modal-overlay {
    display: none;
    position: fixed !important;
    inset: 0 !important;
    z-index: 1000 !important;
    background: rgba(43, 29, 25, 0.65) !important;
    backdrop-filter: blur(6px) !important;
    padding: 1rem !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
}

.modal-overlay.active {
    display: flex !important;
}

.modal-card {
    width: min(520px, 94vw) !important;
    max-height: calc(100vh - 2.5rem) !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding: clamp(1.2rem, 3vw, 1.85rem) !important;
    border-radius: 16px !important;
    box-sizing: border-box !important;
}

.modal-large {
    width: min(860px, 95vw) !important;
}

/* ==========================================================================
   BREAKPOINTS: ADAPTIVE ADJUSTMENTS PER SCREEN SIZE
   ========================================================================== */

/* --------------------------------------------------------------------------
   A. LAPTOP & TABLET LANDSCAPE (max-width: 1080px)
   -------------------------------------------------------------------------- */
@media (max-width: 1080px) {
    .desktop-nav .nav-link {
        padding: 0.5rem 0.7rem !important;
        font-size: 0.84rem !important;
    }
    .header-user-badge {
        max-width: 180px !important;
        font-size: 0.8rem !important;
    }
}

/* --------------------------------------------------------------------------
   B. TABLET PORTRAIT & MEDIUM DEVICES (max-width: 860px)
   -------------------------------------------------------------------------- */
@media (max-width: 860px) {
    /* Hide desktop nav, reveal mobile bottom nav */
    .desktop-nav {
        display: none !important;
    }
    .mobile-bottom-nav {
        display: flex !important;
    }

    /* Provide bottom padding so fixed mobile nav never covers page content */
    .main-wrapper {
        padding-bottom: 6.5rem !important;
        margin-bottom: 0 !important;
    }

    /* Stack 2-column home layouts */
    .studio-hero-grid,
    .hero-split-grid,
    .problem-split-grid,
    .studio-duel-cards-grid,
    .concept-media-grid,
    .simulator-stage-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
    }

    /* Stepper chips 2x2 grid */
    .task-level-selector,
    .academic-stepper {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

/* --------------------------------------------------------------------------
   C. MOBILE PHONES (max-width: 640px)
   -------------------------------------------------------------------------- */
@media (max-width: 640px) {
    .header-container {
        padding: 0.5rem 0.85rem !important;
    }

    .brand-logo-icon {
        width: 34px !important;
        height: 34px !important;
        font-size: 1.2rem !important;
    }

    .header-user-badge {
        max-width: 140px !important;
        font-size: 0.74rem !important;
        padding: 0.35rem 0.65rem !important;
    }

    .main-wrapper {
        padding: 0.85rem 0.65rem 6.5rem 0.65rem !important;
    }

    .academic-card {
        padding: 1.15rem 0.85rem !important;
        border-radius: 14px !important;
    }

    .academic-card-title {
        font-size: 1.25rem !important;
    }

    /* Hero Buttons Full-Width Stack */
    .hero-actions-group {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
    }

    .hero-actions-group > * {
        width: 100% !important;
        justify-content: center !important;
        text-align: center !important;
    }

    /* Attempt Trackers Stack */
    #individual-attempt-tracker,
    #group-attempt-tracker {
        flex-direction: column !important;
        align-items: stretch !important;
        text-align: center !important;
        gap: 0.75rem !important;
    }

    #individual-attempt-tracker button,
    #group-attempt-tracker button {
        width: 100% !important;
        justify-content: center !important;
    }

    /* Profile Screen Hero Card Stacking */
    #screen-profile .academic-card:first-child > div {
        flex-direction: column !important;
        align-items: stretch !important;
        text-align: center !important;
        gap: 1.15rem !important;
    }

    #screen-profile .academic-card:first-child > div > div:first-child {
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
    }

    #screen-profile .academic-card:first-child > div > div:last-child {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        gap: 0.5rem !important;
    }

    #screen-profile .academic-card:first-child button {
        width: 100% !important;
        justify-content: center !important;
    }

    /* Profile Score Card Stack */
    #screen-profile .academic-card.highlight-indigo > div:last-child {
        grid-template-columns: 1fr !important;
    }

    #prof-components-grid {
        grid-template-columns: 1fr !important;
    }

    /* LKPD Member Rows Adaptive Mobile Layout */
    .gp-member-row {
        display: grid !important;
        grid-template-columns: 32px 1fr auto !important;
        gap: 0.5rem !important;
        padding: 0.75rem 0.65rem !important;
    }

    .gp-member-row .gp-member-index {
        grid-column: 1 !important;
        align-self: center !important;
    }

    .gp-member-row .gp-member-name-input {
        grid-column: 2 !important;
        width: 100% !important;
        min-width: 0 !important;
    }

    .gp-member-row button {
        grid-column: 3 !important;
    }

    .gp-member-row .gp-member-absen-input {
        grid-column: 1 / span 3 !important;
        width: 100% !important;
    }

    .gp-member-row .gp-member-role-select {
        grid-column: 1 / span 3 !important;
        width: 100% !important;
        min-width: 0 !important;
    }

    /* LKPD Action Buttons Stack */
    .gp-action-bar {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
    }

    .gp-action-bar > button {
        width: 100% !important;
        justify-content: center !important;
    }

    /* Toast Notification Mobile Safe Placement */
    #toast-notification-area {
        left: 0.75rem !important;
        right: 0.75rem !important;
        width: calc(100% - 1.5rem) !important;
        bottom: 5.5rem !important;
    }
}

/* --------------------------------------------------------------------------
   D. SMALL / COMPACT MOBILE PHONES (max-width: 380px)
   -------------------------------------------------------------------------- */
@media (max-width: 380px) {
    .header-user-badge {
        max-width: 110px !important;
        font-size: 0.7rem !important;
    }

    .task-level-selector,
    .academic-stepper {
        grid-template-columns: 1fr !important;
    }

    .hero-editorial-title {
        font-size: 1.7rem !important;
    }
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'css', 'responsive.css'), responsiveCSS, 'utf8');
console.log('✓ Successfully created css/responsive.css');

// Link responsive.css in index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

const oldLink = `    <link rel="stylesheet" href="css/academic-theme.css">`;
const newLink = `    <link rel="stylesheet" href="css/academic-theme.css">
    <link rel="stylesheet" href="css/responsive.css">`;

if (html.includes(oldLink) && !html.includes('css/responsive.css')) {
    html = html.replace(oldLink, newLink);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✓ Successfully linked css/responsive.css in index.html');
} else if (html.includes('css/responsive.css')) {
    console.log('i css/responsive.css already linked in index.html');
} else {
    console.warn('! oldLink not matched');
}
