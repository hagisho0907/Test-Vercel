import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashtag = searchParams.get('hashtag') || 'test';
  
  console.log('Debug endpoint called with hashtag:', hashtag);
  
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    return NextResponse.json({ 
      error: 'Bearer token not configured',
      hasToken: false
    });
  }

  // Test basic API connectivity
  const testUrl = 'https://api.twitter.com/2/tweets/search/recent';
  const params = new URLSearchParams({
    'query': `#${hashtag}`,
    'max_results': '10',
    'tweet.fields': 'created_at,public_metrics,entities',
  });

  try {
    const response = await fetch(`${testUrl}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      hasToken: true,
      tokenLength: bearerToken.length,
      url: `${testUrl}?${params.toString()}`,
      responseKeys: Object.keys(data),
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Request failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      hasToken: true,
      tokenLength: bearerToken.length
    });
  }
}