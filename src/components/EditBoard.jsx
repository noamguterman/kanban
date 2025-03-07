import { useState, useContext, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CrossIcon from '../assets/icon-cross.svg?react'
import { BoardContext } from '../App'
import useFocusTrap from '../hooks/useFocusTrap'

function EditBoard() {
  const {
    darkMode,
    closeEditBoardModal,
    updateBoard,
    currentBoard,
    editBoardShouldAddColumn,
    resetEditBoardAddColumnFlag
  } = useContext(BoardContext)
  
  const [name, setName] = useState(currentBoard.name)
  const [nameError, setNameError] = useState('')
  const [columns, setColumns] = useState(
    currentBoard.columns.map(col => ({
      id: col.id,
      name: col.name,
      color: col.color || 'color1',
      tasks: col.tasks
    }))
  )
  const [columnErrors, setColumnErrors] = useState({})
  const newColumnInputRef = useRef(null)
  const shouldFocusNewColumn = useRef(false)
  const modalRef = useRef(null)
  const mouseDownOnBackdrop = useRef(false)

  useFocusTrap(modalRef, true, closeEditBoardModal, false)

  useEffect(() => {
    if (nameError) setNameError('')
  }, [name])

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  useEffect(() => {
    if (editBoardShouldAddColumn) {
      handleAddColumn()
      resetEditBoardAddColumnFlag()
    }
  }, [editBoardShouldAddColumn, resetEditBoardAddColumnFlag])

  useEffect(() => {
    if (shouldFocusNewColumn.current && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      shouldFocusNewColumn.current = false
    }
  }, [columns])

  function handleMouseDown(e) {
    // Check if the mousedown happened on backdrop (not on modal content)
    mouseDownOnBackdrop.current = e.target === e.currentTarget
  }
  
  function handleBackdropClick(e) {
    // Only close if both mousedown and click happened on backdrop
    if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
      closeEditBoardModal()
    }
    // Reset the flag
    mouseDownOnBackdrop.current = false
  }

  function handleAddColumn() {
    if (columns.length >= 5) return
    const colorOptions = ['color1', 'color2', 'color3', 'color4', 'color5']
    const colorIndex = columns.length % colorOptions.length

    setColumns([
      ...columns,
      { id: uuidv4(), name: '', color: colorOptions[colorIndex], tasks: [] }
    ])
    shouldFocusNewColumn.current = true
  }

  function handleColorChange(id) {
    const colorOptions = ['color1', 'color2', 'color3', 'color4', 'color5']
    setColumns(
      columns.map(column => {
        if (column.id === id) {
          const currentIndex = colorOptions.indexOf(column.color)
          const nextIndex = (currentIndex + 1) % colorOptions.length
          return { ...column, color: colorOptions[nextIndex] }
        }
        return column
      })
    )
  }

  function handleRemoveColumn(id) {
    setColumns(columns.filter(column => column.id !== id))
    setColumnErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      delete newErrors[id]
      return newErrors
    })
  }

  // Updated handleColumnNameChange clears errors from all duplicates when one field is edited.
  function handleColumnNameChange(id, value) {
    const updatedColumns = columns.map(column =>
      column.id === id ? { ...column, name: value } : column
    )
    setColumns(updatedColumns)
    
    setColumnErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      // Clear error for this column if it now has a value.
      if (value.trim()) {
        delete newErrors[id]
      }
      // Also remove "Duplicate column name" errors from all columns.
      Object.keys(newErrors).forEach(key => {
        if (newErrors[key] === "Duplicate column name") {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  // Updated handleSubmit includes duplicate column name validation.
  function handleSubmit(e) {
    e.preventDefault()

    let hasError = false

    if (!name.trim()) {
      setNameError(`Can't be empty`)
      hasError = true
    } else {
      setNameError('')
    }

    const newColumnErrors = {}
    // Validate empty column names.
    columns.forEach(column => {
      if (!column.name.trim()) {
        newColumnErrors[column.id] = `Can't be empty`
        hasError = true
      }
    })

    // Validate duplicate column names.
    columns.forEach(column => {
      const trimmedName = column.name.trim()
      if (
        trimmedName &&
        columns.filter(col => col.name.trim() === trimmedName).length > 1
      ) {
        newColumnErrors[column.id] = "Duplicate column name"
        hasError = true
      }
    })

    setColumnErrors(newColumnErrors)

    if (hasError) return

    const updatedBoard = {
      ...currentBoard,
      name: name.trim(),
      columns: columns.map(col => {
        const existingColumn = currentBoard.columns.find(c => c.id === col.id)
        return { ...col, tasks: existingColumn ? existingColumn.tasks : [] }
      })
    }
    
    updateBoard(updatedBoard)
    closeEditBoardModal()
  }

  return (
    <div className="task-modal" onClick={handleBackdropClick} onMouseDown={handleMouseDown}>
      <div 
        ref={modalRef}
        className={`task-modal__content ${darkMode ? 'dark' : ''}`} 
        onClick={e => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby='edit-board-title'
        tabIndex={-1}
      >
        <h2 id='edit-board-title' className="task-modal__content--header--title">Edit Board</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <div className='input-container'>
              <input 
                type="text"
                placeholder="e.g. Web Design"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError) setNameError('')
                }}
                className={`${darkMode ? 'dark' : ''} ${nameError ? 'error' : ''}`}
              />
              {nameError && <span className="inline-error">{nameError}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Columns</label>
            {columns.map((column, index) => (
              <div key={column.id} className="subtask-input">
                <button
                  type="button"
                  className={`column__dot modal ${column.color}`}
                  onClick={() => handleColorChange(column.id)}
                  title="Click to change column color"
                ></button>
                <div className='input-container'>
                  <input 
                    type="text"
                    placeholder="e.g. Todo"
                    value={column.name}
                    maxLength={45}
                    onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                    className={`${darkMode ? 'dark' : ''} ${columnErrors[column.id] ? 'error' : ''}`}
                    ref={index === columns.length - 1 ? newColumnInputRef : null}
                  />
                  {columnErrors[column.id] && <span className="inline-error">{columnErrors[column.id]}</span>}
                </div>
                <button
                  type="button"
                  className="remove-subtask"
                  onClick={() => handleRemoveColumn(column.id)}
                >
                  <CrossIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`btn sm secondary ${darkMode ? 'dark' : ''}`}
              onClick={handleAddColumn}
              disabled={columns.length >= 5}
            >
              {columns.length >= 5 ? 'Maximum Columns Reached' : '+ Add New Column'}
            </button>
          </div>
          <button type="submit" className="btn sm primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditBoard
