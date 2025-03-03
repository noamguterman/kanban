import { useState, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Select from 'react-select'
import CrossIcon from '../assets/icon-cross.svg?react'
import { BoardContext } from '../App'
import { getCustomStyles } from '../utils/getCustomStyles_addTask.js'

function AddTask() {
    const { currentBoard, darkMode, addNewTask, closeAddTaskModal, targetColumnName } = useContext(BoardContext)
    const customStyles = getCustomStyles(darkMode)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const initialStatus = targetColumnName || currentBoard.columns[0]?.name || ''
    const [status, setStatus] = useState(initialStatus)
    const [subtasks, setSubtasks] = useState([])

    const options = currentBoard.columns.map(column => ({
        value: column.name.toLowerCase(),
        label: column.name
    }))

    useEffect(() => {
        document.body.classList.add('modal-open')
        
        return () => {
          document.body.classList.remove('modal-open')
        }
      }, [])

    function handleStatusChange(selectedOption) {
        setStatus(selectedOption.label)
    }

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            closeAddTaskModal()
        }
    }

    function handleAddSubtask() {
        setSubtasks([...subtasks, { id: uuidv4(), title: '', isCompleted: false }])
    }

    function handleRemoveSubtask(id) {
        setSubtasks(subtasks.filter(subtask => subtask.id !== id))
    }

    function handleSubtaskChange(id, value) {
        setSubtasks(subtasks.map(subtask => 
            subtask.id === id ? { ...subtask, title: value } : subtask
        ))
    }

    function handleSubmit(e) {
        e.preventDefault()
        
        // Validate inputs
        if (!title.trim()) return

        // Filter out empty subtasks
        const filteredSubtasks = subtasks.filter(subtask => subtask.title.trim() !== '')
        
        // Create new task object
        const newTask = {
            id: uuidv4(),
            title,
            description,
            status,
            subtasks: filteredSubtasks
        }
        
        // Add the task to the board
        addNewTask(newTask)
        
        // Close the modal
        closeAddTaskModal()
    }

    return (
        <div className="task-modal" onClick={handleBackdropClick}>
            <div className={`task-modal__content ${darkMode ? 'dark' : ''}`} onClick={e => e.stopPropagation()}>
                <h2 className="task-modal__content--header--title">Add New Task</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input 
                            type="text"
                            placeholder="e.g. Take coffee break"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={darkMode ? 'dark' : ''}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={darkMode ? 'dark' : ''}
                            rows={4}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Subtasks</label>
                        {subtasks.map((subtask) => (
                            <div key={subtask.id} className="subtask-input">
                                <input 
                                    type="text"
                                    placeholder="e.g. Make coffee"
                                    value={subtask.title}
                                    onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                                    className={darkMode ? 'dark' : ''}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="remove-subtask" 
                                    onClick={() => handleRemoveSubtask(subtask.id)}
                                >
                                    <CrossIcon />
                                </button>
                            </div>
                        ))}
                        
                        <button 
                            type="button" 
                            className={`btn sm secondary ${darkMode ? 'dark' : ''}`}
                            onClick={handleAddSubtask}
                        >
                            + Add New Subtask
                        </button>
                    </div>
                    
                    <div className="form-group">
                        <label>Status</label>
                        <Select 
                            options={options}
                            value={options.find(option => option.label === status) || options[0]}
                            onChange={handleStatusChange}
                            styles={{
                                ...customStyles,
                                menuPortal: (base) => ({ ...base, zIndex: 9999 })
                            }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            isSearchable={false}
                        />
                    </div>
                    
                    <button type="submit" className="btn sm primary">
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddTask