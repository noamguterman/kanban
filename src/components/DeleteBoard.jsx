import { useContext } from 'react'
import { BoardContext } from '../App'

function DeleteBoard() {
    const { darkMode, closeDeleteBoardModal, currentBoard, deleteBoard } = useContext(BoardContext)

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            closeDeleteBoardModal()
        }
    }

    function handleDeleteBoard() {
        // Use the context's deleteBoard function
        deleteBoard(currentBoard.id)
        
        // Close the modal
        closeDeleteBoardModal()
    }

    return (
        <div className="task-modal" onClick={handleBackdropClick}>
            <div className={`task-modal__content delete-modal ${darkMode ? 'dark' : ''}`}>
                <h2 className="task-modal__content--header--title delete-title">Delete this board?</h2>
                
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