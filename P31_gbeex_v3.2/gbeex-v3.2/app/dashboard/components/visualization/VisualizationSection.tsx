// app/dashboard/components/visualization/VisualizationSection.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useDetailContext } from "@/app/contexts/detail/DetailContext";
import styles from "./VisualizationSection.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

// Charts
import DelayBarChart from "./DelayBarChart";
import EnrollmentCompletionScatter from "./EnrollmentCompletionScatter";
import SitePerformanceRadar from "./SitePerformanceRadar";
import DemographicsPieCharts from "@/app/dashboard/components/visualization/DemographicsPieCharts";
import VisitHistogram from "./VisitHistogram";
import ComplicationsHeatmap from "./ComplicationsHeatmap";
import ProtocolCompletionPieChart from "./ProtocolCompletionPieChart";
import ProtocolEnrollmentLineChart from "@/app/dashboard/components/visualization/ProtocolEnrolmentLineChart";
import SiteHeatmap from "@/app/dashboard/components/visualization/SiteHeatmap";

import type { Protocol as RawProtocol, Site, Subject } from "@/app/types";

export default function VisualizationSection({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { nodeType, company, protocol, site } = useDetailContext();
  const [activeTab, setActiveTab] = useState("delayBarChart"); // State to manage active tab

  // 0) protocols array per view
  const protocolsForChart = useMemo<RawProtocol[]>(() => {
    if (nodeType === "company" && company?.protocols) return company.protocols;
    if (nodeType === "protocol" && protocol) return [protocol];
    return [];
  }, [nodeType, company, protocol]);

  // 1) Delay items
  interface DelayItem {
    id: string;
    label: string;
    expected: number;
    actual: number;
    reason: string;
  }
  const delayData = useMemo<DelayItem[]>(() => {
    return protocolsForChart.map((p) => {
      const td = p.timelineDelays;
      const exp = td?.expectedCompletionDate
        ? Date.parse(td.expectedCompletionDate)
        : 0;
      const act = td?.actualCompletionDate
        ? Date.parse(td.actualCompletionDate)
        : 0;
      return {
        id: p.protocolId,
        label: p.protocolName,
        expected: exp,
        actual: act,
        reason: td?.delayReason ?? "Unknown",
      };
    });
  }, [protocolsForChart]);

  // 2) Scatter data
  interface ScatterPoint {
    protocolName: string;
    enrolled: number;
    completed: number;
  }
  const scatterData = useMemo<ScatterPoint[]>(() => {
    return protocolsForChart.map((p) => ({
      protocolName: p.protocolName,
      enrolled: p.progressMetrics?.enrolled ?? 0,
      completed: p.progressMetrics?.completed ?? 0,
    }));
  }, [protocolsForChart]);

  // 3) Radar data (first site)
  interface RadarPoint {
    metric: string;
    value: number;
  }
  const radarData = useMemo<RadarPoint[]>(() => {
    let s: Site | undefined;
    if (nodeType === "protocol" && protocol?.sites) {
      s = protocol.sites[0];
    } else if (nodeType === "site" && site) {
      s = site;
    }
    if (!s || !s.sitePerformance) return [];
    return [
      { metric: "enrollmentRate", value: s.sitePerformance.enrollmentRate },
      {
        metric: "queryResolutionTime",
        value: s.sitePerformance.queryResolutionTime,
      },
      {
        metric: "protocolDeviationRate",
        value: s.sitePerformance.protocolDeviationRate,
      },
      { metric: "complicationRate", value: s.sitePerformance.complicationRate },
    ];
  }, [nodeType, protocol, site]);

  // 4/5/7) Flatten subjects
  const subjects = useMemo<Subject[]>(() => {
    if (nodeType === "company" && company?.protocols) {
      return company.protocols.flatMap((p) =>
        p.sites.flatMap((st) => st.subjects || [])
      );
    }
    if (nodeType === "protocol" && protocol?.sites) {
      return protocol.sites.flatMap((st) => st.subjects || []);
    }
    if (nodeType === "site" && site?.subjects) {
      return site.subjects;
    }
    return [];
  }, [nodeType, company, protocol, site]);

  // 4) Demographics distributions
  const buildDist = (key: keyof Subject): { name: string; value: number }[] => {
    const counts: Record<string, number> = {};
    subjects.forEach((s) => {
      const val = (s[key] as string) ?? "Unknown";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };
  const genderData = useMemo(() => buildDist("gender"), [subjects]);
  const ethnicityData = useMemo(() => buildDist("ethnicity"), [subjects]);
  const incomeData = useMemo(() => buildDist("incomeBracket"), [subjects]);

  // 6) Pie chart data
  interface PieProtocol {
    protocolId: string;
    name: string;
    completionPct: number;
  }
  const pieData = useMemo<PieProtocol[]>(() => {
    return protocolsForChart.map((p) => ({
      protocolId: p.protocolId,
      name: p.protocolName,
      completionPct: p.progressMetrics?.completionPercentage ?? 0,
    }));
  }, [protocolsForChart]);

  // 7) Complications heatmap
  interface ComplicationsHeatCell {
    // Renamed interface for clarity
    x: string; // protocolName
    y: string; // complication type
    value: number;
  }
  const {
    data: complicationsHeatmapData,
    xLabels: complicationsXLabels,
    yLabels: complicationsYLabels,
  } = useMemo<{
    data: ComplicationsHeatCell[];
    xLabels: string[];
    yLabels: string[];
  }>(() => {
    const matrix: Record<string, Record<string, number>> = {};
    protocolsForChart.forEach((p) => (matrix[p.protocolName] = {}));
    subjects.forEach((s) => {
      (s.complications || []).forEach((comp) => {
        const names =
          nodeType === "company" && company?.protocols
            ? company.protocols.map((pr) => pr.protocolName)
            : nodeType === "protocol" && protocol
            ? [protocol.protocolName]
            : [];
        names.forEach((pn) => {
          matrix[pn][comp] = (matrix[pn][comp] || 0) + 1;
        });
      });
    });
    const xL = Object.keys(matrix);
    const ySet = new Set<string>();
    xL.forEach((x) => Object.keys(matrix[x]).forEach((y) => ySet.add(y)));
    const yL = Array.from(ySet);
    const data: ComplicationsHeatCell[] = [];
    xL.forEach((x) => {
      yL.forEach((y) => data.push({ x, y, value: matrix[x][y] || 0 }));
    });
    return { data, xLabels: xL, yLabels: yL };
  }, [protocolsForChart, subjects, nodeType, company, protocol]);

  // Flatten all sites for Site Heatmap data
  const allSites = useMemo<Site[]>(() => {
    if (nodeType === "company" && company?.protocols) {
      return company.protocols.flatMap((p) => p.sites || []);
    }
    if (nodeType === "protocol" && protocol?.sites) {
      return protocol.sites;
    }
    if (nodeType === "site" && site) {
      return [site];
    }
    return [];
  }, [nodeType, company, protocol, site]);

  // Site Heatmap Data
  interface SiteHeatCell {
    // New interface for Site Heatmap data
    xId: string;
    xName: string;
    y: string;
    value: number;
  }

  const {
    data: siteHeatmapData,
    xLabels: siteXLabels, // Corrected type here
    yLabels: siteYLabels,
  } = useMemo<{
    data: SiteHeatCell[];
    xLabels: { id: string; name: string }[]; // Corrected type here
    yLabels: string[];
  }>(() => {
    const matrix: Record<string, Record<string, number>> = {};
    const yL = [
      "Enrollment Rate",
      "Query Resolution Time",
      "Protocol Deviation Rate",
      "Complication Rate",
    ];
    const xLMap: Map<string, string> = new Map(); // Map siteId to siteName

    allSites.forEach((s) => {
      const siteId = s.siteId;
      const siteName = s.siteName || s.siteId; // Fallback to siteId if name is missing
      if (siteId) {
        xLMap.set(siteId, siteName);
        matrix[siteId] = {}; // Use siteId as the unique key for the matrix
        if (s.sitePerformance) {
          matrix[siteId]["Enrollment Rate"] = s.sitePerformance.enrollmentRate;
          matrix[siteId]["Query Resolution Time"] =
            s.sitePerformance.queryResolutionTime;
          matrix[siteId]["Protocol Deviation Rate"] =
            s.sitePerformance.protocolDeviationRate;
          matrix[siteId]["Complication Rate"] =
            s.sitePerformance.complicationRate;
        }
      }
    });

    const xL = Array.from(xLMap.entries()).map(([id, name]) => ({ id, name })); // Corrected generation here
    const data: SiteHeatCell[] = [];
    xL.forEach((xItem) => {
      yL.forEach((y) =>
        data.push({
          xId: xItem.id,
          xName: xItem.name,
          y,
          value: matrix[xItem.id][y] || 0,
        })
      );
    });

    return { data, xLabels: xL, yLabels: yL };
  }, [allSites]);

  // Define tabs
  const tabs = useMemo(
    () => [
      {
        key: "delayBarChart",
        label: "Delay Analysis",
        component: <DelayBarChart data={delayData} />,
      },
      {
        key: "enrollmentScatter",
        label: "Enrollment & Completion",
        component: <EnrollmentCompletionScatter data={scatterData} />,
      },
      {
        key: "sitePerformanceRadar",
        label: "Site Performance",
        component:
          radarData.length > 0 ? (
            <SitePerformanceRadar data={radarData} name="Site Performance" />
          ) : (
            <div className={styles.noDataMessage}>
              No site performance data available for the selected view.
            </div>
          ),
      },
      {
        key: "demographicsPieCharts",
        label: "Demographics",
        component: (
          <DemographicsPieCharts
            genderData={genderData}
            ethnicityData={ethnicityData}
            incomeData={incomeData}
          />
        ),
      },
      {
        key: "visitHistogram",
        label: "Visit Distribution",
        component: <VisitHistogram data={subjects} />,
      },
      {
        key: "protocolCompletionPieChart",
        label: "Protocol Completion",
        component: <ProtocolCompletionPieChart protocols={pieData} />,
      },
      {
        key: "protocolEnrollmentLineChart",
        label: "Protocol Enrollment",
        component: (
          <ProtocolEnrollmentLineChart protocols={protocolsForChart} />
        ),
      },
      {
        key: "complicationsHeatmap",
        label: "Complications Heatmap",
        component: (
          <ComplicationsHeatmap
            data={complicationsHeatmapData}
            xLabels={complicationsXLabels}
            yLabels={complicationsYLabels}
          />
        ),
      },
      {
        key: "siteHeatmap",
        label: "Site Heatmap",
        component:
          siteHeatmapData.length > 0 ? (
            <SiteHeatmap
              data={siteHeatmapData}
              xLabels={siteXLabels}
              yLabels={siteYLabels}
            />
          ) : (
            <div className={styles.noDataMessage}>
              No site heatmap data available for the selected view.
            </div>
          ),
      },
    ],
    [
      delayData,
      scatterData,
      radarData,
      genderData,
      ethnicityData,
      incomeData,
      subjects,
      pieData,
      protocolsForChart,
      complicationsHeatmapData,
      complicationsXLabels,
      complicationsYLabels,
      siteHeatmapData,
      siteXLabels,
      siteYLabels,
    ]
  );

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Visualizations</h2>
        <button onClick={onToggle} aria-label="Toggle visuals">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      <div
        className={`${styles.body} ${
          collapsed ? styles.collapsed : styles.expanded
        }`}
      >
        {!collapsed && (
          <>
            <div className={styles.tabContainer}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`${styles.tabButton} ${
                    activeTab === tab.key ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={styles.tabContent}>
              {tabs.find((tab) => tab.key === activeTab)?.component}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
