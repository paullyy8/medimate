document.addEventListener("DOMContentLoaded", function() {
  // Define all DOM elements at the top
  const progressNumber = document.querySelectorAll(".step").length;
  const slidePage = document.querySelector(".slide-page");
  const submitBtn = document.querySelector(".submit");
  const progressText = document.querySelectorAll(".step p");
  const progressCheck = document.querySelectorAll(".step .check");
  const bullet = document.querySelectorAll(".step .bullet");
  const pages = document.querySelectorAll(".page");
  const nextButtons = document.querySelectorAll(".next-btn");
  const prevButtons = document.querySelectorAll(".prev-btn");
  const stepsNumber = pages.length;
  
  // Declare current at the top level so it's accessible everywhere
  let current = 1;

  // Initialize the multi-step form
  initMultiStepForm();

  function initMultiStepForm() {
      if (progressNumber !== stepsNumber) {
          console.warn(
              "Error, number of steps in progress bar do not match number of pages"
          );
      }

      document.documentElement.style.setProperty("--stepNumber", stepsNumber);

      // Initialize next buttons
      nextButtons.forEach(button => {
          button.addEventListener("click", function(event) {
              event.preventDefault();
              const inputsValid = validateInputs(this);

              if (inputsValid) {
                  slidePage.style.transform = `translateX(-${(100 / stepsNumber) * current}%)`;
                  bullet[current - 1].classList.add("active");
                  progressCheck[current - 1].classList.add("active");
                  progressText[current - 1].classList.add("active");
                  current += 1;
              }
          });
      });

      // Initialize previous buttons
      prevButtons.forEach(button => {
          button.addEventListener("click", function(event) {
              event.preventDefault();
              current -= 1;
              slidePage.style.transform = `translateX(-${(100 / stepsNumber) * (current - 1)}%)`;
              bullet[current - 1].classList.remove("active");
              progressCheck[current - 1].classList.remove("active");
              progressText[current - 1].classList.remove("active");
          });
      });

      // Submit handler
      submitBtn.addEventListener("click", handleSubmit);
  }

  async function handleSubmit(e) {
      e.preventDefault();
    
      const inputsValid = validateInputs(submitBtn);
      if (!inputsValid) return;
    
      const userData = {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          email: document.getElementById("email").value,
          phoneNumber: document.getElementById("phoneNumber").value,
          birthDate: document.getElementById("birthDate").value,
          gender: document.getElementById("gender").value,
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
      };
    
      try {
          submitBtn.disabled = true;
          submitBtn.textContent = "Registering...";
          
          const res = await fetch("/register", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
          });
    
          const data = await res.json();
          if (res.ok) {
              bullet[current - 1].classList.add("active");
              progressCheck[current - 1].classList.add("active");
              progressText[current - 1].classList.add("active");
    
              showSuccessMessage(userData.firstName);
          } else {
              alert(data.message || "Registration failed");
              submitBtn.disabled = false;
              submitBtn.textContent = "Submit";
          }
      } catch (err) {
          console.error("Registration error:", err);
          alert("Something went wrong!");
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
      }
  }

  function showSuccessMessage(firstName) {
      setTimeout(function() {
          document.querySelector(".container").innerHTML = `
              <div class="success-message">
                  <h2>✅ Thank you for registering, ${firstName}!</h2>
                  <p>Redirecting to login page...</p>
                  <div class="spinner"></div>
              </div>
          `;
          setTimeout(() => {
              window.location.href = "login.html";
          }, 2000);
      }, 800);
  }

  function validateInputs(buttonElement) {
      let inputsValid = true;
      let firstInvalid = null;

      const currentStep = buttonElement.closest(".page");
      const inputs = currentStep.querySelectorAll("input, select, textarea");
      
      inputs.forEach(input => {
          const valid = input.checkValidity();
          if (!valid) {
              inputsValid = false;
              input.classList.add("invalid-input");
              if (!firstInvalid) {
                  firstInvalid = input;
              }
          } else {
              input.classList.remove("invalid-input");
          }
      });

      if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return inputsValid;
  }
});