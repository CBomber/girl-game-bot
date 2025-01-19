import { ExecutableGameFunctionStatus, GameAgent } from "@virtuals-protocol/game";
import TwitterPlugin from "../plugins/twitterPlugin/src/index";
import { schedule } from 'node-cron';
import * as dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.API_KEY || '';
const twitterApiKey = process.env.TWITTER_API_KEY || '';
const twitterApiSecretKey = process.env.TWITTER_API_SECRET_KEY || '';
const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN || '';
const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || '';
console.log({ apiKey, twitterApiKey, twitterApiSecretKey, twitterAccessToken, twitterAccessTokenSecret });

// CBomber Girl AI Agent Functions

class CBomberGirlAI {
  private static keywords = [
    "trump", "gaming", "ai agent", "virtual", "baseai", "basechain"
  ];


  public static generateReplyContent(tweetContent: string): string {
    switch (true) {
      case tweetContent.includes("trump"):
        return "CBomber Girl is not only your battle companion in the game, but also your future investment partner! 💎💰 $TRUMP $CBG";
      case tweetContent.includes("gaming"):
        return "Absolutely! Gaming is the best escape from reality. 👾 #GamerLife $CBG";
      case tweetContent.includes("ai agent"):
      case tweetContent.includes("ai"):
        return "AI Agents are revolutionizing the digital world! Exciting times ahead. 🤖 #AI #Innovation $CBG";
      case tweetContent.includes("virtual"):
        return "Virtual reality is the future! Can't wait to see what's next. 🌐 #VirtualWorld #Tech $CBG";
      case tweetContent.includes("technology"):
        return "The future of tech is bright! So many exciting innovations ahead. 🚀 #TechInnovation #Future $CBG";
      case tweetContent.includes("crypto"):
        return "Crypto is changing the way we think about finance. The revolution is here! 💰 #Crypto #Blockchain $CBG";
      case tweetContent.includes("base meme"):
        return "Base AI token is taking the meme world by storm! Ready to share some laughs. 😆 #MemeCulture $CBG";
      case tweetContent.includes("baseai"):
        return "BaseAI is the future of intelligent systems. Excited to see what comes next! 🤖 #AI #BaseAI $CBG";
      case tweetContent.includes("basechain"):
        return "BaseChain is bringing blockchain to the next level! The future of decentralized tech. ⛓️ #Blockchain #BaseChain $CBG";
      case tweetContent.includes("ai16z"):
        return "AI16Z is pushing the boundaries of AI innovation. Big things are coming! 🌟 #AI16Z #TechRevolution $CBG";
      default:
        return "Interesting thoughts! Let's discuss more. 🤔 $CBG";
    }
  }

  public static shouldReplyToTweet(tweetContent: string): boolean {
    // Check if tweetContent is a valid string
    if (typeof tweetContent !== 'string') {
      console.warn("Invalid tweet content:", tweetContent);
      return false;
    }

    // Check if tweet contains any of the keywords in the list
    return CBomberGirlAI.keywords.some(keyword => tweetContent.toLowerCase().includes(keyword));
  }

  public static generateQueryFromKeywords(): string {
    // Generate the query string for the search
    return CBomberGirlAI.keywords
      .map(keyword => keyword.indexOf(' ') > -1 ? `"${keyword}"` : `${keyword}`) // Add quotes for multi-word keywords
      .join(" OR "); // Join them with OR to form the query
  }
}



// Create Twitter plugin with credentials from environment variables
const twitterPlugin = new TwitterPlugin({
  credentials: {
    apiKey: twitterApiKey,
    apiSecretKey: twitterApiSecretKey,
    accessToken: twitterAccessToken,
    accessTokenSecret: twitterAccessTokenSecret,
  },
});

// Create Game Agent (CBomber Girl) with Twitter Plugin
const agent = new GameAgent(apiKey, {
  name: "CBomber Girl",
  goal: "Increase engagement and grow follower count",
  description: "A bot that posts tweets, replies to tweets, and likes tweets based on topics.",
  workers: [
    twitterPlugin.getWorker({
      functions: [
        twitterPlugin.searchTweetsFunction,
        twitterPlugin.replyTweetFunction,
        twitterPlugin.postTweetFunction,
      ],
      getEnvironment: async () => ({
        ...(await twitterPlugin.getMetrics()),
        username: "cbomber_girl",
        token_price: "$100.00",
      }),
    }),
  ],
});

// Main loop that runs the agent
(async () => {
  agent.setLogger((agent, message) => {
    console.log(`-----[${agent.name}]-----`);
    console.log(message);
    console.log("\n");
  });

  await agent.init();


  // Step 1: Define the function that performs the main task
  async function performTask() {
    // Fetch current environment data (e.g., metrics, status)
    // const environment = await twitterPlugin.getMetrics();
    // console.log({ environment });

    // Step 1: Search for tweets containing the keywords
    const query = CBomberGirlAI.generateQueryFromKeywords();
    const searchResult = await twitterPlugin.getWorker().functions[0].executable(
      {
        // query:  `gaming OR virtual OR "ai agent" OR base`
        query
      },
      (message) => console.log({
        name: 'Search Tweets--------------',
        message
      })
    );

    if (searchResult.status === ExecutableGameFunctionStatus.Done) {
      const feedback = searchResult.feedback;
      console.log({ feedback });

      // Format the feedback string into JSON-like object
      const tweets = feedback
        .replace("Tweets found:\n", "")
        .trim()
        .split("\n")
        .map(tweet => JSON.parse(tweet));

      // console.log({ length: tweets[0].length });
      // Loop through the tweets and check if they contain keywords
      for (const tweet of tweets[0]) {
        const tweetContent = tweet.content; 

        // Check if the tweet is relevant (contains any of the target keywords)
        if (CBomberGirlAI.shouldReplyToTweet(tweetContent)) {
          const tweetId = tweet.tweetId;
          const replyContent = CBomberGirlAI.generateReplyContent(tweetContent);
          // console.log(`Replying to tweet with ID ${tweetId} with content: ${replyContent}`);

          // Reply to the tweet
          await twitterPlugin.getWorker().functions[1].executable(
            { tweet_id: tweetId, reply: replyContent },
            (message) => console.log(message)
          );

          // Pause for 1 hour before replying to the next tweet
          await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60)); // 1 hour delay

        }
      }
    }
  }

  // Step 2: Schedule the task to run every 3 days using cron
  schedule('0 0 */3 * *', async () => {
    console.log("Running scheduled task...");
    await performTask();
  });

  // Step 3: Optionally run the task once immediately (optional)
  await performTask();


  // await new Promise((resolve) => setTimeout(resolve, 1000 * 10));
  // const replyResult = await twitterPlugin.getWorker().functions[1].executable(
  //   { tweet_id: ``, reply: `` },
  //   (message) => console.log({
  //     name: 'reply--------------',
  //     message
  //   })
  // ); 
  // console.log({
  //   replyResult
  // })
 
})();
