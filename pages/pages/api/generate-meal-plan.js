export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, sideEffects, dietaryRestrictions, budget } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const prompt = `Create a 3-day GLP-1 meal plan for: ${name}
Side effects: ${sideEffects.length ? sideEffects.join(', ') : 'none'}
Dietary: ${dietaryRestrictions.length ? dietaryRestrictions.join(', ') : 'none specified'}
Budget: ${budget}

Format ONLY as this JSON (no markdown, no code fence, pure JSON):
{
  "intro": "2-3 sentence welcome",
  "days": [
    {"day": 1, "meals": [{"name": "Meal name", "portion": "size", "calories": 300, "protein": 25, "tip": "why good for GLP-1"}]}
  ],
  "shopping": ["item 1", "item 2"],
  "tips": ["tip 1", "tip 2"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to generate meal plan' });
    }

    const text = data.content[0].text;
    const plan = JSON.parse(text);
    
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
}
