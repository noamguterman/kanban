import MenuIcon from '../assets/icon-vertical-ellipsis.svg?react'
import Select from 'react-select'
import { useContext } from 'react'
import { BoardContext } from '../App'
import { getCustomStyles } from '../utils/getCustomStyles.js'

function TaskModal({ task, hasSubtasks, totalSubtasks, completedSubtasks }) {
    const { currentBoard, updateSubtask, updateTaskStatus, closeTaskModal, darkMode } = useContext(BoardContext)
    const customStyles = getCustomStyles(darkMode)
    const options = currentBoard.columns.map(column => ({
        value: column.name.toLowerCase(),
        label: column.name
    }))

    function handleStatusChange(selectedOption) {
        updateTaskStatus(task.id, selectedOption.label)
    }

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            closeTaskModal()
        }
    }

    function handleSubtaskToggle(e, index) {
        e.stopPropagation()
        updateSubtask(task.id, index)
    }

    return (
        <div className='task-modal' onClick={handleBackdropClick}>
            <div className={`task-modal__content ${darkMode ? 'dark' : ''}`}>
                <div className='task-modal__content--header'>
                    <h2 className='task-modal__content--header--title'>{task.title}</h2>
                    <button className='task-modal__content--header--menu'>
                        <MenuIcon alt='Menu icon' />
                    </button>
                </div>
                {task.description && <p className='task-modal__content--description'>{task.description}</p>}
                {hasSubtasks && (
                    <div className='task-modal__content--subtasks'>
                        <p className={`task-modal__content--subtasks--title ${darkMode ? 'dark' : ''}`}>Subtasks ({completedSubtasks} of {totalSubtasks})</p>
                        {task.subtasks.map((subtask, index) => (
                            <div 
                                key={`subtask-${subtask.id}`} 
                                className={`task-modal__content--subtasks--subtask ${darkMode ? 'dark' : ''}`}
                                onClick={(e) => handleSubtaskToggle(e, index)}
                            >
                                <input
                                    type="checkbox"
                                    className={`checkbox ${subtask.isCompleted ? 'checked' : ''}`}
                                    id={`subtask-${subtask.id}`}
                                    checked={subtask.isCompleted}
                                    readOnly
                                />
                                <label
                                    htmlFor={`subtask-${subtask.id}`} 
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleSubtaskToggle(e, index)
                                    }}
                                >
                                    {subtask.title}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
                <div className={`task-modal__content--status ${darkMode ? 'dark' : ''}`}>
                    <p>Current status</p>
                    <Select 
                        options={options}
                        value={options.find(option => option.value === task.status.toLowerCase())}
                        onChange={handleStatusChange}
                        styles={customStyles}
                        isSearchable={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default TaskModal