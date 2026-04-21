/*
 * three-scenes.js
 * --------------------------------------------------------------
 * Three.js powered enhancements for the portfolio:
 *   1. Hero background  – rotating torus-knot lattice + particle
 *                         constellation with mouse parallax
 *   2. Skills 3D globe  – drag-to-rotate sphere of tech tag sprites
 *   3. Project tilt     – pointer-tracked 3D tilt + glare on cards
 *
 * All scenes pause automatically when their section is off-screen.
 * Requires THREE (loaded via CDN in index.html).
 * --------------------------------------------------------------
 */
(function () {
    'use strict';

    // Shared accent palette (matches the site's blue with purple/cyan/pink accents).
    var COLORS = {
        blue: 0x3E6FF4,
        cyan: 0x00E5FF,
        purple: 0x8B5CF6,
        pink: 0xEC4899
    };

    // Detect small / low-power screens so we can reduce particle counts
    // and geometry detail for better mobile performance.
    function isSmallScreen() {
        return window.innerWidth < 768 ||
               (window.matchMedia &&
                window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    }

    /* ============================================================
     * 1. HERO BACKGROUND
     * ============================================================ */
    function initHero() {
        var canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            60,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            1000
        );
        camera.position.set(0, 0, 42);

        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        function resize() {
            var w = canvas.clientWidth;
            var h = canvas.clientHeight;
            if (w === 0 || h === 0) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);
        // ResizeObserver catches layout changes that don't fire a window
        // resize (e.g. the hero section growing to fill 100vh after
        // stylesheet load, or fonts affecting layout).
        if ('ResizeObserver' in window) {
            new ResizeObserver(resize).observe(canvas);
        }
        // Also re-check once the page is fully loaded in case initial
        // layout ran before CSS was applied.
        window.addEventListener('load', resize);

        // Adaptive detail: lower-res geometry + fewer particles on mobile.
        var mobile = isSmallScreen();

        // Outer wireframe knot
        var outerKnot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(8.5, 2.2, mobile ? 120 : 220, mobile ? 20 : 32),
            new THREE.MeshBasicMaterial({
                color: COLORS.blue,
                wireframe: true,
                transparent: true,
                opacity: 0.55
            })
        );
        scene.add(outerKnot);

        // Inner cyan knot for depth
        var innerKnot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(6, 1.4, mobile ? 100 : 180, mobile ? 14 : 22),
            new THREE.MeshBasicMaterial({
                color: COLORS.cyan,
                wireframe: true,
                transparent: true,
                opacity: 0.35
            })
        );
        scene.add(innerKnot);

        // Particle constellation (fewer particles on mobile)
        var PARTICLES = mobile ? 320 : 700;
        var positions = new Float32Array(PARTICLES * 3);
        var colors = new Float32Array(PARTICLES * 3);
        var palette = [
            new THREE.Color(COLORS.blue),
            new THREE.Color(COLORS.purple),
            new THREE.Color(COLORS.cyan),
            new THREE.Color(COLORS.pink)
        ];

        for (var i = 0; i < PARTICLES; i++) {
            // Spherical shell distribution
            var r = 18 + Math.random() * 28;
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            var c = palette[i % palette.length];
            colors[i * 3]     = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        var particleGeom = new THREE.BufferGeometry();
        particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var particles = new THREE.Points(
            particleGeom,
            new THREE.PointsMaterial({
                size: 0.2,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        scene.add(particles);

        // Mouse parallax – smoothed via lerp
        var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        window.addEventListener('mousemove', function (e) {
            mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        var isVisible = true;
        var clock = new THREE.Clock();

        (function animate() {
            requestAnimationFrame(animate);
            if (!isVisible) return;

            var t = clock.getElapsedTime();
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            outerKnot.rotation.x = t * 0.15;
            outerKnot.rotation.y = t * 0.20;

            innerKnot.rotation.x = -t * 0.25;
            innerKnot.rotation.z = t * 0.18;

            particles.rotation.y = t * 0.04;
            particles.rotation.x = Math.sin(t * 0.1) * 0.12;

            camera.position.x = mouse.x * 3.5;
            camera.position.y = -mouse.y * 3.5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        })();

        // Canvas is fixed to the viewport and shows behind every section,
        // so we don't pause on scroll. Instead, pause only when the tab
        // is hidden (saves battery / CPU).
        document.addEventListener('visibilitychange', function () {
            isVisible = !document.hidden;
        });
    }

    /* ============================================================
     * 2. SKILLS 3D GLOBE
     * ============================================================ */
    function initSkillsGlobe() {
        var container = document.getElementById('skills-globe');
        if (!container) return;

        var tags = [
            'Python', 'C++', 'Java', 'Go', 'JavaScript',
            'React', 'Node.js', 'Flask', 'Django', 'FastAPI',
            'PyTorch', 'TensorFlow', 'OpenCV', 'Pandas', 'NumPy',
            'MySQL', 'MongoDB', 'PostgreSQL', 'Azure', 'Docker',
            'GitHub', 'Spark', 'Tableau', 'HTML', 'CSS', 'PHP'
        ];

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.z = 13;

        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        function resize() {
            var w = container.clientWidth;
            var h = container.clientHeight || w;
            if (w === 0) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);
        if ('ResizeObserver' in window) {
            new ResizeObserver(resize).observe(container);
        }
        window.addEventListener('load', resize);

        var group = new THREE.Group();
        scene.add(group);

        // Wireframe icosahedron core
        var core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(4, 1),
            new THREE.MeshBasicMaterial({
                color: COLORS.blue,
                wireframe: true,
                transparent: true,
                opacity: 0.25
            })
        );
        group.add(core);

        // Inner glowing sphere
        var innerGlow = new THREE.Mesh(
            new THREE.SphereGeometry(3.2, 24, 16),
            new THREE.MeshBasicMaterial({
                color: COLORS.purple,
                transparent: true,
                opacity: 0.08
            })
        );
        group.add(innerGlow);

        // Build a text sprite via 2D canvas (gives us crisp, glowing labels)
        function makeTextSprite(text, cssColor) {
            var cvs = document.createElement('canvas');
            cvs.width = 512;
            cvs.height = 128;
            var ctx = cvs.getContext('2d');
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.shadowColor = cssColor;
            ctx.shadowBlur = 18;
            ctx.fillStyle = cssColor;
            ctx.font = 'bold 64px Poppins, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, cvs.width / 2, cvs.height / 2);

            var tex = new THREE.CanvasTexture(cvs);
            tex.needsUpdate = true;

            var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: tex,
                transparent: true,
                depthTest: true
            }));
            sprite.scale.set(2.8, 0.7, 1);
            return sprite;
        }

        // Fibonacci distribution places tags evenly across the sphere
        var radius = 5.2;
        var N = tags.length;
        var gr = (1 + Math.sqrt(5)) / 2; // golden ratio
        var cssPalette = ['#3E6FF4', '#00E5FF', '#8B5CF6', '#EC4899'];

        tags.forEach(function (tag, i) {
            var y = 1 - (i / Math.max(N - 1, 1)) * 2;
            var rAtY = Math.sqrt(1 - y * y);
            var theta = 2 * Math.PI * i / gr;
            var x = Math.cos(theta) * rAtY;
            var z = Math.sin(theta) * rAtY;

            var sprite = makeTextSprite(tag, cssPalette[i % cssPalette.length]);
            sprite.position.set(x * radius, y * radius, z * radius);
            group.add(sprite);
        });

        // Drag-to-rotate state
        var isDragging = false;
        var lastX = 0, lastY = 0;
        var targetRotX = 0, targetRotY = 0;
        var rotX = 0, rotY = 0;

        function onDragStart(x, y) {
            isDragging = true;
            lastX = x;
            lastY = y;
        }
        function onDragMove(x, y) {
            if (!isDragging) return;
            var dx = x - lastX;
            var dy = y - lastY;
            targetRotY += dx * 0.01;
            targetRotX += dy * 0.01;
            lastX = x;
            lastY = y;
        }
        function onDragEnd() { isDragging = false; }

        renderer.domElement.addEventListener('mousedown', function (e) {
            onDragStart(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', function (e) {
            onDragMove(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', onDragEnd);

        renderer.domElement.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                onDragStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        window.addEventListener('touchmove', function (e) {
            if (isDragging && e.touches.length === 1) {
                onDragMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        window.addEventListener('touchend', onDragEnd);

        var isVisible = true;
        (function animate() {
            requestAnimationFrame(animate);
            if (!isVisible) return;

            if (!isDragging) {
                targetRotY += 0.0038;      // subtle auto-rotate
                targetRotX += 0.00015;
            }
            rotX += (targetRotX - rotX) * 0.08;
            rotY += (targetRotY - rotY) * 0.08;
            group.rotation.x = rotX;
            group.rotation.y = rotY;

            renderer.render(scene, camera);
        })();

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (e) { isVisible = e.isIntersecting; });
            }, { threshold: 0 }).observe(container);
        }
    }

    /* ============================================================
     * 3. PROJECT CARD 3D TILT
     * ============================================================ */
    function initProjectTilt() {
        var cards = document.querySelectorAll('.project-popout');
        if (!cards.length) return;

        cards.forEach(function (card) {
            // Glare overlay
            var glare = document.createElement('div');
            glare.className = 'project-glare';
            card.appendChild(glare);

            // Track movement via rAF to stay smooth
            var pending = false;
            var targetX = 0, targetY = 0, glareX = 50, glareY = 50, active = false;

            // Skip tilt while this card's popout overlay is open.
            // Any ancestor with `transform`/`will-change: transform` becomes
            // the containing block for `position: fixed` descendants, which
            // breaks the fullscreen popout.
            function overlayIsOpen() {
                var ov = card.querySelector('.project-popout-overlay');
                return !!(ov && ov.classList.contains('active'));
            }

            card.addEventListener('mousemove', function (e) {
                if (overlayIsOpen()) return;
                var rect = card.getBoundingClientRect();
                var px = (e.clientX - rect.left) / rect.width;
                var py = (e.clientY - rect.top) / rect.height;
                targetX = (py - 0.5) * -14; // rotateX (tilt toward cursor)
                targetY = (px - 0.5) * 14;  // rotateY
                glareX = px * 100;
                glareY = py * 100;
                active = true;
                if (!pending) {
                    pending = true;
                    requestAnimationFrame(apply);
                }
            });

            card.addEventListener('mouseleave', function () {
                active = false;
                card.style.transform = '';
                glare.style.background = 'none';
            });

            // Clicking opens the popout — clear any in-flight tilt
            // immediately so the overlay renders at the right spot
            // even before `.active` is applied.
            card.addEventListener('click', function () {
                active = false;
                card.style.transform = '';
                glare.style.background = 'none';
            });

            function apply() {
                pending = false;
                if (!active || overlayIsOpen()) return;
                card.style.transform =
                    'perspective(900px) rotateX(' + targetX + 'deg) rotateY(' + targetY + 'deg) scale3d(1.03,1.03,1.03)';
                glare.style.background =
                    'radial-gradient(circle at ' + glareX + '% ' + glareY + '%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)';
            }
        });
    }

    /* ============================================================
     * INIT
     * ============================================================ */
    function init() {
        if (typeof THREE === 'undefined') {
            console.warn('[three-scenes] THREE is not available – skipping 3D scenes.');
            return;
        }
        try { initHero(); } catch (err) { console.error('[hero]', err); }
        try { initSkillsGlobe(); } catch (err) { console.error('[skills-globe]', err); }
        try { initProjectTilt(); } catch (err) { console.error('[project-tilt]', err); }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
