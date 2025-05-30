// investigation_result_schema_data.groovy

mgmt = graph.openManagement()

// Property keys for Investigation Result
result_value = mgmt.makePropertyKey("result_value").dataType(String.class).make()
unit = mgmt.makePropertyKey("unit").dataType(String.class).make()
reference_range = mgmt.makePropertyKey("reference_range").dataType(String.class).make()
created_at = mgmt.makePropertyKey("created_at").dataType(Long.class).make()
result_id = mgmt.makePropertyKey("result_id").dataType(String.class).make()

// Vertex label for Investigation Result
mgmt.makeVertexLabel("investigation_result").make()

mgmt.commit()

def now = System.currentTimeMillis()

// Sample Investigation Result data: test_name, value, unit, reference_range, created_at datetime string
def resultList = [
    ["Hemoglobin", "13.5", "g/dL", "13-17", "2024-05-20T08:35:00"],
    ["WBC Count", "6000", "cells/mcL", "4000-11000", "2024-05-21T09:05:00"],
    ["Cholesterol", "190", "mg/dL", "<200", "2024-05-22T10:10:00"],
    ["ALT", "25", "U/L", "7-56", "2024-05-23T11:15:00"],
    ["Blood Sugar", "110", "mg/dL", "70-110", "2024-05-24T12:20:00"]
]

// Function to generate result_id similar to your util function for investigation IDs
def generateResultId(testName, createdAtStr) {
    def prefix = "LSRS"
    def namePart = testName.toUpperCase().replaceAll("\\s", "")
    namePart = namePart.length() > 4 ? namePart.substring(0,4) : namePart.padRight(4, "0")
    def dt = java.time.LocalDateTime.parse(createdAtStr)
    def datePart = dt.format(java.time.format.DateTimeFormatter.ofPattern("ddMMyy"))
    def secondsPart = dt.format(java.time.format.DateTimeFormatter.ofPattern("ss"))
    return prefix + namePart + datePart + secondsPart
}

resultList.each { r ->
    def rid = generateResultId(r[0], r[4])
    def v = graph.addVertex(label, "investigation_result")
    v.property("result_value", r[1])
    v.property("unit", r[2])
    v.property("reference_range", r[3])
    v.property("created_at", now)
    v.property("result_id", rid)
}

graph.tx().commit()
