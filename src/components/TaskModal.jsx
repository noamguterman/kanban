import MenuIcon from '../assets/icon-vertical-ellipsis.svg?react'
import Select from 'react-select'
import { useContext, useEffect, useRef } from 'react'
import { BoardContext } from '../App'
import { getCustomStyles } from '../utils/getCustomStyles.js'
import useFocusTrap from '../hooks/useFocusTrap.js'

function TaskModal({ task, hasSubtasks, totalSubtasks, completedSubtasks }) {
  const { darkMode, currentBoard, updateSubtask, updateTaskStatus, closeTaskModal, isTaskMenuOpen, handleTaskMenuClick, openEditTaskModal, openDeleteTaskModal } = useContext(BoardContext)
  const customStyles = getCustomStyles(darkMode)
  const options = currentBoard.columns.map(column => ({
    value: column.name.toLowerCase(),
    label: column.name
  }))

  // State & refs for the task modal menu
  const taskMenuRef = useRef(null)
  const taskMenuButtonRef = useRef(null)
  const modalRef = useRef(null)
  const mouseDownOnBackdrop = useRef(false)

  useFocusTrap(modalRef, true, closeTaskModal)

  useEffect(() => {
    function handleOutsideClicks(e) {
        if (
            isTaskMenuOpen &&
            taskMenuRef.current &&
            !taskMenuRef.current.contains(e.target) &&
            taskMenuButtonRef.current &&
            !taskMenuButtonRef.current.contains(e.target)) {
            handleTaskMenuClick()
        }
    }

    if (isTaskMenuOpen) {
        document.addEventListener('mousedown', handleOutsideClicks)
    }

    return () => {
        document.removeEventListener('mousedown', handleOutsideClicks)
    }
  }, [isTaskMenuOpen, handleTaskMenuClick])

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  function handleMouseDown(e) {
    // Check if the mousedown happened on backdrop (not on modal content)
    mouseDownOnBackdrop.current = e.target === e.currentTarget
  }

  function handleStatusChange(selectedOption) {
    updateTaskStatus(task.id, selectedOption.label)
  }

  function handleBackdropClick(e) {
    // Only close if both mousedown and click happened on backdrop
    if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
      closeTaskModal()
    }
    // Reset the flag
    mouseDownOnBackdrop.current = false
  }

  function handleSubtaskToggle(e, index) {
    e.stopPropagation()
    updateSubtask(task.id, index)
  }

  return (
    <div className="task-modal" onClick={handleBackdropClick} onMouseDown={handleMouseDown}>
      <div 
        ref={modalRef}
        className={`task-modal__content ${darkMode ? 'dark' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby='task-title'
      >
        <div className="task-modal__content--header">
          <h2 id='task-title' className="task-modal__content--header--title">{task.title}</h2>
          <button
            className="task-modal__content--header--menu"
            onClick={handleTaskMenuClick}
            ref={taskMenuButtonRef}
          >
            <MenuIcon alt="Menu icon" />
          </button>
          {isTaskMenuOpen && (
            <div
              className={`task-modal__menu-dropdown ${darkMode ? 'dark' : ''}`}
              ref={taskMenuRef}
            >
              <button 
                className={`btn-edit ${darkMode ? 'dark' : ''}`}
                onClick={openEditTaskModal}>
                Edit Task
              </button>
              <button 
                className={`btn-delete ${darkMode ? 'dark' : ''}`}
                onClick={openDeleteTaskModal}
            >
                Delete Task
              </button>
            </div>
          )}
        </div>
        {task.description && (
          <p className="task-modal__content--description">{task.description}</p>
        )}
        {hasSubtasks && (
          <div className="task-modal__content--subtasks">
            <p className={`task-modal__content--subtasks--title ${darkMode ? 'dark' : ''}`}>
              Subtasks ({completedSubtasks} of {totalSubtasks})
            </p>
            {task.subtasks.map((subtask, index) => (
              <div
                key={`subtask-${subtask.id}`}
                className={`task-modal__content--subtasks--subtask ${darkMode ? 'dark' : ''}`}
                onClick={(e) => handleSubtaskToggle(e, index)}
              >
                <input
                  type="checkbox"
                  className={`checkbox ${subtask.isCompleted ? 'checked' : ''}`}
                  id={`subtask-${subtask.id}`}
                  checked={subtask.isCompleted}
                  readOnly
                />
                <label
                  htmlFor={`subtask-${subtask.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleSubtaskToggle(e, index)
                  }}
                >
                  {subtask.title}
                </label>
              </div>
            ))}
          </div>
        )}
        <div className={`task-modal__content--status ${darkMode ? 'dark' : ''}`}>
          <p>Current status</p>
          <Select
            options={options}
            value={
              options.find(option => option.value === task.status.toLowerCase()) ||
              (options.length > 0 ? options[0] : null)
            }
            onChange={handleStatusChange}
            styles={{
              ...customStyles,
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  )
}

export default TaskModal