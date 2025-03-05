import { useState, useContext, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Select from 'react-select'
import CrossIcon from '../assets/icon-cross.svg?react'
import { BoardContext } from '../App'
import { getCustomStyles } from '../utils/getCustomStyles_addTask.js'

function AddTask() {
    const { currentBoard, darkMode, addNewTask, closeAddTaskModal, targetColumnName } = useContext(BoardContext)
    const customStyles = getCustomStyles(darkMode)
    const [title, setTitle] = useState('')
    const [titleError, setTitleError] = useState('')
    const [subtaskErrors, setSubtaskErrors] = useState({})
    const [description, setDescription] = useState('')
    
    // Get a valid initial status - prefer targetColumnName, fallback to first column
    const defaultColumnName = currentBoard?.columns[0]?.name || ''
    const [status, setStatus] = useState(targetColumnName || defaultColumnName)
    const [subtasks, setSubtasks] = useState([])

    const titleInputRef = useRef(null)
    const newSubtaskInputRef = useRef(null)
    const focusNewSubtask = useRef(false)
    const mouseDownOnBackdrop = useRef(false)

    // Generate options for the Select dropdown
    const options = currentBoard.columns.map(column => ({
        value: column.name.toLowerCase(),
        label: column.name
    }))

    useEffect(() => {
        setStatus(targetColumnName || defaultColumnName)
    }, [targetColumnName, defaultColumnName]);

    useEffect(() => {
        document.body.classList.add('modal-open')
        if (titleInputRef.current) {
            titleInputRef.current.focus()
        }
        return () => {
            document.body.classList.remove('modal-open')
        }
    }, [])

    useEffect(() => {
        if (focusNewSubtask.current && newSubtaskInputRef.current) {
          newSubtaskInputRef.current.focus()
          focusNewSubtask.current = false
        }
      }, [subtasks])

    function handleMouseDown(e) {
    // Check if the mousedown happened on backdrop (not on modal content)
    mouseDownOnBackdrop.current = e.target === e.currentTarget
    }
    
    function handleStatusChange(selectedOption) {
    setStatus(selectedOption.label)
    }

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
            closeAddTaskModal()
        }

        mouseDownOnBackdrop.current = false
    }

    function handleAddSubtask() {
        setSubtasks([...subtasks, { id: uuidv4(), title: '', isCompleted: false }])
        focusNewSubtask.current = true
    }

    function handleRemoveSubtask(id) {
        setSubtasks(subtasks.filter(subtask => subtask.id !== id))
        setSubtaskErrors(prevErrors => {
            const newErrors = { ...prevErrors }
            delete newErrors[id]
            return newErrors
        })
    }

    function handleSubtaskChange(id, value) {
    setSubtasks(subtasks.map(subtask => 
        subtask.id === id ? { ...subtask, title: value } : subtask
    ))
    setSubtaskErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        if (value.trim()) {
        delete newErrors[id]
        }
        return newErrors
    })
    }

    function handleSubmit(e) {
    e.preventDefault()

    let hasError = false

    if (!title.trim()) {
        setTitleError(`Can't be empty`)
        hasError = true
    } else {
        setTitleError('')
    }

    const newSubtaskErrors = {}
    subtasks.forEach(subtask => {
        if (!subtask.title.trim()) {
        newSubtaskErrors[subtask.id] = `Can't be empty`
        hasError = true
        }
    })

    setSubtaskErrors(newSubtaskErrors)

    if (hasError) return

    const finalStatus = status || defaultColumnName

    const newTask = {
        id: uuidv4(),
        title: title.trim(),
        description,
        status: finalStatus,
        subtasks
    }

    addNewTask(newTask)
    closeAddTaskModal()
    }

    const selectedOption = options.find(option => option.label === status) || 
                          (options.length > 0 ? options[0] : null)

    return (
        <div className="task-modal" onClick={handleBackdropClick} onMouseDown={handleMouseDown}>
            <div className={`task-modal__content ${darkMode ? 'dark' : ''}`} onClick={e => e.stopPropagation()}>
                <h2 className="task-modal__content--header--title">Add New Task</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <div className='input-container'>
                            <input 
                                ref={titleInputRef}
                                type="text"
                                placeholder="e.g. Take coffee break"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    if (titleError) setTitleError('')
                                }}
                                className={`${darkMode ? 'dark' : ''} ${titleError ? 'error' : ''}`}
                            />
                            {titleError && <span className="inline-error">{titleError}</span>}
                        </div>
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
                        {subtasks.map((subtask, index) => (
                            <div key={subtask.id} className="subtask-input">
                                <div className='input-container'>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Make coffee"
                                        value={subtask.title}
                                        onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                                        className={`${darkMode ? 'dark' : ''} ${subtaskErrors[subtask.id] ? 'error' : ''}`}
                                        ref={index === subtasks.length - 1 ? newSubtaskInputRef : null}
                                    />
                                    {subtaskErrors[subtask.id] && <span className="inline-error">{subtaskErrors[subtask.id]}</span>}
                                </div>
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
                            value={selectedOption}
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