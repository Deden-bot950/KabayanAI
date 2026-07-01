// netlify/functions/chat.js
// Proxy ka Groq API sangkan API key teu katembong di frontend.
// Setél environment variable GROQ_API_KEY di Netlify dashboard.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { system, messages } = JSON.parse(event.body);

    const payload = {
      model: 'llama-3.3-70b-versatile', // ganti upami hoyong model Groq séjén
      messages: [
        { role: 'system', content: system || 'Anjeun asisten AI basa Sunda.' },
        ...(messages || [])
      ],
      temperature: 0.7,
      max_tokens: 1024
    };

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Groq error:', data);
      return { statusCode: 502, body: JSON.stringify({ error: 'Groq API error', detail: data }) };
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
