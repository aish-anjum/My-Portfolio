
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // MOBILE NAVIGATION
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu"
    );

    navLinks.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) {
      closeMenu();
    }
  });

  // ACTIVE NAVIGATION LINK
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navItems.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // PROFILE PHOTO FALLBACK
  const profilePhoto = document.getElementById("profile-photo");
  const photoPlaceholder = document.getElementById("photo-placeholder");

  function showPhotoFallback() {
    profilePhoto.hidden = true;
    photoPlaceholder.hidden = false;
  }

  function showProfilePhoto() {
    photoPlaceholder.hidden = true;
    profilePhoto.hidden = false;
  }

  profilePhoto.addEventListener("load", showProfilePhoto);
  profilePhoto.addEventListener("error", showPhotoFallback);

  if (profilePhoto.complete) {
    if (profilePhoto.naturalWidth > 0) {
      showProfilePhoto();
    } else {
      showPhotoFallback();
    }
  }

  // AUTOMATIC FOOTER YEAR
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // COPY EMAIL ADDRESS
  const copyButton = document.getElementById("copy-email");
  const portfolioEmail = "aishanjum010@gmail.com";

  copyButton.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(portfolioEmail);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = portfolioEmail;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        const copied = document.execCommand("copy");
        temporaryInput.remove();

        if (!copied) {
          throw new Error("Copy command was unsuccessful.");
        }
      }

      copyButton.textContent = "Copied!";
      window.setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1800);
    } catch (error) {
      copyButton.textContent = "Copy manually";
      console.error("Could not copy email address:", error);
    }
  });

  // CONTACT FORM VALIDATION
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("name-error")
    },
    email: {
      input: document.getElementById("sender-email"),
      error: document.getElementById("email-error")
    },
    subject: {
      input: document.getElementById("subject"),
      error: document.getElementById("subject-error")
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("message-error")
    }
  };

  function validateField(key) {
    const field = fields[key];
    const input = field.input;
    const value = input.value.trim();
    let errorMessage = "";

    if (!value) {
      errorMessage = "This field is required.";
    } else if (key === "name" && value.length < 2) {
      errorMessage = "Please enter at least 2 characters.";
    } else if (
      key === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      errorMessage = "Please enter a valid email address.";
    } else if (key === "subject" && value.length < 3) {
      errorMessage = "Please enter a subject of at least 3 characters.";
    } else if (key === "message" && value.length < 10) {
      errorMessage = "Please enter at least 10 characters.";
    }

    field.error.textContent = errorMessage;
    input.setAttribute("aria-invalid", String(Boolean(errorMessage)));

    return !errorMessage;
  }

  Object.keys(fields).forEach((key) => {
    const input = fields[key].input;

    input.addEventListener("blur", () => {
      validateField(key);
    });

    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        validateField(key);
      }

      formStatus.textContent = "";
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    const valid = Object.keys(fields).map(validateField).every(Boolean);

    if (!valid) {
      formStatus.textContent =
        "Please correct the highlighted fields before continuing.";

      const firstInvalidField = contactForm.querySelector(
        '[aria-invalid="true"]'
      );

      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return;
    }

    const senderName = fields.name.input.value.trim();
    const senderEmail = fields.email.input.value.trim();
    const subject = fields.subject.input.value.trim();
    const message = fields.message.input.value.trim();

    const emailBody = [
      `Name: ${senderName}`,
      `Reply email: ${senderEmail}`,
      "",
      "Message:",
      message
    ].join("\n");

    const mailtoURL = new URL("mailto:aishanjum010@gmail.com");
    mailtoURL.searchParams.set("subject", subject);
    mailtoURL.searchParams.set("body", emailBody);

    formStatus.textContent =
      "Your details are valid. Opening your email application...";

    // Opens the visitor's configured email application.
    window.location.href = mailtoURL.href;
  });
});
