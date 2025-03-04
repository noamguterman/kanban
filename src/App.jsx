import { useState, useEffect, createContext, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import demoData from './data.json'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import SidebarMini from './components/SidebarMini.jsx'
import Main from './components/Main'
import AddTask from './components/AddTask'
import AddBoard from './components/AddBoard'
import EditBoard from './components/EditBoard'

function addIdsToData(boards) {
  return boards.map(board => ({
    ...board,
    id: uuidv4(),
    columns: board.columns.map(column => ({
      ...column,
      id: uuidv4(),
      tasks: column.tasks.map(task => ({
        ...task,
        id: uuidv4(),
        subtasks: task.subtasks.map(subtask => ({
          ...subtask,
          id: uuidv4(),
        })),
      })),
    })),
  }))
}

export const BoardContext = createContext()

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [boards, setBoards] = useState(addIdsToData(demoData.boards))
  const [currentBoard, setCurrentBoard] = useState(boards[0])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [editBoardShouldAddColumn, setEditBoardShouldAddColumn] = useState(false)
  const [targetColumnName, setTargetColumnName] = useState(null)

  useEffect(() => {
    const updatedCurrentBoard = boards.find(board => board.id === currentBoard.id)
    
    if (updatedCurrentBoard) {
      setCurrentBoard(updatedCurrentBoard)
    } else if (boards.length > 0) {
      // If current board was deleted, select the first available board
      setCurrentBoard(boards[0])
    }
  }, [boards])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark') // Apply to <html> for scrollbar styling
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  function openAddTaskModal(columnName = null) {
    setIsAddTaskModalOpen(true)
    
    if (columnName) {
      setTargetColumnName(columnName)
    } else {
      setTargetColumnName(null)
    }
  }
  function closeAddTaskModal() {
    setIsAddTaskModalOpen(false)
    setTargetColumnName(null)
  }

  function handleHeaderMenuClick() {
    if (isHeaderMenuOpen) {
      setIsHeaderMenuOpen(false)
    } else {
      setIsHeaderMenuOpen(true)
    }
  }

  function openAddBoardModal() {
    setIsAddBoardModalOpen(true)
  }
  function closeAddBoardModal() {
    setIsAddBoardModalOpen(false)
  }
  
  function openTaskModal(taskId) {
    setActiveTaskId(taskId)
    setIsTaskModalOpen(true)
  }
  function closeTaskModal() {
    setIsTaskModalOpen(false)
    setActiveTaskId(null)
  }

  function openEditBoardModal(shouldAddColumn = false) {
    setIsEditBoardModalOpen(true)
    if (shouldAddColumn) {
      setTimeout(() => {
          setEditBoardShouldAddColumn(true)
      }, 0)
    }
    setIsHeaderMenuOpen(false)
  }
  function closeEditBoardModal() {
    setIsEditBoardModalOpen(false)
    setEditBoardShouldAddColumn(false)
  }
  function updateBoard(updatedBoard) {
    setBoards(prevBoards => {
      return prevBoards.map(board => 
        board.id === updatedBoard.id ? updatedBoard : board
      )
    })

    setCurrentBoard(updatedBoard)
  }
  function resetEditBoardAddColumnFlag() {
    setEditBoardShouldAddColumn(false)
}
  
  function addNewTask(newTask) {
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== currentBoard.id) return board
        
        return {
          ...board,
          columns: board.columns.map(column => {
            if (column.name === newTask.status) {
              return {
                ...column,
                tasks: [...column.tasks, newTask]
              }
            }
            return column
          })
        }
      })
    })
  }

  function addNewBoard(newBoard) {
    setBoards(prevBoards => {
      return [
        ...prevBoards,
        {
          ...newBoard,
          id: uuidv4(),
          columns: newBoard.columns.map(column => ({
            ...column,
            id: uuidv4(),
            tasks: []
          }))
        }
      ]
    })}

  function updateTaskStatus(taskId, newStatus) {
    const currentActiveTaskId = activeTaskId

    setBoards(prevBoards => {
        return prevBoards.map(board => {
            if (board.id !== currentBoard.id) return board

            let taskToMove
            const updatedColumns = board.columns.map(column => {
                if (column.tasks.some(task => task.id === taskId)) {
                    taskToMove = column.tasks.find(task => task.id === taskId)
                    return {
                        ...column,
                        tasks: column.tasks.filter(task => task.id !== taskId),
                    }
                }
                return column
            })

            if (!taskToMove) return board

            taskToMove.status = newStatus

            const updatedColumnsWithTask = updatedColumns.map(column => {
                if (column.name === newStatus) {
                    return { ...column, tasks: [...column.tasks, taskToMove] }
                }
                return column
            })

            return { ...board, columns: updatedColumnsWithTask }
        })
    })

    if (currentActiveTaskId === taskId) {
      setActiveTaskId(taskId);
      setIsTaskModalOpen(true);
  }
}
  
  function updateSubtask(taskId, subtaskIndex) {
    setBoards(prevBoards => {
        const newBoards = prevBoards.map(board => {
            if (board.id === currentBoard.id) {
                return {
                    ...board,
                    columns: board.columns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => {
                            if (task.id === taskId) {
                                const updatedSubtasks = [...task.subtasks]
                                updatedSubtasks[subtaskIndex] = {
                                    ...updatedSubtasks[subtaskIndex],
                                    isCompleted: !updatedSubtasks[subtaskIndex].isCompleted
                                }
                                return { ...task, subtasks: updatedSubtasks }
                            }
                            return task
                        })
                    }))
                }
            }
            return board
        })
        return newBoards
    })
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  function toggleDarkMode() {
    setDarkMode(!darkMode)
  }

  const moveTask = useCallback((taskId, sourceColumnName, targetColumnName, targetIndex) => {
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== currentBoard.id) return board

        // Same column reordering case
        if (sourceColumnName === targetColumnName) {
          return {
            ...board,
            columns: board.columns.map(column => {
              if (column.name === sourceColumnName) {
                const tasks = [...column.tasks]
                const taskToMove = tasks.find(task => task.id === taskId)
                if (!taskToMove) return column;
                
                // Remove task from current position
                const sourceIndex = tasks.findIndex(task => task.id === taskId)
                tasks.splice(sourceIndex, 1)
                
                // Insert at new position
                tasks.splice(targetIndex, 0, taskToMove)
                
                return { ...column, tasks }
              }
              return column
            })
          }
      }
        
        // Find and remove the task from the source column
        let taskToMove = null
        let updatedColumns = board.columns.map(column => {
          if (column.name === sourceColumnName) {
            const taskIndex = column.tasks.findIndex(task => task.id === taskId)
            if (taskIndex !== -1) {
              taskToMove = column.tasks[taskIndex]
              // Return column with the task filtered out
              return {
                ...column,
                tasks: column.tasks.filter(task => task.id !== taskId)
              }
            }
          }
          return column
        })
        
        // If no task was found, return the board unchanged
        if (!taskToMove) return board
        
        // Update the task's status to match the target column
        taskToMove = {
          ...taskToMove,
          status: targetColumnName
        }
        
        // Insert the task into the target column at the specified index
        updatedColumns = updatedColumns.map(column => {
          if (column.name === targetColumnName) {
            const newTasks = [...column.tasks]
            
            if (typeof targetIndex === 'number') {
              // Ensure target index is valid
              const safeTargetIndex = Math.min(Math.max(0, targetIndex), newTasks.length)
              newTasks.splice(safeTargetIndex, 0, taskToMove)
              return { ...column, tasks: newTasks }
            } else {
              // If no target index is specified, add to the end
              return { ...column, tasks: [...newTasks, taskToMove] }
            }
          }
          return column
        })
        
        // Return the updated board
        return {
          ...board,
          columns: updatedColumns
        }
      })
    })
  }, [currentBoard.id])

  const contextValue = {
    darkMode,
    boards,
    currentBoard,
    sidebarOpen,
    activeTaskId,
    isTaskModalOpen,
    isAddTaskModalOpen,
    isAddBoardModalOpen,
    isEditBoardModalOpen,
    setCurrentBoard,
    updateTaskStatus,
    updateSubtask,
    toggleSidebar,
    toggleDarkMode,
    openTaskModal,
    closeTaskModal,
    handleHeaderMenuClick,
    openAddTaskModal,
    closeAddTaskModal,
    targetColumnName,
    openAddBoardModal,
    closeAddBoardModal,
    openEditBoardModal,
    closeEditBoardModal,
    editBoardShouldAddColumn,
    resetEditBoardAddColumnFlag,
    addNewTask,
    addNewBoard,
    updateBoard,
    moveTask,
    isHeaderMenuOpen
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardContext.Provider value={contextValue}>
        <div className={`app ${darkMode ? 'dark' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Header />
          {sidebarOpen 
            ? <Sidebar /> 
            : <SidebarMini />
          }
          <Main />
          {isAddTaskModalOpen && <AddTask />}
          {isAddBoardModalOpen && <AddBoard />}
          {isEditBoardModalOpen && <EditBoard />}
        </div>
      </BoardContext.Provider>
    </DndProvider>
  )
}

export default App
