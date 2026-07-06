// Rachell Allen Executive Proposal Interactive Features

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollAnimations();
  initWorkflowInteractive();
  initProgressRadial();
  initRoiCalculator();
  initCardSpotlight();
  initThemeToggle();
});

// Sticky Header & Navigation Tracker
function initStickyHeader() {
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    // Glassmorphism sticky behavior
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Progress Bar Indicator
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const pBar = document.querySelector('.progress-bar');
    if (pBar) pBar.style.width = scrolled + '%';

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Mobile Hamburger Navigation Drawer
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBtn.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Auto-close menu when a navigation item is selected
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  // Close when clicking outside of the active sidebar drawer area
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleBtn.classList.remove('active');
      nav.classList.remove('open');
    }
  });
}

// Intersection Observer for scroll-triggered fade-ups
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up-element');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// Vision Workflow Node Selection
function initWorkflowInteractive() {
  const nodes = document.querySelectorAll('.flow-node');
  const descBox = document.querySelector('.flow-description-box');
  
  if (!descBox) return;

  const workflows = {
    website: {
      title: '1. Brand Website (Initial Touchpoint)',
      description: 'A modern, high-speed UX replacing the Wix storefront. Drives traffic with optimized SEO, curated HSL brand visuals, fast page load layouts (< 2s), and clear geographic licensing program paths.'
    },
    crm: {
      title: '2. Integrated CRM Pipeline',
      description: 'Enables counselor tracking via an automated Kanban pipeline. Registrant details flow from inquiry through to counselor notes, follow-up scheduling, and stage updates, eliminating spreadsheets.'
    },
    enrollment: {
      title: '3. Digital Payment & Verification',
      description: 'Secures and automates student verification. Students upload receipt images directly to host files; counselors verify and click to enroll, creating structured enrollment logs immediately.'
    },
    automation: {
      title: '4. Automated Communication',
      description: 'Automatically dispatches enrollment packets, syllabus handbooks, receipts, and welcome schedules. Includes robust error log queues and background delivery workers.'
    },
    portal: {
      title: '5. Student Portal Access',
      description: 'A self-service hub where authenticated students download course materials, retrieve active live webinars, check localized physical classes schedules, and manage registrations.'
    },
    lms: {
      title: '6. Future Learning Management System (LMS)',
      description: 'Designed as a scalable next phase. Integrates mock examination simulations, interactive flashcards, video streaming reviews, progress trackers, and direct coach feedback systems.'
    }
  };

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      
      const type = node.dataset.step;
      const data = workflows[type];
      
      if (data) {
        // Fade out/in description box text
        descBox.style.opacity = 0;
        descBox.style.transform = 'translateY(5px)';
        
        setTimeout(() => {
          descBox.innerHTML = `
            <h3 style="color: var(--text-primary-dark); margin-bottom: 10px; font-family: var(--font-headings); font-size: 1.3rem;">${data.title}</h3>
            <p style="color: var(--text-secondary-dark); line-height: 1.6; font-size: 1.05rem;">${data.description}</p>
          `;
          descBox.style.opacity = 1;
          descBox.style.transform = 'translateY(0)';
        }, 200);
      }
    });
  });
}

// Milestones circular progress tracker triggers on visibility
function initProgressRadial() {
  const progressSection = document.querySelector('.progress');
  const circleFill = document.querySelector('.progress-circle-fill');
  
  if (!progressSection || !circleFill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Dasharray is 628. 55% completion = 55% of the circle is filled.
        // Dashoffset should be: 628 * (1 - 0.55) = 282.6
        circleFill.style.strokeDashoffset = '282.6';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  observer.observe(progressSection);
}

// Executive ROI Calculator
function initRoiCalculator() {
  const hoursSlider = document.getElementById('calc-hours');
  const rateSlider = document.getElementById('calc-rate');
  const hoursVal = document.getElementById('val-hours');
  const rateVal = document.getElementById('val-rate');
  const annualSavingsText = document.getElementById('calc-savings');
  const wixCostBreakdown = document.getElementById('calc-wix-breakdown');
  const proposedCostBreakdown = document.getElementById('calc-proposed-breakdown');

  if (!hoursSlider || !rateSlider) return;

  function calculateROI() {
    const hours = parseInt(hoursSlider.value);
    const rate = parseInt(rateSlider.value);

    hoursVal.textContent = hours;
    rateVal.textContent = `$${rate}`;

    // Wix Costings
    // Wix Subscriptions + supplementary tools (email, database tools, CRM integrations) = ~$1,200/yr
    // Weekly manual operation hours transformed to annual labor cost
    const wixTools = 1200;
    const manualLaborCost = hours * rate * 52;
    const totalCurrentWixCost = wixTools + manualLaborCost;

    // Proposed Costings
    // Hosting + SMTP services + secure backup + minor server overheads = ~$360/yr
    // Automation saves 85% of manual labor time (reduces labor costs to 15%)
    const proposedHosting = 360;
    const proposedLaborCost = manualLaborCost * 0.15;
    const totalProposedCost = proposedHosting + proposedLaborCost;

    // Annual ROI Savings
    const savings = Math.max(0, totalCurrentWixCost - totalProposedCost);

    // Format numbers as currency
    wixCostBreakdown.textContent = `$${totalCurrentWixCost.toLocaleString()}/yr`;
    proposedCostBreakdown.textContent = `$${totalProposedCost.toLocaleString()}/yr`;
    annualSavingsText.textContent = `$${savings.toLocaleString()}`;
  }

  hoursSlider.addEventListener('input', calculateROI);
  rateSlider.addEventListener('input', calculateROI);

  // Initialize
  calculateROI();
}

// Hover cursor spotlight reflection for modern grids
function initCardSpotlight() {
  const cards = document.querySelectorAll('.card-base');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Theme Switcher Controller
function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  // Retrieve saved theme or default to light theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
