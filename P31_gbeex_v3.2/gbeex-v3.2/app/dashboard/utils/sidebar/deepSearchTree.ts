// utils/sidebar/deepSearchTree.ts
import { Company, Protocol, Site, Subject } from "@/app/types";

export type TreeNode = Company | Protocol | Site | Subject;

const getNodeId = (node: TreeNode): string =>
    "companyId" in node
        ? node.companyId
        : "protocolId" in node
            ? node.protocolId
            : "siteId" in node
                ? node.siteId
                : node.subjectId;

const getNodeName = (node: TreeNode): string =>
    "companyName" in node
        ? node.companyName
        : "protocolName" in node
            ? node.protocolName
            : "siteName" in node
                ? node.siteName
                : node.subjectId;

const getChildren = (node: TreeNode): TreeNode[] =>
    "protocols" in node
        ? node.protocols
        : "sites" in node
            ? node.sites
            : "subjects" in node
                ? node.subjects
                : [];

export function deepSearchTree(
    node: TreeNode,
    query: string,
    matches: Set<string>,
    expand: Set<string>
): void {
    const name = getNodeName(node).toLowerCase();
    const nodeId = getNodeId(node);
    const children = getChildren(node);

    const matched = name.includes(query.toLowerCase());
    if (matched) matches.add(nodeId);

    for (const child of children) {
        deepSearchTree(child, query, matches, expand);
        const childId = getNodeId(child);
        if (matches.has(childId)) expand.add(nodeId);
    }
}