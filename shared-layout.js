async function loadSharedLayout() {
  const navbarTarget = document.getElementById('navbar');
  const footerTarget = document.getElementById('footer');

  if (navbarTarget) {
    const navRes = await fetch('navbar.html');
    navbarTarget.innerHTML = await navRes.text();
  }

  if (footerTarget) {
    const footRes = await fetch('footer.html');
    footerTarget.innerHTML = await footRes.text();
  }

  initSharedNavbar();
}

function initSharedNavbar() {
  const dropdown = document.getElementById('servicesDropdown');
  const toggle = dropdown ? dropdown.querySelector('.nav-drop-toggle') : null;
  const nav = document.querySelector('nav');
  const links = Array.from(document.querySelectorAll('.nav-link'));

  function currentPage() {
    const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    if (path.includes('contact')) return 'contact';
    if (path.includes('maintenance')) return 'maintenance';

    if (
      path.includes('bootcamp') ||
      path.includes('tops') ||
      path.includes('profit') ||
      path.includes('talent') ||
      path.includes('operations') ||
      path.includes('advisory')
    ) {
      return 'service-page';
    }

    return 'index';
  }

  function setActive(key) {
    links.forEach(link => {
      const section = link.dataset.section;
      link.classList.toggle('is-active', section === key);
    });
  }

  function clearActive() {
    links.forEach(link => link.classList.remove('is-active'));
  }

  function navOffset() {
    return (nav ? nav.offsetHeight : 80) + 16;
  }

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - navOffset();
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function getSectionTop(id) {
    const el = document.getElementById(id);
    return el ? el.offsetTop : Infinity;
  }

  const pageType = currentPage();

  if (toggle && dropdown) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth > 820) {
        if (pageType === 'index') {
          e.preventDefault();
          e.stopPropagation();

          dropdown.classList.remove('active');
          scrollToSection('services');
          setActive('services');
          return;
        }

        if (pageType === 'service-page') {
          e.preventDefault();
          e.stopPropagation();

          dropdown.classList.remove('active');
          setActive('services');
          return;
        }

        if (pageType === 'maintenance') {
          e.preventDefault();
          e.stopPropagation();

          dropdown.classList.remove('active');
          clearActive();
          return;
        }
      }
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }

  if (pageType === 'contact') {
    setActive('contact');
    return;
  }

  if (pageType === 'service-page') {
    setActive('services');
    return;
  }

  if (pageType === 'maintenance') {
    clearActive();
    return;
  }

  function updateActive() {
    const scrollPos = window.scrollY + navOffset() + 4;

    const topY = getSectionTop('top');
    const aboutY = getSectionTop('about');
    const servicesY = getSectionTop('services');
    const founderY = getSectionTop('founder');
    const resultsY = getSectionTop('results');

    let current = 'top';

    if (scrollPos >= resultsY) {
      current = 'results';
    } else if (scrollPos >= founderY) {
      current = 'about';
    } else if (scrollPos >= servicesY) {
      current = 'services';
    } else if (scrollPos >= aboutY) {
      current = 'about';
    } else if (scrollPos >= topY) {
      current = 'top';
    }

    setActive(current);
  }

  updateActive();

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  window.addEventListener('hashchange', updateActive);
}

document.addEventListener('DOMContentLoaded', loadSharedLayout);