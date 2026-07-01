// netlify/functions/chat.js
// Proxy ka OpenAI API (GPT) sangkan API key teu katembong di frontend.
// Make environment variable GPT_API_KEY anu geus aya di Netlify dashboard.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { system, messages } = JSON.parse(event.body);

    const payload = {
      model: 'gpt-4o-mini', // ganti upami hoyong model GPT séjén
      messages: [
        { role: 'system', content: system || 'Anjeun asisten AI basa Sunda.' },
        ...(messages || [])
      ],
      temperature: 0.7,
      max_tokens: 1024
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GPT_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('OpenAI error:', data);
      return { statusCode: 502, body: JSON.stringify({ error: 'OpenAI API error', detail: data }) };
    }

    const reply = data.choices?.[0]?.message?.content || '';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
