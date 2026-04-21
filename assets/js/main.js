const progressBar = document.getElementById("progressbar");
progressBar.style.height = 1 + "%";

window.onscroll = function () {
    const scroll = document.documentElement.scrollTop;
    const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (scroll / height) * 100;

    if (scrolled <= 1) {
        progressBar.style.height = 1 + "%";
    } else if (scrolled >= 2 && scrolled <= 99.9) {
        progressBar.style.height = scrolled + "%";
        progressBar.classList.remove("glow");
    } else if (scrolled === 100) {
        progressBar.style.height = scrolled + "%";
        // 		Do something when reached 100% scroll
        progressBar.classList.add("glow");
    }
};



/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active')
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    duration: 800,
    // delay: 20,
    // reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
sr.reveal('.home__social-icon', { interval: 200 });
sr.reveal('.skills__category, .project-popout, .contact__input', { interval: 200 });

function openChatbot() {
    document.getElementById('chatbotOverlay').style.display = 'flex';
}

function closeChatbot() {
    document.getElementById('chatbotOverlay').style.display = 'none';
}

document.querySelectorAll('.project-popout').forEach(project => {
    project.addEventListener('click', function (event) {
        // Don't re-trigger while this card's overlay is already open.
        const overlay = this.querySelector('.project-popout-overlay');
        if (overlay.classList.contains('active')) return;

        event.stopPropagation(); // Prevent triggering document click event

        // IMPORTANT: Neutralize the card's 3D tilt + will-change BEFORE the
        // overlay becomes visible. Otherwise `position: fixed` on the overlay
        // resolves to the still-transformed card's coordinate system for one
        // frame — which looks like the popup opening "inside the tile" and
        // then jumping to the center.
        this.style.transform = 'none';
        this.style.willChange = 'auto';
        const glare = this.querySelector('.project-glare');
        if (glare) glare.style.background = 'none';

        // Force a synchronous layout pass so the containing-block change
        // is committed before the animation starts.
        void this.offsetWidth;

        // Activate on the next frame so the browser has painted the
        // neutralized card first; the overlay's scale animation then runs
        // cleanly from the centered viewport position.
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            document.body.classList.add('popout-open');
        });
    });
});

/**
 * Clear the inline `transform`/`will-change` we applied to each card when
 * opening its overlay, so the 3D tilt is free to take over again on the
 * next hover.
 */
function resetCardInlineStyles() {
    document.querySelectorAll('.project-popout').forEach(card => {
        card.style.transform = '';
        card.style.willChange = '';
    });
}

function closeOverlay(event) {
    event.stopPropagation(); // Prevent triggering document click event
    const overlay = event.currentTarget.closest('.project-popout-overlay');
    overlay.classList.remove('active');
    if (!document.querySelector('.project-popout-overlay.active')) {
        document.body.classList.remove('popout-open');
        resetCardInlineStyles();
    }
}

// Close the overlay when clicking outside of it (including the new backdrop)
document.addEventListener('click', function (event) {
    if (!event.target.closest('.project-popout-overlay') &&
        !event.target.closest('.project-popout')) {
        document.querySelectorAll('.project-popout-overlay.active').forEach(overlay => {
            overlay.classList.remove('active');
        });
        document.body.classList.remove('popout-open');
        resetCardInlineStyles();
    }
});

// Dismiss with the Escape key for accessibility
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const openOverlays = document.querySelectorAll('.project-popout-overlay.active');
        if (openOverlays.length) {
            openOverlays.forEach(ov => ov.classList.remove('active'));
            document.body.classList.remove('popout-open');
            resetCardInlineStyles();
        }
    }
});
