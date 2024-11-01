const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");


async function showTask(){
    const response = await fetch('http://localhost:3000/tasks')
    const tasks = await response.json()

    listContainer.innerHTML = ''

    tasks.forEach(task =>{
        const li = document.createElement('li')
        li.textContent = task.title
        if(task.completed)
        {
            li.classList.add('checked')
        }
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        listContainer.appendChild(li);

        li.setAttribute('data-id', task._id);
    })
}



async function addTask()
{
    if(inputBox.value === '')
    {
        alert("You must write something!")
        return
    }
    const taskData = {
        id: new Date().getTime(),
        title : inputBox.value,
        completed: false
    }
    const response = await fetch('http://localhost:3000/tasks',
        {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        }
    )
    const newTask = await response.json()
    inputBox.value = "";
    showTask()
}
showTask()
listContainer.addEventListener("click", async function(e)
{
    if(e.target.tagName === "LI")
    {
        const taskID = e.target.getAttribute('data-id');
        const completed = !e.target.classList.contains('checked')
        
        e.target.classList.toggle('checked');

        await fetch(`http://localhost:3000/tasks/${taskID}`,
            {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            }
        )
    }
    else if(e.target.tagName === "SPAN")
    {
        deleteTask(e.target.parentElement.getAttribute('data-id'));
        
    }
},false);

async function deleteTask(taskID) {
    console.log("Deleting task with ID:", taskID); // Log the task ID
    const response = await fetch(`http://localhost:3000/tasks/${taskID}`, {
        method: 'DELETE'
    });

    // Check the response status
    if (!response.ok) {
        console.error('Failed to delete task:', response.statusText);
    }

    showTask(); // Refresh the task list
}

