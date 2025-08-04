export interface TwitterTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  entities?: {
    hashtags?: Array<{
      start: number;
      end: number;
      tag: string;
    }>;
  };
}

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface TwitterApiResponse {
  data?: TwitterTweet[];
  includes?: {
    users?: TwitterUser[];
  };
  meta?: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
  };
}

export interface ProcessedTweet {
  id: string;
  username: string;
  handle: string;
  content: string;
  hashtags: string[];
  timestamp: string;
  likes: number;
  retweets: number;
  profileImage?: string;
}

class TwitterClient {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken;
  }

  private async makeRequest(endpoint: string, params: URLSearchParams): Promise<TwitterApiResponse> {
    const url = `${this.baseUrl}${endpoint}?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchTweets(query: string, maxResults: number = 20): Promise<ProcessedTweet[]> {
    const params = new URLSearchParams({
      'query': query,
      'max_results': maxResults.toString(),
      'expansions': 'author_id',
      'tweet.fields': 'created_at,public_metrics,entities',
      'user.fields': 'name,username,profile_image_url',
    });

    try {
      const response = await this.makeRequest('/tweets/search/recent', params);
      return this.processTweets(response);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  }

  private processTweets(response: TwitterApiResponse): ProcessedTweet[] {
    if (!response.data) return [];

    const users = response.includes?.users || [];
    const userMap = new Map(users.map(user => [user.id, user]));

    return response.data.map(tweet => {
      const author = userMap.get(tweet.author_id);
      const hashtags = tweet.entities?.hashtags?.map(tag => tag.tag) || [];
      
      return {
        id: tweet.id,
        username: author?.name || 'Unknown User',
        handle: `@${author?.username || 'unknown'}`,
        content: tweet.text,
        hashtags,
        timestamp: this.formatTimestamp(tweet.created_at),
        likes: tweet.public_metrics.like_count,
        retweets: tweet.public_metrics.retweet_count,
        profileImage: author?.profile_image_url,
      };
    });
  }

  private formatTimestamp(createdAt: string): string {
    const tweetDate = new Date(createdAt);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - tweetDate.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return tweetDate.toLocaleDateString();
  }
}

export default TwitterClient;