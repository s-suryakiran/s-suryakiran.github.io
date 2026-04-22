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
        <p class="label">Analyst, Software Engineer · ex-MLE · New York</p>
        <p>You’ve just entered my galactic portfolio. Each orbiting world holds a part of my story — about me, my toolkit, my projects, my experience.</p>
        <p>Point your rocket, burn thrusters, and land on any planet to read. The sun you’re standing on? That’s me. Call me <b>Surya</b>.</p>
        <ul>
          <li><b>Analyst, Software Engineer</b> @ Goldman Sachs — since Sep 2024</li>
          <li><b>M.S. Computer Science</b> @ NYU Courant · May 2024</li>
          <li><b>Ex-MLE</b> @ Tiger Analytics · lead founding engineer on a no-code DS platform</li>
          <li>From Madurai 🌴 → New York 🗽 · into LLMs, distributed systems, and the cosmos 🪐</li>
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
        <p>I'm a guy fascinated by the endless possibilities of technology. My journey started in the vibrant city of <b>Madurai, India</b>, and now I'm navigating the exciting tech landscape of <b>New York</b>.</p>
        <p>Today I'm an <b>Analyst, Software Engineer at Goldman Sachs</b>, building a risk-analysis platform that handles <b>16M+ daily requests</b> at <b>99.99% uptime</b>. Before this I finished my <b>M.S. in Computer Science at NYU's Courant Institute</b>, where I also TA'd four courses across computer vision, probability, and linear algebra.</p>
        <p>Before the US I was a <b>Machine Learning Engineer at Tiger Analytics</b>, where I was the lead founding engineer on a no-code data-science platform — a project I still talk about with my hands.</p>
        <h3>What gets me up in the morning</h3>
        <p>Puzzles. Especially the ones that involve data, code, and real-world constraints. Some days I'm knee-deep in a model; other days I'm wiring together distributed services. The thrill of turning complex issues into elegant, user-friendly solutions is what keeps me going.</p>
        <h3>Recently</h3>
        <p>I've been exploring <b>Large Language Models</b> and how they're reshaping AI — retrieval systems, vision-language integrations, efficient inference. A bit of a tech Swiss Army knife, always ready for the next challenge.</p>
        <p>If you're into the latest AI trends, need a hand on a software project, or just want to talk tech over coffee — beam a message from Neptune. Let's make something awesome together.</p>

        <h3>The journey so far</h3>
        <p class="label">Madurai → Singapore → Chennai → Raleigh → New York</p>
        <svg viewBox="0 0 500 230" style="width:100%;height:auto;display:block;background:linear-gradient(180deg,rgba(10,12,30,0.7),rgba(5,7,20,0.9));border:1px solid rgba(125,211,252,0.2);border-radius:6px;margin-top:0.6rem" aria-label="Map showing Suryakiran's career journey">
          <defs>
            <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fb923c" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#fb923c" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <!-- lat/lon grid -->
          <g stroke="rgba(125,211,252,0.08)" stroke-width="0.6" fill="none">
            <line x1="0" y1="115" x2="500" y2="115"/>
            <line x1="0" y1="57" x2="500" y2="57"/>
            <line x1="0" y1="172" x2="500" y2="172"/>
            <line x1="125" y1="0" x2="125" y2="230"/>
            <line x1="250" y1="0" x2="250" y2="230"/>
            <line x1="375" y1="0" x2="375" y2="230"/>
          </g>
          <!-- continent silhouettes (very simplified — just hinting) -->
          <g fill="rgba(125,211,252,0.06)" stroke="rgba(125,211,252,0.18)" stroke-width="0.6">
            <!-- North America -->
            <path d="M50,40 L160,36 L170,90 L150,110 L110,105 L95,90 L70,80 Z"/>
            <!-- South America -->
            <path d="M140,115 L170,118 L172,175 L150,180 L138,150 Z"/>
            <!-- Europe/Africa -->
            <path d="M235,45 L290,48 L295,170 L270,185 L245,170 L238,90 Z"/>
            <!-- Asia -->
            <path d="M300,35 L420,40 L430,90 L400,110 L370,108 L340,100 L310,80 Z"/>
            <!-- Australia -->
            <path d="M400,150 L440,152 L438,175 L408,176 Z"/>
          </g>
          <!-- route -->
          <path d="M358,107 L394,118 L361,102 L141,72 L147,66" fill="none" stroke="#7dd3fc" stroke-width="1.6" stroke-dasharray="5 5" stroke-linecap="round" opacity="0.85">
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.4s" repeatCount="indefinite"/>
          </path>
          <!-- pins -->
          <g>
            <circle cx="358" cy="107" r="10" fill="url(#pinGlow)"/>
            <circle cx="394" cy="118" r="10" fill="url(#pinGlow)"/>
            <circle cx="361" cy="102" r="10" fill="url(#pinGlow)"/>
            <circle cx="141" cy="72" r="10" fill="url(#pinGlow)"/>
            <circle cx="147" cy="66" r="12" fill="url(#pinGlow)"/>
            <circle cx="358" cy="107" r="3.2" fill="#fb923c" stroke="#fff" stroke-width="0.8"/>
            <circle cx="394" cy="118" r="3.2" fill="#fb923c" stroke="#fff" stroke-width="0.8"/>
            <circle cx="361" cy="102" r="3.2" fill="#fb923c" stroke="#fff" stroke-width="0.8"/>
            <circle cx="141" cy="72" r="3.2" fill="#fb923c" stroke="#fff" stroke-width="0.8"/>
            <circle cx="147" cy="66" r="4" fill="#7dd3fc" stroke="#fff" stroke-width="1"/>
          </g>
          <!-- labels -->
          <g fill="#e8ecff" font-family="'JetBrains Mono', monospace" font-size="8.5">
            <text x="358" y="128" text-anchor="middle">Madurai</text>
            <text x="358" y="139" text-anchor="middle" fill="rgba(232,236,255,0.55)" font-size="7">home · college</text>
            <text x="400" y="137" text-anchor="start">Singapore</text>
            <text x="400" y="147" text-anchor="start" fill="rgba(232,236,255,0.55)" font-size="7">NUS · HPE '19</text>
            <text x="361" y="95" text-anchor="middle">Chennai</text>
            <text x="361" y="86" text-anchor="middle" fill="rgba(232,236,255,0.55)" font-size="7">Tiger Analytics '21</text>
            <text x="141" y="60" text-anchor="middle">Raleigh</text>
            <text x="141" y="51" text-anchor="middle" fill="rgba(232,236,255,0.55)" font-size="7">Promantus '23</text>
            <text x="153" y="58" text-anchor="start" fill="#7dd3fc">New York</text>
            <text x="153" y="47" text-anchor="start" fill="rgba(125,211,252,0.7)" font-size="7">NYU · Goldman · now</text>
          </g>
        </svg>
        <p style="color:var(--ink-dim);font-size:0.85rem;margin-top:0.4rem">Five cities, three continents, one extremely patient suitcase.</p>
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

        <h3>Analyst, Software Engineer — Goldman Sachs <span style="color:var(--ink-dim);font-weight:400;font-size:0.85rem">· Sep 2024 → Present · New York</span></h3>
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
          <li><b>Origin story</b> — grew up in <b>Madurai, India</b>; now navigating the NYC tech scene. Native in English and Tamil.</li>
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
   ___ _   _ ___ __   __ _   _  _____
  / __| | | |  _ \\ \\ / /| | | |/ /_\\
  \\__ \\ |_| | |_) \\ V / | |_| / / _ \\
  |___/\\___/|  __/ |_|  |____/_/\\_\\_\\
            |_|   made this whole thing</pre>
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
  });

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
Madurai → Singapore → Chennai → Raleigh → <span class="ok">New York</span>
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
  }
  function closePanel() {
    panel.classList.add('hidden');
    panelOpen = false;
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
        for (let i = 0; i < (rocket.boosting ? 3 : 2); i++) spawnThrustParticle();
      }
      // Reverse (S/Down) — gentle brake
      if (keys.down || stickReverse > 0) {
        rocket.vx -= Math.cos(rocket.angle) * 140 * dt * (stickReverse || 1);
        rocket.vy -= Math.sin(rocket.angle) * 140 * dt * (stickReverse || 1);
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

    // Label (only when camera is roughly nearby)
    const dCam = Math.hypot(comet.x - camera.x, comet.y - camera.y);
    if (dCam < 1600) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#c084fc';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('/NOW', comet.x, comet.y - comet.r - 14);
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
      if (pl.isSun || pl.isSecret) continue;
      const d = Math.hypot(pl.x, pl.y) * scale;
      mctx.beginPath();
      mctx.arc(cx, cy, d, 0, Math.PI * 2);
      mctx.stroke();
    }
    // Planets
    for (const pl of PLANETS) {
      if (pl.isSecret) continue;
      mctx.fillStyle = pl.color;
      mctx.beginPath();
      mctx.arc(cx + pl.x * scale, cy + pl.y * scale, pl.isSun ? 4 : 2.5, 0, Math.PI * 2);
      mctx.fill();
    }
    // Comet — small purple pulsing dot with micro-tail
    {
      const mcx = cx + comet.x * scale;
      const mcy = cy + comet.y * scale;
      const pulse2 = 0.7 + 0.3 * Math.sin(sunPulse * 5);
      // tiny tail
      const mback = comet.angle + Math.PI;
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
    // Rocket — distinct arrow + pulsing halo so it never looks like a planet
    const rx = cx + rocket.x * scale;
    const ry = cy + rocket.y * scale;
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

    // Arrow — points where the rocket is flying
    mctx.save();
    mctx.translate(rx, ry);
    mctx.rotate(rocket.angle);
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
