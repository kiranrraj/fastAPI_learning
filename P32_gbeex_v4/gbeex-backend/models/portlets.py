# models/portlets.py
from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class PortletBase(BaseModel):
    key: str = Field(..., example="site-performance-chart", description="Unique identifier for the portlet.")
    title: str = Field(..., example="Site Performance Overview", description="Human-readable title.")
    category: Literal["analytics", "visualization", "generic", "report", "workflow", "other"] = Field(
        ...,
        example="analytics",
        description="Categorization of the portlet."
    )
    description: str = Field(..., example="A chart visualizing key site performance metrics.", description="Brief description of the portlet's function.")
    longDescription: Optional[str] = Field(None, description="Detailed description of the portlet's features or use cases.")
    enabled: bool = Field(True, example=True, description="Whether the portlet is active and visible.")
    order: int = Field(..., ge=0, example=1, description="Display order of the portlet in lists/sidebars.")
    renderMechanism: Literal["iframe", "component"] = Field(
        ...,
        example="component",
        description="Determines how the portlet content is rendered: 'iframe' for external URLs, 'component' for local React components."
    )
    url: Optional[str] = Field(
        None,
        example="https://example.com/dashboard",
        description="URL to embed if 'renderMechanism' is 'iframe'."
    )
    componentName: Optional[str] = Field(
        None,
        example="SitePerformanceChart",
        description="Name of the React component to render if 'renderMechanism' is 'component'. Maps to a component in frontend registry."
    )
    isChild: bool = Field(False, description="Indicates if this is a child portlet.")
    parentPath: Optional[str] = Field(
        None,
        example="Dashboard/Analytics",
        description="Hierarchical path if 'isChild' is true (e.g., 'Parent/SubParent')."
    )
    createdBy: str = Field(..., description="The user or role that created this portlet.")
    testNotes: Optional[str] = Field(None, description="Notes or test cases related to this portlet's development/testing.")
    
    settings: Dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary JSON settings passed to the portlet for configuration.",
        example={
            "defaultFilters": {"region": "all", "disease": "all"},
            "chartType": "bar",
            "dataEndpoint": "/api/v1/data/site-performance"
        }
    )

class Portlet(PortletBase):
    id: str = Field(..., example="64b1f2a3e8b4f12d34acd567")