const GOOGLE_SCRIPT_URL = 'GAS_URL_LINK';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight request.
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method === 'POST') {
      try {
        console.log("Fetching Google Script URL...");

        // Forward the request body as is to the Google Apps Script
        const requestBody = await request.json();

        let response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: { 'Content-Type': 'application/json' },
        });

        // Handle redirect if status code is 302
        if (response.status === 302) {
          const redirectUrl = response.headers.get('Location');
          response = await fetch(redirectUrl);
        }
        
        if (!response.ok) {
          throw new Error(`Google Script responded with status: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: corsHeaders
        });
      } catch (error) {
        console.error("Error occurred:", error);
        return new Response(error.message, {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    
    return new Response('Expected POST', {
      status: 400,
      headers: corsHeaders
    });
  },
};