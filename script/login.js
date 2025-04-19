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
});