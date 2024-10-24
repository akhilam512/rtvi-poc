// [POST] /api
import { defaultBotProfile, defaultMaxDuration } from "@/rtvi.config";

export async function POST(request) {
  try {
    const { services, config } = await request.json();
    console.log('Request body:', { services, config });

    if (!services || !config || !process.env.DAILY_BOTS_URL) {
      console.log('Missing required data:', { services, config, DAILY_BOTS_URL: process.env.DAILY_BOTS_URL });
      return new Response(`Services or config not found on request body`, {
        status: 400,
      });
    }

    const payload = {
      bot_profile: defaultBotProfile,
      max_duration: defaultMaxDuration,
      services,
      api_keys: {
        openai: process.env.OPENAI_API_KEY,
      },
      config: [],
    };

    // Convert the config object to the expected array format
    for (const [service, options] of Object.entries(config)) {
      for (const [key, value] of Object.entries(options)) {
        payload.config.push({ service, options: [{ name: key, value }] });
      }
    }

    console.log('Payload sent to Daily API:', payload);

    const req = await fetch(process.env.DAILY_BOTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await req.json();
    console.log('Response from Daily API:', res);
    console.log('Daily API response status:', req.status);

    if (req.status !== 200) {
      console.log('Error response from Daily API:', res);
      return Response.json(res, { status: req.status });
    }

    return Response.json(res);
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
