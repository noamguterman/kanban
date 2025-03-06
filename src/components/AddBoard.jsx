import { useState, useContext, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CrossIcon from '../assets/icon-cross.svg?react'
import { BoardContext } from '../App'
import useFocusTrap from '../hooks/useFocusTrap'

function AddBoard() {
  const { darkMode, closeAddBoardModal, addNewBoard, boards } = useContext(BoardContext)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [columns, setColumns] = useState([
    { id: uuidv4(), name: 'Todo', color: 'color1' },
    { id: uuidv4(), name: 'Doing', color: 'color2' }
  ])
  const [columnErrors, setColumnErrors] = useState({})
  const newColumnInputRef = useRef(null)
  const shouldFocusNewColumn = useRef(false)
  const nameInputRef = useRef(null)
  const modalRef = useRef(null)
  const mouseDownOnBackdrop = useRef(false)

  useFocusTrap(modalRef, true, closeAddBoardModal)

  useEffect(() => {
    if (nameError) setNameError('')
  }, [name])

  useEffect(() => {
    document.body.classList.add('modal-open')
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

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
    if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
      closeAddBoardModal()
    }

    mouseDownOnBackdrop.current = false
  }

  function handleAddColumn() {
    if (columns.length >= 5) return
    const colorOptions = ['color1', 'color2', 'color3', 'color4', 'color5']
    const colorIndex = columns.length % colorOptions.length

    setColumns([
      ...columns,
      {
        id: uuidv4(),
        name: '',
        color: colorOptions[colorIndex]
      }
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
          return {
            ...column,
            color: colorOptions[nextIndex]
          }
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

  function handleColumnNameChange(id, value) {
    const updatedColumns = columns.map(column =>
      column.id === id ? { ...column, name: value } : column
    )
    setColumns(updatedColumns)
  
    setColumnErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      // Clear error for the current column if it now has a non-empty value.
      if (value.trim()) {
        delete newErrors[id]
      }
      // Clear duplicate errors for all columns when any change occurs.
      Object.keys(newErrors).forEach(key => {
        if (newErrors[key] === "Duplicate column name") {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
  
    let hasError = false;
  
    // Validate board name
    if (!name.trim()) {
      setNameError("Can't be empty")
      hasError = true
    } else {
      setNameError('')
    }
  
    const newColumnErrors = {}
  
    // First, validate empty column names
    columns.forEach(column => {
      if (!column.name.trim()) {
        newColumnErrors[column.id] = "Can't be empty"
        hasError = true
      }
    })
  
    // Then, check for duplicate column names
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
  
    // Proceed if no errors
    const newBoard = {
      name: name.trim(),
      columns: columns.map(col => ({
        ...col,
        tasks: []
      }))
    }
  
    addNewBoard(newBoard)
    closeAddBoardModal()
  }

  return (
    <div className="task-modal" onClick={handleBackdropClick} onMouseDown={handleMouseDown}>
      <div 
        ref={modalRef}
        className={`task-modal__content ${darkMode ? 'dark' : ''}`} 
        onClick={e => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby='add-board-title'
      >
        <h2 id='add-board-title' className="task-modal__content--header--title">Add New Board</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <div className='input-container'>
              <input 
                ref={nameInputRef}
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
            Create New Board
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBoard