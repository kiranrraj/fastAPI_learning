// investigation_group_schema_data.groovy

mgmt = graph.openManagement()

// Property keys for Investigation Group
group_name = mgmt.makePropertyKey("group_name").dataType(String.class).make()
description = mgmt.makePropertyKey("description").dataType(String.class).make()
created_at = mgmt.makePropertyKey("created_at").dataType(Long.class).make()
group_id = mgmt.makePropertyKey("group_id").dataType(String.class).make()

// Vertex label for Investigation Group
mgmt.makeVertexLabel("investigation_group").make()

mgmt.commit()

def now = System.currentTimeMillis()

// Sample group data: group_name, description, created_at datetime string
def groupList = [
    ["Basic Health Panel", "Common routine health tests", "2024-05-20T08:30:00"],
    ["Cardiac Panel", "Tests related to heart function", "2024-05-21T09:00:00"],
    ["Liver Panel", "Assess liver function", "2024-05-22T10:00:00"],
    ["Radiology Panel", "Imaging and scans", "2024-05-23T11:00:00"],
    ["Diabetes Panel", "Tests for diabetes monitoring", "2024-05-24T12:00:00"]
]

// Function to generate group_id based on your util logic
def generateGroupId(name, createdAtStr) {
    def prefix = "LSGR"
    def namePart = name.toUpperCase().replaceAll("\\s", "")
    namePart = namePart.length() > 4 ? namePart.substring(0,4) : namePart.padRight(4, "X")
    def dt = java.time.LocalDateTime.parse(createdAtStr)
    def datePart = dt.format(java.time.format.DateTimeFormatter.ofPattern("MMddss"))
    return prefix + namePart + datePart
}

groupList.each { g ->
    def gid = generateGroupId(g[0], g[2])
    def v = graph.addVertex(label, "investigation_group")
    v.property("group_name", g[0])
    v.property("description", g[1])
    v.property("created_at", now)
    v.property("group_id", gid)
}

graph.tx().commit()
