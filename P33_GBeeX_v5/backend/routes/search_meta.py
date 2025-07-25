# routes/search_meta.py

from fastapi import APIRouter
from models.search_meta import SearchMeta, ParamMeta, FieldMeta, UiMeta

router = APIRouter(prefix="/v1/search", tags=["Search Meta"])


# Company Meta 
COMPANY_META = SearchMeta(
    parameters=[
        ParamMeta(name="q",            type="string", description="Full‑text search across all company fields"),
        ParamMeta(name="page",         type="number", default=1,      description="Page number for pagination"),
        ParamMeta(name="per_page",     type="number", default=20,     description="Results per page"),
        ParamMeta(name="sort_by",      type="string", description="Field to sort on"),
        ParamMeta(name="sort_order",   type="enum",   options=["asc","desc"], default="asc", description="Sort direction"),
        ParamMeta(name="fields",       type="string", description="Comma‑separated list of fields to include"),
        ParamMeta(name="companyId",    type="string", description="Filter by exact company UUID"),
        ParamMeta(name="companyName",  type="string", description="Full or partial company name"),
        ParamMeta(name="sponsorType",  type="enum",   options=["Pharma","Biotech","Academic"], description="Sponsor type"),
        ParamMeta(name="activeRegions",type="string", description="Active regions (comma‑separated)"),
        ParamMeta(name="riskLevel",    type="enum",   options=["Low","Medium","High"], description="Risk level"),
    ],
    response={
        "fields": [
            FieldMeta(name="companyId",                   label="Company ID"),
            FieldMeta(name="companyName",                 label="Company Name"),
            FieldMeta(name="sponsorType",                 label="Sponsor Type"),
            FieldMeta(name="financials.revenueUSD",       label="Revenue (USD)"),
            FieldMeta(name="pipelineSummary.phase1Count", label="Phase I Trials"),
            FieldMeta(name="complianceScore",             label="Compliance Score"),
            FieldMeta(name="riskLevel",                   label="Risk Level"),
            FieldMeta(name="website",                     label="Website"),
        ]
    },
    ui=UiMeta(
        views=["table", "card", "json"],
        defaultView="table",
        viewParam="view"
    ),
    pagination={
        "pageParam":      "page",
        "perPageParam":   "per_page",
        "defaultPerPage": 20,
        "maxPerPage":     100
    }
)

# Protocol Meta 
PROTOCOL_META = SearchMeta(
    parameters=[
        ParamMeta(name="q",            type="string", description="Full‑text search across protocol fields"),
        ParamMeta(name="page",         type="number", default=1,      description="Page number"),
        ParamMeta(name="per_page",     type="number", default=20,     description="Results per page"),
        ParamMeta(name="sort_by",      type="string", description="Field to sort on"),
        ParamMeta(name="sort_order",   type="enum",   options=["asc","desc"], default="asc", description="Sort direction"),
        ParamMeta(name="fields",       type="string", description="Comma‑separated list of fields to include"),
        ParamMeta(name="protocolId",   type="string", description="Filter by exact protocol UUID"),
        ParamMeta(name="protocolName", type="string", description="Full or partial protocol name"),
        ParamMeta(name="phase",        type="enum",   options=["Phase I","Phase II","Phase III"], description="Clinical trial phase"),
        ParamMeta(name="status",       type="enum",   options=["Recruiting","Completed","Terminated"], description="Protocol status"),
        ParamMeta(name="companyId",    type="string", description="Sponsor company UUID"),
    ],
    response={
        "fields": [
            FieldMeta(name="protocolId",                          label="Protocol ID"),
            FieldMeta(name="protocolName",                        label="Protocol Name"),
            FieldMeta(name="nctId",                               label="NCT ID"),
            FieldMeta(name="drugName",                            label="Drug Name"),
            FieldMeta(name="therapeuticArea",                     label="Therapeutic Area"),
            FieldMeta(name="phase",                               label="Phase"),
            FieldMeta(name="status",                              label="Status"),
            FieldMeta(name="startDate",                           label="Start Date"),
            FieldMeta(name="progressMetrics.enrolled",            label="Enrolled"),
            FieldMeta(name="progressMetrics.completionPercentage",label="% Complete"),
        ]
    },
    ui=UiMeta(
        views=["table", "card", "json"],
        defaultView="table",
        viewParam="view"
    ),
    pagination={
        "pageParam":      "page",
        "perPageParam":   "per_page",
        "defaultPerPage": 20,
        "maxPerPage":     100
    }
)

