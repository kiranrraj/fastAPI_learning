# models/search_meta.py

from pydantic import BaseModel
from typing import List, Literal, Optional, Dict, Any

class ParamMeta(BaseModel):
    # Describes a single query parameter that the UI can render.
    name:        str
    type:        Literal["string", "number", "enum", "boolean"]
    required:    bool                = False
    description: Optional[str]       = None
    options:     Optional[List[str]] = None
    default:     Optional[Any]       = None

class FieldMeta(BaseModel):
    # Describes a single field/column that the UI can display in results.
    name:  str
    label: str

class UiMeta(BaseModel):
    # Instructs the UI which view modes to offer and how to switch between them.
    views:       List[Literal["table", "card", "json"]]
    defaultView: Literal["table", "card", "json"]
    viewParam:   str

class SearchMeta(BaseModel):
    # The full metadata contract for a search portlet.
    # - parameters: which filters to render.
    # - response.fields: which fields/columns to display in results.
    # - ui: which view modes (table/card/json).
    # - pagination: how to paginate results.
    parameters: List[ParamMeta]
    response:   Dict[str, List[FieldMeta]]
    ui:         UiMeta
    pagination: Dict[str, Any]

# for ref
#   "pagination": {
#     "pageParam": "page",
#     "perPageParam": "per_page",
#     "defaultPerPage": 20,
#     "maxPerPage": 100
#   }