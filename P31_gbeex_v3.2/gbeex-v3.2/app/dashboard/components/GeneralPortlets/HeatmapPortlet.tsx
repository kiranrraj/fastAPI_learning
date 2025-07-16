"use client";

import React, { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  CompanyContext,
  CompanyContextType,
  Node,
} from "@/app/contexts/company/CompanyContext";
import { Site } from "@/app/types";
import styles from "./HeatmapPortlet.module.css";

// Helper function to get all sites from the active tab's node.
// This is where we get the country and subject data for the heatmap.
const getSitesFromNode = (node: Node | undefined): Site[] => {
  if (!node) return [];
  if ("protocols" in node) return node.protocols.flatMap((p: any) => p.sites);
  if ("sites" in node) return node.sites;
  if ("siteId" in node) return [node]; // If the node itself is a site
  // If it's a company, protocol, or site, we can find sites.
  // If it's a subject, we can't, so we return an empty array.
  return [];
};

export default function HeatmapPortlet() {
  const { activeTabId, openTabs } = useContext(
    CompanyContext
  ) as CompanyContextType;
  const ref = useRef<SVGSVGElement>(null);

  const activeTab = openTabs.find(
    (tab) =>
      ("companyId" in tab
        ? tab.companyId
        : "protocolId" in tab
        ? tab.protocolId
        : "siteId" in tab
        ? tab.siteId
        : tab.subjectId) === activeTabId
  );
  const sites = getSitesFromNode(activeTab);

  useEffect(() => {
    if (!sites || sites.length === 0 || !ref.current) {
      // Clear the SVG if there's no data
      d3.select(ref.current).selectAll("*").remove();
      return;
    }

    // 1. Aggregate Data: Count subjects per country and status
    const countryStatusCounts: { [key: string]: { [key: string]: number } } =
      {};
    const allCountries = new Set<string>();
    const allStatuses = new Set<string>();

    sites.forEach((site) => {
      allCountries.add(site.country);
      site.subjects.forEach((subject) => {
        const status = subject.status;
        allStatuses.add(status);

        if (!countryStatusCounts[site.country]) {
          countryStatusCounts[site.country] = {};
        }
        if (!countryStatusCounts[site.country][status]) {
          countryStatusCounts[site.country][status] = 0;
        }
        countryStatusCounts[site.country][status]++;
      });
    });

    const countries = Array.from(allCountries);
    const statuses = Array.from(allStatuses);

    // 2. D3 Setup
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 100, left: 120 };
    const width = 600 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 3. Create Scales
    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(statuses)
      .padding(0.05);
    const yScale = d3
      .scaleBand()
      .range([height, 0])
      .domain(countries)
      .padding(0.05);
    const maxCount =
      d3.max(
        Object.values(countryStatusCounts).flatMap((d) => Object.values(d))
      ) || 1;
    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, maxCount]);

    // 4. Create Axes
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    chart.append("g").call(d3.axisLeft(yScale));

    // 5. Create a Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", styles.tooltip)
      .style("opacity", 0);

    // 6. Draw the Rectangles for the heatmap
    for (const country of countries) {
      for (const status of statuses) {
        const count = countryStatusCounts[country]?.[status] || 0;
        chart
          .append("rect")
          .attr("x", xScale(status)!)
          .attr("y", yScale(country)!)
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .style("fill", colorScale(count))
          .on("mouseover", (event) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(
                `<strong>${country}</strong><br/>${status}: ${count} subjects`
              )
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          });
      }
    }
  }, [sites]); // Rerun effect when the sites data changes

  return (
    <div className={styles.portlet}>
      <h3 className={styles.portletTitle}>
        Subject Distribution by Country & Status
      </h3>
      <div className={styles.heatmapContainer}>
        {sites.length > 0 ? (
          <svg ref={ref} viewBox="0 0 600 450"></svg>
        ) : (
          <p className={styles.noDataMessage}>
            No site data available to display heatmap.
          </p>
        )}
      </div>
    </div>
  );
}
