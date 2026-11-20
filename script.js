
// Get HTML elements
const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const emptyMessage = document.getElementById("emptyMessage");

// Get students from Local Storage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Save students to Local Storage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Display students
function displayStudents(searchTerm = "") {
    studentList.innerHTML = "";

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matric.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    emptyMessage.hidden = filteredStudents.length > 0;

    if (students.length === 0) {
        emptyMessage.textContent = "No students registered yet.";
    } else {
        emptyMessage.textContent = "No matching students found.";
    }

    filteredStudents.forEach((student, index) => {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            student.name,
            student.matric,
            student.email,
            student.department,
            student.level
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editStudent(student.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteStudent(student.id));

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        studentList.appendChild(row);
    });
}

// Register or update student
studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const editId = document.getElementById("editId").value;

    const student = {
        id: editId || Date.now().toString(),
        name: document.getElementById("name").value.trim(),
        matric: document.getElementById("matric").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value.trim(),
        level: document.getElementById("level").value
    };

    // Check for duplicate matric numbers
    const duplicate = students.some(existing =>
        existing.matric.toLowerCase() === student.matric.toLowerCase() &&
        existing.id !== student.id
    );

    if (duplicate) {
        alert("This matric number is already registered!");
        return;
    }

    if (editId) {
        // Update existing student
        students = students.map(existing =>
            existing.id === editId ? student : existing
        );

        alert("Student information updated successfully!");
    } else {
        // Register new student
        students.push(student);

        alert("Student registered successfully!");
    }

    saveStudents();
    displayStudents(searchInput.value);
    resetForm();
});

// Edit student
function editStudent(id) {
    const student = students.find(student => student.id === id);

    if (!student) return;

    document.getElementById("editId").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("matric").value = student.matric;
    document.getElementById("email").value = student.email;
    document.getElementById("department").value = student.department;
    document.getElementById("level").value = student.level;

    formTitle.textContent = "Update Student";
    submitBtn.textContent = "Update Student";
    cancelBtn.hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete student
function deleteStudent(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
        students = students.filter(student => student.id !== id);

        saveStudents();
        displayStudents(searchInput.value);

        alert("Student deleted successfully!");
    }
}

// Reset form
function resetForm() {
    studentForm.reset();

    document.getElementById("editId").value = "";

    formTitle.textContent = "Register Student";
    submitBtn.textContent = "Register Student";
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener("click", resetForm);

// Search students
searchInput.addEventListener("input", function() {
    displayStudents(this.value);
});

// Display saved students when page loads
displayStudents();
