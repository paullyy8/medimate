initMultiStepForm();

function initMultiStepForm() {
    const progressNumber = document.querySelectorAll(".step").length;
    const slidePage = document.querySelector(".slide-page");
    const submitBtn = document.querySelector(".submit");
    const progressText = document.querySelectorAll(".step p");
    const progressCheck = document.querySelectorAll(".step .check");
    const bullet = document.querySelectorAll(".step .bullet");
    const pages = document.querySelectorAll(".page");
    const stepsNumber = pages.length;

    if (progressNumber !== stepsNumber) {
        console.warn(
            "Error, number of steps in progress bar do not match number of pages"
        );
    }

    document.documentElement.style.setProperty("--stepNumber", stepsNumber);

    let current = 1;

    for (let i = 0; i < nextButtons.length; i++) {
        nextButtons[i].addEventListener("click", function (event) {
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
    }

    for (let i = 0; i < prevButtons.length; i++) {
        prevButtons[i].addEventListener("click", function (event) {
            event.preventDefault();
            current -= 1;
            slidePage.style.transform = `translateX(-${(100 / stepsNumber) * (current - 1)}%)`;
            bullet[current - 1].classList.remove("active");
            progressCheck[current - 1].classList.remove("active");
            progressText[current - 1].classList.remove("active");
        });
    }

    submitBtn.addEventListener("click", function () {
        const inputsValid = validateInputs(this);

        if (inputsValid) {
            submitBtn.disabled = true;

            bullet[current - 1].classList.add("active");
            progressCheck[current - 1].classList.add("active");
            progressText[current - 1].classList.add("active");

            current += 1;
            setTimeout(function () {
                document.querySelector(".container").innerHTML = `
                    <h2 style="color: #330867; font-size: 28px;">✅ Thank you for registering!</h2>
                    <p style="margin-top: 15px; font-size: 18px;">Your form has been successfully submitted.</p>
                `;
            }, 800);
        }
    });

    function validateInputs(ths) {
        let inputsValid = true;
        let firstInvalid = null;

        const inputs = ths.parentElement.parentElement.querySelectorAll("input, select, textarea");
        for (let i = 0; i < inputs.length; i++) {
            const valid = inputs[i].checkValidity();
            if (!valid) {
                inputsValid = false;
                inputs[i].classList.add("invalid-input");
                if (!firstInvalid) {
                    firstInvalid = inputs[i];
                }
            } else {
                inputs[i].classList.remove("invalid-input");
            }
        }

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return inputsValid;
    }
}