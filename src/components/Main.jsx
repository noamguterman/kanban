import Column from './Column'
import { useContext, forwardRef } from 'react'
import { BoardContext } from '../App'

const Main = forwardRef((props, ref) => {
    const { currentBoard, openEditBoardModal, openAddBoardModal, darkMode, boards } = useContext(BoardContext)
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
    const noBoardsCta =
        <div className='main'>
            <div className='empty-board'>
            <h2 className='empty-board__text'>No boards found. Create a new board to get started.</h2>
            <button 
                className='btn sm primary'
                onClick={openAddBoardModal}
            >
                + Add New Board
            </button>
            </div>
        </div>
    const main = 
        <div className='main' ref={ref}>
            {columns.length 
                ? 
                    <>
                        {columns}
                        <button 
                            className={`column-ghost ${darkMode ? 'dark' : ''}`}
                            onClick={() => openEditBoardModal(true)}
                        >
                            + New Column
                        </button>
                    </> 
                : emptyBoardCta
            }
        </div>

    return (
        boards.length ? main : noBoardsCta
    )
})

export default Main