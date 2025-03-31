export interface CodeReviewInput {
    project: {
        url: string;
    };
    changes: {
        files: FileChange[];
        commits: Commit[];
    };
}

export interface FileChange {
    sha: string;
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
}

export interface Commit {
    sha: string;
    node_id: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        committer: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
        tree: {
            sha: string;
            url: string;
        };
        url: string;
        comment_count: number;
        verification: {
            verified: boolean;
            reason: string;
            signature: null | string;
            payload: null | string;
            verified_at: null | string;
        };
    };
    url: string;
    html_url: string;
    comments_url: string;
    author: null | User;
    committer: null | User;
    parents: Parent[];
}

export interface User {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

export interface Parent {
    sha: string;
    url: string;
    html_url: string;
} 