import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Deterministic Pixel-Accurate Reader Jump (No IntersectionObserver race condition)
new_js_scroll = """
  let isNavigating = false;

  function openReaderAtWorld(id) {
    const overlay = document.getElementById('reader-overlay-view');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    isNavigating = true;
    jumpReaderToId(id, true);
    
    setTimeout(() => {
      jumpReaderToId(id, true);
      isNavigating = false;
      setupReaderScrollSpy();
    }, 60);
  }

  function closeReaderModal() {
    document.getElementById('reader-overlay-view').style.display = 'none';
    document.body.style.overflow = '';
    closeSideMarginalia();
  }

  function jumpReaderToId(id, instant = false) {
    currentReaderId = id;
    const overlay = document.getElementById('reader-overlay-view');
    const target = document.getElementById('monograph-block-' + id);
    if (target && overlay) {
      const targetTop = target.offsetTop - 48;
      if (instant) {
        overlay.scrollTop = targetTop;
      } else {
        overlay.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
      updateReaderTopLabel(id);
    }
  }

  function setupReaderScrollSpy() {
    const overlay = document.getElementById('reader-overlay-view');
    if (!overlay) return;

    overlay.onscroll = () => {
      if (isNavigating) return;
      const blocks = document.querySelectorAll('.monograph-world-block');
      const scrollPos = overlay.scrollTop + 120;
      
      for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (block.offsetTop <= scrollPos) {
          const id = parseInt(block.getAttribute('data-id'));
          if (id !== currentReaderId) {
            currentReaderId = id;
            updateReaderTopLabel(id);
          }
          break;
        }
      }
    };
  }
"""

# 2. Proportionally Scaled Mobile Hero Collage (Like Desktop, Compact & Shrunk)
hero_proportional_css = """
  /* =========================================================
     PROPORTIONALLY SCALED MOBILE HERO COLLAGE (LIKE ORIGINAL)
     ========================================================= */
  @media (max-width: 960px) {
    .marginalia { display: none; }
    
    header.site-header {
      padding: 10px 14px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid var(--hair); height: 50px;
    }
    .brand-block .name { font-size: .72rem; letter-spacing: .16em; }
    .brand-block .sub { display: none; }
    
    nav.main-nav-bar {
      display: flex; gap: 1rem; overflow-x: auto; white-space: nowrap;
      scrollbar-width: none; -webkit-overflow-scrolling: touch;
    }
    nav.main-nav-bar::-webkit-scrollbar { display: none; }
    nav.main-nav-bar a { font-size: .6rem; letter-spacing: .14em; }

    .search-button span { display: none; }
    .search-button .dot { display: none; }

    /* Compact Hero Layout: Scaled Proportionally */
    .hero {
      position: relative; padding: 1.6rem 1.2rem 1rem;
      min-height: 520px; overflow: hidden;
    }
    .hero-left {
      padding-left: 0; max-width: 280px; position: relative; z-index: 25;
    }
    h1.main-masthead {
      font-size: clamp(3.2rem, 15vw, 4.4rem); line-height: .92; letter-spacing: .02em;
    }
    .tick { margin: 1rem 0 .8rem; width: 28px; }
    .thesis { font-size: .82rem; line-height: 1.5; letter-spacing: .16em; }
    .lede { font-size: .98rem; line-height: 1.45; margin-top: 1rem; }
    .cta {
      margin-top: 1.2rem; padding: .65rem 1.2rem; font-size: .65rem; letter-spacing: .2em;
    }
    .route { display: none; }

    /* Proportionally Shrunk Scraps on Mobile to Match Original Desktop Aura */
    .piece { position: absolute; }
    
    .moai-strip {
      left: -2.8rem; top: 7rem; width: 110px; height: 210px; z-index: 4; opacity: .7; transform: rotate(-1deg);
    }
    .moai-strip .cap { display: none; }

    .bird {
      right: .4rem; left: auto; top: 1.6rem; width: 115px; z-index: 12; transform: rotate(2.5deg);
    }
    .bird .ph { height: 95px; }
    .bird .cap { font-size: .42rem; padding-top: .3rem; }

    .fieldnote {
      right: .8rem; left: auto; top: 11.5rem; width: 140px; z-index: 14; transform: rotate(-1.5deg);
      padding: .8rem .9rem;
    }
    .fieldnote .hand { font-size: .9rem; line-height: 1.35; }

    .valley {
      right: .4rem; left: auto; top: 20rem; width: 165px; z-index: 10; transform: rotate(1deg);
    }
    .valley .ph { height: 115px; }
    .valley .cap { font-size: .42rem; }

    .tracks {
      left: 1.2rem; top: 24rem; width: 140px; z-index: 12; transform: rotate(-1deg);
    }
    .tracks .inner { padding: .6rem .8rem; }
    .tracks .col span { font-size: .42rem; margin-bottom: .3rem; }
    .tracks svg { height: 32px; }

    .stamp {
      left: 9.5rem; top: 26.5rem; width: 68px; z-index: 16; transform: rotate(-8deg);
    }

    .plate, .map-strip, .map-lens, .map-left, .station, .lang-scrap, .mobile-scrap-row, .mobile-hero-curated-stage {
      display: none !important;
    }

    /* Worlds Grid on Mobile */
    .worlds { margin: 1.2rem 0 0; padding: 1.4rem 1rem 0; }
    .world-grid { grid-template-columns: 1fr; gap: 1.2rem; }
    .world .fig { height: 210px; }
    .world .fig .ph img { transform: scale(1.48); object-position: center 25%; }

    /* Reader Overhaul on Mobile */
    #reader-overlay-view {
      position: fixed; inset: 0; z-index: 200;
      background: var(--paper); overflow-y: auto;
      width: 100vw; max-width: 100vw;
    }
    .reader-header-bar {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 14px; background: rgba(235, 230, 218, 0.98);
      border-bottom: 1px solid var(--hair); height: 48px; width: 100%;
    }
    .reader-header-bar .cta {
      margin: 0; padding: 5px 10px; font-size: .62rem; min-width: 0;
    }
    #reader-top-plate-label {
      font-size: .7rem; font-weight: 700; color: var(--red);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 62vw;
    }
    .reader-header-bar > div:last-child { display: none !important; }

    .reader-layout { display: block !important; width: 100% !important; border-top: none; }
    .reader-nav-col { display: none !important; }
    .reader-main-col {
      display: block !important; width: 100% !important; padding: 16px 14px 120px !important;
      box-sizing: border-box !important;
    }
    .monograph-world-block { width: 100% !important; padding-bottom: 40px; margin-bottom: 40px; }
    .monograph-archival-header {
      display: flex; flex-direction: column; gap: 3px; font-size: .58rem;
    }
    .monograph-hero-plate-box { width: 100% !important; margin: 10px 0 16px !important; }
    .monograph-plate-image { width: 100% !important; border-radius: 2px; }
    .monograph-aphorism-card {
      width: 100% !important; font-size: 1.08rem !important; line-height: 1.55 !important;
      padding: 12px 14px !important; margin-bottom: 18px !important;
    }
    .monograph-prose-text {
      width: 100% !important; font-size: 1.08rem !important; line-height: 1.8 !important; text-align: left !important;
    }

    #side-marginalia-drawer {
      width: 100vw !important; max-width: 100vw !important; right: -100vw;
      top: 48px; height: calc(100vh - 48px); padding: 16px 14px 60px !important;
    }
  }
"""

print("Applied deterministic pixel scroll and compact proportional mobile collage!")
