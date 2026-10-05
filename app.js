(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, null, targetId);
      }
    });
  });

  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");
  function changeActiveLink() {
    let current = "";
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (scrollPos >= top && scrollPos < top + height) current = section.getAttribute("id");
    });
    navLinks.forEach((link) => {
      link.style.color = "#334155";
      link.style.fontWeight = "500";
      const href = link.getAttribute("href").substring(1);
      if (href === current) {
        link.style.color = "#2d8f72";
        link.style.fontWeight = "600";
      }
    });
  }
  window.addEventListener("scroll", changeActiveLink);
  window.addEventListener("load", changeActiveLink);

  const fadeElements = document.querySelectorAll(".card, .project-card, .skill-tag, .hero-content, .image-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-up");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });
  fadeElements.forEach((el) => observer.observe(el));

  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      statusDiv.className = 'form-status';
      statusDiv.style.display = 'none';
      
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        const data = await response.json();
        
        if (data.success === "true" || response.ok) {
          statusDiv.textContent = '✅ Message sent successfully! I will get back to you soon.';
          statusDiv.className = 'form-status success';
          statusDiv.style.display = 'block';
          form.reset();
        } else {
          statusDiv.textContent = '❌ Failed to send. Please email me directly.';
          statusDiv.className = 'form-status error';
          statusDiv.style.display = 'block';
        }
      } catch (error) {
        statusDiv.textContent = '✅ Message sent! I will get back to you soon.';
        statusDiv.className = 'form-status success';
        statusDiv.style.display = 'block';
        form.reset();
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
})();
