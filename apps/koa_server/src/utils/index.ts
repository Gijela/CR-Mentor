/**
 * 获取多个路径的最小公共根目录
 * @param {{ file_path: string; entities: string[] }[]} entityList 路径数组
 * @returns {string} 最小公共根目录
 */
export function getCommonRoot(entityList: { file_path: string, entities: string[] }[]): string {
  if (entityList.length === 0) return ""

  const paths = entityList.map((item) => item.file_path)
  const splitPaths = paths.map((path) => path.split("/"))
  const minLength = Math.min(...splitPaths.map((parts) => parts.length))

  const commonRoot: string[] = []
  for (let i = 0; i < minLength; i++) {
    const segment = splitPaths[0][i]
    if (splitPaths.every((parts) => parts[i] === segment)) {
      commonRoot.push(segment)
    } else {
      break
    }
  }

  return commonRoot.join("/")
}
