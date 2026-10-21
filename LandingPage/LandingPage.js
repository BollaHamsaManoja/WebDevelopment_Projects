
// 1. MOBILE NAVIGATION MENU
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close the menu after clicking a navigation link
navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});


// 2. SCROLL REVEAL ANIMATION
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}


// 3. ROTATING TESTIMONIAL EXAMPLES
// Replace these samples with genuine customer feedback.
const testimonials = [
    {
        text: "Great digital experiences come from understanding people, communicating clearly, and paying attention to every detail.",
        author: "Our Creative Philosophy",
        role: "Design with purpose"
    },
    {
        text: "Good design should make digital experiences clearer, easier to use, and more enjoyable.",
        author: "Our Design Approach",
        role: "User-focused experiences"
    },
    {
        text: "Every project is an opportunity to turn a thoughtful idea into a useful digital solution.",
        author: "Our Development Approach",
        role: "Ideas into experiences"
    }
];

let testimonialIndex = 0;

const testimonialText = document.getElementById("testimonialText");
const testimonialAuthor = document.getElementById("testimonialAuthor");
const testimonialRole = document.getElementById("testimonialRole");
const testimonialCount = document.getElementById("testimonialCount");

function showTestimonial(index) {
    const item = testimonials[index];

    testimonialText.textContent = item.text;
    testimonialAuthor.textContent = item.author;
    testimonialRole.textContent = item.role;
    testimonialCount.textContent =
        `${index + 1} / ${testimonials.length}`;
}

function changeTestimonial(direction) {
    testimonialIndex =
        (testimonialIndex + direction + testimonials.length)
        % testimonials.length;

    showTestimonial(testimonialIndex);
}

document.getElementById("previousTestimonial")
    .addEventListener("click", () => changeTestimonial(-1));

document.getElementById("nextTestimonial")
    .addEventListener("click", () => changeTestimonial(1));


// 4. CONTACT FORM VALIDATION AND EMAIL DRAFT
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    const name = document.getElementById("visitorName").value.trim();
    const email = document.getElementById("visitorEmail").value.trim();
    const message = document.getElementById("visitorMessage").value.trim();

    if (!name || !email || !message) {
        formMessage.textContent = "Please complete all fields.";
        return;
    }

    const subject = encodeURIComponent("Website Consultation Enquiry");
    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formMessage.textContent =
        "Opening your email application to send the enquiry...";

    window.location.href =
        `mailto:hamsamanojabolla5@gmail.com?subject=${subject}&body=${body}`;
});


// 5. BACK-TO-TOP BUTTON
const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
    backToTop.classList.toggle("show", window.scrollY > 350);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth"
    });
});


// 6. AUTOMATIC COPYRIGHT YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();
