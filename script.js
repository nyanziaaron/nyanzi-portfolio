// ==========================================
// AARON NYANZI KARANJA - PORTFOLIO SCRIPT
// Features: Mobile Navigation, Scrollspy,
// Web3Forms AJAX Contact, and AI Portfolio Chatbot
// ==========================================

// Set the current year dynamically in the footer
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// Mobile Menu Variables and Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
    if (!sidebar || !mobileMenuBtn || !overlay) return;
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
    
    if (isOpen) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            toggleMenu();
        }
    });
});

// Scroll Spy: Highlight active navigation link
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact Form Handling (Web3Forms API)
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const status = document.getElementById('formStatus');
    const originalText = btn ? btn.textContent : 'Send Message';
    
    if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.classList.add('opacity-70');
    }

    fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    })
    .then(() => {
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('opacity-70');
        }
        form.reset();
        if (status) {
            status.textContent = 'Message sent successfully! Aaron will get back to you soon.';
            status.classList.remove('hidden', 'text-red-500');
            status.classList.add('text-green-600');
            setTimeout(() => status.classList.add('hidden'), 5000);
        }
    })
    .catch(() => {
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.classList.remove('opacity-70');
        }
        if (status) {
            status.textContent = 'Oops! There was a problem sending your message. Please reach out directly via email or WhatsApp.';
            status.classList.remove('hidden', 'text-green-600');
            status.classList.add('text-red-500');
        }
    });
}

// ==========================================
// TRAINED PORTFOLIO DATA & LOCAL AI ENGINE
// ==========================================
const AARON_PORTFOLIO_DATA = {
    name: "Aaron Nyanzi Karanja",
    title: "Computer Science Student, Web Developer & Digital Content Creator",
    location: "Nairobi, Kenya",
    education: {
        degree: "Bachelor of Science in Computer Science",
        university: "Zetech University, Ruiru Campus",
        graduation: "Expected Graduation: November 2027",
        details: "Focuses on computer networking, software engineering, algorithms, web development, and system administration."
    },
    experience: {
        role: "Digital Content Creator & Social Media Manager",
        duration: "July 2025 - Present",
        platform: "@stickyfied (TikTok & digital platforms)",
        followers: "50,000+ followers grown organically from zero",
        highlights: [
            "Scaled digital presence from 0 to over 50,000+ followers through consistent high-retention content creation.",
            "Created and directed visual branding assets ensuring a cohesive, professional online presence.",
            "Utilized data analytics (TikTok Analytics, YouTube Studio, Google Analytics) to refine content performance and audience retention."
        ]
    },
    skills: {
        web: ["HTML", "CSS", "JavaScript", "Python", "Tailwind CSS", "REST APIs"],
        design: ["Canva (visual identity, graphics, branding)", "CapCut (video editing, pacing, sound design)"],
        networking: ["Cisco Packet Tracer", "Computer Networking", "IT Troubleshooting & Support"],
        analytics: ["Google Analytics", "TikTok Analytics", "YouTube Studio", "Linktree", "Beacons"],
        cloudTools: ["Google Cloud Platform (GCP)", "Git", "GitHub", "Netlify"],
        productivity: ["Google Workspace", "Microsoft Office", "Entrepreneurship & Small Business Management"]
    },
    projects: [
        {
            name: "Tenantmode",
            description: "A comprehensive Tenant Management System engineered to streamline rental tracking, property oversight, automated records, and seamless tenant communications."
        },
        {
            name: "MediCore254",
            description: "A healthcare management portal built to optimize clinic operations, appointment scheduling, and patient record management in Kenya."
        },
        {
            name: "Personal Portfolio Website",
            description: "An interactive, modern portfolio with custom Tailwind typography, accessible sidebar navigation, Web3Forms integration, and this intelligent AI assistant."
        }
    ],
    certifications: [
        {
            title: "Mastercard Foundation Business Certification",
            issuer: "Mastercard Foundation",
            focus: "Entrepreneurship, small business management, and strategic financial planning."
        },
        {
            title: "What Is Generative AI? Certificate",
            issuer: "LinkedIn (2025)",
            focus: "Generative AI architectures, prompt engineering, large language models, and modern AI productivity workflows."
        }
    ],
    contact: {
        email: "Aaronkaranjanyanzi@gmail.com",
        phone: "+254 716277805",
        whatsapp: "https://wa.me/254716277805",
        linkedin: "https://www.linkedin.com/in/aaron-nyanzi-746933328",
        github: "https://github.com/nyanziaaron",
        tiktok: "https://www.tiktok.com/@stickyfied"
    }
};

