// staff_schema_data.groovy

// Open management for schema definition
mgmt = graph.openManagement()

// Define property keys for Staff
first_name = mgmt.makePropertyKey("first_name").dataType(String.class).make()
last_name = mgmt.makePropertyKey("last_name").dataType(String.class).make()
role = mgmt.makePropertyKey("role").dataType(String.class).make()
emp_id = mgmt.makePropertyKey("emp_id").dataType(String.class).make()
created_at = mgmt.makePropertyKey("created_at").dataType(Long.class).make()
branch_code = mgmt.makePropertyKey("branch_code").dataType(String.class).make()  // foreign key to branch_code

// Define vertex label for Staff
mgmt.makeVertexLabel("staff").make()

mgmt.commit()


// Data insertion starts here
def now = System.currentTimeMillis()

// Staff list: firstName, lastName, role, joinYearMonth, branch location (to find branch_code)
def staffList = [
    ["Alice", "Smith", "doctor", "2023-01", "Mumbai"],
    ["Bob", "Johnson", "nurse", "2022-11", "Mumbai"],
    ["Charlie", "Williams", "technician", "2023-03", "Bangalore"],
    ["Diana", "Brown", "admin", "2021-12", "Bangalore"],
    ["Ethan", "Jones", "doctor", "2022-05", "Kolkata"],
    ["Fiona", "Garcia", "nurse", "2023-02", "Kolkata"],
    ["George", "Miller", "technician", "2023-01", "Chennai"],
    ["Hannah", "Davis", "admin", "2023-04", "Chennai"],
    ["Ian", "Rodriguez", "doctor", "2023-03", "Hyderabad"],
    ["Jill", "Martinez", "nurse", "2023-05", "Hyderabad"]
]

// Helper function to generate employee ID
def generateEmpId(role, joinYM) {
    def prefix = "LS"
    def roleCode = role.take(2).toUpperCase()
    def randNum = String.format("%06d", (Math.abs(new Random().nextInt()) % 1000000))
    def ym = joinYM.replaceAll("-", "")[-4..-1] // e.g. "2301" from "2023-01"
    return prefix + roleCode + randNum + ym
}

// Build map: branch location -> branch_code
def branchesByLocation = [:]
graph.traversal().V().hasLabel("branch").forEachRemaining { v ->
    def loc = v.value("location")
    def code = v.value("branch_code")
    branchesByLocation[loc] = code
}

staffList.each { s ->
    def empId = generateEmpId(s[2], s[3])
    def branchCode = branchesByLocation[s[4]]
    def v = graph.addVertex(label, "staff")
    v.property("first_name", s[0])
    v.property("last_name", s[1])
    v.property("role", s[2])
    v.property("emp_id", empId)
    v.property("created_at", now)
    v.property("branch_code", branchCode)
}

graph.tx().commit()
