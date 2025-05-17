// agent 额外信息
export const agentExtraInfoMap = {
  dbChatAgent: {
    description: "Ability to interact with databases",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=5534551242421",
    hasMemory: true,
    suggestions: [
      {
        title: "What were my common mistakes",
        subtitle: "in API design previously"
      },
      {
        title: "What are my recent coding strengths",
        subtitle: "according to my saved insights"
      },
      {
        title: "How did I resolve the N+1 query problem",
        subtitle: "find the notes in my knowledge base."
      },
      {
        title: "What are the best practices of TypeScript",
        subtitle: "for error handling"
      }
    ],
  },
  prAnalyzeAgent: {
    description: "Ability to analyze PRs and interact with databases",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=41",
    hasMemory: false,
    suggestions: [
      {
        title: "Recall feedback from past PRs",
        subtitle: "What insights were noted?"
      },
      {
        title: "Issues in PR 'owner/repo' #X?",
        subtitle: "Show past comments/solutions."
      },
      {
        title: "Recall DB connection pool fix",
        subtitle: "or find React server component notes."
      },
      {
        title: "My common coding pitfalls from PRs?",
        subtitle: "And my recognized strengths?"
      }
    ]
  },
  commitsAnalyzeAgent: {
    description: "Ability to analyze commits and interact with databases",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=",
    hasMemory: false,
    suggestions: [
      {
        title: "Insights from past commit reports?",
        subtitle: "Show developer profile updates."
      },
      {
        title: "Knowledge from commit analyses?",
        subtitle: "Find saved solutions/patterns."
      }
    ]
  },
};
