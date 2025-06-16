import uuid
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class LabRestServiceBase(ABC):
    """
    Base class for all LabRest services.

    This class provides a standard interface for:
    - Synchronous request handling (`handle_request`)
    - Asynchronous job submission (`submit_async`)
    - Job tracking via UUIDs
    - Optional peek/inspect support
    """

    def __init__(self):
        # Tracks job_id to job metadata
        self.async_jobs: Dict[str, Dict[str, Any]] = {}

    def peek(self) -> Dict[str, Any]:
        """Returns basic metadata or diagnostics for the service."""
        return {
            "name": self.__class__.__name__,
            "description": "LabRest-compatible service",
            "type": "LabRestService",
            "endpoints": ["/peek", "/", "/submit", "/status", "/result"]
        }

    def handle_request(self, query_params: Dict[str, Any], body: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Handles synchronous request (GET/POST)."""
        return self.process(query_params, body or {})

    def submit_async(self, query_params: Dict[str, Any], body: Dict[str, Any]) -> Dict[str, Any]:
        """Submits a long-running task and returns a job ID."""
        job_id = str(uuid.uuid4())
        self.async_jobs[job_id] = {"status": "processing", "result": None}
        try:
            result = self.process(query_params, body)
            self.async_jobs[job_id].update({"status": "completed", "result": result})
        except Exception as e:
            self.async_jobs[job_id].update({"status": "failed", "result": {"error": str(e)}})
        return {"job_id": job_id}

    def check_status(self, job_id: str) -> Dict[str, Any]:
        """Check current status of a job ID."""
        return {"status": self.async_jobs.get(job_id, {}).get("status", "not_found")}

    def get_async_result(self, job_id: str) -> Dict[str, Any]:
        """Return the result of a completed job."""
        job = self.async_jobs.get(job_id)
        if not job:
            return {"status": "not_found"}
        return {"status": job["status"], "result": job["result"] if job["status"] == "completed" else None}

    @abstractmethod
    def process(self, query_params: Dict[str, Any], body: Dict[str, Any]) -> Dict[str, Any]:
        """To be implemented by subclasses. Contains actual logic."""
        raise NotImplementedError("Subclasses must implement `process`.")
