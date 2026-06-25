const SITE_CONTACT_EMAIL = "connect@liberty-global-consulting.com";

const header = document.querySelector("[data-header]");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && header && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function formToMessage(form) {
  const data = new FormData(form);
  const lines = [];

  data.forEach((value, key) => {
    const label = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    const clean = String(value).trim();

    if (clean) {
      lines.push(`${label}: ${clean}`);
    }
  });

  return lines.join("\n");
}

async function copyText(text) {
  if (!text) return false;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

function subjectForForm(type) {
  if (type === "booking") return "Speaking Booking Request for Kgomotso Kay Hargraves";
  if (type === "newsletter") return "Book and Speaking Newsletter Signup";
  return "Message for Kgomotso Kay Hargraves";
}

function statusForPlaceholder(type) {
  if (type === "booking") {
    return "Booking request prepared. Add a contact email in script.js so this can send directly.";
  }

  if (type === "newsletter") {
    return "Book and speaking signup prepared. Connect this to your newsletter platform before publishing.";
  }

  return "Message prepared. Add a contact email in script.js so this can send directly.";
}

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector("[data-form-status]");
    const type = form.dataset.form || "contact";
    const message = formToMessage(form);
    const subject = subjectForForm(type);
    const emailReady = SITE_CONTACT_EMAIL.includes("@");

    if (!message) {
      if (status) status.textContent = "Please complete the form first.";
      return;
    }

    await copyText(`${subject}\n\n${message}`);

    if (emailReady) {
      const mailto = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailto;
      if (status) status.textContent = "Email draft opened. The request was also copied.";
      return;
    }

    if (status) status.textContent = statusForPlaceholder(type);
  });
});

document.querySelectorAll("[data-copy-form]").forEach((button) => {
  button.addEventListener("click", async () => {
    const form = button.closest("form");
    const status = form ? form.querySelector("[data-form-status]") : null;
    const message = form ? formToMessage(form) : "";

    if (!message) {
      if (status) status.textContent = "Please complete the form first.";
      return;
    }

    await copyText(message);
    if (status) status.textContent = "Copied.";
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const key = button.getAttribute("data-copy-target");
    const source = key ? document.querySelector(`[data-copy-source="${key}"]`) : null;

    if (!source) return;

    await copyText(source.textContent.trim());
    const original = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = original;
    }, 1600);
  });
});

document.querySelectorAll("[data-topic]").forEach((button) => {
  button.addEventListener("click", () => {
    const topic = button.getAttribute("data-topic") || "";
    const input = document.querySelector("[data-topic-input]");
    const booking = document.querySelector("#booking");

    if (input instanceof HTMLInputElement) {
      input.value = topic;
    }

    if (booking) {
      booking.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".book-card, .book-detail, .audience-grid article, .values-grid article, .media-panel, .resource-list article, .event-list article, .testimonial-grid blockquote")
    .forEach((item) => {
      item.classList.add("reveal");
      revealObserver.observe(item);
    });
}
