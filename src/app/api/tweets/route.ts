import { NextRequest, NextResponse } from 'next/server';
import TwitterClient from '@/lib/twitter';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashtag = searchParams.get('hashtag');
  const maxResults = parseInt(searchParams.get('max_results') || '20');

  if (!hashtag) {
    return NextResponse.json({ error: 'Hashtag parameter is required' }, { status: 400 });
  }

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    return NextResponse.json({ 
      error: 'Twitter API Bearer Token is not configured. Please set TWITTER_BEARER_TOKEN environment variable.' 
    }, { status: 500 });
  }

  try {
    const twitterClient = new TwitterClient(bearerToken);
    const query = `#${hashtag} -is:retweet lang:en`;
    const tweets = await twitterClient.searchTweets(query, maxResults);
    
    return NextResponse.json({ tweets });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tweets from Twitter API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}