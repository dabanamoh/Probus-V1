
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, conversationHistory } = await req.json();

    // Create context-specific prompts
    const systemPrompts = {
      hr: "You are an HR AI assistant. Help with HR policies, employee relations, and workplace issues. Always maintain confidentiality and provide GDPR-compliant advice.",
      admin: "You are an administrative AI assistant. Help with management decisions, risk assessment, and organizational insights. Provide data-driven recommendations.",
      employee: "You are an employee AI assistant. Help with workplace questions, procedures, and general support. Be helpful and professional.",
      general: "You are a workplace AI assistant. Help with general workplace questions, provide guidance, and maintain a professional tone."
    };

    const systemPrompt = systemPrompts[context as keyof typeof systemPrompts] || systemPrompts.general;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map((msg: any) => ({
            role: msg.is_ai ? 'assistant' : 'user',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
