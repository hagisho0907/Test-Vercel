# X Hashtag Curator

A Next.js application that curates and displays X (formerly Twitter) posts by hashtags. The app supports both mock data for development and real-time data from the X API v2.

## Features

- **Hashtag Filtering**: Filter posts by predefined or custom hashtags
- **Real-time Data**: Fetch live tweets from X API v2
- **Mock Data Mode**: Development mode with sample data
- **Custom Hashtags**: Add and remove your own hashtag filters
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Automatic dark/light theme support

## Getting Started

### Prerequisites

- Node.js 18+ 
- X API v2 Bearer Token (for live data)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Configure your X API credentials in `.env.local`:

```env
TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
```

### Getting X API Access

1. Go to the [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use an existing one
3. Navigate to "Keys and Tokens"
4. Generate a Bearer Token
5. Copy the Bearer Token to your `.env.local` file

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Usage

1. **Mock Data Mode** (default): Uses sample tweets for development
2. **Live Data Mode**: Click the "📝 Mock Data" button to switch to "🔴 Live Data"
3. **Filter by Hashtag**: Click on any hashtag button to filter posts
4. **Add Custom Hashtags**: Use the input field to add your own hashtags
5. **Remove Hashtags**: Click the "×" button on custom hashtags to remove them

## Configuration

The app works in two modes:

- **Mock Mode**: No API keys required, uses sample data
- **Live Mode**: Requires X API Bearer Token in environment variables

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
