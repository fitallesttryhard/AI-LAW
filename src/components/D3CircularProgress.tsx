import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3CircularProgressProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function D3CircularProgress({ 
  progress, 
  size = 40, 
  strokeWidth = 4,
  color = '#3b82f6' // blue-500
}: D3CircularProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const radius = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;

    // Background circle
    svg.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#e2e8f0') // slate-200
      .attr('stroke-width', strokeWidth);

    // Progress arc
    const arc = d3.arc()
      .innerRadius(radius)
      .outerRadius(radius)
      .startAngle(0);

    const foreground = svg.append('path')
      .datum({ endAngle: 0 })
      .attr('d', arc as any)
      .attr('transform', `translate(${cx},${cy})`)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round');

    // Text inside
    svg.append('text')
      .attr('x', cx)
      .attr('y', cy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#64748b') // slate-500
      .attr('font-size', size * 0.28)
      .attr('font-weight', 'bold')
      .text(`${progress}%`);

    // Animation
    const targetAngle = (progress / 100) * (2 * Math.PI);
    foreground.transition()
      .duration(1000)
      .attrTween('d', function(d: any) {
        const interpolate = d3.interpolate(d.endAngle, targetAngle);
        return function(t) {
          d.endAngle = interpolate(t);
          return arc(d) as string;
        };
      });

  }, [progress, size, strokeWidth, color]);

  return (
    <svg ref={svgRef} width={size} height={size} className="overflow-visible" />
  );
}
