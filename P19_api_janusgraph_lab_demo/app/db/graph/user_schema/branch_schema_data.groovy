// branch_schema_data.groovy

// Open management for schema definition
mgmt = graph.openManagement()

// Define property keys for Branch
name = mgmt.makePropertyKey("name").dataType(String.class).make()
location = mgmt.makePropertyKey("location").dataType(String.class).make()
address = mgmt.makePropertyKey("address").dataType(String.class).make()
phone = mgmt.makePropertyKey("phone").dataType(String.class).make()
created_at = mgmt.makePropertyKey("created_at").dataType(Long.class).make()
branch_code = mgmt.makePropertyKey("branch_code").dataType(String.class).make()

// Define vertex label for Branch
mgmt.makeVertexLabel("branch").make()

mgmt.commit()


// Data insertion starts here
def now = System.currentTimeMillis()

// Static 4-digit counters for branch codes
def branchCounters = [1001, 1002, 1003, 1004, 1005]

// List of branches: name, location, address, phone
def branchList = [
    ["Andheri Diagnostic Center", "Mumbai", "123 Andheri East, Mumbai", "+91 9823456780"],
    ["Koramangala Health Hub", "Bangalore", "45 Koramangala 5th Block", "+91 9845098450"],
    ["Salt Lake Clinic", "Kolkata", "7th Ave, Salt Lake", "+91 9830011223"],
    ["T-Nagar Wellness Center", "Chennai", "8 South Boag Rd, T-Nagar", "+91 9876543210"],
    ["Gachibowli Diagnostics", "Hyderabad", "10 Tech Park Road, Gachibowli", "+91 9966778899"]
]

branchList.eachWithIndex { b, i ->
    def locCode = b[1].toUpperCase().replaceAll("\\s", "") // Remove spaces
    if (locCode.length() < 4) {
        locCode = locCode.padRight(4, 'X')  // Pad with 'X' if less than 4 letters
    } else {
        locCode = locCode.substring(0,4)
    }
    
    def branchCode = "${locCode}${branchCounters[i]}"
    
    graph.addVertex(
        label, 'branch',
        'name', b[0],
        'location', b[1],
        'address', b[2],
        'phone', b[3],
        'branch_code', branchCode,
        'created_at', now
    )
}

graph.tx().commit()
