require('dotenv').config();
const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function enhanceContent(prompt, temperature) {
    try {
        const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature,
            max_tokens: 1500,
            top_p: 1,
        });

        return response.choices[0]?.message?.content || "Failed to generate content.";
    } catch (error) {
        console.error("Error enhancing content:", error);
        throw new Error("Failed to generate content.");
    }
}

async function summarizeContent(content) {
    try {
        const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: `Summarize this blog: ${content}` }],
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
        });

        return response.choices[0]?.message?.content || "Failed to summarize content.";
    } catch (error) {
        console.error("Error summarizing content:", error);
        throw new Error("Failed to summarize content.");
    }
}

async function analyzeComments(comments) {
    try {
    
        const formattedComments = comments.join("\n");


        const prompt = `
You are a content strategist. Analyze the following comments for feedback, sentiment, and future topic recommendations.

Comments:
${formattedComments}

Please provide the following:
1. An overview of the feedback received.
2. A brief sentiment analysis (positive, neutral, or negative) with reasons.
3. Recommendations for topics or improvements for future posts.
provide this analysis in 3 paragraphs, each explaining one of the above points. also include subheadings for each paragraph
        `;

        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.9,
            max_tokens: 1000,
            top_p: 1,
            stream: false,
        });


        return completion.choices[0]?.message?.content || 'Analysis failed.';
    } catch (error) {
        console.error('Error during comment analysis:', error);
        throw new Error('Failed to analyze comments.');
    }
}

module.exports = { enhanceContent, summarizeContent, analyzeComments };
