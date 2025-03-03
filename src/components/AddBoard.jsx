import { useState, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CrossIcon from '../assets/icon-cross.svg?react'
import { BoardContext } from '../App'

function AddBoard() {
    const { darkMode, closeAddBoardModal, addNewBoard, boards } = useContext(BoardContext)
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const [columns, setColumns] = useState([
        { id: uuidv4(), name: 'Todo', color: 'color1' },
        { id: uuidv4(), name: 'Doing', color: 'color2' }
    ])

    useEffect(() => {
        if (nameError) setNameError('')
    }, [name])

    useEffect(() => {
        document.body.classList.add('modal-open')
        
        return () => {
            document.body.classList.remove('modal-open')
        }
    }, [])

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            closeAddBoardModal()
        }
    }

    function handleAddColumn() {
        if (columns.length >= 5) {
            return
        }
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
    }

    function handleRemoveColumn(id) {
        if (columns.length <= 1) {
            return
        }

        setColumns(columns.filter(column => column.id !== id))
    }

    function handleColumnNameChange(id, value) {
        setColumns(columns.map(column => 
            column.id === id ? { ...column, name: value } : column
        ))
    }

    function handleSubmit(e) {
        e.preventDefault()
        
        // Trim the name to avoid whitespace-only names
        const trimmedName = name.trim()
        
        // Validate board name
        if (!trimmedName) {
            setNameError('Board name cannot be empty')
            return
        }
        
        // Check for duplicate board names (case insensitive)
        const isDuplicate = boards.some(board => 
            board.name.toLowerCase() === trimmedName.toLowerCase()
        )
        
        if (isDuplicate) {
            setNameError('A board with this name already exists')
            return
        }
        
        // Check if all columns have names
        const hasEmptyColumns = columns.some(column => !column.name.trim())
        if (hasEmptyColumns) {
            setNameError('All columns must have names')
            return
        }
        
        // Create new board object
        const newBoard = {
            name: trimmedName,
            columns: columns.map(col => ({
                ...col,
                tasks: []
            }))
        }
        
        // Add the board
        addNewBoard(newBoard)
        
        // Close the modal
        closeAddBoardModal()
    }

    return (
        <div className="task-modal" onClick={handleBackdropClick}>
            <div className={`task-modal__content ${darkMode ? 'dark' : ''}`} onClick={e => e.stopPropagation()}>
                <h2 className="task-modal__content--header--title">Add New Board</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            type="text"
                            placeholder="e.g. Web Design"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`${darkMode ? 'dark' : ''} ${nameError ? 'error' : ''}`}
                            required
                        />
                        {nameError && (
                            <p className="form-error">{nameError}</p>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label>Columns</label>
                        {columns.map((column) => (
                            <div key={column.id} className="subtask-input">
                                <input 
                                    type="text"
                                    placeholder="e.g. Todo"
                                    value={column.name}
                                    onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                                    className={darkMode ? 'dark' : ''}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="remove-subtask" 
                                    onClick={() => handleRemoveColumn(column.id)}
                                    disabled={columns.length <= 1}
                                    style={{ opacity: columns.length <= 1 ? 0.5 : 1, cursor: columns.length <= 1 ? 'not-allowed' : 'pointer' }}
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