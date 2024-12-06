require('dotenv').config();
const Groq = require('groq-sdk');

const client = new Groq({ apiKey: "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" });

async function enhanceContent(prompt, temp) {
    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: `${prompt}`,
                },
            ],
            temperature: temp,
            max_tokens: 700,
            top_p: 1,
            stream: false,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error("Error during content enhancement:", error);
        throw new Error("Failed to enhance content");
    }
}


async function summarizeContent(blogContent) {
    try {
        const completion = await client.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'user',
                    content: `Summarize the following content: ${blogContent}`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            stream: false
        });

        return completion.choices[0]?.message?.content || 'Summarization failed.';
    } catch (error) {
        console.error('Error during summarization:', error);
        throw new Error('Failed to summarize content.');
    }
}

module.exports = { enhanceContent, summarizeContent };


module.exports = { enhanceContent, summarizeContent };
