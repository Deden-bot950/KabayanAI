// netlify/functions/image.js
// Proxy ka SiliconFlow API pikeun generate gambar.
// Setél environment variable SILICONFLOW_API_KEY di Netlify dashboard.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    const res = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell', // ganti upami hoyong model gambar séjén
        prompt: prompt,
        image_size: '1024x1024',
        num_inference_steps: 4
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('SiliconFlow error:', data);
      return { statusCode: 502, body: JSON.stringify({ error: 'SiliconFlow API error', detail: data }) };
    }

    const imageUrl = data.images?.[0]?.url || data.data?.[0]?.url || '';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
