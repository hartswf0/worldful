import shutil

with open('index.html', 'r') as f:
    content = f.read()

# 1. Update .lg-portal-grid CSS
old_css = """.lg-portal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.8rem;
    margin-bottom: 3rem;
  }"""

new_css = """.lg-portal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 1.8rem;
    margin-bottom: 3rem;
  }"""

if old_css in content:
    content = content.replace(old_css, new_css)
    print("Updated .lg-portal-grid CSS")
else:
    print("Notice: old_css not found exactly, checking regex")

# 2. Update the portal cards in the HTML markup
old_portals = """      <!-- TWO MASTER PORTAL CARDS -->
      <div class="lg-portal-grid">
        <!-- PORTAL 1: 12 LANGUAGE GAMES THOUGHT ESSAYS & PRESENTATION ENGINE -->
        <div class="lg-portal-card" style="border-top:4px solid var(--red);">
          <div class="lg-portal-top">
            <span class="lg-card-tag" style="background:var(--red); color:#fff; border:none;">[ THOUGHT ESSAYS &amp; PRESENTATIONS ]</span>
            <span style="font-family:var(--mono); font-size:.6rem; letter-spacing:.18em; color:var(--ink-soft); font-weight:700;">12 ESSAY CONTAINERS &bull; 78 SLIDES</span>
          </div>
          <h3>The Twelve Language Games: Thought Essays &amp; Keynote Engine</h3>
          <p>
            Each of the twelve games elevated into its own monograph-grade thought essay container and full-screen presentation deck.
            Features explicit <strong>Contractor Guilds</strong>—mapping specialized system instructions from the 136 prompts to solve each game's architectural traps—paired with the empirical systems from <em>Deep Play at the Aperture</em>.
          </p>
          <div class="lg-portal-actions">
            <a href="presentation.html" class="btn-lg-action">
              <span>📖 READ THOUGHT ESSAYS</span>
              <span>&rarr;</span>
            </a>
            <a href="presentation.html?mode=presentation" class="btn-lg-action secondary">
              <span>🖥️ LAUNCH KEYNOTE DECK</span>
            </a>
            <a href="presentation.html?game=00&mode=presentation" class="btn-lg-action secondary" style="border-color:var(--red); color:var(--red);">
              <span>★ DEEP PLAY TOUR</span>
            </a>
          </div>
        </div>

        <!-- PORTAL 2: CLASSIFIED SYSTEM INSTRUCTIONS YELLOW PAGES -->
        <div class="lg-portal-card accent-yellow">
          <div class="lg-portal-top">
            <span class="lg-card-tag" style="background:#12110e; color:#fde84d; border:none;">[ CLASSIFIED DIRECTORY ]</span>
            <span style="font-family:var(--mono); font-size:.6rem; letter-spacing:.18em; color:#4a473f; font-weight:700;">138+ PRODUCTION ENGINES</span>
          </div>
          <h3 style="color:#12110e;">The Yellow Prompts: Classified Directory</h3>
          <p style="color:#38352d;">
            Official classified telephone directory indexing 138+ production system instructions and operational protocols.
            Categorized by agents, adversarial red-teaming, code synthesis, philosophy, and creative direction with instant one-click payload copying.
          </p>
          <div class="lg-portal-actions">
            <a href="yellow_pages.html" class="btn-lg-action" style="background:#12110e; border-color:#12110e; color:#fde84d;">
              <span>OPEN YELLOW PAGES</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>"""

