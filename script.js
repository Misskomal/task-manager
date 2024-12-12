// Task Data
let taskData = [];

// Update Task Counters
function updateTaskCounters() {
  const totalTasks = taskData.length;
  const todoCount = taskData.filter(task => task.status === "To Do").length;
  const inProgressCount = taskData.filter(task => task.status === "In Progress").length;
  const doneCount = taskData.filter(task => task.status === "Done").length;

  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("todoCount").textContent = todoCount;
  document.getElementById("inProgressCount").textContent = inProgressCount;
  document.getElementById("doneCount").textContent = doneCount;
}

// Fetch data and initialize
fetch('https://jsonplaceholder.typicode.com/todos')
  .then(response => response.json())
  .then(data => {
    // Map API data to taskData format
    taskData = data.slice(0, 20).map(task => ({
      id: task.id,
      title: task.title,
      description: "Sample Description",
      status: task.completed ? "Done" : "To Do",
    }));

    // Initialize table and counters
    initializeTable();
    updateTaskCounters();
  })
  .catch(error => console.error("Error fetching data:", error));

// Initialize Tabulator Table
function initializeTable() {
  const table = new Tabulator("#taskTable", {
    data: taskData,
    layout: "fitColumns",
    columns: [
      { title: "Task ID", field: "id", width: 100 },
      { title: "Title", field: "title", editor: "input" },
      { title: "Description", field: "description", editor: "input" },
      {
        title: "Status",
        field: "status",
        editor: "list",
        editorParams: { values: ["To Do", "In Progress", "Done"] },
      },
      {
        formatter: "buttonCross",
        width: 40,
        align: "center",
        cellClick: function (e, cell) {
          const rowData = cell.getRow().getData();
          taskData = taskData.filter(task => task.id !== rowData.id); // Remove task from data
          cell.getRow().delete();
          updateTaskCounters(); // Update counters
          showToast("Task deleted successfully!", "error");
        },
      },
    ],
  });

  // Add new task button functionality
  document.getElementById("addTaskBtn").addEventListener("click", () => {
    const newTask = {
      id: taskData.length + 1,
      title: "New Task",
      description: "Description",
      status: "To Do",
    };
    taskData.push(newTask); // Add to taskData
    table.addData([newTask]); // Add to table
    updateTaskCounters(); // Update counters
    showToast("Task added successfully!");
  });

  // Filter tasks by Status
  document.getElementById("filterDropdown").addEventListener("change", (e) => {
    const filterValue = e.target.value;
    if (filterValue) {
      table.setFilter("status", "=", filterValue);
    } else {
      table.clearFilter();
    }
  });

  // Search tasks by Title or Description
  const searchInput = document.getElementById("searchBar");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredTasks = taskData.filter((task) => {
      const title = task.title ? task.title.toLowerCase() : ""; // Ensure title exists
      const description = task.description
        ? task.description.toLowerCase()
        : ""; // Ensure description exists
      return title.includes(searchTerm) || description.includes(searchTerm);
    });
    table.setData(filteredTasks); // Update the table with filtered data
    updateTaskCounters(); // Update counters to reflect filtered data
  });
  




}

// Toast Notifications
function showToast(message, type = "success") {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: type === "success" ? "#28a745" : "#dc3545",
    stopOnFocus: true,
  }).showToast();
}
