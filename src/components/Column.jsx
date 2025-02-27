import { useDrop } from 'react-dnd'
import { useContext, useRef } from 'react'
import { BoardContext } from '../App'
import Task from './Task'

function Column({ column }) {
    const { moveTask } = useContext(BoardContext)
    const columnRef = useRef(null)
    const tasksRef = useRef(null)

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        hover: (item, monitor) => {
            // Optional hover feedback
        },
        drop: (item, monitor) => {
            if (item.columnName === column.name) {
                return
            }
            
            const clientOffset = monitor.getClientOffset()
            if (!clientOffset) return
            
            let targetIndex = column.tasks.length // Default to end of list
            
            // If tasksRef exists and has children (there are tasks in the column)
            if (tasksRef.current && tasksRef.current.children.length > 0) {
                const taskElements = Array.from(tasksRef.current.children)
                
                // Find the closest task element based on mouse Y position
                for (let i = 0; i < taskElements.length; i++) {
                    const taskRect = taskElements[i].getBoundingClientRect()
                    const taskMiddleY = taskRect.top + taskRect.height / 2
                    
                    if (clientOffset.y < taskMiddleY) {
                        targetIndex = i
                        break
                    }
                }
            }
            
            // Move the task to the target position
            moveTask(item.id, item.columnName, column.name, targetIndex)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        })
    }))

    // Apply the drop ref to the column container
    drop(columnRef)
    
    return (
        <div 
            className={`column ${isOver ? 'drop-target' : ''}`}
            ref={columnRef}
        >
            <span className='column__header--name'>{column.name} ({column.tasks.length})</span>
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
        </div>
    )
}

export default Column