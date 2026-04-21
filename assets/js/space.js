/* =====================================================================
   GALACTIC PORTFOLIO — Suryakiran Sureshkumar
   Fly a rocket, explore planets, land to read.
   ===================================================================== */
(() => {
  'use strict';

  // ---------- DOM ----------
  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');
  const mini = document.getElementById('minimap-canvas');
  const mctx = mini.getContext('2d');
  const intro = document.getElementById('intro');
  const launchBtn = document.getElementById('launch');
  const panel = document.getElementById('panel');
  const panelContent = document.getElementById('panel-content');
  const panelName = document.getElementById('panel-planet-name');
  const panelDot = document.getElementById('panel-planet-dot');
  const closeBtn = document.querySelector('.close-btn');
  const prompt = document.getElementById('prompt');
  const compass = document.getElementById('compass-target');

  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Minimap is a fixed square
    const ms = mini.clientWidth || 180;
    mini.width = ms * DPR;
    mini.height = ms * DPR;
    mctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);

  // ---------- WORLD DATA ----------
  const PROJECTS = [
    { title: 'DriveVLM',
      desc: 'Fine-tuned QwenVL on CARLA driving routes to produce control commands. Hit 40% of baseline with just 5% data; surpassed baselines at 40%.',
      link: 'https://github.com/s-suryakiran/DriveVLM', cta: 'GitHub' },
    { title: 'ChatLoom',
      desc: 'A specialised LLM chatbot for cosmology & astrophysics. Runs locally and answers domain questions with expert-level depth.',
      link: 'https://github.com/s-suryakiran/ChatLoom', cta: 'GitHub' },
    { title: 'SegMentor',
      desc: 'Future frame segmentation with SimVP + MogaNet + DeepLabV3+. Predicts the 22nd frame from 11 RGB frames; strong Jaccard on hidden test.',
      link: 'https://github.com/s-suryakiran/SegMentor', cta: 'GitHub' },
    { title: 'Pokémon GAN',
      desc: 'DCGAN in PyTorch trained on a Pokémon sprite dataset — generates novel creatures you’ve never seen before.',
      link: 'https://github.com/s-suryakiran/Pokemon-GAN', cta: 'GitHub' },
    { title: 'Video Summarisation for Search',
      desc: 'Keyframe extraction + captioning pipeline that makes video databases searchable with meaningful keywords.',
      link: 'https://github.com/s-suryakiran/Using-Video-summarization-techniques-for-effective-search-indexing', cta: 'GitHub' },
    { title: 'Component Identification DL Framework',
      desc: 'Object detection on assembly lines — classifies, counts, and reports coordinates to downstream automation. Published paper.',
      link: 'https://link.springer.com/article/10.1007/s41870-022-00895-z', cta: 'Paper' },
    { title: 'Covid Fight',
      desc: 'Mobile app with live case counts, a crisis chatbot, self-diagnosis flow, and one-tap access to distress numbers.',
      link: 'https://github.com/s-suryakiran/COVID-Fight', cta: 'GitHub' },
    { title: 'Phishing Site Detection',
      desc: 'Neural-network Chrome extension + web app that flags phishing sites from 14 extracted features.',
      link: 'https://github.com/s-suryakiran/phishing_site_detection', cta: 'GitHub' },
    { title: 'Night-time Object Detection',
      desc: 'Modified YOLO tailored for night-time CCTV object detection. Presented at NCVPRIPG.',
      link: 'https://link.springer.com/chapter/10.1007/978-981-15-8697-2_52', cta: 'Paper' },
  ];

  const PLANETS = [
    {
      id: 'sun', name: 'SOL', x: 0, y: 0, r: 85, mass: 1,
      color: '#ffcc33', glow: '#ff7700', coreColor: '#fff6a8',
      isSun: true,
      title: 'Welcome, Traveller',
      html: () => `
        <h2>Suryakiran Sureshkumar</h2>
        <p class="label">Software Engineer · Machine Learning Engineer</p>
        <p>You’ve just entered my galactic portfolio. Each orbiting world holds a part of my story — about me, my toolkit, my projects, my experience.</p>
        <p>Point your rocket, burn thrusters, and land on any planet to read. The sun you’re standing on? That’s me.</p>
        <ul>
          <li>Currently building with ML, LLMs, and systems that scale</li>
          <li>Masters @ NYU Courant — Computer Science</li>
          <li>Previously: ML Engineer @ Tiger Analytics</li>
        </ul>
      `
    },
    {
      id: 'mercury', name: 'MERCURY', x: 520, y: -60, r: 28,
      color: '#b7a896', glow: '#9b8a77', coreColor: '#e3d6c4',
      title: 'About Me',
      html: () => `
        <h2>About</h2>
        <p class="label">The pilot behind the ship</p>
        <p>I'm pursuing a Master of Science in Computer Science at <b>NYU's Courant Institute of Mathematical Sciences</b>, specialising in machine learning, data science, and software engineering.</p>
        <p>Before NYU, I was a <b>Machine Learning Engineer at Tiger Analytics</b>, leading computer-vision and ML projects for global clients and helping steer a team building a no-code data-science platform.</p>
        <p>I’ve sharpened my craft through hackathons, research, and production work across cloud computing, NLP, and analytics. What drives me: tackling hard problems with data and technology, shipping real things, and always picking up the next tool.</p>
        <p>I’m open to conversations and opportunities in <b>ML, data science, and software engineering</b>. Say hi from Neptune.</p>
      `
    },
    {
      id: 'venus', name: 'VENUS', x: -680, y: 340, r: 42,
      color: '#f3b562', glow: '#d78a3a', coreColor: '#ffe4a8',
      title: 'Skills',
      html: () => `
        <h2>Toolkit</h2>
        <p class="label">Technologies I fly with</p>
        <div class="skill-groups">
          <div class="skill-group"><h4>Languages</h4>
            <div class="chips">${chips('Python','C++','C','Java','Go','JavaScript')}</div></div>
          <div class="skill-group"><h4>ML / Data</h4>
            <div class="chips">${chips('PyTorch','TensorFlow','Scikit-Learn','OpenCV','PySpark','NumPy','Pandas','Matplotlib')}</div></div>
          <div class="skill-group"><h4>Web</h4>
            <div class="chips">${chips('React.js','Node.js','Express.js','Flask','Django','FastAPI','HTML','CSS','jQuery')}</div></div>
          <div class="skill-group"><h4>Data Stores</h4>
            <div class="chips">${chips('MySQL','PostgreSQL','MongoDB','Oracle')}</div></div>
          <div class="skill-group"><h4>Cloud & Ops</h4>
            <div class="chips">${chips('Azure','Oracle Cloud','Docker','Azure DevOps','GitHub','GitLab','Databricks')}</div></div>
          <div class="skill-group"><h4>Also</h4>
            <div class="chips">${chips('Spark','Flutter','Postman','Tableau','Power Apps')}</div></div>
        </div>
      `
    },
    {
      id: 'earth', name: 'EARTH', x: 1080, y: 420, r: 48,
      color: '#3ea6e0', glow: '#1a66a8', coreColor: '#7cd0ff',
      ring: false,
      title: 'Experience',
      html: () => `
        <h2>Missions Flown</h2>
        <p class="label">Where I’ve worked and what I built</p>
        <h3>Machine Learning Engineer — Tiger Analytics</h3>
        <p>Led computer-vision and ML projects for global clients. Owned model design, data pipelines, and deployment. Helped manage the team building an internal no-code data-science platform used by analysts across the company.</p>
        <h3>Graduate Researcher — NYU Courant</h3>
        <p>Research-grade projects across vision-language models, video prediction, and generative models. Published and presented work in computer-vision venues.</p>
        <h3>Publications</h3>
        <ul>
          <li><a href="https://link.springer.com/article/10.1007/s41870-022-00895-z" target="_blank">Deep Learning Framework for Component Identification</a> — Springer, Int. J. Inf. Technol.</li>
          <li><a href="https://link.springer.com/chapter/10.1007/978-981-15-8697-2_52" target="_blank">Night-time Object Detection using Machine Learning</a> — NCVPRIPG proceedings</li>
        </ul>
        <a class="btn-primary" href="./assets/Suryakiran_S_(Resume).pdf" target="_blank">Download Resume</a>
      `
    },
    {
      id: 'mars', name: 'MARS', x: -1420, y: -220, r: 40,
      color: '#c1492a', glow: '#7a2b14', coreColor: '#f47248',
      title: 'Projects',
      html: () => `
        <h2>Projects</h2>
        <p class="label">Featured missions — each its own moon</p>
        <div class="projects-grid">
          ${PROJECTS.map(p => `
            <div class="project-card">
              <h4>${p.title}</h4>
              <p>${p.desc}</p>
              <a class="project-link" href="${p.link}" target="_blank">${p.cta} →</a>
            </div>
          `).join('')}
        </div>
      `
    },
    {
      id: 'jupiter', name: 'JUPITER', x: 1900, y: -560, r: 96,
      color: '#d8a05a', glow: '#8a5a2a', coreColor: '#f4c37c',
      bands: true,
      title: 'Research',
      html: () => `
        <h2>Research Highlights</h2>
        <p class="label">Deep dives into vision, language, and generation</p>
        <h3>DriveVLM — Vision-Language Autonomous Driving</h3>
        <p>Fine-tuned QwenVL on CARLA driving routes to generate low-level control commands directly from visual input. With only <b>5%</b> of the labelled data we reached 40% of baseline performance; at 40% data, our method <i>surpassed</i> traditional baselines. Shows that VLMs can massively cut the supervised-data cost in AV.</p>
        <h3>SegMentor — Future Frame Segmentation</h3>
        <p>Predicts the 22<sup>nd</sup> segmented frame from 11 RGB frames using a SimVP + MogaNet backbone with DeepLabV3+ segmentation — Jaccard 0.2952 val / 0.2852 hidden test.</p>
        <h3>Pokémon GAN — Generative Models</h3>
        <p>DCGAN in PyTorch trained on Pokémon sprites. Produces creatures that never existed — a playground for studying GAN training stability.</p>
        <a class="btn-primary" href="https://github.com/s-suryakiran" target="_blank">See all repos on GitHub</a>
      `
    },
    {
      id: 'saturn', name: 'SATURN', x: -2280, y: 680, r: 78,
      color: '#e1c280', glow: '#a67d40', coreColor: '#fce6b0',
      ring: true, ringColor: '#f1d7a4',
      title: 'Education',
      html: () => `
        <h2>Education</h2>
        <p class="label">The rings of learning</p>
        <h3>M.S. in Computer Science</h3>
        <p><b>New York University — Courant Institute of Mathematical Sciences</b></p>
        <p>Focus: machine learning, deep learning, computer vision, natural language processing, large-scale systems.</p>
        <h3>B.E. in Computer Science and Engineering</h3>
        <p>Foundations in algorithms, systems, databases, and applied AI. Multiple hackathons and published research during undergrad.</p>
        <h3>Certifications & Interests</h3>
        <ul>
          <li>Cloud computing on Azure and Oracle</li>
          <li>Computer vision and vision-language models</li>
          <li>LLMs, RAG systems, and applied NLP</li>
          <li>Distributed data processing with Spark / PySpark</li>
        </ul>
      `
    },
    {
      id: 'neptune', name: 'NEPTUNE', x: 2600, y: 240, r: 58,
      color: '#4169e1', glow: '#1f3c94', coreColor: '#7d9cf0',
      title: 'Contact',
      html: () => `
        <h2>Open Comms</h2>
        <p class="label">Beam me a message — I read every signal</p>
        <div class="contact-grid">
          <a class="contact-row" href="mailto:suryakiranbdsk@gmail.com">
            <span class="ico">✉</span>
            <div><span class="label-tiny">Email</span><span class="val">suryakiranbdsk@gmail.com</span></div>
          </a>
          <a class="contact-row" href="https://www.linkedin.com/in/suryakiran-sureshkumar/" target="_blank">
            <span class="ico">in</span>
            <div><span class="label-tiny">LinkedIn</span><span class="val">/in/suryakiran-sureshkumar</span></div>
          </a>
          <a class="contact-row" href="https://github.com/s-suryakiran" target="_blank">
            <span class="ico">★</span>
            <div><span class="label-tiny">GitHub</span><span class="val">github.com/s-suryakiran</span></div>
          </a>
        </div>
        <form action="https://formsubmit.co/suryakiranbdsk@gmail.com" method="post" style="margin-top:1.5rem;display:grid;gap:0.6rem;">
          <input type="hidden" name="_captcha" value="false">
          <input name="name" placeholder="Your name" style="background:rgba(255,255,255,0.04);border:1px solid rgba(125,211,252,0.2);color:#e8ecff;padding:0.8rem 1rem;font-family:inherit;font-size:0.95rem;" required>
          <input name="email" type="email" placeholder="Your email" style="background:rgba(255,255,255,0.04);border:1px solid rgba(125,211,252,0.2);color:#e8ecff;padding:0.8rem 1rem;font-family:inherit;font-size:0.95rem;" required>
          <textarea name="message" placeholder="Transmission..." rows="4" style="background:rgba(255,255,255,0.04);border:1px solid rgba(125,211,252,0.2);color:#e8ecff;padding:0.8rem 1rem;font-family:inherit;font-size:0.95rem;resize:vertical;" required></textarea>
          <button type="submit" class="btn-primary" style="justify-self:start;">Transmit</button>
        </form>
      `
    },
  ];

  function chips(...items) {
    return items.map(i => `<span class="chip">${i}</span>`).join('');
  }

  // ---------- STATE ----------
  const rocket = {
    x: 0, y: -200,
    vx: 0, vy: 0,
    angle: -Math.PI / 2, // pointing up
    thrusting: false,
    boosting: false,
    radius: 10,
  };

  const camera = { x: rocket.x, y: rocket.y };
  const keys = {};
  const stars = [];
  const particles = [];
  let nearPlanet = null;
  let panelOpen = false;
  let lastTime = performance.now();
  let started = false;
  let sunPulse = 0;

  // Build parallax starfield (three layers)
  function buildStars() {
    stars.length = 0;
    const layers = [
      { count: 260, speed: 0.15, size: [0.4, 0.9], alpha: [0.25, 0.55] },
      { count: 180, speed: 0.35, size: [0.6, 1.3], alpha: [0.4, 0.8] },
      { count: 90,  speed: 0.65, size: [0.9, 1.8], alpha: [0.55, 1.0] },
    ];
    const spread = 4200;
    layers.forEach((L, li) => {
      for (let i = 0; i < L.count; i++) {
        stars.push({
          x: (Math.random() - 0.5) * spread * 2,
          y: (Math.random() - 0.5) * spread * 2,
          size: rand(L.size[0], L.size[1]),
          alpha: rand(L.alpha[0], L.alpha[1]),
          layer: li,
          speed: L.speed,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    });
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  // ---------- INPUT ----------
  const KEYMAP = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ShiftLeft: 'boost', ShiftRight: 'boost',
    Space: 'land', KeyE: 'land',
    Escape: 'escape',
  };

  window.addEventListener('keydown', (e) => {
    const k = KEYMAP[e.code];
    if (!k) return;
    if (k === 'land' && nearPlanet && !panelOpen && started) {
      openPanel(nearPlanet);
      e.preventDefault();
      return;
    }
    if (k === 'escape' && panelOpen) {
      closePanel();
      e.preventDefault();
      return;
    }
    if (['up', 'down', 'left', 'right'].includes(k)) e.preventDefault();
    keys[k] = true;
  });
  window.addEventListener('keyup', (e) => {
    const k = KEYMAP[e.code];
    if (k) keys[k] = false;
  });

  // Mobile joystick
  const stick = document.getElementById('stick');
  const nub = stick.querySelector('.nub');
  const landBtn = document.getElementById('land-btn');
  let stickActive = false;
  const stickVec = { x: 0, y: 0 };

  function setNub(dx, dy) {
    const max = 44;
    const len = Math.hypot(dx, dy);
    if (len > max) { dx = dx / len * max; dy = dy / len * max; }
    nub.style.transform = `translate(${dx}px, ${dy}px)`;
    stickVec.x = dx / max;
    stickVec.y = dy / max;
  }

  stick.addEventListener('pointerdown', (e) => {
    stickActive = true;
    stick.setPointerCapture(e.pointerId);
    const rect = stick.getBoundingClientRect();
    setNub(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
  });
  stick.addEventListener('pointermove', (e) => {
    if (!stickActive) return;
    const rect = stick.getBoundingClientRect();
    setNub(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
  });
  function endStick() { stickActive = false; setNub(0, 0); }
  stick.addEventListener('pointerup', endStick);
  stick.addEventListener('pointercancel', endStick);

  landBtn.addEventListener('click', () => {
    if (nearPlanet && !panelOpen) openPanel(nearPlanet);
  });

  // Close panel
  closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('click', (e) => { if (e.target === panel) closePanel(); });

  // Launch
  launchBtn.addEventListener('click', () => {
    intro.classList.add('hidden');
    started = true;
    setTimeout(() => intro.style.display = 'none', 900);
  });

  // ---------- PANEL ----------
  function openPanel(planet) {
    panelName.textContent = planet.name;
    panelDot.style.background = planet.color;
    panelDot.style.color = planet.color;
    panelContent.innerHTML = planet.html();
    panel.classList.remove('hidden');
    panelOpen = true;
    // kill rocket velocity softly so you don't fly away while reading
    rocket.vx *= 0.3;
    rocket.vy *= 0.3;
  }
  function closePanel() {
    panel.classList.add('hidden');
    panelOpen = false;
  }

  // ---------- GAME LOOP ----------
  function step(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;

    if (!panelOpen && started) update(dt);
    render();
    renderMini();
    requestAnimationFrame(step);
  }

  function update(dt) {
    // Rotation
    const rotSpeed = 2.8;
    if (keys.left || stickVec.x < -0.15) rocket.angle -= rotSpeed * dt * (stickVec.x < 0 ? Math.abs(stickVec.x) : 1);
    if (keys.right || stickVec.x > 0.15) rocket.angle += rotSpeed * dt * (stickVec.x > 0 ? Math.abs(stickVec.x) : 1);

    // Thrust (W/Up or stick-up)
    const stickForward = stickVec.y < -0.15 ? -stickVec.y : 0;
    const stickReverse = stickVec.y >  0.15 ?  stickVec.y : 0;
    rocket.thrusting = !!(keys.up || stickForward > 0);
    rocket.boosting = !!keys.boost;

    const thrust = rocket.thrusting ? (rocket.boosting ? 480 : 260) : 0;
    const forward = thrust + stickForward * 220;
    if (forward > 0) {
      rocket.vx += Math.cos(rocket.angle) * forward * dt;
      rocket.vy += Math.sin(rocket.angle) * forward * dt;
      // Thrust particles
      for (let i = 0; i < (rocket.boosting ? 3 : 2); i++) spawnThrustParticle();
    }
    // Reverse (S/Down) — gentle brake
    if (keys.down || stickReverse > 0) {
      rocket.vx -= Math.cos(rocket.angle) * 140 * dt * (stickReverse || 1);
      rocket.vy -= Math.sin(rocket.angle) * 140 * dt * (stickReverse || 1);
    }

    // Light drag (space but nice to fly)
    rocket.vx *= 0.995;
    rocket.vy *= 0.995;

    // Clamp velocity
    const max = rocket.boosting ? 620 : 380;
    const speed = Math.hypot(rocket.vx, rocket.vy);
    if (speed > max) {
      rocket.vx = rocket.vx / speed * max;
      rocket.vy = rocket.vy / speed * max;
    }

    rocket.x += rocket.vx * dt;
    rocket.y += rocket.vy * dt;

    // Camera follow with easing
    camera.x += (rocket.x - camera.x) * Math.min(1, 4 * dt);
    camera.y += (rocket.y - camera.y) * Math.min(1, 4 * dt);

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Planet proximity → closest landable planet
    let closest = null;
    let closestDist = Infinity;
    for (const pl of PLANETS) {
      const dx = pl.x - rocket.x;
      const dy = pl.y - rocket.y;
      const d = Math.hypot(dx, dy) - pl.r;
      if (d < 80 && d < closestDist) {
        closest = pl;
        closestDist = d;
      }
      // Soft collision: push rocket away from planet surface
      const centerD = Math.hypot(dx, dy);
      const overlap = pl.r + rocket.radius - centerD;
      if (overlap > 0) {
        const nx = dx / centerD;
        const ny = dy / centerD;
        rocket.x -= nx * overlap;
        rocket.y -= ny * overlap;
        // bounce
        const vdotn = rocket.vx * nx + rocket.vy * ny;
        if (vdotn > 0) {
          rocket.vx -= 1.6 * vdotn * nx;
          rocket.vy -= 1.6 * vdotn * ny;
          rocket.vx *= 0.5;
          rocket.vy *= 0.5;
        }
      }
    }
    nearPlanet = closest;
    if (nearPlanet) {
      prompt.textContent = `▸ LAND ON ${nearPlanet.name} — press E / Space`;
      prompt.classList.remove('hidden');
    } else {
      prompt.classList.add('hidden');
    }

    // Compass — nearest unvisited target by distance
    let nearestTarget = null, nt = Infinity;
    for (const pl of PLANETS) {
      if (pl.isSun) continue;
      const d = Math.hypot(pl.x - rocket.x, pl.y - rocket.y);
      if (d < nt) { nt = d; nearestTarget = pl; }
    }
    if (nearestTarget) {
      compass.innerHTML = `<b>${nearestTarget.name}</b>${Math.round(nt)} units out`;
    }

    sunPulse += dt;
  }

  function spawnThrustParticle() {
    const back = rocket.angle + Math.PI;
    const spread = (Math.random() - 0.5) * 0.6;
    const a = back + spread;
    const speed = rand(80, 180) + (rocket.boosting ? 120 : 0);
    const bx = rocket.x + Math.cos(back) * 12;
    const by = rocket.y + Math.sin(back) * 12;
    particles.push({
      x: bx, y: by,
      vx: Math.cos(a) * speed + rocket.vx * 0.4,
      vy: Math.sin(a) * speed + rocket.vy * 0.4,
      life: rand(0.3, 0.7),
      maxLife: 0.7,
      size: rand(2, 4),
      color: rocket.boosting ? '#7dd3fc' : '#fb923c',
    });
  }

  // ---------- RENDER ----------
  function render() {
    // Background
    ctx.fillStyle = '#03030b';
    ctx.fillRect(0, 0, W, H);

    // Draw stars (parallax)
    for (const s of stars) {
      const px = (s.x - camera.x * s.speed) % 4200;
      const py = (s.y - camera.y * s.speed) % 4200;
      // wrap to screen
      const sx = ((px + 2100) % 4200) - 2100 + W / 2;
      const sy = ((py + 2100) % 4200) - 2100 + H / 2;
      if (sx < -5 || sx > W + 5 || sy < -5 || sy > H + 5) continue;
      const tw = 0.8 + 0.2 * Math.sin(sunPulse * 2 + s.twinkle);
      ctx.globalAlpha = s.alpha * tw;
      ctx.fillStyle = '#e8ecff';
      ctx.beginPath();
      ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // World transform
    ctx.save();
    ctx.translate(W / 2 - camera.x, H / 2 - camera.y);

    // Draw orbit rings from sun
    for (const pl of PLANETS) {
      if (pl.isSun) continue;
      const d = Math.hypot(pl.x, pl.y);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, d, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw planets
    for (const pl of PLANETS) drawPlanet(pl);

    // Particles
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Draw rocket
    drawRocket();

    // Nearby planet halo
    if (nearPlanet) {
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.8)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(nearPlanet.x, nearPlanet.y, nearPlanet.r + 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.save();
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 11px "Space Grotesk", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(nearPlanet.name, nearPlanet.x, nearPlanet.y - nearPlanet.r - 22);
      ctx.restore();
    }

    ctx.restore();
  }

  function drawPlanet(pl) {
    ctx.save();
    // Outer glow
    const glowR = pl.r * (pl.isSun ? 3.2 : 1.8);
    const gg = ctx.createRadialGradient(pl.x, pl.y, pl.r * 0.7, pl.x, pl.y, glowR);
    gg.addColorStop(0, hexA(pl.glow, pl.isSun ? 0.7 : 0.35));
    gg.addColorStop(1, hexA(pl.glow, 0));
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(pl.x, pl.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Body — radial gradient for depth
    const bg = ctx.createRadialGradient(
      pl.x - pl.r * 0.35, pl.y - pl.r * 0.35, pl.r * 0.1,
      pl.x, pl.y, pl.r
    );
    bg.addColorStop(0, pl.coreColor || pl.color);
    bg.addColorStop(0.55, pl.color);
    bg.addColorStop(1, shade(pl.color, -40));
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2);
    ctx.fill();

    // Bands for jupiter
    if (pl.bands) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2);
      ctx.clip();
      for (let i = -3; i <= 3; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(90, 50, 20, 0.25)' : 'rgba(255, 230, 170, 0.08)';
        const yy = pl.y + (i / 3) * pl.r * 0.9;
        ctx.fillRect(pl.x - pl.r, yy - pl.r * 0.18, pl.r * 2, pl.r * 0.22);
      }
      ctx.restore();
    }

    // Sun corona pulsing
    if (pl.isSun) {
      const pulse = 1 + 0.06 * Math.sin(sunPulse * 1.2);
      ctx.globalAlpha = 0.4;
      const coronaR = pl.r * 1.4 * pulse;
      const cg = ctx.createRadialGradient(pl.x, pl.y, pl.r, pl.x, pl.y, coronaR);
      cg.addColorStop(0, hexA('#fff2b0', 0.5));
      cg.addColorStop(1, hexA('#fff2b0', 0));
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(pl.x, pl.y, coronaR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Ring (Saturn)
    if (pl.ring) {
      ctx.save();
      ctx.translate(pl.x, pl.y);
      ctx.rotate(-0.35);
      ctx.scale(1, 0.28);
      ctx.strokeStyle = hexA(pl.ringColor, 0.7);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, pl.r * 1.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = hexA(pl.ringColor, 0.35);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pl.r * 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Label when not very close
    const dCam = Math.hypot(pl.x - camera.x, pl.y - camera.y);
    if (dCam < 1100 && !pl.isSun) {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#e8ecff';
      ctx.font = '500 10px "Space Grotesk", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pl.name, pl.x, pl.y + pl.r + 22);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function drawRocket() {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);

    // Flame when thrusting
    if (rocket.thrusting) {
      const flicker = 6 + Math.random() * 8 + (rocket.boosting ? 10 : 0);
      const g = ctx.createLinearGradient(-12, 0, -12 - flicker, 0);
      g.addColorStop(0, '#fff2b0');
      g.addColorStop(0.4, rocket.boosting ? '#7dd3fc' : '#fb923c');
      g.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-12, -5);
      ctx.lineTo(-12 - flicker, 0);
      ctx.lineTo(-12, 5);
      ctx.closePath();
      ctx.fill();
    }

    // Body
    ctx.fillStyle = '#e8ecff';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.4;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-8, -7);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fins
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.moveTo(-8, -7);
    ctx.lineTo(-12, -11);
    ctx.lineTo(-8, -4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-8, 7);
    ctx.lineTo(-12, 11);
    ctx.lineTo(-8, 4);
    ctx.closePath();
    ctx.fill();

    // Window
    ctx.fillStyle = '#0a0a1e';
    ctx.beginPath();
    ctx.arc(4, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.arc(5, -1, 1.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Minimap render
  function renderMini() {
    const size = mini.clientWidth || 180;
    mctx.clearRect(0, 0, size, size);
    mctx.fillStyle = 'rgba(5, 7, 20, 0.6)';
    mctx.fillRect(0, 0, size, size);
    // scale so extreme planets fit
    const worldRadius = 3200;
    const scale = (size / 2) / worldRadius;
    const cx = size / 2;
    const cy = size / 2;
    // Orbits
    mctx.strokeStyle = 'rgba(125, 211, 252, 0.08)';
    mctx.lineWidth = 1;
    for (const pl of PLANETS) {
      if (pl.isSun) continue;
      const d = Math.hypot(pl.x, pl.y) * scale;
      mctx.beginPath();
      mctx.arc(cx, cy, d, 0, Math.PI * 2);
      mctx.stroke();
    }
    // Planets
    for (const pl of PLANETS) {
      mctx.fillStyle = pl.color;
      mctx.beginPath();
      mctx.arc(cx + pl.x * scale, cy + pl.y * scale, pl.isSun ? 4 : 2.5, 0, Math.PI * 2);
      mctx.fill();
    }
    // Rocket
    mctx.fillStyle = '#7dd3fc';
    mctx.shadowBlur = 8;
    mctx.shadowColor = '#7dd3fc';
    mctx.beginPath();
    mctx.arc(cx + rocket.x * scale, cy + rocket.y * scale, 3, 0, Math.PI * 2);
    mctx.fill();
    mctx.shadowBlur = 0;
  }

  // ---------- UTILITIES ----------
  function hexA(hex, a) {
    // accept #rrggbb
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function shade(hex, amount) {
    const h = hex.replace('#', '');
    let r = parseInt(h.substring(0, 2), 16);
    let g = parseInt(h.substring(2, 4), 16);
    let b = parseInt(h.substring(4, 6), 16);
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    return `rgb(${r},${g},${b})`;
  }

  // ---------- INIT ----------
  resize();
  buildStars();
  requestAnimationFrame(step);
})();
