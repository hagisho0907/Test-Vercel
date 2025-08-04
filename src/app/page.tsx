'use client';

import { useState } from 'react';

interface Tweet {
  id: string;
  username: string;
  handle: string;
  content: string;
  hashtags: string[];
  timestamp: string;
  likes: number;
  retweets: number;
}

const mockTweets: Tweet[] = [
  {
    id: '1',
    username: 'Tech Enthusiast',
    handle: '@techlover',
    content: 'Just discovered this amazing new framework! The developer experience is incredible. #WebDev #ReactJS #NextJS',
    hashtags: ['WebDev', 'ReactJS', 'NextJS'],
    timestamp: '2h',
    likes: 142,
    retweets: 23
  },
  {
    id: '2',
    username: 'Design Master',
    handle: '@designpro',
    content: 'Working on a new UI kit with modern design principles. Clean, minimal, and functional. #UIDesign #UXDesign #Design',
    hashtags: ['UIDesign', 'UXDesign', 'Design'],
    timestamp: '4h',
    likes: 89,
    retweets: 15
  },
  {
    id: '3',
    username: 'Startup Founder',
    handle: '@startuplife',
    content: 'Building in public is scary but rewarding. Sharing our journey from idea to MVP. #StartupLife #BuildInPublic #Entrepreneur',
    hashtags: ['StartupLife', 'BuildInPublic', 'Entrepreneur'],
    timestamp: '6h',
    likes: 256,
    retweets: 42
  },
  {
    id: '4',
    username: 'AI Researcher',
    handle: '@aiexpert',
    content: 'The future of AI is not about replacing humans, but augmenting human capabilities. #AI #MachineLearning #TechFuture',
    hashtags: ['AI', 'MachineLearning', 'TechFuture'],
    timestamp: '8h',
    likes: 324,
    retweets: 67
  }
];

export default function Home() {
  const [selectedHashtag, setSelectedHashtag] = useState<string>('');
  const [customHashtags, setCustomHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState<string>('');
  
  const defaultHashtags = Array.from(new Set(mockTweets.flatMap(tweet => tweet.hashtags)));
  const allHashtags = [...defaultHashtags, ...customHashtags];
  
  const filteredTweets = selectedHashtag 
    ? mockTweets.filter(tweet => tweet.hashtags.includes(selectedHashtag))
    : mockTweets;

  const addCustomHashtag = () => {
    if (newHashtag.trim() && !allHashtags.includes(newHashtag.trim())) {
      const hashtag = newHashtag.trim().replace(/^#/, '');
      setCustomHashtags([...customHashtags, hashtag]);
      setNewHashtag('');
    }
  };

  const removeCustomHashtag = (hashtagToRemove: string) => {
    setCustomHashtags(customHashtags.filter(tag => tag !== hashtagToRemove));
    if (selectedHashtag === hashtagToRemove) {
      setSelectedHashtag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomHashtag();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            X Hashtag Curator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Discover and explore trending posts by hashtags
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Filter by Hashtag
          </h2>
          
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add custom hashtag (e.g., React, Design)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCustomHashtag}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedHashtag('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedHashtag
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {defaultHashtags.map(hashtag => (
              <button
                key={hashtag}
                onClick={() => setSelectedHashtag(hashtag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedHashtag === hashtag
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                #{hashtag}
              </button>
            ))}
            {customHashtags.map(hashtag => (
              <div
                key={hashtag}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedHashtag === hashtag
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                }`}
              >
                <button
                  onClick={() => setSelectedHashtag(hashtag)}
                  className="flex-1"
                >
                  #{hashtag}
                </button>
                <button
                  onClick={() => removeCustomHashtag(hashtag)}
                  className="ml-1 hover:text-red-500 transition-colors"
                  title="Remove hashtag"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredTweets.map(tweet => (
            <div
              key={tweet.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {tweet.username.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {tweet.username}
                    </h3>
                    <span className="text-gray-500 dark:text-gray-400">
                      {tweet.handle}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">·</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {tweet.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white mt-2 leading-relaxed">
                    {tweet.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tweet.hashtags.map(hashtag => (
                      <span
                        key={hashtag}
                        className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium"
                      >
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-6 mt-4 text-gray-500 dark:text-gray-400">
                    <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{tweet.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>{tweet.retweets}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