# Site Meta 
SITE_META = SearchMeta(
    parameters=[
        ParamMeta(name="q",          type="string", description="Full‑text search across site fields"),
        ParamMeta(name="page",       type="number", default=1,      description="Page number"),
        ParamMeta(name="per_page",   type="number", default=20,     description="Results per page"),
        ParamMeta(name="sort_by",    type="string", description="Field to sort on"),
        ParamMeta(name="sort_order", type="enum",   options=["asc","desc"], default="asc", description="Sort direction"),
        ParamMeta(name="fields",     type="string", description="Comma‑separated list of fields to include"),
        ParamMeta(name="siteId",     type="string", description="Filter by exact site UUID"),
        ParamMeta(name="siteName",   type="string", description="Full or partial site name"),
        ParamMeta(name="city",       type="string", description="City name"),
        ParamMeta(name="country",    type="string", description="Country name"),
        ParamMeta(name="status",     type="enum",   options=["open","closed","suspended"], description="Site status"),
    ],
    response={
        "fields": [
            FieldMeta(name="siteId",                          label="Site ID"),
            FieldMeta(name="siteName",                        label="Site Name"),
            FieldMeta(name="siteType",                        label="Type"),
            FieldMeta(name="city",                            label="City"),
            FieldMeta(name="country",                         label="Country"),
            FieldMeta(name="principalInvestigator.name",      label="PI Name"),
            FieldMeta(name="recruitmentCapacity",             label="Capacity"),
            FieldMeta(name="sitePerformance.trialSuccessRate",label="Success Rate"),
        ]
    },
    ui=UiMeta(
        views=["table", "card", "json"],
        defaultView="table",
        viewParam="view"
    ),
    pagination={
        "pageParam":      "page",
        "perPageParam":   "per_page",
        "defaultPerPage": 20,
        "maxPerPage":     100
    }
)

# Subject Meta

SUBJECT_META = SearchMeta(
    parameters=[
        ParamMeta(name="q",                    type="string", description="Full‑text search across subject fields"),
        ParamMeta(name="page",                 type="number", default=1,      description="Page number"),
        ParamMeta(name="per_page",             type="number", default=20,     description="Results per page"),
        ParamMeta(name="sort_by",              type="string", description="Field to sort on"),
        ParamMeta(name="sort_order",           type="enum",   options=["asc","desc"], default="asc", description="Sort direction"),
        ParamMeta(name="fields",               type="string", description="Comma‑separated list of fields to include"),
        ParamMeta(name="subjectId",            type="string", description="Filter by subject UUID"),
        ParamMeta(name="screeningNumber",      type="string", description="Screening number"),
        ParamMeta(name="medicalRecordNumber",  type="string", description="Medical record number"),
        ParamMeta(name="status",               type="enum",   options=["Enrolled","Completed","Dropped","Screen Failure"], description="Subject status"),
    ],
    response={
        "fields": [
            FieldMeta(name="subjectId",           label="Subject ID"),
            FieldMeta(name="screeningNumber",     label="Screening No."),
            FieldMeta(name="medicalRecordNumber", label="MRN"),
            FieldMeta(name="age",                 label="Age"),
            FieldMeta(name="gender",              label="Gender"),
            FieldMeta(name="status",              label="Status"),
            FieldMeta(name="dateOfEnrollment",    label="Enrollment Date"),
            FieldMeta(name="lastVisitDate",       label="Last Visit"),
            FieldMeta(name="nextScheduledVisit",  label="Next Visit"),
        ]
    },
    ui=UiMeta(
        views=["table", "card", "json"],
        defaultView="table",
        viewParam="view"
    ),
    pagination={
        "pageParam":      "page",
        "perPageParam":   "per_page",
        "defaultPerPage": 20,
        "maxPerPage":     100
    }
)

@router.get("/company/meta", response_model=SearchMeta)
async def get_company_meta():
    return COMPANY_META

@router.get("/site/meta", response_model=SearchMeta)
async def get_site_meta():
    return SITE_META

@router.get("/protocol/meta", response_model=SearchMeta)
async def get_protocol_meta():
    return PROTOCOL_META

@router.get("/subject/meta", response_model=SearchMeta)
async def get_subject_meta():
    return SUBJECT_META
