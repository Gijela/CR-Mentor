import type { Diff } from "@/hooks/useAgents"

/**
 * 过滤掉微小变动, 复杂变更就提取实体
 * @param {Diff[]} diffs
 * @returns {Promise<Diff[]>}
 */
export const filterEntity = async (diffs: Diff[]) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}/repo/filterDiffEntity`, {
      method: "POST",
      body: JSON.stringify({ diffs }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

/**
 * 总结 commits Msg 信息
 * @param {string[]} commitsMsgList
 * @returns {Promise<string>}
 */
export const summaryCommitMsg = async (commitsMsgList: string[]) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}/repo/summaryCommitMsg`, {
      method: "POST",
      body: JSON.stringify({ commits: commitsMsgList }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
