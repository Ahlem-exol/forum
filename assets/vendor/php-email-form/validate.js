(function () {
  "use strict";

  let forms = document.querySelectorAll(".php-email-form");

  forms.forEach(function (e) {
    e.addEventListener("submit", function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute("action");
      let recaptcha = thisForm.getAttribute("data-recaptcha-site-key");

      if (!action) {
        displayError(
          thisForm,
          "L'attribut action du formulaire n'est pas défini !"
        );
        return;
      }

      thisForm.querySelector(".loading").classList.add("d-block");
      thisForm.querySelector(".error-message").classList.remove("d-block");
      thisForm.querySelector(".sent-message").classList.remove("d-block");

      let formData = new FormData(thisForm);

      // Set a timeout for the form submission
      let timeout = setTimeout(function () {
        displayError(
          thisForm,
          "La demande a pris trop de temps, veuillez réessayer."
        );
      }, 30000); // Timeout after 30 seconds

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha
                .execute(recaptcha, { action: "php_email_form_submit" })
                .then((token) => {
                  formData.set("recaptcha-response", token);
                  php_email_form_submit(thisForm, action, formData, timeout);
                });
            } catch (error) {
              clearTimeout(timeout); // Clear timeout in case of error
              displayError(thisForm, "L'envoi du formulaire a échoué.");
            }
          });
        } else {
          clearTimeout(timeout); // Clear timeout if reCaptcha API is not loaded
          displayError(
            thisForm,
            "L'URL de l'API JavaScript reCaptcha n'est pas chargée !"
          );
        }
      } else {
        php_email_form_submit(thisForm, action, formData, timeout);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData, timeout) {
    fetch(action, {
      method: "POST",
      body: formData,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(
            `${response.status} ${response.statusText} ${response.url}`
          );
        }
      })
      .then((data) => {
        clearTimeout(timeout); // Clear timeout when response is received
        thisForm.querySelector(".loading").classList.remove("d-block");
        if (data.trim() == "OK") {
          thisForm.querySelector(".sent-message").classList.add("d-block");
          thisForm.reset();
        } else {
          throw new Error("L'envoi du formulaire a échoué.");
        }
      })
      .catch((error) => {
        clearTimeout(timeout); // Clear timeout if an error occurs
        displayError(thisForm, "L'envoi du formulaire a échoué.");
      });
  }

  function displayError(thisForm, error) {
    if (
      thisForm.querySelector(".error-message").classList.contains("d-block")
    ) {
      return; // Prevent sending the error if it already exists
    }
    thisForm.querySelector(".loading").classList.remove("d-block");
    thisForm.querySelector(".error-message").innerHTML = error;
    thisForm.querySelector(".error-message").classList.add("d-block");
  }
})();
