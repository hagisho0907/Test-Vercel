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
    
    // Try multiple query variations to increase chances of finding results
    const queries = [
      `#${hashtag} -is:retweet`,           // Remove language restriction
      `#${hashtag}`,                       // Most basic query
      `${hashtag} -is:retweet`,            // Without # prefix
      `#${hashtag} -is:retweet lang:ja`,   // Japanese language
      `#${hashtag} -is:retweet lang:en`    // English language (original)
    ];
    
    console.log('Trying multiple query variations for hashtag:', hashtag);
    
    for (const query of queries) {
      console.log('Searching for tweets with query:', query);
      try {
        const tweets = await twitterClient.searchTweets(query, maxResults);
        console.log('Query result:', query, '- tweets found:', tweets.length);
        
        if (tweets.length > 0) {
          console.log('Successfully fetched tweets with query:', query);
          return NextResponse.json({ tweets, query_used: query });
        }
      } catch (queryError) {
        console.log('Query failed:', query, 'Error:', queryError);
        continue; // Try next query
      }
    }
    
    // If no queries returned results, return empty array
    console.log('No tweets found with any query variation');
    return NextResponse.json({ tweets: [], message: 'No tweets found for this hashtag' });
    
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tweets from Twitter API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}