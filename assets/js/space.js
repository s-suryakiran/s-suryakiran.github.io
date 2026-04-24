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

  // ---------- MOBILE "ROCKET-UP" CAMERA MODE ----------
  // On touch devices the joystick is much easier to use when the rocket stays
  // visually fixed (centred + pointing up on screen) and the world rotates
  // around it. On desktop we keep the classic "rocket turns, world stays" feel
  // because the keyboard gives you precise heading control.
  //
  // Detection: any coarse pointer OR the same 768px breakpoint that shows the
  // on-screen joystick in CSS. Re-evaluated on resize / orientation change.
  let mobileMode = false;
  function recomputeMobileMode() {
    mobileMode = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
                 window.innerWidth <= 768;
  }
  // viewRotation() returns the angle (radians) to rotate the world by so that
  // the rocket's heading vector points "up" on screen. 0 on desktop.
  function viewRotation() {
    return mobileMode ? (-rocket.angle - Math.PI / 2) : 0;
  }

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
    recomputeMobileMode();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', recomputeMobileMode);

  // ---------- WORLD DATA ----------
  const PROJECTS = [
    { title: 'DriveVLM',
      desc: 'LoRA-fine-tuned QwenVL on CARLA driving routes to produce control commands. Hit 40% of baseline with just 5% data; surpassed baselines at 40%.',
      link: 'https://github.com/s-suryakiran/DriveVLM', cta: 'GitHub' },
    { title: 'ChatLoom',
      desc: 'A specialised LLM chatbot for cosmology & astrophysics — Chainlit front-end, runs locally and answers domain questions with expert-level depth.',
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
      desc: 'Neural-network Chrome extension + web app flagging phishing sites from 14 extracted features — 98.73% accuracy, Best Project Award at NUS.',
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
        <p class="label">Analyst, Software Engineer · ex-MLE · Salt Lake City</p>
        <p>You’ve just entered my galactic portfolio. Each orbiting world holds a part of my story — about me, my toolkit, my projects, my experience.</p>
        <p>Point your rocket, burn thrusters, and land on any planet to read. The sun you’re standing on? That’s me. Call me <b>Surya</b>.</p>
        <ul>
          <li><b>Analyst, Software Engineer</b> @ Goldman Sachs — since Sep 2024</li>
          <li><b>M.S. Computer Science</b> @ NYU Courant · May 2024</li>
          <li><b>Ex-MLE</b> @ Tiger Analytics · lead founding engineer on a no-code DS platform</li>
          <li>From Madurai 🌴 → New York 🗽 → Salt Lake City 🏔 · into LLMs, distributed systems, and the cosmos 🪐</li>
        </ul>
      `
    },
    {
      id: 'mercury', name: 'MERCURY', x: 520, y: -60, r: 28,
      color: '#b7a896', glow: '#9b8a77', coreColor: '#e3d6c4',
      title: 'About Me',
      html: () => `
        <h2>About</h2>
        <p class="label">Hey there — I'm Surya 👋</p>
        <p>I'm a guy fascinated by the endless possibilities of technology. My journey started in the vibrant city of <b>Madurai, India</b>, and has since carried me through New York and out to <b>Salt Lake City</b>, where I live today — mountains outside the window, fintech on the screen.</p>
        <p>Today I'm an <b>Analyst, Software Engineer at Goldman Sachs</b> (Salt Lake City office), building a risk-analysis platform that handles <b>16M+ daily requests</b> at <b>99.99% uptime</b>. Before Salt Lake, I finished my <b>M.S. in Computer Science at NYU's Courant Institute</b> in New York, where I also TA'd four courses across computer vision, probability, and linear algebra.</p>
        <p>Before the US I was a <b>Machine Learning Engineer at Tiger Analytics</b>, where I was the lead founding engineer on a no-code data-science platform — a project I still talk about with my hands.</p>
        <h3>What gets me up in the morning</h3>
        <p>Puzzles. Especially the ones that involve data, code, and real-world constraints. Some days I'm knee-deep in a model; other days I'm wiring together distributed services. The thrill of turning complex issues into elegant, user-friendly solutions is what keeps me going.</p>
        <h3>Recently</h3>
        <p>I've been exploring <b>Large Language Models</b> and how they're reshaping AI — retrieval systems, vision-language integrations, efficient inference. A bit of a tech Swiss Army knife, always ready for the next challenge.</p>
        <p>If you're into the latest AI trends, need a hand on a software project, or just want to talk tech over coffee — beam a message from Neptune. Let's make something awesome together.</p>

        <h3>The journey so far</h3>
        <p class="label">Madurai → Singapore → Chennai → New York → Raleigh → Salt Lake City · <span style="color:var(--ink-dim)">drag to spin · pins mark every workplace</span></p>
        <div id="globe-3d" style="position:relative;width:100%;height:420px;background:radial-gradient(ellipse at center, rgba(10,15,40,0.9), rgba(3,3,11,1));border:1px solid rgba(125,211,252,0.2);border-radius:6px;margin-top:0.6rem;overflow:hidden;cursor:grab;">
          <div class="globe-loading" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--ink-dim);font-family:'JetBrains Mono',monospace;font-size:0.8rem;letter-spacing:0.15em;">[booting globe…]</div>
          <div class="globe-fallback" style="display:none;position:absolute;inset:0;padding:1.2rem;overflow:auto;">
            <p style="color:var(--accent-3);font-family:'JetBrains Mono',monospace;font-size:0.75rem;margin-bottom:0.8rem">[ 3D globe unavailable — offline or WebGL disabled. City list follows. ]</p>
            <ul style="list-style:none;padding:0;margin:0;display:grid;gap:0.4rem;font-size:0.85rem;">
              <li><b style="color:var(--accent-3)">Madurai</b> — Thiagarajar '17–'21 · BSNL '18 · Research '19–'21</li>
              <li><b style="color:var(--accent-3)">Singapore</b> — NUS · HPE '19</li>
              <li><b style="color:var(--accent-3)">Chennai</b> — Tiger Analytics '21–'22</li>
              <li><b style="color:var(--accent-3)">New York</b> — NYU '22–'24</li>
              <li><b style="color:var(--accent-3)">Raleigh</b> — Promantus '23 (summer internship during NYU)</li>
              <li><b style="color:var(--accent)">Salt Lake City</b> — Goldman Sachs '24–now</li>
            </ul>
          </div>
        </div>
        <p style="color:var(--ink-dim);font-size:0.85rem;margin-top:0.6rem">Six cities, three continents, one extremely patient suitcase. Drag the globe to spin · scroll to zoom.</p>
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
            <div class="chips">${chips('Python','Java','C++','C','Go','JavaScript','TypeScript','SQL')}</div></div>
          <div class="skill-group"><h4>ML / AI</h4>
            <div class="chips">${chips('PyTorch','TensorFlow','HuggingFace','Scikit-Learn','OpenCV','LLMs','RAG','Vision-Language Models','YOLOv3')}</div></div>
          <div class="skill-group"><h4>Big Data</h4>
            <div class="chips">${chips('Hadoop','HDFS','YARN','Spark','PySpark','Databricks','Kafka','Hive','Flume','OpenMPI','MapReduce')}</div></div>
          <div class="skill-group"><h4>Backend / Web</h4>
            <div class="chips">${chips('Spring Boot','FastAPI','Flask','Django','Node.js','Express.js','React.js','Flutter')}</div></div>
          <div class="skill-group"><h4>Messaging & Infra</h4>
            <div class="chips">${chips('RabbitMQ','HAProxy','Apache Geode','Kubernetes','Docker','Terraform','AWS','Azure','Oracle Cloud')}</div></div>
          <div class="skill-group"><h4>Data Stores</h4>
            <div class="chips">${chips('MySQL','SQL Server','PostgreSQL','MongoDB','Elasticsearch','Oracle','Redis','Snowflake','BigQuery','Redshift')}</div></div>
          <div class="skill-group"><h4>Systems & Craft</h4>
            <div class="chips">${chips('Distributed Systems','System Design','ML Pipelines','Microservices','CI/CD','Azure DevOps','GitHub Actions','Kerberos','JIRA')}</div></div>
          <div class="skill-group"><h4>Also</h4>
            <div class="chips">${chips('Tableau','Postman','Power Apps','Pandas','NumPy','Matplotlib','Git','Linux')}</div></div>
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
        <p class="label">The flight log — most recent first</p>

        <h3>Analyst, Software Engineer — Goldman Sachs <span style="color:var(--ink-dim);font-weight:400;font-size:0.85rem">· Sep 2024 → Present · Salt Lake City</span></h3>
        <ul>
          <li>Building a <b>risk-analysis platform</b> that automates trade margining from legal agreements — powers margin-call workflows at <b>16M+ requests / day, 99.99% uptime</b>. Stack: Java, Spring Boot, Kubernetes, MySQL.</li>
          <li>Wrote a <b>Spark / PySpark refiner</b> ingesting <b>3M+ records / day</b> from heterogeneous upstream feeds into a unified margin schema — the backbone behind the risk engine's nightly reconciliation.</li>
          <li>Shipped an <b>LLM-based netting system</b> that reads legal agreements and auto-derives netting rules, collapsing a <b>multi-week legal-ops cycle into minutes</b> and saving the desk <b>~$1.2M / year</b>.</li>
          <li><b>Boosted system performance 30–40%</b> via RabbitMQ async processing, HAProxy load balancing, and Apache Geode caching.</li>
          <li>Shipped full-stack features for a <b>legal agreement search tool</b> (React + Java + MongoDB/Elasticsearch) — <b>3× faster search</b>.</li>
          <li>Contributed across the full SDLC with cross-functional teams in <b>5+ regions</b>.</li>
        </ul>

        <h3>Teaching Assistant — New York University <span style="color:var(--ink-dim);font-weight:400;font-size:0.85rem">· Jan 2023 → May 2024</span></h3>
        <ul>
          <li>TA'd across four courses: <b>Vision Meets Machine Learning (CSCI-GA.3033)</b>, <b>Computer Vision (CSCI-UA.0480)</b>, Probability/Stats/Decision Making, and Linear Algebra.</li>
          <li>Ran weekly recitations, designed quizzes &amp; worksheets, held office hours, and co-proctored midterms and finals.</li>
        </ul>

        <h3>Data Engineer Intern — Promantus Inc <span style="color:var(--ink-dim);font-weight:400;font-size:0.85rem">· Jun 2023 → Aug 2023 · Raleigh, NC</span></h3>
        <ul>
          <li>Deployed and optimized a <b>few-shot object-detection model</b> on P&amp;ID diagrams — <b>+10% accuracy</b> over the prior solution.</li>
          <li>Built Java parsers for cash-application integration across heterogeneous bank statements — <b>50% less manual work, 95% data accuracy</b>.</li>
        </ul>

        <h3>Analyst — Machine Learning Engineer — Tiger Analytics <span style="color:var(--ink-dim);font-weight:400;font-size:0.85rem">· Feb 2021 → Jul 2022 · Chennai</span></h3>
        <ul>
          <li><b>Lead founding engineer</b> on a <b>no-code data-science platform</b> — architected 30+ predefined DS functions on Azure Databricks + PySpark, designed the execution API, set up CI/CD (+20% deploy speed).</li>
          <li>Built an <b>Automated Shelf Analysis</b> mobile app that counts retail products from video — <b>−60% manual counting effort</b>.</li>
          <li>Tuned Spark / Databricks internals to speed up an internal framework.</li>
        </ul>

        <h3>Research Assistant — Thiagarajar College of Engineering <span style="color:var(--ink-dim);font-weight:400;font-size:0.85rem">· Jul 2019 → Jan 2021</span></h3>
        <ul>
          <li>Co-authored the <b>Deep Learning Framework for Component Identification</b> — real-time detect / classify / count on manufacturing assembly lines.</li>
          <li>Co-authored <b>Scene Understanding in Night-Time using the SSAN Dataset</b> — low-light CCTV surveillance with YOLOv3 (NCVPRIPG 2019, Springer 2020).</li>
          <li>Built a fruit-grading system that classifies apples &amp; oranges into four freshness / disease classes.</li>
        </ul>

        <h3>Earlier</h3>
        <p><b>Hewlett Packard Enterprise</b> — Summer Intern, Singapore (Jun 2019) · Hadoop system admin, MapReduce experiments with AES encryption. &nbsp;·&nbsp; <b>National University of Singapore</b> — Academic Intern, Singapore (Jun 2019) · Built a Phishing-Site Detection app that won the <b>Best Project Award</b>. &nbsp;·&nbsp; <b>BSNL</b> — In-plant Training (Dec 2018).</p>

        <h3>Publications</h3>
        <ul>
          <li><a href="https://link.springer.com/article/10.1007/s41870-022-00895-z" target="_blank">Deep Learning Framework for Component Identification</a> — Springer, Int. J. Inf. Technol.</li>
          <li><a href="https://link.springer.com/chapter/10.1007/978-981-15-8697-2_52" target="_blank">Scene Understanding in Night-Time Using SSAN Dataset</a> — NCVPRIPG 2019 / Springer 2020</li>
        </ul>

        <a class="btn-primary" href="./assets/Suryakiran_Sureshkumar_Resume.pdf" target="_blank">Download Resume</a>
      `
    },
    {
      id: 'mars', name: 'MARS', x: -1420, y: -220, r: 40,
      color: '#c1492a', glow: '#7a2b14', coreColor: '#f47248',
      title: 'Projects',
      html: () => `
        <h2>Projects</h2>
        <p class="label">
          Featured missions — each its own moon
          <button onclick="window.__playMarsClip && window.__playMarsClip()" style="margin-left:0.8rem;background:rgba(251,146,60,0.12);border:1px solid rgba(251,146,60,0.4);color:#fb923c;font-family:'JetBrains Mono',monospace;font-size:0.7rem;padding:0.2rem 0.55rem;cursor:pointer;letter-spacing:0.05em;">▶ replay transmission</button>
        </p>
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
      title: 'Education & Beyond',
      html: () => `
        <h2>Education</h2>
        <p class="label">The rings of learning</p>

        <h3>M.S. Computer Science — New York University</h3>
        <p><b>Courant Institute of Mathematical Sciences</b> · Sep 2022 → May 2024 · GPA <b>3.85 / 4.00</b></p>
        <p>Focus: machine learning, deep learning, computer vision, NLP, and large-scale systems. Also TA'd four courses while studying.</p>

        <h3>B.E. Computer Science and Engineering — Thiagarajar College of Engineering</h3>
        <p>Aug 2017 → Apr 2021 · Madurai, India · GPA <b>9.11 / 10.00</b></p>
        <p>Foundations in algorithms, systems, databases, and applied AI. Two published research papers, multiple hackathons, and the projects that got me into ML.</p>

        <h3>Certifications</h3>
        <ul>
          <li>Improving Deep Neural Networks: Hyperparameter Tuning, Regularization and Optimization</li>
          <li>Foundations: Data, Data, Everywhere</li>
          <li>Prepare Data for Exploration</li>
          <li>Share Data Through the Art of Visualization</li>
          <li>Node-RED: basics to bots</li>
        </ul>

        <h2 style="margin-top:2rem">Beyond the Code</h2>
        <p class="label">The things LinkedIn doesn't tell you</p>
        <ul>
          <li><b>Origin story</b> — grew up in <b>Madurai, India</b>; did grad school in NYC; now based in <b>Salt Lake City</b>, mountains out the window. Native in English and Tamil.</li>
          <li><b>Proud moment</b> — the <b>Phishing-Site Detection</b> app I built as an NUS intern won the <b>Best Project Award</b>. My first "maybe I actually belong here" moment.</li>
          <li><b>Another one</b> — watching the <b>No-Code DS platform</b> I led at Tiger Analytics go live and get adopted across the firm.</li>
          <li><b>Algorithms for fun</b> — I keep a running <a href="https://github.com/s-suryakiran/leet-code-problems" target="_blank">LeetCode log on GitHub</a>. Coffee + a hard problem = my ideal weekend.</li>
          <li><b>Cosmology, genuinely</b> — why I built <a href="https://github.com/s-suryakiran/ChatLoom" target="_blank">ChatLoom</a> and why this entire portfolio is a solar system. Nebulae &gt; dashboards.</li>
          <li><b>Currently exploring</b> — LLMs, retrieval systems, vision-language models, and how to make inference faster.</li>
        </ul>
      `
    },
    {
      id: 'pluto', name: 'PLUTO', x: 5600, y: -3400, r: 14,
      color: '#d9c6b4', glow: '#6b5a48', coreColor: '#f0e3d2',
      isSecret: true,
      title: 'You found it.',
      html: () => `
        <h2>🕳️ You found Pluto.</h2>
        <p class="label">Officially a dwarf planet. Still showing up.</p>
        <p>Very few people fly this far out. Congratulations — you're either extremely curious, extremely bored, or a bot. Any of the three is fine with me.</p>
        <pre style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;line-height:1.3;color:#7dd3fc;background:rgba(125,211,252,0.06);border:1px solid rgba(125,211,252,0.2);padding:1rem;overflow-x:auto;white-space:pre;">
   ____  _   _ ______   __    _
  / ___|| | | |  _ \\ \\ / /   / \\
  \\___ \\| | | | |_) \\ V /   / _ \\
   ___) | |_| |  _ < | |   / ___ \\
  |____/ \\___/|_| \\_\\|_|  /_/   \\_\\
                    made this whole thing</pre>
        <h3>The one quote I actually live by</h3>
        <blockquote style="border-left:2px solid var(--accent);padding:0.3rem 1rem;margin:1rem 0;color:var(--ink);font-style:italic;">
          "We are all in the gutter, but some of us are looking at the stars."
          <br><span style="font-style:normal;color:var(--ink-dim);font-size:0.85rem">— Oscar Wilde</span>
        </blockquote>
        <h3>Six things that are true about me</h3>
        <ul>
          <li>I can't pass a bookstore without going in. Current stack: Sagan, Stephenson, and a dog-eared copy of <i>Designing Data-Intensive Applications</i>.</li>
          <li>I'll happily lose an hour to a chess puzzle, a LeetCode hard, or a weirdly-lit nebula photo.</li>
          <li>Filter coffee > every other coffee. Madurai brain, forever.</li>
          <li>I wrote this entire site in vanilla JS on a canvas — no framework, no build step, no excuse.</li>
          <li>If you scroll the sector map far enough west at (−4200, 1800) you'll find nothing. I'm just telling you so you don't go looking.</li>
          <li>If you're reading this, you probably get along with me. Email me.</li>
        </ul>
        <p style="margin-top:1.5rem;color:var(--ink-dim);font-size:0.85rem">Press <kbd>\`</kbd> to open the terminal from anywhere. Try <code>sudo hire-me</code>.</p>
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
          <a class="contact-row" href="tel:+15512229708">
            <span class="ico">☏</span>
            <div><span class="label-tiny">Phone</span><span class="val">+1 (551) 222-9708</span></div>
          </a>
          <a class="contact-row" href="https://www.linkedin.com/in/suryakiran-sureshkumar/" target="_blank">
            <span class="ico">in</span>
            <div><span class="label-tiny">LinkedIn</span><span class="val">/in/suryakiran-sureshkumar</span></div>
          </a>
          <a class="contact-row" href="https://github.com/s-suryakiran" target="_blank">
            <span class="ico">★</span>
            <div><span class="label-tiny">GitHub</span><span class="val">github.com/s-suryakiran</span></div>
          </a>
          <a class="contact-row" href="https://leetcode.com/u/s-suryakiran/" target="_blank">
            <span class="ico">◆</span>
            <div><span class="label-tiny">LeetCode</span><span class="val">leetcode.com/s-suryakiran</span></div>
          </a>
          <a class="contact-row" href="./assets/Suryakiran_Sureshkumar_Resume.pdf" target="_blank">
            <span class="ico">⎙</span>
            <div><span class="label-tiny">Resume</span><span class="val">Download PDF</span></div>
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

  // ---------- MARS EASTER EGG (audio) ----------
  // Drops a clip at assets/audio/mars-botanist.mp3 — site is silent if missing.
  const MARS_AUDIO_SRC = './assets/audio/mars-botanist.mp3';
  let marsAudio = null;
  let marsAudioPlayedOnce = false;
  try {
    marsAudio = new Audio(MARS_AUDIO_SRC);
    marsAudio.preload = 'auto';
    marsAudio.volume = 0.55;
    // If the file doesn't exist or can't be decoded, swallow the error.
    marsAudio.addEventListener('error', () => { marsAudio = null; });
  } catch (_) { marsAudio = null; }

  function playMarsClip() {
    if (!marsAudio) return;
    try {
      marsAudio.currentTime = 0;
      const p = marsAudio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) { /* autoplay policy or missing file — shrug */ }
  }
  // Expose for the inline "replay transmission" button in the Mars panel
  window.__playMarsClip = playMarsClip;

  // ---------- COMET /NOW — a bright streak carrying a "right now" note ----------
  const comet = {
    id: 'comet', name: '/NOW',
    color: '#c084fc',
    x: 0, y: 0, r: 18,
    vx: 0, vy: 0, angle: 0,
    t: Math.random() * 20,
    // Elliptical orbit around the origin, tilted
    a: 2400, b: 1550, tilt: 0.55, period: 58,
    isComet: true,
    title: "What I'm on right now",
    html: () => `
      <h2>☄️ /NOW — April 2026</h2>
      <p class="label">A live dispatch. Updated whenever this page is rebuilt.</p>
      <p>The comet passes through every 58 seconds. You caught it — here's what's on my desk this month.</p>
      <h3>Reading</h3>
      <ul>
        <li>A fresh stack of <b>retrieval-augmented generation</b> papers — the long-tail of "how do we get LLMs to stop hallucinating on private data".</li>
        <li><i>Designing Data-Intensive Applications</i>, Kleppmann. Round two, slower this time.</li>
      </ul>
      <h3>Learning</h3>
      <ul>
        <li><b>JAX</b>, after living inside PyTorch for years. Trying to form actual opinions on <code>pmap</code> vs <code>pjit</code>.</li>
        <li><b>Triton</b> — writing a tiny fused-attention kernel, mostly to understand the shapes of the thing.</li>
      </ul>
      <h3>Shipping</h3>
      <ul>
        <li>Pushing an <b>LLM-based netting rule extractor</b> toward production inside Goldman's risk engine.</li>
        <li>This portfolio. Yes, the one you're flying through. Written in vanilla JS on a canvas — no framework, no build step.</li>
      </ul>
      <h3>Listening to</h3>
      <p>Hans Zimmer's <i>Interstellar</i> OST on loop, then Ludovico Einaudi when the day needs to slow down. Both somehow match this page.</p>
      <h3>Watching</h3>
      <p><i>3 Body Problem</i> S2 (finally) and every Veritasium video about Lagrange points.</p>
      <p style="color:var(--ink-dim);font-size:0.85rem;margin-top:1.5rem">Last updated: 2026-04-21. If this date is stale, ping me — I'll refresh it.</p>
    `
  };

  function updateComet(dt) {
    comet.t += dt;
    const theta = (comet.t / comet.period) * Math.PI * 2;
    const ax = comet.a * Math.cos(theta);
    const by = comet.b * Math.sin(theta);
    const px = ax * Math.cos(comet.tilt) - by * Math.sin(comet.tilt);
    const py = ax * Math.sin(comet.tilt) + by * Math.cos(comet.tilt);
    if (dt > 0) {
      comet.vx = (px - comet.x) / dt;
      comet.vy = (py - comet.y) / dt;
    }
    comet.x = px;
    comet.y = py;
    if (comet.vx || comet.vy) comet.angle = Math.atan2(comet.vy, comet.vx);
  }

  // Prime comet position so the first frame has sensible velocity
  updateComet(0.016);

  // ---------- 3D GLOBE (Mercury travel-log) ----------
  // Every city with a workplace, in chronological order
  const CITIES = [
    { name: 'Madurai',        lat:  9.9252, lon:  78.1198, role: "Thiagarajar '17–'21 · BSNL '18 · Research '19–'21", color: 0xfb923c },
    { name: 'Singapore',      lat:  1.3521, lon: 103.8198, role: "NUS · HPE '19",                                     color: 0xfb923c },
    { name: 'Chennai',        lat: 13.0827, lon:  80.2707, role: "Tiger Analytics '21–'22",                           color: 0xfb923c },
    { name: 'New York',       lat: 40.7128, lon: -74.0060, role: "NYU '22–'24",                                       color: 0xfb923c },
    { name: 'Raleigh',        lat: 35.7796, lon: -78.6382, role: "Promantus '23 (summer)",                            color: 0xfb923c },
    { name: 'Salt Lake City', lat: 40.7608, lon:-111.8910, role: "Goldman Sachs '24–now",                             color: 0x7dd3fc, current: true },
  ];

  let globe3d = null; // { dispose(): void, raf, etc. }

  async function initGlobe(container) {
    if (!container) return;
    const loading = container.querySelector('.globe-loading');
    const fallback = container.querySelector('.globe-fallback');

    let THREE;
    try {
      THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    } catch (err) {
      // Couldn't fetch three.js — reveal the text fallback
      if (loading) loading.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
      console.warn('Globe: Three.js failed to load —', err);
      return;
    }

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Detect WebGL availability
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      if (loading) loading.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.15, 3.1);
    camera.lookAt(0, 0, 0);

    // --- Build equirectangular earth texture on a 2D canvas ---
    const earthTex = buildEarthCanvasTexture(THREE);

    // Group that holds everything that should rotate together
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Earth sphere
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshBasicMaterial({ map: earthTex })
    );
    globeGroup.add(earth);

    // Wireframe overlay for hologram vibe
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.003, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, wireframe: true, transparent: true, opacity: 0.08 })
    );
    globeGroup.add(wire);

    // Atmospheric glow — additive backface sphere with Fresnel-ish shader
    // NOTE: clamp the input to pow() with max(0.0, ...) — otherwise GLSL produces
    // NaN fragments on the far hemisphere which render as a dark halo/ring.
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 64, 64),
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float d = dot(vNormal, vec3(0.0, 0.0, 1.0));
            float intensity = pow(max(0.0, 0.75 - d), 2.5);
            gl_FragColor = vec4(0.49, 0.83, 0.99, 1.0) * intensity;
          }`,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      })
    );
    atmo.renderOrder = 1;
    scene.add(atmo);

    // --- lat/lon → 3D ---
    function latLonTo3D(lat, lon, r) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta)
      );
    }

    // --- pins + halos + labels ---
    const pinObjs = [];
    for (const city of CITIES) {
      const pos = latLonTo3D(city.lat, city.lon, 1.015);
      const col = new THREE.Color(city.color);

      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 16, 16),
        new THREE.MeshBasicMaterial({ color: col })
      );
      pin.position.copy(pos);
      globeGroup.add(pin);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.25 })
      );
      halo.position.copy(pos);
      globeGroup.add(halo);

      // City label as a sprite
      // NOTE: sits at radius 1.28 — OUTSIDE the atmosphere sphere (1.18), otherwise
      // labels z-fight with the atmo fragments and "break" as the globe rotates.
      const label = makeCityLabel(THREE, city);
      const labelPos = latLonTo3D(city.lat, city.lon, 1.28);
      label.position.copy(labelPos);
      label.renderOrder = 2;
      globeGroup.add(label);

      pinObjs.push({ city, pin, halo, label });
    }

    // --- arcs between cities ---
    // Explicit pairs, not "consecutive in array" — Raleigh was a summer internship
    // BRANCHING OFF from NYU, not a step between NYC and Salt Lake City. The real
    // career path is Chennai → NYC → SLC, with Raleigh as a NYC side trip.
    // Arc height scales with angular distance so long hops arch far off the sphere
    // and don't get occluded by the planet itself.
    const cityIdx = Object.fromEntries(CITIES.map((c, i) => [c.name, i]));
    const ARCS = [
      { from: 'Madurai',   to: 'Singapore',      kind: 'main' },
      { from: 'Singapore', to: 'Chennai',        kind: 'main' },
      { from: 'Chennai',   to: 'New York',       kind: 'main' }, // cross-continent, auto-purple
      { from: 'New York',  to: 'Salt Lake City', kind: 'main' }, // the one that matters
      { from: 'New York',  to: 'Raleigh',        kind: 'side' }, // summer intern detour
    ];

    const travelers = []; // pulsing dots that travel along each arc
    ARCS.forEach((spec, i) => {
      const ca = CITIES[cityIdx[spec.from]];
      const cb = CITIES[cityIdx[spec.to]];
      const a = latLonTo3D(ca.lat, ca.lon, 1.012);
      const b = latLonTo3D(cb.lat, cb.lon, 1.012);
      const angle = a.angleTo(b);                          // 0 … π
      const arcHeight = 1.0 + 0.55 * angle;                // short = 1.0, antipodal ≈ 2.73
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);

      // Visual language:
      //   - cross-continent main arcs = thicker + purple
      //   - within-continent main arcs = cyan
      //   - side trips (Raleigh)       = dimmer/thinner cyan
      const isLongHop = angle > 0.6; // ~34°+ geodesic — covers the India↔USA arc
      const isSide    = spec.kind === 'side';
      const color  = isSide ? 0x7dd3fc : (isLongHop ? 0xc084fc : 0x7dd3fc);
      const radius = isSide ? 0.003  : (isLongHop ? 0.006    : 0.0045);
      const opacity = isSide ? 0.55 : 0.85;

      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 80, radius, 8, false),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
      );
      globeGroup.add(tube);

      // Travelling glow dot — a visual signal the arc actually exists and shows direction
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(isSide ? 0.011 : 0.015, 12, 12),
        new THREE.MeshBasicMaterial({
          color: isLongHop ? 0xe8ecff : 0xfff2b0,
          transparent: true,
          opacity: isSide ? 0.7 : 0.95,
        })
      );
      globeGroup.add(dot);
      travelers.push({ curve, dot, offset: i * 0.17, speed: 0.00035 + Math.random() * 0.00015 });
    });

    // --- stars in the background ---
    {
      const sgeo = new THREE.BufferGeometry();
      const sv = new Float32Array(800 * 3);
      for (let i = 0; i < 800; i++) {
        const r = 30 + Math.random() * 20;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        sv[i * 3]     = r * Math.sin(p) * Math.cos(t);
        sv[i * 3 + 1] = r * Math.cos(p);
        sv[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
      }
      sgeo.setAttribute('position', new THREE.BufferAttribute(sv, 3));
      const stars = new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xe8ecff, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.55 }));
      scene.add(stars);
    }

    // Initial rotation — show India/Asia roughly centred
    globeGroup.rotation.y = -Math.PI * 0.55;
    globeGroup.rotation.x = 0.25;

    // --- interaction: drag, wheel zoom, auto-rotate ---
    let drag = { active: false, x: 0, y: 0 };
    let autoRot = true;
    let autoRotResume = 0;

    const onDown = (e) => {
      drag.active = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      autoRot = false;
      autoRotResume = performance.now() + 2500;
      container.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!drag.active) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      globeGroup.rotation.y += dx * 0.006;
      globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x + dy * 0.005));
      drag.x = e.clientX;
      drag.y = e.clientY;
    };
    const onUp = () => {
      drag.active = false;
      container.style.cursor = 'grab';
    };
    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(1.8, Math.min(5.5, camera.position.z + e.deltaY * 0.002));
    };

    renderer.domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Resize on panel width change
    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    // Remove the loading shim now that everything is ready
    if (loading) loading.style.display = 'none';

    // --- render loop ---
    // Reusable scratch vectors so the tick doesn't allocate 60× per second
    const _camDir = new THREE.Vector3();
    const _pinWorld = new THREE.Vector3();
    const _toPin = new THREE.Vector3();
    let raf = 0;
    let pulseT = 0;
    function tick(t) {
      raf = requestAnimationFrame(tick);
      pulseT += 0.016;
      if (!autoRot && t > autoRotResume) autoRot = true;
      // Respect prefers-reduced-motion — skip the idle auto-rotation entirely
      // so users with vestibular sensitivity don't get a constantly moving globe.
      const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (autoRot && !rm) globeGroup.rotation.y += 0.0018;

      // Camera forward vector (points away from the camera, into the scene)
      camera.getWorldDirection(_camDir);

      // halo pulse + label facing-camera fade
      for (const po of pinObjs) {
        const s = 1 + 0.25 * Math.sin(pulseT * 2 + po.city.lat * 0.1);
        po.halo.scale.setScalar(s);
        po.halo.material.opacity = 0.18 + 0.1 * Math.sin(pulseT * 2 + po.city.lat * 0.1);

        // Fade the label when its pin rotates onto the far hemisphere.
        // A pin is "facing the camera" when the vector from the earth centre to
        // the pin points in the opposite direction to the camera's forward.
        po.pin.getWorldPosition(_pinWorld);
        _toPin.copy(_pinWorld).normalize();
        const facing = -_toPin.dot(_camDir); // 1 = dead-centre, -1 = directly behind
        const alpha = Math.max(0, Math.min(1, (facing - 0.1) * 2.2));
        po.label.material.opacity = alpha;
        po.label.visible = alpha > 0.02;
      }

      // Travellers — glow dots ride along each arc
      for (const tr of travelers) {
        tr.offset = (tr.offset + tr.speed * 16.67) % 1;
        const pos = tr.curve.getPointAt(tr.offset);
        tr.dot.position.copy(pos);
      }

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(tick);

    // Expose disposal
    globe3d = {
      dispose() {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('resize', onResize);
        renderer.domElement.removeEventListener('pointerdown', onDown);
        renderer.domElement.removeEventListener('wheel', onWheel);
        // dispose geometries / materials / textures
        scene.traverse(obj => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
            else obj.material.dispose();
          }
        });
        earthTex.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }

  function disposeGlobe() {
    if (globe3d) { try { globe3d.dispose(); } catch (_) {} globe3d = null; }
  }

  // Build a stylised hologram earth texture on a 2D canvas.
  // No external image, no copyright issues — rough hand-authored continent polygons.
  function buildEarthCanvasTexture(THREE) {
    const W = 2048, H = 1024;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');

    // Ocean — deep navy with a subtle vertical gradient (darker at poles)
    const oceanGrad = g.createLinearGradient(0, 0, 0, H);
    oceanGrad.addColorStop(0,   '#030613');
    oceanGrad.addColorStop(0.5, '#0a1a33');
    oceanGrad.addColorStop(1,   '#030613');
    g.fillStyle = oceanGrad;
    g.fillRect(0, 0, W, H);

    const p = (lon, lat) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];

    // Simplified continent polygons — lon, lat pairs
    const continents = [
      // North America (Alaska → US → Mexico)
      [[-168,65],[-164,71],[-148,71],[-125,69],[-95,74],[-82,75],[-64,60],[-55,49],[-65,43],[-72,38],[-80,25],[-97,18],[-106,23],[-115,30],[-122,34],[-124,42],[-130,53],[-141,60],[-154,59],[-168,65]],
      // Greenland
      [[-55,60],[-50,70],[-40,83],[-20,82],[-15,75],[-22,62],[-42,60],[-55,60]],
      // South America
      [[-80,11],[-75,10],[-60,8],[-50,2],[-38,-5],[-35,-10],[-38,-23],[-48,-28],[-58,-38],[-65,-55],[-72,-52],[-73,-42],[-75,-33],[-73,-20],[-78,-4],[-81,3],[-80,11]],
      // Europe (mainland + UK approximation)
      [[-10,36],[-8,43],[-4,44],[2,43],[8,44],[14,45],[20,42],[28,41],[34,45],[40,48],[42,54],[38,62],[28,66],[15,68],[5,64],[-2,58],[-6,55],[-8,50],[-4,46],[-10,36]],
      // UK / Ireland rough
      [[-10,51],[-8,55],[-6,58],[-2,58],[1,54],[-3,50],[-6,50],[-10,51]],
      // Africa
      [[-17,14],[-5,15],[10,35],[25,32],[32,31],[35,16],[43,11],[51,12],[48,5],[42,-5],[40,-15],[32,-22],[20,-34],[15,-34],[10,-22],[9,-5],[-2,5],[-10,6],[-17,14]],
      // Arabia
      [[35,30],[48,28],[55,22],[53,13],[44,12],[38,18],[35,30]],
      // Asia (huge — Russia + China + SE Asia + India)
      [[30,45],[40,48],[55,51],[70,55],[85,60],[100,62],[120,65],[140,70],[160,68],[175,66],[180,60],[170,50],[150,45],[135,36],[125,28],[115,22],[105,18],[100,11],[97,5],[92,12],[85,22],[77,8],[72,17],[67,24],[58,25],[48,36],[40,40],[30,45]],
      // Japan (island blob)
      [[135,33],[140,38],[143,43],[141,45],[135,38],[132,33],[135,33]],
      // Indonesia / SE Asia archipelago
      [[95,-2],[105,1],[112,-3],[120,-8],[130,-8],[135,-4],[142,-3],[140,-8],[122,-10],[110,-9],[100,-3],[95,-2]],
      // Australia
      [[113,-22],[122,-16],[132,-12],[141,-10],[145,-14],[153,-23],[150,-36],[140,-38],[130,-32],[120,-34],[115,-33],[114,-26],[113,-22]],
      // New Zealand
      [[166,-46],[172,-41],[176,-39],[178,-42],[172,-46],[167,-47],[166,-46]],
      // Antarctica — band at bottom
      [[-180,-78],[-90,-75],[0,-78],[90,-72],[180,-78],[180,-90],[-180,-90],[-180,-78]],
    ];

    g.save();
    g.fillStyle = 'rgba(32, 90, 120, 0.9)';
    g.strokeStyle = 'rgba(125, 211, 252, 0.7)';
    g.lineWidth = 1.4;
    g.shadowBlur = 14;
    g.shadowColor = 'rgba(125, 211, 252, 0.35)';
    for (const poly of continents) {
      g.beginPath();
      poly.forEach((pt, i) => {
        const [x, y] = p(pt[0], pt[1]);
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      });
      g.closePath();
      g.fill();
      g.stroke();
    }
    g.restore();

    // Lat/lon graticule
    g.strokeStyle = 'rgba(125, 211, 252, 0.10)';
    g.lineWidth = 1;
    for (let lat = -60; lat <= 60; lat += 15) {
      const y = ((90 - lat) / 180) * H;
      g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 15) {
      const x = ((lon + 180) / 360) * W;
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke();
    }

    // Equator
    g.strokeStyle = 'rgba(192, 132, 252, 0.35)';
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }

  function makeCityLabel(THREE, city) {
    const c = document.createElement('canvas');
    c.width = 360; c.height = 88;
    const g = c.getContext('2d');
    // background plate
    g.fillStyle = 'rgba(5, 8, 20, 0.88)';
    g.strokeStyle = city.current ? 'rgba(125,211,252,0.65)' : 'rgba(251,146,60,0.55)';
    g.lineWidth = 2;
    const pad = 6;
    roundRect(g, pad, pad, c.width - pad*2, c.height - pad*2, 8);
    g.fill();
    g.stroke();
    // text
    g.textAlign = 'center';
    g.font = '700 26px "JetBrains Mono", monospace';
    g.fillStyle = city.current ? '#7dd3fc' : '#fb923c';
    g.fillText(city.name, c.width / 2, 38);
    g.font = '500 14px "JetBrains Mono", monospace';
    g.fillStyle = 'rgba(232, 236, 255, 0.8)';
    g.fillText(city.role, c.width / 2, 62);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    // Roughly 0.6 wide in world units; aspect matches canvas
    const aspect = c.width / c.height;
    sprite.scale.set(0.55 * aspect * 0.35, 0.35 * 0.55, 1);
    return sprite;
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
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
  let autopilotTarget = null;

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
    KeyF: 'autopilot', Tab: 'autopilot',
    Escape: 'escape',
  };

  function pickAutopilotTarget() {
    // Find nearest landable by surface distance (skip hidden planets unless already close)
    let best = null, bestD = Infinity;
    for (const pl of PLANETS) {
      if (pl.isSecret) {
        // Secret planets only auto-targetable if you're already nearby
        const d = Math.hypot(pl.x - rocket.x, pl.y - rocket.y) - pl.r;
        if (d < 400 && d < bestD) { bestD = d; best = pl; }
        continue;
      }
      const d = Math.hypot(pl.x - rocket.x, pl.y - rocket.y) - pl.r;
      if (d < bestD) { bestD = d; best = pl; }
    }
    // Comet as autopilot target if close enough
    if (typeof comet !== 'undefined' && comet) {
      const d = Math.hypot(comet.x - rocket.x, comet.y - rocket.y) - comet.r;
      if (d < 600 && d < bestD) { bestD = d; best = comet; }
    }
    return best;
  }

  function toggleAutopilot() {
    if (autopilotTarget) {
      autopilotTarget = null;
      return;
    }
    autopilotTarget = pickAutopilotTarget();
  }

  window.addEventListener('keydown', (e) => {
    // Backtick toggles the terminal from anywhere (but not while typing inside it)
    if ((e.code === 'Backquote' || e.key === '`') && e.target !== termInput) {
      if (started) { toggleTerminal(); e.preventDefault(); }
      return;
    }
    // While the terminal is open, don't hijack keys for the rocket
    if (termOpen) return;

    const k = KEYMAP[e.code];
    if (!k) return;
    if (k === 'land' && nearPlanet && !panelOpen && started) {
      openPanel(nearPlanet);
      e.preventDefault();
      return;
    }
    if (k === 'autopilot' && started && !panelOpen) {
      toggleAutopilot();
      e.preventDefault();
      return;
    }
    if (k === 'escape' && expressOverlay && !expressOverlay.classList.contains('hidden')) {
      closeExpress();
      e.preventDefault();
      return;
    }
    if (k === 'escape' && panelOpen) {
      closePanel();
      e.preventDefault();
      return;
    }
    if (k === 'escape' && autopilotTarget) {
      autopilotTarget = null;
      e.preventDefault();
      return;
    }
    // When the express-resume overlay is up, swallow game keys so WASD
    // doesn't steer a hidden rocket or fire autopilot in the background.
    if (expressOverlay && !expressOverlay.classList.contains('hidden')) return;
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
    if (termHintBtn) termHintBtn.style.display = '';
    if (resumeFab) resumeFab.classList.remove('hidden');
    track('launch_clicked');
  });

  // ---------- ANALYTICS HELPER ----------
  // Thin wrapper around gtag so the rest of the code can fire events without
  // having to care whether GA actually loaded (ad-blockers, offline, etc).
  function track(event, params) {
    try {
      if (typeof gtag === 'function') gtag('event', event, params || {});
    } catch (_) { /* no-op */ }
  }

  // ---------- EXPRESS RESUME (recruiter fast-path) ----------
  // Traditional scrollable resume layout reachable via:
  //   · "View as resume →" link on the intro screen
  //   · Floating ⎙ Resume button in the top-right once flying
  //   · The "?mode=resume" URL (for LinkedIn profile links etc.)
  //   · Esc closes it (falls through to the usual panel-close handler)
  const expressOverlay  = document.getElementById('express-resume');
  const expressBody     = document.getElementById('express-body');
  const expressBtn      = document.getElementById('express-resume-btn');
  const expressCloseBtn = document.getElementById('express-close-btn');
  const expressFlyBtn   = document.getElementById('express-fly-btn');
  const expressPdfBtn   = document.getElementById('express-pdf-btn');
  const resumeFab       = document.getElementById('resume-fab');
  const introResumeDl   = document.getElementById('intro-resume-dl');

  // We build the express body lazily on first open — it's static content
  // assembled from the same PLANETS data, so one build is enough per session.
  let expressBuilt = false;
  function buildExpressBody() {
    if (expressBuilt || !expressBody) return;
    const byId = (id) => PLANETS.find(p => p.id === id);

    // Take a planet's existing HTML and strip game-specific chrome (replay
    // buttons, the 3D globe canvas, the redundant inner h2 titles) so it
    // slots cleanly under our section headers.
    function htmlMinus(raw, selectors) {
      const tmp = document.createElement('div');
      tmp.innerHTML = raw;
      (selectors || []).forEach(sel =>
        tmp.querySelectorAll(sel).forEach(el => el.remove())
      );
      return tmp.innerHTML;
    }

    expressBody.innerHTML = `
      <section>
        <p>I'm <b>Surya</b> — a software engineer who came up through research and ML. Today I build a risk-analysis platform at <b>Goldman Sachs</b> that handles <b>16M+ requests / day at 99.99% uptime</b>. Before that: founding engineer on a no-code data-science platform at <b>Tiger Analytics</b>, an <b>M.S. at NYU Courant</b>, and three published papers from India. Currently in <b>Salt Lake City</b>.</p>
      </section>
      <section>
        <h2>Experience</h2>
        ${htmlMinus(byId('earth').html(), ['h2', '.label', 'a.btn-primary'])}
      </section>
      <section>
        <h2>Education &amp; Beyond</h2>
        ${htmlMinus(byId('saturn').html(), ['h2', '.label'])}
      </section>
      <section>
        <h2>Skills</h2>
        ${htmlMinus(byId('venus').html(), ['h2', '.label'])}
      </section>
      <section>
        <h2>Projects</h2>
        ${htmlMinus(byId('mars').html(), ['h2', '.label', 'button'])}
      </section>
      <section>
        <h2>Research Highlights</h2>
        ${htmlMinus(byId('jupiter').html(), ['h2', '.label', 'a.btn-primary'])}
      </section>
      <section>
        <h2>Contact</h2>
        <div class="contact-inline">
          <a href="mailto:suryakiranbdsk@gmail.com">✉ suryakiranbdsk@gmail.com</a>
          <a href="https://www.linkedin.com/in/suryakiran-sureshkumar/" target="_blank" rel="noopener">in LinkedIn</a>
          <a href="https://github.com/s-suryakiran" target="_blank" rel="noopener">★ GitHub</a>
          <a href="./assets/Suryakiran_Sureshkumar_Resume.pdf" target="_blank" rel="noopener">⎙ Resume PDF</a>
        </div>
      </section>
    `;
    expressBuilt = true;
  }

  function openExpress(source) {
    buildExpressBody();
    if (expressOverlay) {
      expressOverlay.classList.remove('hidden');
      expressOverlay.scrollTop = 0;
    }
    track('express_resume_opened', { source: source || 'unknown' });
  }
  function closeExpress() {
    if (expressOverlay) expressOverlay.classList.add('hidden');
  }

  if (expressBtn)      expressBtn.addEventListener('click', () => openExpress('intro'));
  if (expressCloseBtn) expressCloseBtn.addEventListener('click', closeExpress);
  if (expressFlyBtn)   expressFlyBtn.addEventListener('click', () => {
    closeExpress();
    if (!started) launchBtn.click();
  });
  if (resumeFab)       resumeFab.addEventListener('click', () => openExpress('fab'));
  if (expressPdfBtn)   expressPdfBtn.addEventListener('click', () =>
    track('resume_downloaded', { source: 'express' })
  );
  if (introResumeDl)   introResumeDl.addEventListener('click', () =>
    track('resume_downloaded', { source: 'intro' })
  );

  // ?mode=resume → auto-open the express view on load. Useful for the
  // LinkedIn profile URL field, email signatures, etc.
  try {
    if (new URLSearchParams(window.location.search).get('mode') === 'resume') {
      openExpress('url-param');
    }
  } catch (_) { /* IE / old browser — skip */ }

  // ---------- TERMINAL ----------
  const term = document.getElementById('terminal');
  const termOutput = document.getElementById('term-output');
  const termInput = document.getElementById('term-input');
  const termHintBtn = document.getElementById('term-hint');
  let termOpen = false;
  const termHistory = [];
  let termHistoryIdx = -1;

  function termPrint(html, cls) {
    const row = document.createElement('div');
    row.className = 'row' + (cls ? ' ' + cls : '');
    row.innerHTML = html;
    termOutput.appendChild(row);
    const body = document.getElementById('term-body');
    body.scrollTop = body.scrollHeight;
  }

  function termEchoCommand(cmd) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<span class="term-prompt" style="color:#7dd3fc">surya@galactic:~$</span> <span class="cmd">${escapeHtml(cmd)}</span>`;
    termOutput.appendChild(row);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function openTerminal() {
    if (termOpen) return;
    termOpen = true;
    term.classList.remove('hidden');
    setTimeout(() => termInput.focus(), 30);
    // If empty, drop a banner
    if (!termOutput.children.length) {
      termPrint(`<span class="ok">[galactic-os]</span> boot ok · kernel 4.7.2-suryakiran · welcome, traveller.`);
      termPrint(`Type <span class="cmd">help</span> for available commands.`, 'muted');
    }
    // Clear any held movement keys — you didn't mean to fly into Jupiter
    for (const k in keys) keys[k] = false;
  }
  function closeTerminal() {
    termOpen = false;
    term.classList.add('hidden');
    termInput.blur();
    termInput.value = '';
  }
  function toggleTerminal() { termOpen ? closeTerminal() : openTerminal(); }

  function flyTo(planet) {
    autopilotTarget = planet;
  }

  const TERM_COMMANDS = {
    help: () => {
      termPrint(`<h4>commands</h4>
