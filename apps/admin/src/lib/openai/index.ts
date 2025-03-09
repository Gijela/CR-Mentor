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
