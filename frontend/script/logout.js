// Health quotes array
const healthQuotes = [
  "Health is the greatest gift, contentment the greatest wealth.",
  "A healthy outside starts from the inside.",
  "The first wealth is health.",
  "Take care of your body. It's the only place you have to live.",
  "Healthy citizens are the greatest asset any country can have."
];

// Display random quote
document.addEventListener('DOMContentLoaded', () => {
  const quoteElement = document.getElementById('health-quote');
  const randomQuote = healthQuotes[Math.floor(Math.random() * healthQuotes.length)];
  quoteElement.textContent = `"${randomQuote}"`;
  
  // Redirect after 8 seconds if user doesn't click
  setTimeout(() => {
      window.location.href = 'landing-page.html';
  }, 8000);
});