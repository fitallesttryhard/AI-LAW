import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TimelineEvent {
  id: string;
  year: number;
  text: string;
  color: string;
}

interface D3TimelineProps {
  events: TimelineEvent[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function D3Timeline({ events, selectedId, onSelect }: D3TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || events.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 120;
    const margin = { top: 40, right: 40, bottom: 20, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const minYear = d3.min(events, d => d.year) || 1990;
    const maxYear = d3.max(events, d => d.year) || new Date().getFullYear();

    const xScale = d3.scaleLinear()
      .domain([minYear - 2, maxYear + 2])
      .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(5);

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .attr('class', 'text-slate-500 font-sans text-xs')
      .call(xAxis)
      .select('.domain').attr('stroke', '#e2e8f0'); // slate-200

    svg.selectAll('.tick line').attr('stroke', '#e2e8f0');
    svg.selectAll('.tick text').attr('fill', '#64748b'); // slate-500

    // Timeline baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', height / 2)
      .attr('y2', height / 2)
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 2);

    const getColor = (colorStr: string) => {
      switch (colorStr) {
        case 'blue': return '#3b82f6';
        case 'amber': return '#f59e0b';
        case 'emerald': return '#10b981';
        case 'slate': default: return '#64748b';
      }
    };

    // Events
    const nodes = svg.selectAll('.event-node')
      .data(events)
      .enter()
      .append('g')
      .attr('class', 'event-node cursor-pointer')
      .attr('transform', d => `translate(${xScale(d.year)}, ${height / 2})`)
      .on('click', (event, d) => {
        onSelect(d.id);
      });

    // Connections to baseline
    nodes.append('line')
      .attr('y1', 0)
      .attr('y2', (d, i) => i % 2 === 0 ? -20 : 20)
      .attr('stroke', d => getColor(d.color))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '2,2');

    // Circles
    nodes.append('circle')
      .attr('r', d => d.id === selectedId ? 8 : 6)
      .attr('fill', '#ffffff') // white
      .attr('stroke', d => getColor(d.color))
      .attr('stroke-width', d => d.id === selectedId ? 4 : 2)
      .style('transition', 'all 0.2s');

    // Labels
    nodes.append('text')
      .attr('y', (d, i) => i % 2 === 0 ? -28 : 34)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.id === selectedId ? '#0f172a' : '#334155') // slate-900/slate-700
      .attr('font-size', '10px')
      .attr('font-weight', d => d.id === selectedId ? 'bold' : 'normal')
      .text(d => d.year);
      
    nodes.append('text')
      .attr('y', (d, i) => i % 2 === 0 ? -40 : 46)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b') // slate-500
      .attr('font-size', '9px')
      .text(d => d.text.length > 15 ? d.text.substring(0, 15) + '...' : d.text);

  }, [events, selectedId, onSelect]);

  return (
    <div className="w-full h-[120px] bg-white border border-slate-200 rounded-xl shadow-lg relative overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">D3 Timeline Visualization</div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