<span class="cmd">help</span>          &nbsp;- this list
<span class="cmd">whoami</span>        &nbsp;- short bio
<span class="cmd">about</span>         &nbsp;- about me (opens Mercury)
<span class="cmd">experience</span>    &nbsp;- work history (opens Earth)
<span class="cmd">projects</span>      &nbsp;- featured builds (opens Mars)
<span class="cmd">research</span>      &nbsp;- research highlights (opens Jupiter)
<span class="cmd">skills</span>        &nbsp;- the toolkit (opens Venus)
<span class="cmd">education</span>     &nbsp;- degrees & more (opens Saturn)
<span class="cmd">contact</span>       &nbsp;- say hi (opens Neptune)
<span class="cmd">now</span>           &nbsp;- what I'm on this month
<span class="cmd">planets</span>       &nbsp;- list the system
<span class="cmd">goto &lt;name&gt;</span>  &nbsp;- autopilot to a planet
<span class="cmd">resume</span>        &nbsp;- download my resume
<span class="cmd">socials</span>       &nbsp;- links you care about
<span class="cmd">sudo hire-me</span>  &nbsp;- a friendly sales pitch
<span class="cmd">clear</span>         &nbsp;- clear the screen
<span class="cmd">exit</span>          &nbsp;- close terminal`);
    },
    whoami: () => {
      termPrint(`<span class="ok">suryakiran</span> · Analyst, Software Engineer @ Goldman Sachs · ex-MLE @ Tiger Analytics
