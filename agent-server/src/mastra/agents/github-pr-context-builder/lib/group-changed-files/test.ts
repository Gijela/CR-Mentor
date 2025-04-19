import { groupChangedFilesBasedOnDeps } from "."

// pr diff 内容(changedFiles)
const changedFiles = {
  "metadata": {
    "title": "2a",
    "description": "x\r\n\r\n#1 \r\n\r\nCreated by: [@Gijela](https://github.com/Gijela)",
    "author": "cr-mentor[bot]",
    "url": "https://github.com/Gijela/git-analyze/pull/10",
    "state": "open",
    "number": 10,
    "baseRef": "faeture/deploy_vercel",
    "headRef": "main",
    "headSha": "e7d53572eddb7dcc34b69a818b4f11f0a75740d1"
  },
  "associatedIssues": [
    {
      "number": 1,
      "title": "1",
      "url": "https://github.com/Gijela/git-analyze/issues/1",
      "state": "open"
    }
  ],
  "comments": [
    {
      "id": 2790354520,
      "user": "Gijela",
      "body": "test1\r\n",
      "createdAt": "2025-04-09T16:41:19Z",
      "url": "https://github.com/Gijela/git-analyze/pull/10#issuecomment-2790354520"
    }
  ],
  "files": [
    {
      "filename": ".github/workflows/build_dependency_graph.yml",
      "status": "added",
      "changes": 100,
      "additions": 100,
      "deletions": 0
    },
    {
      "filename": ".gitignore",
      "status": "modified",
      "changes": 4,
      "additions": 2,
      "deletions": 2
    },
    {
      "filename": "README-zh.md",
      "status": "added",
      "changes": 304,
      "additions": 304,
      "deletions": 0
    },
    {
      "filename": "README.md",
      "status": "modified",
      "changes": 285,
      "additions": 234,
      "deletions": 51
    },
    {
      "filename": "dist/index.d.ts",
      "status": "added",
      "changes": 134,
      "additions": 134,
      "deletions": 0
    },
    {
      "filename": "dist/index.js",
      "status": "added",
      "changes": 1205,
      "additions": 1205,
      "deletions": 0
    },
    {
      "filename": "example/index.ts",
      "status": "removed",
      "changes": 58,
      "additions": 0,
      "deletions": 58
    },
    {
      "filename": "package.json",
      "status": "modified",
      "changes": 21,
      "additions": 12,
      "deletions": 9
    },
    {
      "filename": "pnpm-lock.yaml",
      "status": "modified",
      "changes": 839,
      "additions": 305,
      "deletions": 534
    },
    {
      "filename": "src/core/codeAnalyzer.ts",
      "status": "modified",
      "changes": 48,
      "additions": 24,
      "deletions": 24
    },
    {
      "filename": "src/index.ts",
      "status": "modified",
      "changes": 16,
      "additions": 8,
      "deletions": 8
    },
    {
      "filename": "src/types/index.ts",
      "status": "modified",
      "changes": 4,
      "additions": 4,
      "deletions": 0
    },
    {
      "filename": "src/utils/analyzeDependencies.ts",
      "status": "added",
      "changes": 20,
      "additions": 20,
      "deletions": 0
    },
    {
      "filename": "tsconfig.json",
      "status": "modified",
      "changes": 6,
      "additions": 3,
      "deletions": 3
    }
  ]
} as any

// 文件依赖图数据(dependencyGraph)
const dependencyGraph = {
  "src/core/codeAnalyzer.ts": {
    "dependencies": [],
    "dependents": ["src/index.ts"]
  },
  "src/core/errors.ts": {
    "dependencies": [],
    "dependents": [
      "src/core/gitAction.ts",
      "src/core/scanner.ts",
      "src/index.ts"
    ]
  },
  "src/core/gitAction.ts": {
    "dependencies": ["src/core/errors.ts"],
    "dependents": ["src/index.ts"]
  },
  "src/core/scanner.ts": {
    "dependencies": ["src/utils/index.ts", "src/core/errors.ts"],
    "dependents": ["src/index.ts"]
  },
  "src/utils/index.ts": {
    "dependencies": ["src/utils/graphSearch.ts"],
    "dependents": ["src/core/scanner.ts", "src/index.ts"]
  },
  "src/utils/graphSearch.ts": {
    "dependencies": [],
    "dependents": ["src/utils/index.ts", "src/index.ts"]
  },
  "src/index.ts": {
    "dependencies": [
      "src/core/codeAnalyzer.ts",
      "src/core/errors.ts",
      "src/core/gitAction.ts",
      "src/core/scanner.ts",
      "src/utils/analyzeDependencies.ts",
      "src/utils/graphSearch.ts",
      "src/utils/index.ts"
    ],
    "dependents": []
  },
  "src/utils/analyzeDependencies.ts": {
    "dependencies": [],
    "dependents": ["src/index.ts"]
  },
  "src/types/index.ts": {
    "dependencies": [],
    "dependents": []
  }
}

// 测试
const fileGroups = groupChangedFilesBasedOnDeps(changedFiles.files, dependencyGraph)
console.log(fileGroups)
