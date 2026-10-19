
// 1. MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close the mobile menu after selecting a section
navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});


// 2. DARK AND LIGHT MODE
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

function updateThemeIcon() {
    themeToggle.innerHTML = document.body.classList.contains("dark")
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

updateThemeIcon();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("portfolio-theme", theme);
    updateThemeIcon();
});


// 3. TYPING ANIMATION
const typingElement = document.getElementById("typing");
const roles = ["Software Developer", "Java Developer", "Web Developer"];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeRole() {
    const currentRole = roles[roleIndex];

    typingElement.textContent = currentRole.substring(0, characterIndex);

    if (!deleting) {
        characterIndex++;

        if (characterIndex > currentRole.length) {
            deleting = true;
            setTimeout(typeRole, 1200);
            return;
        }
    } else {
        characterIndex--;

        if (characterIndex < 0) {
            characterIndex = 0;
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeRole, deleting ? 45 : 100);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typeRole();
} else {
    typingElement.textContent = roles[0];
    document.querySelector(".cursor").hidden = true;
}


// 4. PROJECT FILTERS
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        projectCards.forEach(card => {
            const matches =
                selectedFilter === "all" ||
                card.dataset.category === selectedFilter;

            card.hidden = !matches;
        });
    });
});


// 5. REVEAL ELEMENTS WHEN SCROLLING
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}


// 6. HIGHLIGHT THE CURRENT NAVIGATION SECTION
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(
    '#navMenu a[href^="#"]'
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    const isActive =
                        link.getAttribute("href") ===
                        "#" + entry.target.id;

                    if (isActive) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, { rootMargin: "-25% 0px -60% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
}


// 7. AUTOMATIC COPYRIGHT YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();
