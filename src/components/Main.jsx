import Column from './Column'
import { useContext } from 'react'
import { BoardContext } from '../App'

function Main() {
    const { currentBoard } = useContext(BoardContext)
    const columns = currentBoard.columns.map(column => {
        return (
            <Column key={`column-${column.id}`} column={column} />
        )
    })

    return (
        <div className='main'>
            {columns}
        </div>
    )
}

export default Main