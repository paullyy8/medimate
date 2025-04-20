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
  
  document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Explicitly ask for JSON
        },
      });
  
      // First check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Didn't receive JSON");
      }
  
      const data = await response.json();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login.html';
      
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login.html'; 
    }
  });
});