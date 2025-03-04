import { useDrop } from 'react-dnd'
import { useContext, useRef } from 'react'
import { BoardContext } from '../App'
import Task from './Task'

function Column({ column }) {
    const { moveTask, openAddTaskModal, darkMode } = useContext(BoardContext)
    const columnRef = useRef(null)
    const tasksRef = useRef(null)

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        hover: (item, monitor) => {
            // Optional hover feedback for empty columns
            if (column.tasks.length === 0) {
                if (columnRef.current) {
                    columnRef.current.classList.add('drop-target')
                }
            }
        },
        drop: (item, monitor) => {
            if (item.columnName === column.name && column.tasks.length > 0) {
                return
            }
            
            const clientOffset = monitor.getClientOffset()
            if (!clientOffset) return
            
            let targetIndex = column.tasks.length // Default to end of list
            
            if (tasksRef.current && tasksRef.current.children.length > 0) {
                const taskElements = Array.from(tasksRef.current.children)
                
                for (let i = 0; i < taskElements.length; i++) {
                    const taskRect = taskElements[i].getBoundingClientRect()
                    const taskMiddleY = taskRect.top + taskRect.height / 2
                    
                    if (clientOffset.y < taskMiddleY) {
                        targetIndex = i
                        break
                    }
                }
            }
            
            moveTask(item.id, item.columnName, column.name, targetIndex)

            // Clear hover style
            if (columnRef.current) {
                columnRef.current.classList.remove('drop-target')
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        })
    }), [column.name, column.tasks.length, moveTask])

    drop(columnRef)
    
    return (
        <div 
            className={`column ${isOver ? 'drop-target' : ''}`}
            ref={columnRef}
        >
            <div className='column__header'>
                <span className={`column__header--dot ${column.color}`}></span>
                <span className='column__header--name'>{column.name} ({column.tasks.length})</span>
            </div>
            <div className='column__tasks' ref={tasksRef}>
                {column.tasks.map((task, index) => (
                    <Task 
                        key={`task-${task.id}`} 
                        task={task} 
                        columnName={column.name} 
                        index={index}
                    />
                ))}
            </div>
            <button 
                className={`task-ghost ${darkMode ? 'dark' : ''}`}
                onClick={() => openAddTaskModal(column.name)}
            >
                + New Task
            </button>
        </div>
    )
}

export default Column