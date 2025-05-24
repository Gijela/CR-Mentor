import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, ZoomInIcon, ZoomOutIcon, RefreshCwIcon } from "lucide-react";
import type { StrengthItem } from "./DataTable";
import * as d3 from "d3";
import { ResponsiveContainer } from "recharts";

interface SkillNetworkGraphProps {
  strengths: StrengthItem[];
  title?: string;
  description?: string;
}

// 定义节点和边的类型
interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  value: number; // 大小
  color: string; // 颜色
  category: string; // 分类
  x?: number;
  y?: number;
}

interface Edge extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number; // 关联强度
}

interface GraphData {
  nodes: Node[];
  links: Edge[];
}

// 生成技能之间的关联数据
function generateNetworkData(strengths: StrengthItem[]): GraphData {
  // 安全的默认值
  if (!strengths.length) {
    return { nodes: [], links: [] };
  }

  // 定义固定的颜色数组
  const colorPalette: string[] = [
    "#2563eb", // 蓝色
    "#10b981", // 绿色
    "#f59e0b", // 橙色
    "#ef4444", // 红色
    "#8b5cf6", // 紫色
    "#ec4899", // 粉色
    "#06b6d4", // 青色
  ];

  // 手动创建节点和边
  const nodes: Node[] = [];
  const links: Edge[] = [];

  // 先提取所有有效的技能类别
  const skillCategories = strengths
    .map((s) => s.category_or_area)
    .filter((category): category is string => !!category);

  // 删除重复项
  const uniqueCategories = Array.from(new Set(skillCategories));

  // 计算每个类别的统计信息
  const categoryStats = uniqueCategories.map((category) => {
    const items = strengths.filter((s) => s.category_or_area === category);
    const count = items.length;
    const totalConfidence = items.reduce(
      (sum, item) => sum + (item.confidence || 0.5),
      0
    );
    const avgConfidence = totalConfidence / count;

    return {
      category,
      count,
      confidence: avgConfidence,
    };
  });

  // 创建节点
  categoryStats.forEach((stat, index) => {
    const colorIndex = index % colorPalette.length;

    nodes.push({
      id: stat.category,
      name: stat.category,
      value: Math.max(10, Math.min(25, stat.count * 3 + 10)), // 限制大小范围
      color: colorPalette[colorIndex],
      category: stat.category,
    });
  });

  // 创建边
  for (let i = 0; i < nodes.length; i++) {
    const source = nodes[i];

    for (let j = i + 1; j < nodes.length; j++) {
      const target = nodes[j];

      // 找到对应的统计信息
      const sourceStats = categoryStats.find((s) => s.category === source.id);
      const targetStats = categoryStats.find((s) => s.category === target.id);

      if (sourceStats && targetStats) {
        // 计算关联强度 - 更加真实的算法
        const sharedItems = strengths.filter(
          (s) =>
            s.category_or_area === source.id || s.category_or_area === target.id
        );

        // 基于共同的知识数量和相对重要性计算关联强度
        const relationshipStrength = Math.min(
          3, // 最大宽度限制
          Math.max(
            0.5, // 最小宽度
            (sourceStats.confidence + targetStats.confidence) *
              Math.min(2, sharedItems.length / 5) // 基于共享项目数的缩放因子
          )
        );

        // 只添加超过阈值的边
        links.push({
          source: source.id,
          target: target.id,
          value: relationshipStrength,
        });
      }
    }
  }

  return { nodes, links };
}

