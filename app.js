const textInput = document.getElementById('tasks');

textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

function addNewTask() {
    const jobs = document.querySelector('.work4');
    const jobValue = textInput.value;

    if (jobValue.trim() === '') return; // Avoid adding empty tasks

    const newDiv = document.createElement('div');
    newDiv.draggable = true;
    newDiv.textContent = jobValue;
    newDiv.classList.add('newtasks');

    // Attach drag event listeners
    addDragEvents(newDiv);

    jobs.appendChild(newDiv);

    // Attach the double click to remove behavior
    addRemoveOnDblClick(newDiv);

    // Clear the input field
    textInput.value = '';
}

function addDragEvents(newtask) {
    const work1 = document.querySelector('.work1');
    const work2 = document.querySelector('.work2');
    const work3 = document.querySelector('.work3');
    
    newtask.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', '');
        setTimeout(() => { newtask.style.display = "none"; }, 0); // hide the dragged element only after the drag starts
    });
    
    newtask.addEventListener('dragend', function(e) {
        newtask.style.display = ""; // unhide the dragged element on drag end
    });

    [work1, work2, work3].forEach(container => {
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        container.addEventListener('dragenter', function(e) {
            if (newtask.style.display === "none") {
                if (e.target.classList.contains('newtasks')) {
                    if (e.clientY < e.target.getBoundingClientRect().top + e.target.offsetHeight / 2) {
                        e.target.before(newtask);
                    } else {
                        e.target.after(newtask);
                    }
                } else {
                    container.appendChild(newtask);
                }
            }
        });
    });
}

// function for remove the newTask if not needed
function addRemoveOnDblClick(newtask) {
    newtask.addEventListener('dblclick', function() {
        newtask.remove();
    });
}

// enable vertical dragging
const draggables = document.querySelectorAll('.newtasks');
const containers = document.querySelectorAll('.work1, .work2, .work3, .work4');

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        console.log('drag start'); // just for testing
        draggable.classList.add('dragging');
    });
    
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });
});

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        console.log('drag over');
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.newtasks:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest; 
        }
    }, { offset: Number.POSITIVE_INFINITY }).element;
}

//enabling editing Newtask
document.querySelectorAll('.newtasks').forEach(task => {
    task.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        // Prompt the user to edit the task's text
        const newTaskText = prompt('Edit task:', e.target.textContent);

        if (newTaskText !== null && newTaskText.trim() !== '') {
            e.target.textContent = newTaskText;
        }
    });
});
