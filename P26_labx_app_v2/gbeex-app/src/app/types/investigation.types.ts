export interface Investigation {
    group_ids: string;
    updated_at: string;
    name: string;
    created_at: string;
    id: string;
    unit: string;
    investigation_id: string;
    "T.id": string;
    "T.label": string;
}

export interface InvestigationGroup {
    updated_at: string;
    name: string;
    created_at: string;
    id: string;
    group_id: string;
    parent_group_id: string;
    description: string;
    "T.id": string;
    "T.label": string;
    investigations: Investigation[];
}
