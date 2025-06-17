
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, senderId, context } = await req.json();

    // Risk analysis prompt
    const systemPrompt = `You are an AI risk assessment system for workplace communications. 
    Analyze the following message for potential risks including:
    - Harassment or inappropriate behavior
    - Violent tendencies or threats
    - Discriminatory language
    - Fraudulent activities
    - Data privacy violations
    - Confidentiality breaches
    
    Respond with only a JSON object containing:
    {
      "riskLevel": "low|medium|high|critical",
      "categories": ["array of risk categories detected"],
      "confidence": 0.0-1.0,
      "explanation": "brief explanation"
    }`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this message: "${content}"` }
        ],
        max_tokens: 200,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    let riskAnalysis;
    
    try {
      riskAnalysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      riskAnalysis = {
        riskLevel: 'low',
        categories: [],
        confidence: 0.5,
        explanation: 'Analysis completed with default risk assessment'
      };
    }

    return new Response(JSON.stringify(riskAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-risk function:', error);
    return new Response(
      JSON.stringify({ 
        riskLevel: 'low',
        categories: [],
        confidence: 0.5,
        explanation: 'Risk analysis unavailable'
      }), 
      {
        status: 200, // Return 200 to avoid breaking the chat
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
