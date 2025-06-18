# app\utils\labx_validation_exceptions.py

class LabXError(Exception):
    """Base class for all LabX exceptions."""
    pass

class GraphConnectionError(LabXError):
    """Raised when connection to JanusGraph fails."""
    pass

class VertexInsertError(LabXError):
    """Raised on failure to insert vertex."""
    pass

class SpecValidationError(LabXError):
    """Raised when an entity or edge spec is invalid."""
    pass