/**
 * Intelligent Local Knowledge Engine
 * Strictly trained on Aaron's portfolio data.
 * Answers relevant questions accurately and rejects off-topic queries politely.
 */
function queryLocalPortfolioKnowledge(rawQuery) {
    const query = rawQuery.toLowerCase().trim();
    const cleanQuery = query.replace(/[^\w\s]/gi, ' ');
    const words = cleanQuery.split(/\s+/).filter(Boolean);

    // 1. Specific Projects Check (Run before generic "tell me about")
    if (query.includes('tenantmode')) {
        return `🏠 **Tenantmode (Tenant Management System):**\n\nA full-featured property and tenant management system engineered by Aaron to streamline rental tracking, lease records, property oversight, and automated tenant communication.`;
    }

    if (query.includes('medicore') || query.includes('medicore254')) {
        return `🏥 **MediCore254 (Healthcare Portal):**\n\nA digital healthcare management platform designed by Aaron to optimize clinic operations, appointment scheduling, and digital patient record administration for healthcare providers in Kenya.`;
    }

    // 2. Specific Experience / TikTok / Social Media
    if (
        query.includes('tiktok') ||
        query.includes('stickyfied') ||
        query.includes('follower') ||
        query.includes('content creator') ||
        query.includes('social media manager')
    ) {
        return `📱 **Content Creation & Social Media Management:**\n\n• Platform: **@stickyfied**\n• Growth: Built an organic audience of **50,000+ followers** from scratch since July 2025.\n• Strategy: Produced consistent high-retention video content, established brand identity, and used **TikTok Analytics & YouTube Studio** to optimize reach.`;
    }

    // 3. Specific Skill Inquiries
    if (query.includes('python')) {
        return `🐍 **Python Experience:**\n\nYes! Aaron uses **Python** for general programming, algorithmic problem-solving, and foundational machine learning workflows (such as KNN, Naive Bayes, and Linear Regression).`;
    }

    if (query.includes('javascript') || query.includes('html') || query.includes('css') || query.includes('tailwind') || query.includes('frontend') || query.includes('web dev')) {
        return `💻 **Web Development Skills:**\n\nAaron develops modern, responsive web interfaces using **HTML, CSS, JavaScript**, and **Tailwind CSS**, integrating dynamic APIs and asynchronous frontend logic.`;
    }

    if (query.includes('network') || query.includes('cisco') || query.includes('packet tracer') || query.includes('it support') || query.includes('hardware')) {
        return `🌐 **Networking & IT Support:**\n\nAaron is trained in computer networking fundamentals, configuring network topologies and device simulations with **Cisco Packet Tracer**, as well as diagnosing PC hardware and software issues.`;
    }

    if (query.includes('capcut') || query.includes('canva') || query.includes('graphic design') || query.includes('video editing')) {
        return `🎨 **Design & Video Production:**\n\n• **Canva:** Crafting brand identity kits, social media graphics, presentations, and marketing collateral.\n• **CapCut:** Video editing, timing, sound effects, and short-form pacing for high audience retention.`;
    }

    if (query.includes('generative ai') || query.includes('machine learning') || (query.includes(' ai') && !query.includes('email'))) {
        return `🤖 **AI & Machine Learning Knowledge:**\n\n• Certified in **"What Is Generative AI?"** by LinkedIn (2025).\n• Practical knowledge of machine learning concepts (KNN, Naive Bayes, Linear Regression).\n• Experience integrating generative AI capabilities into web applications.`;
    }

    // 4. Contact / Hire / Location / Reach
    if (
        query.includes('contact') ||
        query.includes('email') ||
        query.includes('phone') ||
        query.includes('whatsapp') ||
        query.includes('hire') ||
        query.includes('reach') ||
        query.includes('call') ||
        query.includes('message') ||
        query.includes('location') ||
        query.includes('where is he') ||
        query.includes('where does he live') ||
        query.includes('nairobi') ||
        query.includes('kenya') ||
        query.includes('linkedin') ||
        query.includes('github')
    ) {
        return `📫 **Get in Touch with Aaron:**\n\n• **Email:** [Aaronkaranjanyanzi@gmail.com](mailto:Aaronkaranjanyanzi@gmail.com)\n• **WhatsApp / Phone:** [+254 716277805](https://wa.me/254716277805)\n• **Location:** Nairobi, Kenya\n• **LinkedIn:** [Aaron Nyanzi](https://www.linkedin.com/in/aaron-nyanzi-746933328)\n• **GitHub:** [nyanziaaron](https://github.com/nyanziaaron)\n• **TikTok:** [@stickyfied](https://www.tiktok.com/@stickyfied)`;
    }

    // 5. Certifications
    if (
        query.includes('certificat') ||
        query.includes('credential') ||
        query.includes('qualification') ||
        query.includes('mastercard')
    ) {
        return `📜 **Certifications:**\n\n• **Mastercard Foundation Business Certification:** Comprehensive training in entrepreneurship, small business management, and financial planning.\n• **What Is Generative AI? (LinkedIn, 2025):** Core principles of generative AI, large language models, and practical AI workflows.`;
    }

    // 6. Projects (General)
    if (
        query.includes('project') ||
        query.includes('portfolio') ||
        query.includes('what has he built') ||
        query.includes('work sample') ||
        query.includes('built')
    ) {
        return `🚀 **Key Projects by Aaron:**\n\n` +
            `1. **Tenantmode:** A complete Tenant Management System designed to streamline rental tracking, tenant communications, and digital property records.\n\n` +
            `2. **MediCore254:** A digital healthcare portal enabling efficient clinic appointments and patient record management tailored for Kenyan healthcare providers.\n\n` +
            `3. **Aaron's Portfolio:** A responsive, accessible portfolio with custom Tailwind themes, Web3Forms integration, and this trained AI assistant.`;
    }

    // 7. Education / School / University / Degree
    if (
        query.includes('school') ||
        query.includes('university') ||
        query.includes('college') ||
        query.includes('degree') ||
        query.includes('education') ||
        query.includes('study') ||
        query.includes('studying') ||
        query.includes('zetech') ||
        query.includes('graduate') ||
        query.includes('graduation') ||
        query.includes('academic')
    ) {
        return `🎓 **Education Background:**\n\n• **Degree:** Bachelor of Science in Computer Science\n• **Institution:** Zetech University (Ruiru Campus, Kenya)\n• **Expected Graduation:** November 2027\n\nAaron's coursework covers computer networking, software engineering, web development, algorithms, and IT support.`;
    }

    // 8. General Experience / Work / Job
    if (
        query.includes('experience') ||
        query.includes('work') ||
        query.includes('job') ||
        query.includes('career') ||
        query.includes('employment')
    ) {
        return `💼 **Work Experience:**\n\n**Digital Content Creator & Social Media Manager** (July 2025 – Present)\n\n• Built and scaled his digital brand (**@stickyfied**) from **0 to over 50,000+ followers** organically.\n• Created visual identity assets, branded graphics, and high-retention short-form video content.\n• Monitored audience engagement metrics using **TikTok Analytics, YouTube Studio, and Google Analytics** to optimize growth strategies.`;
    }

    // 9. General Skills
    if (
        query.includes('skill') ||
        query.includes('technologies') ||
        query.includes('tech stack') ||
        query.includes('what can he do') ||
        query.includes('tools') ||
        query.includes('stack') ||
        query.includes('programming languages')
    ) {
        return `🛠️ **Aaron's Technical Skill Set:**\n\n` +
            `• **Web Development:** HTML, CSS, JavaScript, Python, Tailwind CSS\n` +
            `• **Networking & IT:** Cisco Packet Tracer, Network Configuration, IT Troubleshooting\n` +
            `• **Design & Video:** Canva, CapCut Video Editing\n` +
            `• **Analytics & Growth:** Google Analytics, TikTok Analytics, YouTube Studio, Linktree, Beacons\n` +
            `• **Productivity & Cloud:** Google Workspace, Microsoft Office, Git, GitHub, Netlify, GCP`;
    }

    // 10. Greetings & Pleasantries
    const greetingWords = ['hi', 'hello', 'hey', 'howdy', 'greetings', 'morning', 'afternoon', 'evening', 'sup', 'yo'];
    const isGreetingOnly = words.length <= 3 && words.some(w => greetingWords.includes(w));
    if (isGreetingOnly) {
        return "Hello! 👋 I am Aaron Nyanzi's virtual portfolio assistant. I am trained exclusively on Aaron's education, skills, projects, experience, and contact information. How can I help you explore his work today?";
    }

    // 11. Gratitude
    if (query.includes('thank') || query.includes('thanks') || query.includes('awesome') || query.includes('great') || query.includes('cool')) {
        return "You're very welcome! Feel free to ask anything else about Aaron's education, skills, projects, or how to contact him.";
    }

    // 12. Identity / Who is Aaron / About Aaron / What do you do
    if (
        query.includes('who are you') || 
        query.includes('what are you') ||
        query.includes('who is aaron') || 
        query.includes('tell me about aaron') ||
        query.includes('what do you do') ||
        query.includes('what does aaron do') ||
        query.includes('about aaron') ||
        query.includes('about him') ||
        query.includes('about himself') ||
        query.includes('bio') ||
        query.includes('introduction') ||
        (words.includes('aaron') && words.length <= 4)
    ) {
        return `**Aaron Nyanzi Karanja** is a Computer Science student at **Zetech University**, web developer, and digital content creator based in Nairobi, Kenya.\n\nHe has a strong foundation in **IT, computer networking, web development, and digital media**, and has built an online audience of **50,000+ followers**. He is trained in entrepreneurship and is passionate about building practical digital solutions.`;
    }

    // 13. STRICT GUARDRAIL / DOMAIN BOUNDARY
    // Rejects questions unrelated to Aaron Nyanzi's portfolio data.
    return `I am Aaron's dedicated portfolio assistant. I can only answer questions regarding Aaron Nyanzi Karanja's professional background, skills, education, projects, certifications, and contact information.\n\nFeel free to ask me anything about Aaron's qualifications or how to get in touch with him!`;
}

