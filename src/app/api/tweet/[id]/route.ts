import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tweetId = params.id;
  console.log('Fetching specific tweet ID:', tweetId);

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    return NextResponse.json({ 
      error: 'Twitter API Bearer Token is not configured.' 
    }, { status: 500 });
  }

  try {
    const url = `https://api.twitter.com/2/tweets/${tweetId}`;
    const params = new URLSearchParams({
      'expansions': 'author_id',
      'tweet.fields': 'created_at,public_metrics,entities',
      'user.fields': 'name,username,profile_image_url',
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('Tweet lookup response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch tweet',
        status: response.status,
        statusText: response.statusText,
        details: data
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      tweet: data,
      tweetId: tweetId
    });

  } catch (error) {
    console.error('Error fetching tweet:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tweet from Twitter API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}