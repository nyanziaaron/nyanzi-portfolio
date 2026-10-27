exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const message = body.message || "";
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { 
                statusCode: 200, 
                body: JSON.stringify({ reply: "Configuration error: GEMINI_API_KEY environment variable is missing in Netlify settings." }) 
            };
        }

        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are the intelligent virtual portfolio assistant for Aaron Nyanzi Karanja. 
                        Your job is to understand natural, conversational human phrasing (e.g. "where does he study?", "what school did he go to?", "tell me his tech stack") and answer based strictly on Aaron's profile below.

                        Guidelines:
                        - Answer conversationally and naturally, interpreting human phrasing intelligently.
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
            })
        });

        const data = await apiResponse.json();

        if (data.error) {
            return { 
                statusCode: 200, 
                body: JSON.stringify({ reply: `Gemini API Error: ${data.error.message}` }) 
            };
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm Aaron's portfolio assistant. Feel free to ask about his background, skills, or projects!";

        return {
            statusCode: 200,
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        return { 
            statusCode: 200, 
            body: JSON.stringify({ reply: `Server Error: ${error.message}` }) 
        };
    }
};