// ==========================================
// CHATBOT UI & CONTROLLER LOGIC
// ==========================================

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chatIcon');
    const closeIcon = document.getElementById('closeIcon');
    const toggleBtn = document.getElementById('botToggleBtn');
    
    if (!chatWindow) return;

    const isHidden = chatWindow.classList.contains('hidden');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', isHidden);
    
    chatWindow.classList.toggle('hidden');
    if (chatIcon) chatIcon.classList.toggle('hidden');
    if (closeIcon) closeIcon.classList.toggle('hidden');
    
    if (isHidden) {
        const input = document.getElementById('chatInput');
        if (input) input.focus();
    }
}

function handleKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

function sendQuickReply(text) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = text;
        sendMessage();
    }
}

/**
 * Format markdown safely for chat bubble rendering
 */
function formatBotReply(text) {
    if (!text) return '';

    // Escape HTML first to prevent XSS
    let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Convert Markdown links [Text](url)
    escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, (match, label, url) => {
        const target = url.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"';
        return `<a href="${url}" class="text-tuscany font-bold underline hover:text-umber transition-colors"${target}>${label}</a>`;
    });

    // Convert bold text **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Convert bullet points (• or -)
    escaped = escaped.replace(/(?:^|\n)[•-]\s+(.+)/g, '<br>• $1');

    // Convert double newlines into paragraph breaks
    escaped = escaped.replace(/\n\n/g, '<br><br>');
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
}

