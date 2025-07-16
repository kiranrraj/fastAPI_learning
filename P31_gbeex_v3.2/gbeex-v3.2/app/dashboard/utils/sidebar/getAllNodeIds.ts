// utils/sidebar/getAllNodeIds.ts

import { Company } from "@/app/types/company.types"; // adjust the import path

/**
 * Recursively collects all node IDs from the hierarchical tree.
 *
 * @param companies - The full list of companies with nested children.
 * @returns An array of all node IDs.
 */
export function getAllNodeIds(companies: Company[]): string[] {
    const ids: string[] = [];

    const traverse = (company: Company) => {
        ids.push(company.companyId);
        company.protocols?.forEach((protocol) => {
            ids.push(protocol.protocolId);
            protocol.sites?.forEach((site) => {
                ids.push(site.siteId);
                site.subjects?.forEach((subject) => {
                    ids.push(subject.subjectId);
                });
            });
        });
    };

    companies.forEach(traverse);
    return ids;
}
