// Add hover effects
document.querySelectorAll('.profile-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
      card.querySelector('.card-glow').style.opacity = '1';
  });
  
  card.addEventListener('mouseleave', () => {
      card.querySelector('.card-glow').style.opacity = '0';
  });
});