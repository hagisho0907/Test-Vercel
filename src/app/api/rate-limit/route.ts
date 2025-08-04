import { NextResponse } from 'next/server';

export async function GET() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    return NextResponse.json({ 
      error: 'Twitter API Bearer Token is not configured.' 
    }, { status: 500 });
  }

  try {
    // Use a lightweight endpoint to check rate limits
    const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=test&max_results=10', {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Extract rate limit headers
    const rateLimitLimit = response.headers.get('x-rate-limit-limit');
    const rateLimitRemaining = response.headers.get('x-rate-limit-remaining');
    const rateLimitReset = response.headers.get('x-rate-limit-reset');

    let resetTime = null;
    let minutesLeft = 0;
    let isLimited = false;

    if (rateLimitReset) {
      resetTime = new Date(parseInt(rateLimitReset) * 1000);
      const now = new Date();
      minutesLeft = Math.max(0, Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60)));
      isLimited = parseInt(rateLimitRemaining || '0') === 0;
    }

    return NextResponse.json({
      limit: parseInt(rateLimitLimit || '0'),
      remaining: parseInt(rateLimitRemaining || '0'),
      reset: rateLimitReset ? parseInt(rateLimitReset) : null,
      resetTime: resetTime ? resetTime.toISOString() : null,
      minutesLeft,
      isLimited,
      status: response.status
    });

  } catch (error) {
    console.error('Error checking rate limit:', error);
    return NextResponse.json({ 
      error: 'Failed to check rate limit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}