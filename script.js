 const taskInput = document.getElementById("taskInput");
 const taskList = document.getElementById("taskList");
 const progressBar = document.getElementById("progress-bar");
 const taskCounter = document.getElementById("task-counter");
 const toggleModeBtn = document.getElementById("toggleMode");

 let tasks = [];

 // Initialize mode from localStorage or default to dark
 let isLightMode = localStorage.getItem('isLightMode') === 'true';
 if (isLightMode) {
     document.body.classList.add('light-mode');
     toggleModeBtn.textContent = 'Dark Mode';
 } else {
     toggleModeBtn.textContent = 'Light Mode';
 }

 toggleModeBtn.addEventListener('click', () => {
     isLightMode = !isLightMode;
     localStorage.setItem('isLightMode', isLightMode);
     document.body.classList.toggle('light-mode', isLightMode);
     toggleModeBtn.textContent = isLightMode ? 'Dark Mode' : 'Light Mode';
 });

 function addTask() {
     const text = taskInput.value.trim();
     if (text === '') return;
     tasks.push({
         text,
         done: false
     });
     taskInput.value = '';
     renderTasks();
 }

 function toggleTask(index) {
     tasks[index].done = !tasks[index].done;
     renderTasks();

     // Trigger confetti only when all tasks are completed on toggling
     if (tasks.length && tasks.every(task => task.done)) {
         confetti({
             particleCount: 100,
             spread: 70,
             origin: {
                 y: 0.6
             },
         });
     }
 }

 function deleteTask(index) {
     tasks.splice(index, 1);
     renderTasks();
 }

 function renderTasks() {
     taskList.innerHTML = '';
     let completed = 0;

     tasks.forEach((task, index) => {
         const li = document.createElement("li");
         if (task.done) {
             li.classList.add("completed");
             completed++;
         }

         const label = document.createElement("label");
         label.innerHTML = `<input type='checkbox' ${task.done ? 'checked' : ''} onchange='toggleTask(${index})'> ${task.text}`;

         const actions = document.createElement("div");
         actions.classList.add("actions");
         actions.innerHTML = `
          <i class="fas fa-pen" onclick="editTask(${index})" title="Edit task"></i>
          <i class="fas fa-trash" onclick="deleteTask(${index})" title="Delete task"></i>
        `;

         li.appendChild(label);
         li.appendChild(actions);
         taskList.appendChild(li);
     });

     const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
     progressBar.style.width = `${percent}%`;
     taskCounter.textContent = `${completed} / ${tasks.length}`;
 }

 function editTask(index) {
     const newText = prompt("Edit your task:", tasks[index].text);
     if (newText !== null) {
         tasks[index].text = newText.trim();
         renderTasks();
     }
 }