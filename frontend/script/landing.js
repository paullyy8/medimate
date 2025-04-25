// Animate feature cards on scroll
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.animation = `slideInUp 0.6s ${entry.target.style.getPropertyValue('--delay') || '0s'} ease-out forwards`;
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });

  featureCards.forEach(card => observer.observe(card));

  // Counter animation
  const counters = document.querySelectorAll('.counter');
  const speed = 200;

  counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / speed;

      if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCounter, 1);
      } else {
          counter.innerText = target;
      }

      function updateCounter() {
          const count = +counter.innerText;
          if (count < target) {
              counter.innerText = Math.ceil(count + increment);
              setTimeout(updateCounter, 1);
          } else {
              counter.innerText = target;
          }
      }
  });

  // Add CSS for dynamic animation
  const style = document.createElement('style');
  style.textContent = `
      @keyframes slideInUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
      }
  `;
  document.head.appendChild(style);
});