// investigation_schema_data.groovy

mgmt = graph.openManagement()

// Define property keys for Investigation
test_name = mgmt.makePropertyKey("test_name").dataType(String.class).make()
test_type = mgmt.makePropertyKey("test_type").dataType(String.class).make()
price = mgmt.makePropertyKey("price").dataType(Double.class).make()
created_at = mgmt.makePropertyKey("created_at").dataType(Long.class).make()
investigation_id = mgmt.makePropertyKey("investigation_id").dataType(String.class).make()

// Define vertex label for Investigation
mgmt.makeVertexLabel("investigation").make()

mgmt.commit()

def now = System.currentTimeMillis()

// Sample investigation data: test_name, test_type, price, created_at datetime string
def investigationList = [
    ["Complete Blood Count", "hematology", 250.0, "2024-05-20T10:15:00"],
    ["Lipid Profile", "biochemistry", 500.0, "2024-05-21T11:30:00"],
    ["Liver Function Test", "biochemistry", 450.0, "2024-05-22T12:00:00"],
    ["Chest X-Ray", "radiology", 700.0, "2024-05-23T09:45:00"],
    ["ECG", "cardiology", 650.0, "2024-05-24T14:00:00"]
]

// Function to generate investigation_id similar to your util
def generateInvestigationId(testName, createdAtStr) {
    def prefix = "LS"
    def namePart = testName.toUpperCase().replaceAll("\\s", "")
    namePart = namePart.length() > 4 ? namePart.substring(0,4) : namePart.padRight(4, "0")
    def dt = java.time.LocalDateTime.parse(createdAtStr)
    def datePart = dt.format(java.time.format.DateTimeFormatter.ofPattern("ddMMyy"))
    def secondsPart = dt.format(java.time.format.DateTimeFormatter.ofPattern("ss"))
    return prefix + namePart + datePart + secondsPart
}

investigationList.each { i ->
    def iid = generateInvestigationId(i[0], i[3])
    def v = graph.addVertex(label, "investigation")
    v.property("test_name", i[0])
    v.property("test_type", i[1])
    v.property("price", i[2])
    v.property("created_at", now)
    v.property("investigation_id", iid)
}

graph.tx().commit()
