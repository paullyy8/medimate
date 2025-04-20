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

// Symptom Analysis Feature
// Symptom Analysis Feature
document.querySelector('.feature-card[href="#symptom-checker"]').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('symptomModal').style.display = 'block';
  console.log("Modal opened"); // Debug log
});

// Close modal
document.querySelector('.modal .close').addEventListener('click', () => {
  document.getElementById('symptomModal').style.display = 'none';
});

// Form submission
document.getElementById('symptomForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("Form submitted"); // Debug log
  
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const symptoms = document.getElementById('symptoms').value;
  
  if (!age || !gender || !symptoms) {
    alert("Please fill all fields");
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Analyzing...";
  
  try {
    console.log("Sending request to server"); // Debug log
    const response = await fetch('/analyze-symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, age, gender })
    });
    
    const data = await response.json();
    console.log("Server response:", data); // Debug log
    
    const resultDiv = document.getElementById('symptomResult');
    
    if (data.success && data.diagnosis) {
      resultDiv.innerHTML = `
        <h3>Analysis Results:</h3>
        <div class="diagnosis-result">${formatDiagnosis(data.diagnosis)}</div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="error-message">${data.error || 'Analysis failed. Please try again.'}</div>
      `;
    }
  } catch (err) {
    console.error("Error:", err);
    document.getElementById('symptomResult').innerHTML = `
      <div class="error-message">Network error. Please check connection.</div>
    `;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Analyze";
  }
});

// Helper function to format diagnosis
function formatDiagnosis(text) {
  // First, normalize the text
  let cleaned = text
    .trim()
    .replace(/\n{2,}/g, '\n') // Reduce multiple newlines
    .replace(/\t/g, ' ')      // Replace tabs with spaces
    .replace(/ +/g, ' ');     // Reduce multiple spaces

  // Handle different response formats
  if (!text.includes('1.') && !text.includes('-')) {
    // If response doesn't follow expected format, wrap it in paragraphs
    return `<div class="diagnosis-text">${cleaned.replace(/\n/g, '</p><p>')}</p></div>`;
  }

  // Convert medical response to HTML
  cleaned = cleaned
    // Sections with headers
    .replace(/(Possible Conditions|Urgency Level|Recommended Actions|Red Flags|When to Seek Emergency Care):/g, '<h4>$1:</h4>')
    
    // Numbered conditions
    .replace(/(\d+)\.\s+(.*?)\s-\s(.*?)(\n|$)/g, '<div class="condition"><span class="condition-number">$1.</span> <strong>$2</strong> - $3</div>')
    
    // Bullet points
    .replace(/\n-\s(.*?)(\n|$)/g, '<li>$1</li>')
    .replace(/\n•\s(.*?)(\n|$)/g, '<li>$1</li>')
    
    // Urgency indicators
    .replace(/🟢/g, '<span class="urgency-mild">🟢</span>')
    .replace(/🟡/g, '<span class="urgency-moderate">🟡</span>')
    .replace(/🔴/g, '<span class="urgency-severe">🔴</span>')
    .replace(/❗/g, '<span class="warning-flag">⚠️</span>')
    
    // Final cleanup
    .replace(/\n/g, '<br>')
    .replace(/<li>.*?<\/li>/g, '<ul>$&</ul>');

  // Add disclaimer
  return `
    <div class="diagnosis-result">
      ${cleaned}
      <div class="medical-disclaimer">
        <p>Note: This AI analysis is not a substitute for professional medical advice.</p>
      </div>
    </div>
  `;
}

// Add to index.js
document.querySelector('.feature-card[href="#hospital-finder"]').addEventListener('click', (e) => {
  e.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      window.open(`https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`);
    }, () => {
      window.open("https://www.google.com/maps/search/hospitals");
    });
  } else {
    window.open("https://www.google.com/maps/search/hospitals");
  }
});

document.querySelector('.feature-card[href="#health-report"]').addEventListener('click', async (e) => {
  e.preventDefault();
  const age = prompt("Your age:");
  const activity = prompt("Activity level (sedentary/moderate/active):");
  const diet = prompt("Current diet (e.g., vegetarian, fast food):");
  const sleep = prompt("Sleep quality (good/fair/poor):");
  const stress = prompt("Stress level (low/medium/high):");
  
  if (age && activity && diet && sleep && stress) {
    try {
      const response = await fetch('/generate-health-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, activity, diet, sleep, stress })
      });
      const data = await response.json();
      alert("Your Health Plan:\n\n" + data.result.replace(/\n/g, '\n\n'));
    } catch (err) {
      alert("Failed to generate health plan");
    }
  }
});

});