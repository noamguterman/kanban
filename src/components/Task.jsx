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

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        item: { 
            id: task.id, 
            columnName, 
            index
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
    }))

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'task',
        hover: (item, monitor) => {
          if (!ref.current) return
          
          const dragIndex = item.index
          const hoverIndex = index
          const dragColumnName = item.columnName
          
          // Don't replace items with themselves
          if (dragIndex === hoverIndex && dragColumnName === columnName) {
            return
          }
          
          // Get rectangle on screen
          const hoverBoundingRect = ref.current.getBoundingClientRect()
          
          // Get vertical middle
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          
          // Get mouse position
          const clientOffset = monitor.getClientOffset()
          if (!clientOffset) return
          
          // Get pixels to the top
          const hoverClientY = clientOffset.y - hoverBoundingRect.top
          
          // Add visual indicators based on mouse position
          if (hoverClientY < hoverMiddleY) {
            ref.current.classList.add('drop-above')
            ref.current.classList.remove('drop-below')
          } else {
            ref.current.classList.add('drop-below') 
            ref.current.classList.remove('drop-above')
          }
          
          // For same column reordering, move immediately on hover
          if (dragColumnName === columnName) {
            // Only perform the move when the mouse has crossed half of the items height
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
              return
            }
            
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
              return
            }
            
            moveTask(item.id, dragColumnName, columnName, hoverIndex)
            item.index = hoverIndex
          }
        },
        drop: (item, monitor) => {
          // If drag is from another column, move the task
          if (item.columnName !== columnName) {
            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            if (!clientOffset) return
            
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
        
            // Place above or below based on position
            if (hoverClientY < hoverMiddleY) {
              moveTask(item.id, item.columnName, columnName, index)
            } else {
              moveTask(item.id, item.columnName, columnName, index + 1)
            }
          }
        
          // Reset classes
          if (ref.current) {
            ref.current.classList.remove('drop-above', 'drop-below')
          }
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop()
        })
    }))

    useEffect(() => {
      drag(drop(ref.current))
    }, [drag, drop])

    useEffect(() => {
      return () => {
        if (ref.current) {
          ref.current.classList.remove('drop-above', 'drop-below')
        }
      }
    }, [])

    useEffect(() => {
      if (!isOver && ref.current) {
        ref.current.classList.remove('drop-above', 'drop-below')
      }
    }, [isOver])

    return (
        <>
            <div 
                ref={ref}
                className={`task__card ${darkMode ? 'dark' : ''} ${isDragging ? 'dragging' : ''}`} 
                onClick={() => openTaskModal(task.id)}
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