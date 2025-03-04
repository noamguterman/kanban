import { useState, useContext, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CrossIcon from '../assets/icon-cross.svg?react'
import { BoardContext } from '../App'

function EditBoard() {
  const { darkMode, closeEditBoardModal, updateBoard, boards, currentBoard, editBoardShouldAddColumn, resetEditBoardAddColumnFlag } = useContext(BoardContext)
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
  const [columnNameError, setColumnNameError] = useState('')
  const newColumnInputRef = useRef(null)
  const shouldFocusNewColumn = useRef(false)
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (nameError) setNameError('')
  }, [name])

  useEffect(() => {
    document.body.classList.add('modal-open')
    if (nameInputRef.current) nameInputRef.current.focus()
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
  
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeEditBoardModal()
    }
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
  }

  function handleColumnNameChange(id, value) {
    setColumns(
      columns.map(column =>
        column.id === id ? { ...column, name: value } : column
      )
    )
    if (columnNameError && value.trim()) {
      setColumnNameError('')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Board name cannot be empty')
      return
    }

    const isDuplicate = boards.some(board => 
      board.id !== currentBoard.id &&
      board.name.toLowerCase() === trimmedName.toLowerCase()
    )
    if (isDuplicate) {
      setNameError('A board with this name already exists')
      return
    }

    if (columns.some(column => !column.name.trim())) {
      setColumnNameError('Column name cannot be empty')
      return
    }

    const updatedBoard = {
      ...currentBoard,
      name: trimmedName,
      columns: columns.map(col => {
        const existingColumn = currentBoard.columns.find(c => c.id === col.id)
        return { ...col, tasks: existingColumn ? existingColumn.tasks : [] }
      })
    }
    
    updateBoard(updatedBoard)
    closeEditBoardModal()
  }

  return (
    <div className="task-modal" onClick={handleBackdropClick}>
      <div className={`task-modal__content ${darkMode ? 'dark' : ''}`} onClick={e => e.stopPropagation()}>
        <h2 className="task-modal__content--header--title">Edit Board</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
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
            {nameError && <p className="form-error">{nameError}</p>}
          </div>
          <div className="form-group">
            <label>Columns</label>
            {columns.map((column, index) => (
              <div key={column.id} className="subtask-input">
                <button
                  type="button"
                  className={`column__dot ${column.color}`}
                  onClick={() => handleColorChange(column.id)}
                  title="Click to change column color"
                ></button>
                <input 
                  type="text"
                  placeholder="e.g. Todo"
                  value={column.name}
                  onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                  className={`${darkMode ? 'dark' : ''} ${columnNameError && !column.name.trim() ? 'error' : ''}`}
                  ref={index === columns.length - 1 ? newColumnInputRef : null}
                />
                <button
                  type="button"
                  className="remove-subtask"
                  onClick={() => handleRemoveColumn(column.id)}
                >
                  <CrossIcon />
                </button>
              </div>
            ))}
            {columnNameError && <p className="form-error">{columnNameError}</p>}
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