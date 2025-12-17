const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Clean up OCR extracted text using Groq LLM
 * @param {string} rawText - Raw OCR text
 * @returns {Promise<string>} Cleaned and formatted text
 */
async function cleanupOCR(rawText) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a text cleanup assistant. Clean up OCR-extracted text by:
- Fixing spelling errors and typos
- Correcting spacing and formatting issues
- Removing duplicate characters or words
- Organizing content in a readable format
- Preserving all important information
- Return only the cleaned text, no explanations.`
        },
        {
          role: 'user',
          content: `Clean up this OCR text:\n\n${rawText}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 4096
    });

    return chatCompletion.choices[0]?.message?.content || rawText;
  } catch (error) {
    console.error('Error cleaning OCR text with Groq:', error);
    // Return original text if cleanup fails
    return rawText;
  }
}

/**
 * Clean up web scraped text using Groq LLM
 * @param {string} rawText - Raw scraped text
 * @returns {Promise<string>} Cleaned and summarized text
 */
async function cleanupScrape(rawText) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a web content cleanup assistant. Clean up scraped web content by:
- Removing navigation menus, footers, and irrelevant elements
- Extracting main content only
- Organizing in a readable format
- Fixing spacing and formatting
- Removing repetitive content
- Preserving important links and information
- Return only the cleaned content, no explanations.`
        },
        {
          role: 'user',
          content: `Clean up this scraped web content:\n\n${rawText}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 4096
    });

    return chatCompletion.choices[0]?.message?.content || rawText;
  } catch (error) {
    console.error('Error cleaning scraped text with Groq:', error);
    return rawText;
  }
}

/**
 * Summarize file comparison results using Groq LLM
 * @param {Object} comparisonData - Comparison result object
 * @returns {Promise<string>} Human-readable summary
 */
async function summarizeComparison(comparisonData) {
  try {
    const dataStr = JSON.stringify(comparisonData, null, 2);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a file comparison analyst. Create a clear, concise summary of file comparison results:
- Highlight key differences
- Note similarities
- Identify unique content in each file
- Provide similarity percentage
- Make it easy to understand
- Use bullet points and clear structure
- Return only the summary, no explanations.`
        },
        {
          role: 'user',
          content: `Summarize this file comparison:\n\n${dataStr}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 2048
    });

    return chatCompletion.choices[0]?.message?.content || 'Comparison completed. See raw data for details.';
  } catch (error) {
    console.error('Error summarizing comparison with Groq:', error);
    return 'Comparison completed. LLM summary unavailable.';
  }
}

/**
 * General text improvement using Groq LLM
 * @param {string} text - Input text
 * @param {string} task - Task description
 * @returns {Promise<string>} Improved text
 */
async function improveText(text, task = 'improve readability') {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a text improvement assistant. Task: ${task}. Return only the improved text.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      max_tokens: 4096
    });

    return chatCompletion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('Error improving text with Groq:', error);
    return text;
  }
}

/**
 * Generate a chat title using Groq LLM
 * @param {string} text - Text content to generate title from
 * @returns {Promise<string>} Generated title (max 6 words)
 */
async function generateChatTitle(text) {
  try {
    const prompt = `Generate a short, meaningful title (max 6 words) for this text:

${text.substring(0, 500)}

Return ONLY the title.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 20
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || 'Untitled Chat';
  } catch (error) {
    console.error('Error generating chat title with Groq:', error);
    return 'Untitled Chat';
  }
}

module.exports = {
  cleanupOCR,
  cleanupScrape,
  summarizeComparison,
  improveText,
  generateChatTitle
};
