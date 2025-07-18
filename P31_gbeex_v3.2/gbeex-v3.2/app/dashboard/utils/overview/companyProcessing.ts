// src/app/utils/companyProcessing.ts

import { Company } from "@/app/types";

// Define sorting options
type SortField = 'companyName' | 'riskLevel' | 'complianceScore' | 'sponsorType' | 'headquarters';
type SortDirection = 'asc' | 'desc';

/**
 * Filters an array of Company objects based on a search query.
 * The search is case-insensitive and checks company name, headquarters, sponsor type,
 * risk level, active regions, and therapeutic areas.
 * @param companies The array of Company objects to filter.
 * @param query The search string.
 * @returns A new array containing only the companies that match the query.
 */
export const filterCompanies = (companies: Company[], query: string): Company[] => {
    if (!query) {
        return companies;
    }
    const lowerCaseQuery = query.toLowerCase();
    return companies.filter(company =>
        company.companyName.toLowerCase().includes(lowerCaseQuery) ||
        company.headquarters.toLowerCase().includes(lowerCaseQuery) ||
        company.sponsorType.toLowerCase().includes(lowerCaseQuery) ||
        company.riskLevel.toLowerCase().includes(lowerCaseQuery) ||
        company.activeRegions.some(region => region.toLowerCase().includes(lowerCaseQuery)) ||
        company.therapeuticAreasCovered.some(area => area.toLowerCase().includes(lowerCaseQuery))
    );
};

/**
 * Sorts an array of Company objects based on a specified field and direction.
 * @param companies The array of Company objects to sort.
 * @param field The field to sort by ('companyName', 'riskLevel', 'complianceScore', 'sponsorType', 'headquarters').
 * @param direction The sort direction ('asc' or 'desc').
 * @returns A new array containing the sorted companies.
 */
export const sortCompanies = (
    companies: Company[],
    field: SortField,
    direction: SortDirection
): Company[] => {
    // Create a shallow copy to avoid mutating the original array
    const sorted = [...companies];

    sorted.sort((a, b) => {
        let valueA: string | number;
        let valueB: string | number;
        let comparisonResult: number | undefined; // To store result for fields with custom logic

        switch (field) {
            case 'companyName':
                valueA = a.companyName.toLowerCase();
                valueB = b.companyName.toLowerCase();
                break;
            case 'headquarters':
                valueA = a.headquarters.toLowerCase();
                valueB = b.headquarters.toLowerCase();
                break;
            case 'riskLevel':
                // Custom sort order for risk levels (Low < Medium < High)
                const riskOrder: { [key: string]: number } = { 'Low': 1, 'Medium': 2, 'High': 3 };
                valueA = riskOrder[a.riskLevel] || 0; // Default to 0 if risk level is unexpected
                valueB = riskOrder[b.riskLevel] || 0;

                // Explicitly handle riskLevel comparison
                if (direction === 'asc') {
                    comparisonResult = valueA - valueB; // Low to High
                } else {
                    comparisonResult = valueB - valueA; // High to Low
                }
                break;
            case 'complianceScore':
                valueA = a.complianceScore;
                valueB = b.complianceScore;
                // For 'complianceScore', 'asc' typically means highest score first.
                // For 'desc', it means lowest score first.
                if (direction === 'asc') {
                    comparisonResult = valueB - valueA; // Highest to Lowest
                } else {
                    comparisonResult = valueA - valueB; // Lowest to Highest
                }
                break;
            case 'sponsorType':
                valueA = a.sponsorType.toLowerCase();
                valueB = b.sponsorType.toLowerCase();
                break;
            default:
                // Fallback to companyName if field is not recognized
                valueA = a.companyName.toLowerCase();
                valueB = b.companyName.toLowerCase();
        }

        // If a custom comparison result was determined, return it
        if (comparisonResult !== undefined) {
            return comparisonResult;
        }

        // Standard comparison for string and other numeric fields not handled above
        if (valueA < valueB) {
            return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0; // Values are equal
    });

    return sorted;
};