export function SkillNetworkGraph({
  strengths,
  title = "技能关联网络",
  description = "显示不同技能领域之间的关联关系",
}: SkillNetworkGraphProps) {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

  // 生成网络数据
  useEffect(() => {
    if (strengths.length > 0) {
      setGraphData(generateNetworkData(strengths));
    }
  }, [strengths]);

  // 创建力导向图
  useEffect(() => {
    if (!graphData.nodes.length || !svgElement) return;

    // 清除之前的图形
    d3.select(svgElement).selectAll("*").remove();

    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;

    // 创建力导向模拟
    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink(graphData.links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.value + 10)
      );

    // 创建缩放行为
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    // 应用缩放行为到SVG
    const svg = d3.select(svgElement).call(zoom);

    // 创建容器组
    const g = svg.append("g");

    // 创建箭头标记
    g.append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#999");

    // 绘制连接线
    const link = g
      .append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", (d: any) => d.value)
      .attr("stroke", "#999")
      .style("stroke-dasharray", "5,5")
      .style("opacity", 0.7);

    // 创建节点组
    const node = g
      .append("g")
      .selectAll(".node")
      .data(graphData.nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(selectedNode === d.id ? null : d.id);
      });

    // 绘制节点圆形
    node
      .append("circle")
      .attr("r", (d: any) => d.value)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))");

    // 添加节点文本
    node
      .append("text")
      .text((d: any) => d.name)
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#fff")
      .attr("font-size", 10)
      .style("pointer-events", "none");

    // 设置模拟的tick函数，控制动画
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // 添加拖拽行为
    node.call(
      d3
        .drag<SVGGElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    // 添加选中高亮效果
    const updateHighlight = () => {
      if (selectedNode) {
        // 高亮选中节点及其连接
        node.select("circle").attr("fill", (d: any) => {
          return d.id === selectedNode ? d.color : "rgba(150, 150, 150, 0.5)";
        });

        link.style("opacity", (d: any) => {
          return d.source.id === selectedNode || d.target.id === selectedNode
            ? 1
            : 0.2;
        });
      } else {
        // 重置所有高亮
        node.select("circle").attr("fill", (d: any) => d.color);
        link.style("opacity", 0.7);
      }
    };

    // 初始更新高亮
    updateHighlight();

    // 监听selectedNode变化
    const selectedNodeEffect = () => {
      updateHighlight();
    };

    // 添加节点悬停效果
    node
      .on("mouseenter", function (event, d: any) {
        d3.select(this)
          .select("circle")
          .attr("r", (d: any) => d.value + 2);
      })
      .on("mouseleave", function (event, d: any) {
        d3.select(this)
          .select("circle")
          .attr("r", (d: any) => d.value);
      });

    // 清理函数
    return () => {
      simulation.stop();
    };
  }, [graphData, svgElement, selectedNode]);

  // 重置缩放
  const resetZoom = () => {
    if (svgElement) {
      d3.select(svgElement)
        .transition()
        .duration(750)
        .call(
          d3.zoom().transform as any,
          d3.zoomIdentity,
          d3
            .zoomTransform(svgElement)
            .invert([svgElement.clientWidth / 2, svgElement.clientHeight / 2])
        );
      setZoomLevel(1);
    }
  };

  // 放大
  const zoomIn = () => {
    if (svgElement) {
      d3.select(svgElement)
        .transition()
        .duration(300)
        .call(d3.zoom().scaleBy as any, 1.2, [
          svgElement.clientWidth / 2,
          svgElement.clientHeight / 2,
        ]);
      setZoomLevel(Math.min(3, zoomLevel * 1.2));
    }
  };

  // 缩小
  const zoomOut = () => {
    if (svgElement) {
      d3.select(svgElement)
        .transition()
        .duration(300)
        .call(d3.zoom().scaleBy as any, 0.8, [
          svgElement.clientWidth / 2,
          svgElement.clientHeight / 2,
        ]);
      setZoomLevel(Math.max(0.5, zoomLevel * 0.8));
    }
  };

  // 如果没有数据，显示提示信息
  if (strengths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-center text-muted-foreground">暂无技能数据</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {graphData.nodes.map((node) => (
                <Badge
                  key={node.id}
                  variant={selectedNode === node.id ? "default" : "outline"}
                  style={{
                    borderColor: node.color,
                    backgroundColor:
                      selectedNode === node.id ? node.color : undefined,
                  }}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedNode(selectedNode === node.id ? null : node.id)
                  }
                >
                  {node.name}
                </Badge>
              ))}
            </div>
            {/* <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOutIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={resetZoom}
              >
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomInIcon className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
        </div>

        <div
          className="relative"
          style={{ height: "400px", overflow: "hidden" }}
          onClick={() => setSelectedNode(null)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <div className="w-full h-full">
              <svg className="w-full h-full" ref={setSvgElement} />
            </div>
          </ResponsiveContainer>

          {selectedNode && (
            <div className="absolute bottom-3 right-3 bg-popover p-2 rounded-md shadow-md text-sm">
              <p className="font-medium">{selectedNode}</p>
              <p className="text-xs text-muted-foreground">点击背景重置视图</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1">
          <InfoIcon className="h-3 w-3" />
          <span>节点大小代表技能数量，线条粗细代表关联强度</span>
        </div>
        <div>
          <span>缩放: {Math.round(zoomLevel * 100)}%</span>
        </div>
      </CardFooter>
    </Card>
  );
}