new_portals = """      <!-- THREE MASTER PORTAL CARDS -->
      <div class="lg-portal-grid">
        <!-- PORTAL 1: SCHOLARLY MONOGRAPH PAPER -->
        <div class="lg-portal-card" style="border-top:4px solid var(--red);">
          <div class="lg-portal-top">
            <span class="lg-card-tag" style="background:var(--red); color:#fff; border:none;">[ CITED MONOGRAPH // ESSAY ]</span>
            <span style="font-family:var(--mono); font-size:.6rem; letter-spacing:.18em; color:var(--ink-soft); font-weight:700;">WATSON HARTSOE &bull; SEPT 7, 2026</span>
          </div>
          <h3>Deep Play at the Aperture: Large Language Games and the Operative Humanities</h3>
          <p>
            The foundational 11-page peer-reviewed caliber monograph establishing the operative humanities.
            Formulates the aperture error <code>R = f(u, c, g)</code>, analyzes six built cases from the <em>elsewhere</em> portfolio (LDraw LEGO, LEGOS persistent state, Centaur Box strategy), and provides a 5-part thick prompting field protocol with 21 scholarly citations.
          </p>
          <div class="lg-portal-actions">
            <a href="deep_play_at_the_aperture.html" class="btn-lg-action" style="background:var(--red); border-color:var(--red-deep); color:#fff;">
              <span>📜 READ FULL MONOGRAPH</span>
              <span>&rarr;</span>
            </a>
            <a href="WAYS TO WRITE/deep_play_at_the_aperture.md" class="btn-lg-action secondary" target="_blank">
              <span>RAW MARKDOWN</span>
            </a>
            <a href="presentation.html?game=00&mode=presentation" class="btn-lg-action secondary" style="border-color:var(--red); color:var(--red);">
              <span>★ KEYNOTE TOUR</span>
            </a>
          </div>
        </div>

        <!-- PORTAL 2: 12 LANGUAGE GAMES THOUGHT ESSAYS & PRESENTATION ENGINE -->
        <div class="lg-portal-card" style="border-top:4px solid var(--ink);">
          <div class="lg-portal-top">
            <span class="lg-card-tag" style="background:var(--ink); color:#fff; border:none;">[ THOUGHT ESSAYS &amp; SLIDES ]</span>
            <span style="font-family:var(--mono); font-size:.6rem; letter-spacing:.18em; color:var(--ink-soft); font-weight:700;">12 GAMES &bull; 96 SLIDES</span>
          </div>
          <h3>The Twelve Language Games: Thought Essay Containers &amp; Decks</h3>
          <p>
            Each game elevated into an autonomous, publishable thought essay container paired with a dedicated 16:9 keynote presentation.
            Features explicit <strong>Contractor Guilds</strong> deploying the 136 system instruction prompts to solve each game's characteristic failure modes.
          </p>
          <div class="lg-portal-actions">
            <a href="presentation.html" class="btn-lg-action">
              <span>📖 BROWSE ALL 12 ESSAYS</span>
              <span>&rarr;</span>
            </a>
            <a href="presentation.html?mode=presentation" class="btn-lg-action secondary">
              <span>🖥️ LAUNCH 16:9 ENGINE</span>
            </a>
          </div>
        </div>

        <!-- PORTAL 3: CLASSIFIED SYSTEM INSTRUCTIONS YELLOW PAGES -->
        <div class="lg-portal-card accent-yellow" style="border-top:4px solid #12110e;">
          <div class="lg-portal-top">
            <span class="lg-card-tag" style="background:#12110e; color:#fde84d; border:none;">[ THE 136 CANON ]</span>
            <span style="font-family:var(--mono); font-size:.6rem; letter-spacing:.18em; color:#4a473f; font-weight:700;">136 SPECIALIZED CONTRACTORS</span>
          </div>
          <h3 style="color:#12110e;">The Contractor Guild: 136 System Prompts Directory</h3>
          <p style="color:#38352d;">
            Complete operational inventory indexing all 136 production system instructions and operational work orders.
            Includes conversational analysis, adversarial boundary guards, and craft philosophies with one-click payload copying.
          </p>
          <div class="lg-portal-actions">
            <a href="yellow_pages.html" class="btn-lg-action" style="background:#12110e; border-color:#12110e; color:#fde84d;">
              <span>OPEN CONTRACTOR DIRECTORY</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>"""

if old_portals in content:
    content = content.replace(old_portals, new_portals)
    print("Replaced old portals with new 3-portal layout")
else:
    print("Warning: old_portals exact string not matched!")

# Write updated index.html
with open('index.html', 'w') as f:
    f.write(content)
print("Wrote updated index.html")

# Synchronize byte-for-byte with reader.html
shutil.copyfile('index.html', 'reader.html')
print("Synchronized reader.html byte-for-byte with index.html")
