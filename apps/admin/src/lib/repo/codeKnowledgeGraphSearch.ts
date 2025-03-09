export interface KnowledgeNode {
  id: string
  name: string
  type: string
  filePath: string
  location: {
    file: string
    line: number
  }
  description?: string
  properties?: Record<string, any>
  implementation?: string
}

export interface KnowledgeEdge {
  source: string
  target: string
  type: string
  properties?: Record<string, any>
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

export interface SearchOptions {
  entities: string[] // 实体名称数组
  relationTypes?: string[] // 按关系类型过滤
  maxDistance?: number // 关系距离限制
  limit?: number // 结果数量限制
}

export interface SearchResult {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
  metadata: {
    totalNodes: number
    totalEdges: number
    entities: string[]
    relationTypes: string[]
    maxDistance: number
  }
}

interface RelatedNodesResult {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

function findRelatedNodes(
  graph: KnowledgeGraph,
  startNodes: KnowledgeNode[],
  maxDistance: number,
): RelatedNodesResult {
  const relatedNodes = new Set<KnowledgeNode>()
  const relatedEdges = new Set<KnowledgeEdge>()
  const processedNodeIds = new Set<string>()

  function processNode(node: KnowledgeNode, distance: number) {
    if (distance > maxDistance || processedNodeIds.has(node.id)) return
    processedNodeIds.add(node.id)
    relatedNodes.add(node)

    // 1. 查找直接相关的边
    const directEdges = graph.edges.filter((edge) =>
      edge.source === node.id || edge.target === node.id,
    )

    directEdges.forEach((edge) => {
      relatedEdges.add(edge)

      // 处理边的另一端节点
      const otherId = edge.source === node.id ? edge.target : edge.source
      const otherNode = graph.nodes.find((n) => n.id === otherId)

      if (otherNode && !processedNodeIds.has(otherNode.id)) {
        processNode(otherNode, distance + 1)
      }
    })

    // 2. 查找类和方法的关系
    if (node.type === "class") {
      // 先找到类的所有方法
      const methodNodes = graph.nodes.filter((n) => {
        if (n.type !== "function" && n.type !== "class_method") return false
        if (n.filePath !== node.filePath) return false
        if (n.name === "constructor") return false

        // 检查方法是否属于这个类
        const classNode = graph.nodes.find((c) =>
          c.type === "class" &&
          c.filePath === n.filePath &&
          c.id === `${n.id.split("#")[0]}#${node.name}`,
        )
        return classNode !== undefined
      })

      methodNodes.forEach((methodNode) => {
        if (!processedNodeIds.has(methodNode.id)) {
          // 添加 defines 关系
          const edge: KnowledgeEdge = {
            source: node.id,
            target: methodNode.id,
            type: "defines",
            properties: {},
          }
          relatedEdges.add(edge)
          processNode(methodNode, distance + 1)
        }
      })
    }

    // 3. 查找继承关系
    if (node.type === "class" && node.name.endsWith("Error")) {
      const parentNode = graph.nodes.find((n) => n.name === "Error")
      if (parentNode && !processedNodeIds.has(parentNode.id)) {
        const edge: KnowledgeEdge = {
          source: node.id,
          target: "Error",
          type: "extends",
          properties: {},
        }
        relatedEdges.add(edge)
        processNode(parentNode, distance + 1)
      }
    }
  }

  // 从每个起始节点开始处理
  startNodes.forEach((node) => processNode(node, 0))

  return {
    nodes: Array.from(relatedNodes),
    edges: Array.from(relatedEdges),
  }
}

/**
 * 基于实体名称列表搜索关联的知识图谱
 * @param graph 知识图谱
 * @param options 搜索选项
 * @returns 搜索结果
 */
export function searchKnowledgeGraph(
  graph: KnowledgeGraph,
  options: SearchOptions,
): SearchResult {
  const { entities, maxDistance = 2 } = options

  // 1. 找到起始节点
  const startNodes = graph.nodes.filter((node) =>
    entities.includes(node.name),
  )

  if (startNodes.length === 0) {
    console.warn(`[Warning] No nodes found for entities:`, entities)
    return {
      nodes: [],
      edges: [],
      metadata: {
        totalNodes: 0,
        totalEdges: 0,
        entities,
        relationTypes: [],
        maxDistance,
      },
    }
  }

  // 2. 找到相关节点和边
  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance)

  // 3. 添加类和方法的关系
  const methodNodes = nodes.filter((n) => n.type === "function" || n.type === "class_method")
  const classNodes = nodes.filter((n) => n.type === "class")

  methodNodes.forEach((method) => {
    const className = method.id.split("#")[1]
    const relatedClass = classNodes.find((c) => c.name === className)
    if (relatedClass) {
      edges.push({
        source: relatedClass.id,
        target: method.id,
        type: "defines",
        properties: {},
      })
    }
  })

  // 4. 添加继承关系
  const errorClasses = classNodes.filter((n) => n.name.endsWith("Error"))
  errorClasses.forEach((errorClass) => {
    edges.push({
      source: errorClass.id,
      target: "Error",
      type: "extends",
      properties: {},
    })
  })

  return {
    nodes,
    edges,
    metadata: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      entities,
      relationTypes: Array.from(new Set(edges.map((e) => e.type))),
      maxDistance,
    },
  }
}

// function printGraphStats(graph: KnowledgeGraph) {
//   console.log('Nodes:', graph.nodes.length);
//   console.log('Edges:', graph.edges.length);
//   console.log('Unique Relationships:',
//     new Set(graph.edges.map(e => `${e.type}:${e.source}->${e.target}`)).size
//   );
// }
