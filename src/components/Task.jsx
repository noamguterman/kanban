import { useContext, useRef, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { BoardContext } from '../App'
import TaskModal from './TaskModal'

function Task({ task, columnName, index }) {
    const { darkMode, openTaskModal, activeTaskId, isTaskModalOpen, moveTask } = useContext(BoardContext)
    const hasSubtasks = task.subtasks.length > 0
    const totalSubtasks = task.subtasks?.length
    const completedSubtasks = task.subtasks?.filter(subtask => subtask.isCompleted).length
    const isThisTaskModalOpen = isTaskModalOpen && activeTaskId === task.id

    const ref = useRef(null)

    const [{ isDragging }, drag] = useDrag({
        type: 'task',
        item: () => ({ 
            id: task.id, 
            columnName, 
            index,
            originalIndex: index // Track original position
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        // Keep dragging state consistent
        isDragging: (monitor) => {
            const item = monitor.getItem()
            return item && item.id === task.id
        }
    }, [task.id, columnName, index])

    const [{ isOver }, drop] = useDrop({
        accept: 'task',
        hover: (item, monitor) => {
            if (!ref.current) return
            
            // Don't replace items with themselves
            if (item.id === task.id) return
            
            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            
            if (!clientOffset) return
            
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            
            // Only add visual indicators for cross-column moves
            if (item.columnName !== columnName) {
                if (hoverClientY < hoverMiddleY) {
                    ref.current.classList.add('drop-above')
                    ref.current.classList.remove('drop-below')
                } else {
                    ref.current.classList.add('drop-below') 
                    ref.current.classList.remove('drop-above')
                }
            } else {
                ref.current.classList.remove('drop-above', 'drop-below')
                
                // For same column reordering
                if (item.index !== index) {
                    // Only move when crossing the middle point
                    if ((item.index < index && hoverClientY > hoverMiddleY) || 
                        (item.index > index && hoverClientY < hoverMiddleY)) {
                        moveTask(item.id, item.columnName, columnName, index)
                        item.index = index // Important: update the index on the dragged item
                    }
                }
            }
        },
        drop: (item, monitor) => {
            if (ref.current) {
                ref.current.classList.remove('drop-above', 'drop-below')
            }
            
            if (item.id === task.id) return
            
            // Handle cross-column drops
            if (item.columnName !== columnName) {
                const hoverBoundingRect = ref.current.getBoundingClientRect()
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
                const clientOffset = monitor.getClientOffset()
                
                if (!clientOffset) return
                
                const hoverClientY = clientOffset.y - hoverBoundingRect.top
                
                if (hoverClientY < hoverMiddleY) {
                    moveTask(item.id, item.columnName, columnName, index)
                } else {
                    moveTask(item.id, item.columnName, columnName, index + 1)
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })

    // Setup drag and drop refs
    useEffect(() => {
        const dragDropRef = drag(drop(ref))
        return () => {
            if (dragDropRef && typeof dragDropRef?.disconnect === 'function') {
                dragDropRef.disconnect()
            }
        }
    }, [drag, drop])

    // Cleanup drop indicators
    useEffect(() => {
        if (!isOver && ref.current) {
            ref.current.classList.remove('drop-above', 'drop-below')
        }
        
        return () => {
            if (ref.current) {
                ref.current.classList.remove('drop-above', 'drop-below')
            }
        }
    }, [isOver])

    return (
        <>
            <div 
                ref={ref}
                className={`task__card ${darkMode ? 'dark' : ''} ${isDragging ? 'dragging' : ''}`} 
                onClick={(e) => {
                    if (!isDragging) openTaskModal(task.id)
                }}
                data-task-id={task.id}
            >
                <span className='task__card--title'>{task.title}</span>
                {hasSubtasks && <span className='task__card--subtasks'>{completedSubtasks} of {totalSubtasks} subtasks</span>}
            </div>

            {isThisTaskModalOpen && (
                <TaskModal 
                    task={task}
                    hasSubtasks={hasSubtasks} 
                    totalSubtasks={totalSubtasks} 
                    completedSubtasks={completedSubtasks}
                />
            )}
        </>
    )
}

export default Task