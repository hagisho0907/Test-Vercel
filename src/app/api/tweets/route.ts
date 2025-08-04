import { NextRequest, NextResponse } from 'next/server';
import TwitterClient from '@/lib/twitter';

export async function GET(request: NextRequest) {
  console.log('API Route called:', request.url);
  
  const { searchParams } = new URL(request.url);
  const hashtag = searchParams.get('hashtag');
  const maxResults = parseInt(searchParams.get('max_results') || '20');

  console.log('Received params:', { hashtag, maxResults });

  if (!hashtag) {
    console.log('Missing hashtag parameter');
    return NextResponse.json({ error: 'Hashtag parameter is required' }, { status: 400 });
  }

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  console.log('Bearer token available:', !!bearerToken);
  
  if (!bearerToken) {
    console.log('Bearer token not configured');
    return NextResponse.json({ 
      error: 'Twitter API Bearer Token is not configured. Please set TWITTER_BEARER_TOKEN environment variable.' 
    }, { status: 500 });
  }

  try {
    console.log('Creating Twitter client...');
    const twitterClient = new TwitterClient(bearerToken);
    const query = `#${hashtag} -is:retweet lang:en`;
    console.log('Searching for tweets with query:', query);
    
    const tweets = await twitterClient.searchTweets(query, maxResults);
    console.log('Successfully fetched tweets:', tweets.length);
    
    return NextResponse.json({ tweets });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tweets from Twitter API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}