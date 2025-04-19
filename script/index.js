// Dynamic Tips
const tips = [
  "Crush medication packets before disposal to prevent misuse by animals.",
  "Use digital prescriptions when possible to reduce paper waste.",
  "Return unused medicines to pharmacies for proper disposal.",
  "Opt for glass medicine bottles which are more recyclable than plastic.",
  "Walk to nearby clinics when possible for eco-friendly healthcare access."
];

document.addEventListener('DOMContentLoaded', () => {
  // Rotate eco tip
  const tipElement = document.querySelector('.eco-tip p');
  if (tipElement) {
      tipElement.textContent = `"${tips[Math.floor(Math.random() * tips.length)]}"`;
  }

  // Set random health status (demo only - replace with real data)
  const healthStatus = document.querySelector('.health-status');
  if (healthStatus) {
      const statuses = ["good", "medium", "caution"];
      healthStatus.setAttribute('data-status', statuses[Math.floor(Math.random() * statuses.length)]);
  }
});