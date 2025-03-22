import { useState } from "react";
import { Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";

// 知识图谱数据处理函数
const processKnowledgeGraph = (codeKnowledgeGraph: any) => {
  if (!codeKnowledgeGraph?.nodes || !codeKnowledgeGraph?.edges) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node[] = codeKnowledgeGraph.nodes.map((node: any) => {
    const id = node.id.split("#").pop() || node.id;
    const filePath = node.filePath.split("/").pop() || node.filePath;

    return {
      id: node.id,
      position: { x: Math.random() * 500, y: Math.random() * 500 }, // 实际项目中应该使用布局算法
      data: {
        label: (
          <div className="bg-background p-2 rounded-md border shadow-sm">
            <div className="font-medium text-sm">{id}</div>
            <div className="text-xs text-muted-foreground">{filePath}</div>
            <div className="text-xs text-muted-foreground">{node.type}</div>
          </div>
        ),
        type: node.type,
        implementation: node.implementation,
      },
      type: "default",
    };
  });

  const edges: Edge[] = codeKnowledgeGraph.edges.map((edge: any) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: edge.type,
    type: "smoothstep",
    animated: true,
  }));

  return { nodes, edges };
};

export const ArchitectView = ({
  codeKnowledgeGraph,
}: {
  codeKnowledgeGraph: any;
}) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const { nodes, edges } = processKnowledgeGraph(codeKnowledgeGraph);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Network className="h-4 w-4" />
        <span className="text-sm font-medium">代码知识图谱</span>
      </div>

      {/* 知识图谱可视化 */}
      <Card>
        <CardContent className="p-4">
          <div style={{ height: "500px" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodeClick={(_, node) => setSelectedNode(node)}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      {/* 节点详情对话框 */}
      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>节点详情</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">类型</h4>
              <Badge variant="secondary">{selectedNode?.data?.type}</Badge>
            </div>
            {selectedNode?.data?.implementation && (
              <div>
                <h4 className="text-sm font-medium mb-1">实现代码</h4>
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px] bg-muted p-2 rounded-md">
                      {selectedNode.data.implementation}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 图谱统计信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">节点数量</div>
            <div className="text-2xl font-bold mt-1">{nodes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">关系数量</div>
            <div className="text-2xl font-bold mt-1">{edges.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">类型统计</div>
            <div className="text-2xl font-bold mt-1">
              {new Set(nodes.map((n) => n.data.type)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 完整数据查看按钮 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            查看原始数据
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>知识图谱原始数据</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(codeKnowledgeGraph, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
