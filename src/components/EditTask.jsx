import { useState, useContext, useEffect, useRef } from 'react'
import CrossIcon from '../assets/icon-cross.svg?react'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'
import { BoardContext } from '../App'
import { getCustomStyles } from '../utils/getCustomStyles_addTask.js'
import useFocusTrap from '../hooks/useFocusTrap'

function EditTask() {
  // Locate the active task from the current board's columns
  const { currentBoard, activeTaskId, updateTask, updateTaskStatus, closeEditTaskModal, closeTaskModal, darkMode } = useContext(BoardContext)
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
  const [subtaskErrors, setSubtaskErrors] = useState({})
  const [status, setStatus] = useState(currentTask?.status || currentBoard.columns[0]?.name || '')
  const customStyles = getCustomStyles(darkMode)
  // Generate status options from board columns
  const options = currentBoard.columns.map((column) => ({
    value: column.name.toLowerCase(),
    label: column.name
  }))
  const newSubtaskInputRef = useRef(null)
  const focusNewSubtask = useRef(false)
  const modalRef = useRef(null)
  const mouseDownOnBackdrop = useRef(false)

  useFocusTrap(modalRef, true, closeEditTaskModal)

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

  function handleAddSubtask() {
    setSubtasks([...subtasks, { id: uuidv4(), title: '', isCompleted: false }])
    focusNewSubtask.current = true
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

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
      closeEditTaskModal()
    }
    mouseDownOnBackdrop.current = false
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
      status, // this is the new status (column name)
      subtasks
    }
  
    // If the task's status has changed, use updateTaskStatus to move it.
    if (updatedTask.status !== currentTask.status) {
      updateTaskStatus(updatedTask.id, updatedTask.status)
    } else {
      updateTask(updatedTask)
    }
    closeEditTaskModal()
    closeTaskModal()
  }

  const selectedOption = options.find((option) => option.label === status) || options[0]

  return (
    <div className="task-modal" onClick={handleBackdropClick} onMouseDown={handleMouseDown}>
      <div 
        ref={modalRef}
        className={`task-modal__content ${darkMode ? 'dark' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby='edit-task-title'
      >
        <h2 id='edit-task-title' className="task-modal__content--header--title">Edit Task</h2>
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
            {subtasks.map((subtask, index) => (
              <div key={subtask.id} className="subtask-input">
                <div className='input-container'>
                    <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                        className={`${darkMode ? 'dark' : ''} ${subtaskErrors[subtask.id] ? 'error' : ''}`}
                        placeholder="Subtask title"
                        ref={index === subtasks.length - 1 ? newSubtaskInputRef : null}
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