M.S. CS, NYU Courant (2024) · B.E. CS, Thiagarajar (2021)
Madurai → Singapore → Chennai → New York → Raleigh → <span class="ok">Salt Lake City</span>
into: LLMs, retrieval, distributed systems, and the cosmos.`);
    },
    about: () => { closeTerminal(); const p = PLANETS.find(x => x.id === 'mercury'); openPanel(p); },
    experience: () => { closeTerminal(); const p = PLANETS.find(x => x.id === 'earth'); openPanel(p); },
    projects: () => { closeTerminal(); const p = PLANETS.find(x => x.id === 'mars'); openPanel(p); },
    research: () => { closeTerminal(); const p = PLANETS.find(x => x.id === 'jupiter'); openPanel(p); },
    skills: () => { closeTerminal(); const p = PLANETS.find(x => x.id === 'venus'); openPanel(p); },
    education: () => { closeTerminal(); const p = PLANETS.find(x => x.id === 'saturn'); openPanel(p); },
    contact: () => { closeTerminal(); const p = PLANETS.find(x => x.id === 'neptune'); openPanel(p); },
    now: () => { closeTerminal(); openPanel(comet); },
    planets: () => {
      const list = PLANETS
        .filter(p => !p.isSecret)
        .map(p => `  <span class="cmd">${p.id.padEnd(10)}</span> ${p.name} — ${p.title}`)
        .join('\n');
      termPrint(`<h4>known bodies</h4>${list}\n  <span class="cmd">${'now'.padEnd(10)}</span> /NOW — this month's dispatch (the comet)`);
    },
    goto: (args) => {
      const name = (args[0] || '').toLowerCase().trim();
      if (!name) { termPrint(`usage: <span class="cmd">goto &lt;planet-name&gt;</span>`, 'warn'); return; }
      if (name === 'now' || name === 'comet') {
        closeTerminal(); flyTo(comet);
        setTimeout(() => termPrint(''), 0);
        return;
      }
      const p = PLANETS.find(x => x.id === name || x.name.toLowerCase() === name);
      if (!p) { termPrint(`unknown body: ${escapeHtml(name)}. try <span class="cmd">planets</span>.`, 'err'); return; }
      if (p.isSecret) { termPrint(`[classified] coordinates redacted. try flying further.`, 'warn'); return; }
      closeTerminal();
      flyTo(p);
    },
    resume: () => {
      termPrint(`opening resume…`, 'ok');
      window.open('./assets/Suryakiran_Sureshkumar_Resume.pdf', '_blank');
    },
    socials: () => {
      termPrint(`<h4>links</h4>
email     &nbsp;- <a href="mailto:suryakiranbdsk@gmail.com">suryakiranbdsk@gmail.com</a>
linkedin  &nbsp;- <a href="https://www.linkedin.com/in/suryakiran-sureshkumar/" target="_blank">/in/suryakiran-sureshkumar</a>
github    &nbsp;- <a href="https://github.com/s-suryakiran" target="_blank">github.com/s-suryakiran</a>
leetcode  &nbsp;- <a href="https://leetcode.com/u/s-suryakiran/" target="_blank">leetcode.com/s-suryakiran</a>`);
    },
    clear: () => { termOutput.innerHTML = ''; },
    exit: () => { closeTerminal(); },
    // Easter eggs
    sudo: (args) => {
      const rest = args.join(' ').toLowerCase();
      if (rest === 'hire-me' || rest === 'hire me') {
        termPrint(`<span class="ok">[authenticated — sudoers: suryakiran]</span>
you read the portfolio, flew the rocket, opened the terminal.
you are clearly a person of taste.

here is the short pitch:

  · ships production code at scale (16M req/day, 99.99% up).
  · ships ML that actually lands (LLM netting system → $1.2M/yr).
  · writes his own game engine for fun on a wednesday.
  · timezones are fine. flights are fine. coffee must be good.

<span class="ok">next step →</span> mail <a href="mailto:suryakiranbdsk@gmail.com?subject=Let%27s%20talk">suryakiranbdsk@gmail.com</a>
or visit <span class="cmd">contact</span> to send it from here.`);
      } else if (rest === 'rm -rf /' || rest === 'rm -rf') {
        termPrint(`nice try. this canvas is load-bearing.`, 'err');
      } else {
        termPrint(`sudo: "${escapeHtml(rest || '(nothing)')}": command not found`, 'err');
      }
    },
    echo: (args) => { termPrint(escapeHtml(args.join(' '))); },
    ls: () => TERM_COMMANDS.planets(),
    pwd: () => termPrint(`/home/surya/galactic-os`, 'muted'),
    date: () => termPrint(new Date().toString(), 'muted'),
    uname: () => termPrint(`GalacticOS 4.7.2-suryakiran canvas_2d x86_64`, 'muted'),
    man: (args) => {
      const c = (args[0] || '').toLowerCase();
      if (c && TERM_COMMANDS[c]) {
        termPrint(`<h4>${c}(1)</h4>see <span class="cmd">help</span> — this manual is under construction.`);
      } else {
        termPrint(`no entry for ${escapeHtml(c || '(empty)')}`, 'err');
      }
    },
    hello: () => termPrint(`hi 👋`),
    hi: () => termPrint(`hello!`),
  };

  function termRun(raw) {
    const line = raw.trim();
    if (!line) return;
    termEchoCommand(line);
    termHistory.unshift(line);
    termHistoryIdx = -1;
    // tokenise
    const tokens = line.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    const fn = TERM_COMMANDS[cmd];
    if (fn) {
      try { fn(args); }
      catch (e) { termPrint(`runtime error: ${escapeHtml(e.message)}`, 'err'); }
    } else {
      termPrint(`command not found: <span class="cmd">${escapeHtml(cmd)}</span> — try <span class="cmd">help</span>`, 'err');
    }
    const body = document.getElementById('term-body');
    body.scrollTop = body.scrollHeight;
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      termRun(val);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (termHistory.length) {
        termHistoryIdx = Math.min(termHistoryIdx + 1, termHistory.length - 1);
        termInput.value = termHistory[termHistoryIdx] || '';
        // move cursor to end
        setTimeout(() => termInput.setSelectionRange(termInput.value.length, termInput.value.length), 0);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      termHistoryIdx = Math.max(termHistoryIdx - 1, -1);
      termInput.value = termHistoryIdx === -1 ? '' : (termHistory[termHistoryIdx] || '');
      e.preventDefault();
    } else if (e.key === 'Escape') {
      closeTerminal();
      e.preventDefault();
    } else if (e.key === '`' || e.code === 'Backquote') {
      closeTerminal();
      e.preventDefault();
    } else if (e.key === 'Tab') {
      // naive autocomplete on command name
      const val = termInput.value;
      if (!val.includes(' ')) {
        const hits = Object.keys(TERM_COMMANDS).filter(k => k.startsWith(val));
        if (hits.length === 1) termInput.value = hits[0] + ' ';
        else if (hits.length > 1) termPrint(hits.join('  '), 'muted');
      }
      e.preventDefault();
    }
  });

  termHintBtn.addEventListener('click', openTerminal);

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
    track('planet_visited', { planet: planet.id, name: planet.name });
    // Easter egg: first time you land on Mars, play the clip (if the file exists)
    if (planet.id === 'mars' && !marsAudioPlayedOnce) {
      marsAudioPlayedOnce = true;
      playMarsClip();
    }
    // Boot the 3D globe when landing on Mercury (About)
    if (planet.id === 'mercury') {
      const container = panelContent.querySelector('#globe-3d');
      if (container) {
        // Wait a frame so the panel is laid out and clientWidth/Height are real
        requestAnimationFrame(() => initGlobe(container));
      }
    }
  }
  function closePanel() {
    panel.classList.add('hidden');
    panelOpen = false;
    // Stop Mars clip if it's still going when the user bails
    if (marsAudio && !marsAudio.paused) {
      try { marsAudio.pause(); } catch (_) {}
    }
    // Tear down the globe if it's running
    disposeGlobe();
  }

  // ---------- GAME LOOP ----------
  function step(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;

    if (!panelOpen && !termOpen && started) update(dt);
    render();
    renderMini();
    requestAnimationFrame(step);
  }

  function update(dt) {
    updateComet(dt);

    // Cancel autopilot on any manual input
    if (autopilotTarget) {
      const userInput = keys.up || keys.down || keys.left || keys.right ||
        Math.abs(stickVec.x) > 0.15 || Math.abs(stickVec.y) > 0.15;
      if (userInput) autopilotTarget = null;
    }

    if (autopilotTarget) {
      // ---- AUTOPILOT STEERING ----
      const target = autopilotTarget;
      const dx = target.x - rocket.x;
      const dy = target.y - rocket.y;
      const dist = Math.hypot(dx, dy);
      const surfDist = dist - target.r - rocket.radius;
      const targetAngle = Math.atan2(dy, dx);

      // Smooth rotation toward target
      let angleDiff = targetAngle - rocket.angle;
      while (angleDiff >  Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rocket.angle += angleDiff * Math.min(1, 6 * dt);

      // Arrival: open the panel (looser threshold for moving comet)
      const speed = Math.hypot(rocket.vx, rocket.vy);
      const isMoving = !!target.isComet;
      const arriveDist = isMoving ? 60 : 32;
      const arriveSpeed = isMoving ? 500 : 140;
      if (surfDist < arriveDist && speed < arriveSpeed) {
        const arrived = autopilotTarget;
        autopilotTarget = null;
        rocket.thrusting = false;
        rocket.boosting = false;
        openPanel(arrived);
      } else {
        // Kinematic "arrive" — desired speed scales with remaining distance
        const aligned = Math.abs(angleDiff) < 0.55;
        const desiredSpeed = Math.min(380, Math.sqrt(Math.max(0, surfDist) * 480));
        rocket.boosting = false;
        if (aligned && speed < desiredSpeed && surfDist > 15) {
          rocket.vx += Math.cos(rocket.angle) * 340 * dt;
          rocket.vy += Math.sin(rocket.angle) * 340 * dt;
          rocket.thrusting = true;
          for (let i = 0; i < 2; i++) spawnThrustParticle();
        } else if (speed > desiredSpeed + 20) {
          // Overshooting — retro-brake
          rocket.vx *= 0.94;
          rocket.vy *= 0.94;
          rocket.thrusting = false;
        } else {
          rocket.thrusting = false;
        }
      }
    } else {
      // ---- MANUAL CONTROL ----
      // Rotation: slightly slower on mobile because the whole world swings
      // (rocket-up mode), which reads more intense than just the ship turning.
      const rotSpeed = mobileMode ? 2.1 : 2.8;
      if (keys.left)  rocket.angle -= rotSpeed * dt;
      if (keys.right) rocket.angle += rotSpeed * dt;
      if (stickVec.x < -0.15) rocket.angle -= rotSpeed * dt * Math.abs(stickVec.x);
      if (stickVec.x >  0.15) rocket.angle += rotSpeed * dt * stickVec.x;

      // Thrust — stick acts as a throttle, not a bonus on top of base thrust.
      //   - desktop key  : 260 base (480 with Shift boost)
      //   - mobile stick : 260 * stickMagnitude (so full push ≈ desktop tap,
      //                    NOT desktop boost — old code stacked them and
      //                    pushed you to 480 on any significant stick nudge)
      const stickForward = stickVec.y < -0.15 ? -stickVec.y : 0; // 0..1
      const stickReverse = stickVec.y >  0.15 ?  stickVec.y : 0; // 0..1
      rocket.thrusting = !!(keys.up || stickForward > 0);
      rocket.boosting = !!keys.boost;

      let forward = 0;
      if (keys.up)             forward = rocket.boosting ? 480 : 260;
      else if (stickForward > 0) forward = 260 * stickForward;

      if (forward > 0) {
        rocket.vx += Math.cos(rocket.angle) * forward * dt;
        rocket.vy += Math.sin(rocket.angle) * forward * dt;
        for (let i = 0; i < (rocket.boosting ? 3 : 2); i++) spawnThrustParticle();
      }
      // Reverse (S/Down) — gentle brake; stick magnitude scales it
      if (keys.down || stickReverse > 0) {
        const rev = keys.down ? 1 : stickReverse;
        rocket.vx -= Math.cos(rocket.angle) * 140 * dt * rev;
        rocket.vy -= Math.sin(rocket.angle) * 140 * dt * rev;
      }
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

    // Planet proximity → closest landable body (planets + comet)
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
    // Comet proximity — pass-through (no collision), but land-able
    {
      const d = Math.hypot(comet.x - rocket.x, comet.y - rocket.y) - comet.r;
      if (d < 80 && d < closestDist) {
        closest = comet;
        closestDist = d;
      }
    }
    nearPlanet = closest;
    if (autopilotTarget) {
      prompt.textContent = `◉ AUTOPILOT → ${autopilotTarget.name} — press F or move to cancel`;
      prompt.classList.remove('hidden');
    } else if (nearPlanet) {
      prompt.textContent = `▸ LAND ON ${nearPlanet.name} — press E / Space · F for autopilot`;
      prompt.classList.remove('hidden');
    } else {
      prompt.classList.add('hidden');
    }

    // Compass — nearest unvisited target by distance (skip sun and hidden planets)
    let nearestTarget = null, nt = Infinity;
    for (const pl of PLANETS) {
      if (pl.isSun || pl.isSecret) continue;
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

    const vRot = viewRotation();

    // Draw stars (parallax).
    // On mobile we rotate the starfield around screen center so the sky moves
    // with the world — otherwise stars stay locked to the device while planets
    // swing around, which reads as motion sickness territory.
    ctx.save();
    if (vRot !== 0) {
      ctx.translate(W / 2, H / 2);
      ctx.rotate(vRot);
      ctx.translate(-W / 2, -H / 2);
    }
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
    ctx.restore();

    // World transform — on mobile we also rotate around screen center so the
    // rocket ends up drawn pointing up (rocket draws at world angle, world
    // rotation of -angle-π/2 composes to -π/2 = screen-up).
    ctx.save();
    ctx.translate(W / 2, H / 2);
    if (vRot !== 0) ctx.rotate(vRot);
    ctx.translate(-camera.x, -camera.y);

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

    // Draw comet (drawn between planets and rocket)
    drawComet();

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

    // Autopilot guide line — animated dashes from rocket to target
    if (autopilotTarget) {
      ctx.save();
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -(sunPulse * 30) % 16;
      ctx.beginPath();
      ctx.moveTo(rocket.x, rocket.y);
      ctx.lineTo(autopilotTarget.x, autopilotTarget.y);
      ctx.stroke();
      ctx.setLineDash([]);
      // Target reticle
      const pulse = 1 + 0.18 * Math.sin(sunPulse * 4);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(autopilotTarget.x, autopilotTarget.y, (autopilotTarget.r + 22) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

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

      // Label — counter-rotate so the text stays upright under mobile view rot
      ctx.save();
      ctx.translate(nearPlanet.x, nearPlanet.y);
      ctx.rotate(-viewRotation());
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 11px "Space Grotesk", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(nearPlanet.name, 0, -nearPlanet.r - 22);
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

    // Label when not very close.
    // Counter-rotate so the text stays upright when mobile rocket-up view is on.
    const dCam = Math.hypot(pl.x - camera.x, pl.y - camera.y);
    if (dCam < 1100 && !pl.isSun) {
      ctx.save();
      ctx.translate(pl.x, pl.y);
      ctx.rotate(-viewRotation());
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#e8ecff';
      ctx.font = '500 10px "Space Grotesk", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pl.name, 0, pl.r + 22);
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    ctx.restore();
  }

  function drawComet() {
    const back = comet.angle + Math.PI;
    const tailLen = 180;
    const tx = comet.x + Math.cos(back) * tailLen;
    const ty = comet.y + Math.sin(back) * tailLen;

    ctx.save();

    // Tail — gradient streak behind velocity
    const g = ctx.createLinearGradient(comet.x, comet.y, tx, ty);
    g.addColorStop(0, 'rgba(192, 132, 252, 0.8)');
    g.addColorStop(0.35, 'rgba(125, 211, 252, 0.45)');
    g.addColorStop(1, 'rgba(125, 211, 252, 0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = comet.r * 1.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(comet.x, comet.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // Halo glow
    const halo = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, comet.r * 3);
    halo.addColorStop(0, 'rgba(192, 132, 252, 0.5)');
    halo.addColorStop(1, 'rgba(192, 132, 252, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(comet.x, comet.y, comet.r * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.shadowBlur = 22;
    ctx.shadowColor = '#c084fc';
    ctx.fillStyle = '#fff2b0';
    ctx.beginPath();
    ctx.arc(comet.x, comet.y, comet.r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label (only when camera is roughly nearby). Counter-rotate for mobile.
    const dCam = Math.hypot(comet.x - camera.x, comet.y - camera.y);
    if (dCam < 1600) {
      ctx.save();
      ctx.translate(comet.x, comet.y);
      ctx.rotate(-viewRotation());
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#c084fc';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('/NOW', 0, -comet.r - 14);
      ctx.globalAlpha = 1;
      ctx.restore();
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

    // In rocket-up mobile mode, the whole minimap swings so the rocket sits at
    // the centre pointing up and planets/orbits rotate around it — matches the
    // main view so the two never fight each other for the user's orientation.
    //
    // Effective world-to-mini mapping used below:
    //   desktop: (cx + worldX*scale, cy + worldY*scale)   [sun at centre]
    //   mobile : rotated & translated so rocket is at centre and points up
    const vRot = viewRotation();
    const mobile = vRot !== 0;
    const cosV = Math.cos(vRot), sinV = Math.sin(vRot);
    // World (wx,wy) → minimap (sx,sy).
    // In mobile mode: translate rocket to origin → scale → rotate by vRot → re-centre at (cx,cy).
    const mapX = mobile
      ? (wx, wy) => cx + ((wx - rocket.x) * scale) * cosV - ((wy - rocket.y) * scale) * sinV
      : (wx, _wy) => cx + wx * scale;
    const mapY = mobile
      ? (wx, wy) => cy + ((wx - rocket.x) * scale) * sinV + ((wy - rocket.y) * scale) * cosV
      : (_wx, wy) => cy + wy * scale;
    // Where the sun/world-origin lands on the minimap — used as orbit centre
    const ox = mapX(0, 0);
    const oy = mapY(0, 0);

    // Orbits (centred on the sun at world origin)
    mctx.strokeStyle = 'rgba(125, 211, 252, 0.08)';
    mctx.lineWidth = 1;
    for (const pl of PLANETS) {
      if (pl.isSun || pl.isSecret) continue;
      const d = Math.hypot(pl.x, pl.y) * scale;
      mctx.beginPath();
      mctx.arc(ox, oy, d, 0, Math.PI * 2);
      mctx.stroke();
    }
    // Planets
    for (const pl of PLANETS) {
      if (pl.isSecret) continue;
      mctx.fillStyle = pl.color;
      mctx.beginPath();
      mctx.arc(mapX(pl.x, pl.y), mapY(pl.x, pl.y), pl.isSun ? 4 : 2.5, 0, Math.PI * 2);
      mctx.fill();
    }
    // Comet — small purple pulsing dot with micro-tail
    {
      const mcx = mapX(comet.x, comet.y);
      const mcy = mapY(comet.x, comet.y);
      const pulse2 = 0.7 + 0.3 * Math.sin(sunPulse * 5);
      // tiny tail — direction also rotates under mobile view
      const mback = comet.angle + Math.PI + vRot;
      mctx.strokeStyle = 'rgba(192, 132, 252, 0.5)';
      mctx.lineWidth = 1.2;
      mctx.beginPath();
      mctx.moveTo(mcx, mcy);
      mctx.lineTo(mcx + Math.cos(mback) * 8, mcy + Math.sin(mback) * 8);
      mctx.stroke();
      // head
      mctx.fillStyle = '#c084fc';
      mctx.shadowBlur = 8;
      mctx.shadowColor = '#c084fc';
      mctx.beginPath();
      mctx.arc(mcx, mcy, 2.2 * pulse2, 0, Math.PI * 2);
      mctx.fill();
      mctx.shadowBlur = 0;
    }
    // Rocket — distinct arrow + pulsing halo so it never looks like a planet.
    // In mobile rocket-up mode this lands exactly at (cx, cy).
    const rx = mapX(rocket.x, rocket.y);
    const ry = mapY(rocket.x, rocket.y);
    const pulse = 1 + 0.35 * Math.sin(sunPulse * 4);

    // Outer pulsing ring
    mctx.strokeStyle = 'rgba(125, 211, 252, 0.55)';
    mctx.lineWidth = 1.2;
    mctx.beginPath();
    mctx.arc(rx, ry, 7 * pulse, 0, Math.PI * 2);
    mctx.stroke();

    // Inner halo disc
    mctx.fillStyle = 'rgba(125, 211, 252, 0.18)';
    mctx.beginPath();
    mctx.arc(rx, ry, 6, 0, Math.PI * 2);
    mctx.fill();

    // Arrow — points where the rocket is flying.
    // Adding vRot composes with the mobile view rotation so the arrow always
    // renders as screen-up on mobile (rocket.angle + (-rocket.angle - π/2) = -π/2).
    mctx.save();
    mctx.translate(rx, ry);
    mctx.rotate(rocket.angle + vRot);
    mctx.shadowBlur = 10;
    mctx.shadowColor = '#7dd3fc';
    mctx.fillStyle = '#fb923c';
    mctx.strokeStyle = '#ffffff';
    mctx.lineWidth = 1;
    mctx.beginPath();
    mctx.moveTo(6, 0);
    mctx.lineTo(-4, -3.5);
    mctx.lineTo(-2, 0);
    mctx.lineTo(-4, 3.5);
    mctx.closePath();
    mctx.fill();
    mctx.stroke();
    mctx.shadowBlur = 0;
    mctx.restore();
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
