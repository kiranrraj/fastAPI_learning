// patient_schema_data.groovy

// Open management for schema definition
mgmt = graph.openManagement()

// Define property keys for Patient
first_name = mgmt.makePropertyKey("first_name").dataType(String.class).make()
last_name = mgmt.makePropertyKey("last_name").dataType(String.class).make()
gender = mgmt.makePropertyKey("gender").dataType(String.class).make()
dob = mgmt.makePropertyKey("dob").dataType(String.class).make() // Date of Birth as String for simplicity
phone = mgmt.makePropertyKey("phone").dataType(String.class).make()
email = mgmt.makePropertyKey("email").dataType(String.class).make()
created_at = mgmt.makePropertyKey("created_at").dataType(Long.class).make()
patient_id = mgmt.makePropertyKey("patient_id").dataType(String.class).make()

// Define vertex label for Patient
mgmt.makeVertexLabel("patient").make()

mgmt.commit()


// Data insertion starts here
def now = System.currentTimeMillis()

// Sample patient list: firstName, lastName, gender, dob (YYYY-MM-DD), phone, email, created_at datetime string
def patientList = [
    ["Arjun", "Patel", "male", "1985-04-23", "+91 9876543210", "arjun.patel@example.com", "2024-05-20T10:00:00"],
    ["Sneha", "Reddy", "female", "1990-11-15", "+91 9123456789", "sneha.reddy@example.com", "2024-05-21T09:30:00"],
    ["Karan", "Shah", "male", "1978-07-09", "+91 9988776655", "karan.shah@example.com", "2024-05-22T11:45:00"],
    ["Meera", "Desai", "female", "1995-12-02", "+91 9871234567", "meera.desai@example.com", "2024-05-23T08:20:00"],
    ["Ravi", "Kumar", "male", "1982-03-18", "+91 9123987456", "ravi.kumar@example.com", "2024-05-24T15:10:00"]
]

// Function to generate patient_id similar to your Python util
def generatePatientId(firstName, lastName, createdAtStr) {
    def prefix = "LS"
    def nameCode = (firstName + lastName).toUpperCase().replaceAll("\\s", "")
    nameCode = nameCode.length() > 4 ? nameCode.substring(0, 4) : nameCode.padRight(4, 'X')
    def dt = java.time.LocalDateTime.parse(createdAtStr)
    def dateCode = dt.format(java.time.format.DateTimeFormatter.ofPattern("MMddyy"))
    def secondsPart = dt.format(java.time.format.DateTimeFormatter.ofPattern("ss"))
    return prefix + nameCode + dateCode + secondsPart
}

patientList.each { p ->
    def pid = generatePatientId(p[0], p[1], p[6])
    def v = graph.addVertex(label, "patient")
    v.property("first_name", p[0])
    v.property("last_name", p[1])
    v.property("gender", p[2])
    v.property("dob", p[3])
    v.property("phone", p[4])
    v.property("email", p[5])
    v.property("created_at", now)
    v.property("patient_id", pid)
}

graph.tx().commit()
