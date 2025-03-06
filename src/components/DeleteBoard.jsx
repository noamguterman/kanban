import { useContext, useRef } from 'react'
import { BoardContext } from '../App'
import useFocusTrap from '../hooks/useFocusTrap'

function DeleteBoard() {
    const { darkMode, closeDeleteBoardModal, currentBoard, deleteBoard } = useContext(BoardContext)
    const modalRef = useRef(null)
    const mouseDownOnBackdrop = useRef(false)

    useFocusTrap(modalRef, true, closeDeleteBoardModal)

    function handleMouseDown(e) {
        // Check if the mousedown happened on backdrop (not on modal content)
        mouseDownOnBackdrop.current = e.target === e.currentTarget
    }

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget && mouseDownOnBackdrop.current) {
            closeDeleteBoardModal()
        }

        mouseDownOnBackdrop.current = false
    }

    function handleDeleteBoard() {
        // Use the context's deleteBoard function
        deleteBoard(currentBoard.id)
        
        // Close the modal
        closeDeleteBoardModal()
    }

    return (
        <div className="task-modal" onClick={handleBackdropClick} onMouseDown={handleMouseDown}>
            <div 
                ref={modalRef}
                className={`task-modal__content delete-modal ${darkMode ? 'dark' : ''}`}
                onClick={e => e.stopPropagation()}
                role='dialog'
                aria-modal='true'
                aria-labelledby='delete-board-title'
            >
                <h2 id='delete-board-title' className="task-modal__content--header--title delete-title">Delete this board?</h2>
                
                <p className="delete-message">
                    Are you sure you want to delete the '{currentBoard.name}' board? 
                    This action will remove all columns and tasks and cannot be reversed.
                </p>
                
                <div className="delete-actions">
                    <button 
                        className="btn sm destructive" 
                        onClick={handleDeleteBoard}
                    >
                        Delete
                    </button>
                    <button 
                        className={`btn sm secondary ${darkMode ? 'dark' : ''}`}
                        onClick={closeDeleteBoardModal}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteBoard