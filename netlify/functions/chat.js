// ==========================================
// NETLIFY SERVERLESS FUNCTION: CHAT
// Aaron Nyanzi Karanja - AI Portfolio Assistant
// Powered by Google Gemini API
// ==========================================

exports.handler = async function(event, context) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    };

    // Handle CORS pre-flight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            headers, 
            body: JSON.stringify({ error: "Method Not Allowed" }) 
        };
    }

    try {
        let body = {};
        try {
            body = typeof event.body === 'string' ? JSON.parse(event.body || "{}") : (event.body || {});
        } catch {
            body = { message: event.body };
        }

        const message = (body.message || "").trim();
        if (!message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Message is required" })
            };
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // If no API key configured in Netlify, tell client to fall back to the built-in knowledge engine
        if (!apiKey) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply: null, 
                    fallback: true,
                    note: "GEMINI_API_KEY is not configured in Netlify environment variables." 
                })
            };
        }

        const systemPrompt = `You are the official, intelligent virtual portfolio assistant for Aaron Nyanzi Karanja.

CRITICAL INSTRUCTIONS & GUARDRAIL RULES:
1. ONLY answer questions intelligently based on Aaron Nyanzi Karanja's portfolio data provided below.
2. Under NO circumstances should you answer off-topic questions (e.g. general knowledge, math, science, recipes, weather, general coding exercises or homework, trivia, news, politics, other people).
3. If a question is off-topic or outside Aaron's portfolio, POLITELY DECLINE using this exact tone:
   "I am Aaron's dedicated portfolio assistant. I can only answer questions regarding Aaron Nyanzi Karanja's professional background, skills, education, projects, certifications, and contact information. Feel free to ask anything about Aaron!"
4. If the user sends a friendly greeting (e.g. "hi", "hello", "hey"), greet them warmly as Aaron's assistant and invite them to explore his portfolio.
5. If the user asks how to contact or hire Aaron, provide his exact contact details (email: Aaronkaranjanyanzi@gmail.com, WhatsApp: +254 716277805, LinkedIn, GitHub).
6. Keep your answers concise, engaging, professional, well-structured, and easy to read using markdown bullet points and bold headers where appropriate. Do not hallucinate any information not present in the knowledge base.

AARON'S TRAINED PORTFOLIO KNOWLEDGE BASE:
- Full Name: Aaron Nyanzi Karanja
- Professional Headline: Computer Science Student, Web Developer, Digital Content Creator & Social Media Manager, IT & Networking Specialist.
- Current Location: Nairobi, Kenya.

- Bio & Profile:
  Computer Science student at Zetech University with foundational knowledge of IT, computer networking, web development, and graphic design. Experienced in independently managing digital projects, creating visual content, and using digital tools to achieve practical results. Trained in entrepreneurship and small business management, with a strong interest in technology, problem-solving, and continuous learning.

- Education:
  * Degree: Bachelor of Science in Computer Science
  * Institution: Zetech University (Ruiru Campus, Kenya)
  * Expected Graduation: November 2027
  * Core Areas: Computer networking, software engineering, databases, algorithms, web development, IT support.

- Work Experience:
  * Role: Digital Content Creator & Social Media Manager
  * Duration: July 2025 – Present
  * Platform: @stickyfied (TikTok and digital platforms)
  * Achievements & Responsibilities:
    - Built and scaled the digital brand from 0 to over 50,000+ followers through consistent, engaging content creation and audience retention strategies.
    - Created and managed digital content to improve brand visibility and online presence.
    - Designed visual branding materials and assets to maintain a consistent brand identity.
    - Monitored engagement metrics using TikTok Analytics, YouTube Studio, and Google Analytics to guide growth and content strategies.

- Technical & Professional Skills:
  * Web Development & Programming: HTML, CSS, JavaScript, Python, Tailwind CSS, REST APIs.
  * Design & Video Production: Canva (graphic design, branding assets, slides), CapCut (video editing, pacing, audio sync).
  * Networking & IT Support: Cisco Packet Tracer, computer networking fundamentals, hardware & software troubleshooting.
  * Data & Machine Learning: Foundational ML workflows (KNN, Naive Bayes, Linear Regression) using Python.
  * Analytics & Audience Growth: Google Analytics, TikTok Analytics, YouTube Studio, Linktree, Beacons.
  * Cloud & Development Tools: Google Cloud Platform (GCP), Git, GitHub, Netlify.
  * Strategy & Productivity: Google Workspace (Docs, Sheets, Slides), Microsoft Office (Word, Excel, PowerPoint), Entrepreneurship & Business Management.

- Key Projects:
  * Tenantmode: A comprehensive Tenant Management System engineered to streamline rental tracking, property oversight, automated records, and seamless tenant communications.
  * MediCore254: A digital healthcare management portal designed to optimize clinic operations, appointment scheduling, and patient record management for Kenyan healthcare facilities.
  * Personal Portfolio Website: An interactive, modern personal portfolio with custom Tailwind CSS typography, responsive sidebar navigation, Web3Forms contact integration, and an intelligent AI assistant.

- Certifications:
  * Mastercard Foundation Business Certification: Focus on entrepreneurship, business planning, and small business management.
  * What Is Generative AI? Certificate: Issued by LinkedIn (2025), covering the fundamentals of generative AI, large language models, and AI productivity.

- Contact Information & Online Profiles:
  * Email: Aaronkaranjanyanzi@gmail.com
  * Phone & WhatsApp: +254 716277805 (WhatsApp link: https://wa.me/254716277805)
  * Location: Nairobi, Kenya
  * LinkedIn: https://www.linkedin.com/in/aaron-nyanzi-746933328
  * GitHub: https://github.com/nyanziaaron
  * TikTok: https://www.tiktok.com/@stickyfied`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [{
                role: "user",
                parts: [{ text: message }]
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 500
            }
        };

        const apiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await apiResponse.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    fallback: true,
                    error: data.error.message 
                })
            };
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ fallback: true })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        console.error("Serverless Function Error:", error);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                fallback: true,
                error: error.message 
            })
        };
    }
};