/**
 * Escape plain text
 */
function escapeHtml(string) {
    if (!string) return '';
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

let isGeneratingResponse = false;

async function sendMessage() {
    if (isGeneratingResponse) return;

    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    if (!input) return;

    const userText = input.value.trim();
    if (!userText) return;

    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    // Add User Message Bubble
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'flex justify-end';
    userMsgDiv.innerHTML = `<div class="bg-tuscany text-eerie font-medium p-3 rounded-lg shadow-sm max-w-[85%] text-sm break-words">${escapeHtml(userText)}</div>`;
    messagesContainer.appendChild(userMsgDiv);

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Lock send state
    isGeneratingResponse = true;
    if (sendBtn) sendBtn.disabled = true;

    // Add Loading Indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'flex items-start space-x-2 mt-2';
    loadingDiv.innerHTML = `
        <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-gray-500 text-xs flex items-center space-x-2">
            <span class="inline-block w-2 h-2 bg-tuscany rounded-full animate-bounce"></span>
            <span class="inline-block w-2 h-2 bg-umber rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span class="inline-block w-2 h-2 bg-tuscany rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span class="italic text-xs ml-1">Thinking...</span>
        </div>`;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    let botReply = null;

    // Try Netlify Function (with Gemini AI) first
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.reply && !data.fallback) {
                botReply = data.reply;
            }
        }
    } catch {
        // Network or local hosting without Netlify CLI -> fall through to local engine
    }

    // Fall back seamlessly to local trained portfolio AI engine
    if (!botReply) {
        botReply = queryLocalPortfolioKnowledge(userText);
    }

    // Remove loading indicator
    if (loadingDiv.parentNode === messagesContainer) {
        messagesContainer.removeChild(loadingDiv);
    }

    // Render Bot Message Bubble
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'flex items-start space-x-2 mt-2';
    botMsgDiv.innerHTML = `<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[85%] text-eerie text-sm break-words">${formatBotReply(botReply)}</div>`;
    messagesContainer.appendChild(botMsgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Unlock send state
    isGeneratingResponse = false;
    if (sendBtn) sendBtn.disabled = false;
    input.focus();
}
