import Column from './Column'
import { useContext } from 'react'
import { BoardContext } from '../App'

function Main() {
    const { currentBoard, openEditBoardModal } = useContext(BoardContext)
    const columns = currentBoard.columns.map(column => {
        return (
            <Column key={`column-${column.id}`} column={column} />
        )
    })
    const emptyBoardCta = 
        <div className='empty-board'>
            <h2 className='empty-board__text'>This board is empty. Create a new column to get started.</h2>
            <button 
                className='btn sm primary'
                onClick={() => openEditBoardModal(true)}
            >
                    + Add New Column
            </button>
        </div>

    return (
        <div className='main'>
            {columns.length ? columns : emptyBoardCta}
        </div>
    )
}

export default Main