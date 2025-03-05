import { useContext, useRef } from 'react'
import { BoardContext } from '../App'

function DeleteTask() {
  const { darkMode, closeDeleteTaskModal, currentBoard, deleteTask, activeTaskId } = useContext(BoardContext)
  const mouseDownOnBackdrop = useRef(false)

  function handleMouseDown(e) {
    // Check if the mousedown happened on backdrop (not on modal content)
    mouseDownOnBackdrop.current = e.target === e.currentTarget
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
      closeTaskModal()
    }

    mouseDownOnBackdrop.current = false
  }

  function handleDeleteTask() {
    // Call context function to delete the task.
    // Make sure to add a function like deleteTask in your App.jsx context.
    deleteTask(activeTaskId)
    closeDeleteTaskModal()
  }

  // Retrieve current task title for a confirmation message
  let currentTaskTitle = ''
  for (const column of currentBoard.columns) {
    const found = column.tasks.find((task) => task.id === activeTaskId)
    if (found) {
      currentTaskTitle = found.title
      break
    }
  }

  return (
    <div className="task-modal" onClick={handleBackdropClick} onMouseDown={handleMouseDown}>
      <div className={`task-modal__content delete-modal ${darkMode ? 'dark' : ''}`}>
        <h2 className="task-modal__content--header--title delete-title">Delete this task?</h2>
        <p className="delete-message">
          Are you sure you want to delete the task &apos;{currentTaskTitle}&apos;? This action cannot be undone.
        </p>
        <div className="delete-actions">
          <button className="btn sm destructive" onClick={handleDeleteTask}>
            Delete
          </button>
          <button className={`btn sm secondary ${darkMode ? 'dark' : ''}`} onClick={closeDeleteTaskModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTask