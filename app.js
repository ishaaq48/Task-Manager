const express = require('express')
const mongoose = require('mongoose')
const Task = require('./models/tasks.model.js')
const cors = require('cors');
const app = express()

app.use(cors())
app.use(express.static('./public'))
app.use(express.json())

app.use(cors({
    origin: 'http://127.0.0.1:5500'
  }))

app.get('/tasks',async(req,res)=>{
    const tasks = await Task.find();
    res.json(tasks)
})

app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res
            .status(404)
            .json({ success: false, msg: "Task not found" });
    }
    res.json({ success: true, task });
});

app.post('/tasks',async(req,res)=>{
    const {id,title,completed} = req.body
    if(!title)
    {
        return res
            .status(400)
            .json({success:false,msg: "Title not found"})
    }
    const task = new Task({ id, title,completed : completed || false})
    await task.save();
    res.status(201).json({success:true, task})
})

app.put('/tasks/:id', async (req, res) => {
    const { title, completed } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res
            .status(404)
            .json({ success: false, msg: `No task with id ${req.params.id}` });
    }
    task.title = title || task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    await task.save();
    res.status(200).json({ success: true, task });
});


app.delete('/tasks/:id', async (req, res) => {
    try {
        // Use findByIdAndDelete to find the task by its MongoDB ObjectId
        const task = await Task.findByIdAndDelete(req.params.id);

        // Check if the task was found and deleted
        if (!task) {
            return res.status(404).json({ success: false, msg: `No task found with id ${req.params.id}` });
        }

        return res.status(200).json({ success: true, task });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
})


mongoose.connect('mongodb+srv://syedishaaq48:ishaaq1342003@tasks1.7igs7.mongodb.net/task-manager?retryWrites=true&w=majority&appName=tasks1')
  .then(() => {console.log('Connected!')})
  .catch(()=>{console.log('Connection failed')})

app.listen(3000,()=>{
    console.log('Server is running on port 3000...')
})