document.addEventListener('DOMContentLoaded', function() {
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');
  
  if (togglePassword && passwordField) {
      togglePassword.addEventListener('click', function() {
          // Toggle password visibility
          const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
          passwordField.setAttribute('type', type);
          
          // Toggle eye icon
          this.classList.toggle('fa-eye');
          this.classList.toggle('fa-eye-slash');
          
          // Maintain focus on password field
          passwordField.focus();
      });
  }
  
  //Handle login
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          try {
              const res = await fetch('/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password }),
              });
              
              const data = await res.json();
              
              if (res.ok) {
                  window.location.href = './index.html';
              } else {
                  alert(data.message || 'Login failed');
              }
          } catch (err) {
              console.error('Login error:', err);
              alert('Something went wrong. Please try again.');
          }
      });
  }
});

