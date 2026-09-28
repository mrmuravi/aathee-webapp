// Reveal content as it enters view.
document.documentElement.classList.add("js-enabled");

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Mobile nav toggle.
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Pre-select the relevant inquiry category when a service/partnership CTA links to the contact form.
const inquiryForm = document.getElementById("inquiry-form");

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!inquiryForm) return;
    const match = inquiryForm.querySelector(`input[name="service"][value="${CSS.escape(link.dataset.service)}"]`);
    if (match) match.checked = true;
  });
});

// Static site, no backend: build a mailto link from the inquiry form instead of submitting anywhere.
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(inquiryForm);
    const service = data.get("service") || "General Inquiry";
    const subject = `New inquiry: ${service}`;
    const body = [
      `Service: ${service}`,
      `Name: ${data.get("name") || ""}`,
      `Company: ${data.get("company") || ""}`,
      `Email: ${data.get("email") || ""}`,
      "",
      data.get("message") || "",
    ].join("\n");
    window.location.href = `mailto:contact@aathee.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
