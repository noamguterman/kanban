import { useState, useContext } from 'react'
import CrossIcon from '../assets/icon-cross.svg?react'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'
import { BoardContext } from '../App'
import { getCustomStyles } from '../utils/getCustomStyles_addTask.js'

function EditTask() {
  // Locate the active task from the current board's columns
  const { currentBoard, activeTaskId, updateTask, closeEditTaskModal, darkMode } = useContext(BoardContext)
  let currentTask
  for (const column of currentBoard.columns) {
    const found = column.tasks.find((task) => task.id === activeTaskId)
    if (found) {
      currentTask = found
      break
    }
  }

  // Local state with error handling (inline errors)
  const [title, setTitle] = useState(currentTask?.title || '')
  const [titleError, setTitleError] = useState('')
  const [description, setDescription] = useState(currentTask?.description || '')
  const [subtasks, setSubtasks] = useState(currentTask?.subtasks || [])
  const [subtaskErrors, setSubtaskErrors] = useState('')
  const [status, setStatus] = useState(currentTask?.status || currentBoard.columns[0]?.name || '')
  const customStyles = getCustomStyles(darkMode)
  // Generate status options from board columns
  const options = currentBoard.columns.map((column) => ({
    value: column.name.toLowerCase(),
    label: column.name
  }))

  function handleStatusChange(selectedOption) {
    setStatus(selectedOption.label)
  }

  function handleAddSubtask() {
    setSubtasks([...subtasks, { id: uuidv4(), title: '', isCompleted: false }])
  }

  function handleRemoveSubtask(id) {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id))
    setSubtaskErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      delete newErrors[id]
      return newErrors
    })
  }

  function handleSubtaskChange(id, value) {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, title: value } : subtask
      )
    )
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

    const updatedTask = {
      ...currentTask,
      title: title.trim(),
      description,
      status,
      subtasks
    }

    updateTask(updatedTask)
    closeEditTaskModal()
  }

  const selectedOption = options.find((option) => option.label === status) || options[0]

  return (
    <div className="task-modal" onClick={(e) => { if (e.target === e.currentTarget) closeEditTaskModal() }}>
      <div className={`task-modal__content ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h2 className="task-modal__content--header--title">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <div className="input-container">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (titleError) setTitleError('')
                }}
                className={`${darkMode ? 'dark' : ''} ${titleError ? 'error' : ''}`}
                placeholder="Task title"
              />
              {titleError && <span className="inline-error">{titleError}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={darkMode ? 'dark' : ''}
              placeholder="Task description"
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Subtasks</label>
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="subtask-input">
                <div className='input-container'>
                    <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                        className={`${darkMode ? 'dark' : ''} ${subtaskErrors[subtask.id] ? 'error' : ''}`}
                        placeholder="Subtask title"
                    />
                    {subtaskErrors[subtask.id] && <span className="inline-error">{subtaskErrors[subtask.id]}</span>}
                </div>
                <button type="button" className="remove-subtask" onClick={() => handleRemoveSubtask(subtask.id)}>
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
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditTask