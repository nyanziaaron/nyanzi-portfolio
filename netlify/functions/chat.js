// Set the current year dynamically in the footer
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
});

// Mobile Menu Variables and Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
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

mobileMenuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

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
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
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
    const btn = form.querySelector('button');
    const status = document.getElementById('formStatus');
    const originalText = btn.textContent;
    
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.classList.add('opacity-70');

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    })
    .then(data => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-70');
        
        form.reset();
        status.textContent = 'Message sent successfully!';
        status.classList.remove('hidden', 'text-red-500');
        status.classList.add('text-green-600');
        
        setTimeout(() => status.classList.add('hidden'), 4000);
    })
    .catch(error => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-70');
        
        status.textContent = 'Oops! There was a problem sending your message.';
        status.classList.remove('hidden', 'text-green-600');
        status.classList.add('text-red-500');
    });
}

// Chatbot Logic
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chatIcon');
    const closeIcon = document.getElementById('closeIcon');
    const toggleBtn = document.getElementById('botToggleBtn');
    
    const isHidden = chatWindow.classList.contains('hidden');
    toggleBtn.setAttribute('aria-expanded', isHidden);
    
    chatWindow.classList.toggle('hidden');
    chatIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    
    if (isHidden) {
        document.getElementById('chatInput').focus();
    }
}

function handleKeypress(event) {
    if (event.key === 'Enter') sendMessage();
}

function sendQuickReply(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    const messagesContainer = document.getElementById('chatMessages');

    // Add user message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'flex justify-end';
    userMsgDiv.innerHTML = `<div class="bg-tuscany text-eerie font-medium p-3 rounded-lg shadow-sm max-w-[85%]">${escapeHtml(text)}</div>`;
    messagesContainer.appendChild(userMsgDiv);

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Check for hardcoded contact info keywords
    const lowerText = text.toLowerCase();
    if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('whatsapp')) {
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'flex items-start space-x-2 mt-2';
        botMsgDiv.innerHTML = `<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[85%] text-eerie">You can reach Aaron directly here:<br><br>
            <a href="mailto:Aaronkaranjanyanzi@gmail.com" class="text-tuscany font-bold underline hover:text-umber block mb-2">📧 Send an Email</a>
            <a href="https://wa.me/254716277805" target="_blank" rel="noopener noreferrer" class="text-green-600 font-bold underline hover:text-green-700 block">💬 Message on WhatsApp</a></div>`;
        messagesContainer.appendChild(botMsgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return;
    }

    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'flex items-start space-x-2 mt-2';
    loadingDiv.innerHTML = `<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-gray-400 italic text-xs">Thinking...</div>`;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Fetch reply from Netlify Function
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        messagesContainer.removeChild(loadingDiv);

        const botReply = data.reply || "I'm Aaron's portfolio assistant. Feel free to ask about his background!";
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'flex items-start space-x-2 mt-2';
        botMsgDiv.innerHTML = `<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[85%] text-eerie">${escapeHtml(botReply)}</div>`;
        messagesContainer.appendChild(botMsgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        messagesContainer.removeChild(loadingDiv);
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'flex items-start space-x-2 mt-2';
        botMsgDiv.innerHTML = `<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[85%] text-eerie">Aaron is a Computer Science student at Zetech University. How can I help you explore his portfolio?</div>`;
        messagesContainer.appendChild(botMsgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(string) {
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}