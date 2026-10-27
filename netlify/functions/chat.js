exports.handler = async function(event, context) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        let body = {};
        try {
            body = JSON.parse(event.body || "{}");
        } catch (e) {
            body = { message: event.body };
        }

        const message = body.message || "Hello";
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ reply: "Configuration error: GEMINI_API_KEY is missing." }) 
            };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                parts: [{
                    text: `You are the intelligent virtual portfolio assistant for Aaron Nyanzi Karanja. 
                    Guidelines:
                    - Answer conversationally and naturally, interpreting human phrasing intelligently (e.g. "where does he study?", "what school did he go to?").
                    - Keep answers short, punchy, and direct. Do not dump unnecessary details like registration numbers unless specifically asked.
                    - If the user says a greeting (like "hi", "hello"), reply with a brief, friendly greeting and ask how you can help them explore Aaron's portfolio.
                    - If the user asks a non-portfolio question (unrelated to Aaron's professional background, education, skills, projects, or contact info), politely state that you are Aaron's portfolio assistant and can only discuss Aaron's professional details.

                    Aaron's Profile Knowledge Base:
                    - Name: Aaron Nyanzi Karanja
                    - Title / Status: Computer Science Student & Digital Content Creator
                    - Education: Computer Science student at Zetech University, expected graduation November 2027.
                    - Experience: Digital Content Creator & Social Media Manager (grew Stickyfied to 50k+ followers).
                    - Tech Stack: Full-Stack Web Development (HTML, CSS, JS, Python), Data Science workflows (KNN, Naive Bayes, Linear Regression), Cloud Infrastructure (GCP).
                    - Projects: Tenantmode (Tenant Management System) and MediCore254 (Healthcare Portal).
                    - Contacts: Email: Aaronkaranjanyanzi@gmail.com, WhatsApp: +254 716277805.

                    Visitor Message: ${message}`
                }]
            }]
        };

        const apiResponse = await fetch(url, {
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
                body: JSON.stringify({ reply: `Gemini Error: ${data.error.message || 'Unknown API error'}` }) 
            };
        }

        const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm Aaron's portfolio assistant. Feel free to ask about his background, skills, or projects!";
        
        const reply = `✨ [Gemini AI]: ${rawReply}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        console.error("Function Execution Error:", error);
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ reply: `System Error: ${error.message}` }) 
        };
    }
};