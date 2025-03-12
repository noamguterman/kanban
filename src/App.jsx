import { useState, useEffect, createContext, useCallback, useRef, useLayoutEffect } from 'react'
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
import DeleteBoard from './components/DeleteBoard'
import EditTask from './components/EditTask'
import DeleteTask from './components/DeleteTask'

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
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [boards, setBoards] = useState(addIdsToData(demoData.boards))
  const [currentBoard, setCurrentBoard] = useState(boards[0])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false)
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false)
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false)
  const [editBoardShouldAddColumn, setEditBoardShouldAddColumn] = useState(false)
  const [targetColumnName, setTargetColumnName] = useState(null)
  const manualBoardSelection = useRef(false)
  const mainRef = useRef(null)

  useEffect(() => {
    // If we did a manual selection, reset the flag and skip this effect
    if (manualBoardSelection.current) {
      manualBoardSelection.current = false
      return
    }
  
    const updatedCurrentBoard = boards.find(board => currentBoard && board.id === currentBoard.id)
    
    if (updatedCurrentBoard) {
      setCurrentBoard(updatedCurrentBoard)
    } else if (boards.length > 0) {
      setCurrentBoard(boards[0])
    } else {
      setCurrentBoard(null);
    }
  }, [boards])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark') // Apply to <html> for scrollbar styling
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useLayoutEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        left: 0,
      })
      window.scrollTo(0, 0)
    }
  }, [currentBoard])

  function openAddTaskModal(columnName = null) {
    if (columnName) {
      setTargetColumnName(columnName)
    } else {
      const defaultColumn = currentBoard?.columns[0]?.name || null
      setTargetColumnName(defaultColumn)
    }
    setIsAddTaskModalOpen(true)
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

  function handleTaskMenuClick() {
    if (isTaskMenuOpen) {
      setIsTaskMenuOpen(false)
    } else {
      setIsTaskMenuOpen(true)
    }
  }

  function openAddBoardModal() {
    setIsAddBoardModalOpen(true)
  }

  function closeAddBoardModal() {
    setIsAddBoardModalOpen(false)
  }

  function openDeleteBoardModal() {
    setIsDeleteBoardModalOpen(true)
  }

  function closeDeleteBoardModal() {
    setIsDeleteBoardModalOpen(false)
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

  function openEditTaskModal() {
    setIsTaskModalOpen(false)
    setIsEditTaskModalOpen(true)
    setIsTaskMenuOpen(false)
  }
  
  function closeEditTaskModal() {
    setIsEditTaskModalOpen(false)
  }

  function openDeleteTaskModal() {
    setIsTaskModalOpen(false)
    setIsDeleteTaskModalOpen(true)
    setIsTaskMenuOpen(false)
  }
  
  function closeDeleteTaskModal() {
    setIsDeleteTaskModalOpen(false)
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
    if (!currentBoard) return
    
    // Ensure task has a valid status (column name)
    if (!newTask.status && currentBoard.columns.length > 0) {
      newTask = {
        ...newTask,
        status: currentBoard.columns[0].name
      }
    }
  
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
    // Create the new board with proper IDs
    const newBoardWithId = {
      ...newBoard,
      id: uuidv4(),
      columns: newBoard.columns.map(column => ({
        ...column,
        id: uuidv4(),
        tasks: []
      }))
    }
    
    // Update boards state
    setBoards(prevBoards => [...prevBoards, newBoardWithId])
    
    // Set the new board as the current board
    // Set the flag to prevent the useEffect from overriding our selection
    manualBoardSelection.current = true
    setCurrentBoard(newBoardWithId)
  }

  function updateTaskStatus(taskId, newStatus) {
    if (!currentBoard) return
    
    // Find the current task and check if status is changing
    let currentStatus = null
    let found = false
    
    for (const column of currentBoard.columns) {
        const task = column.tasks.find(t => t.id === taskId)
        if (task) {
            currentStatus = task.status
            found = true
            break
        }
    }
    
    // If task not found or status isn't changing, return early
    if (!found || currentStatus === newStatus) return
    
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
        setActiveTaskId(taskId)
        setIsTaskModalOpen(true)
    }
}
  
  function updateSubtask(taskId, subtaskIndex) {
    if (!currentBoard) return

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

  function deleteBoard(boardId) {
    // Find the index of the board being deleted
    const boardIndex = boards.findIndex(board => board.id === boardId)
    
    if (boardIndex === -1) return // Board not found
    
    // Create a new array without the deleted board
    const filteredBoards = boards.filter(board => board.id !== boardId)
    
    // Flag that we're manually selecting a board
    manualBoardSelection.current = true
    
    // Update boards state
    setBoards(filteredBoards)
    
    // If there are no boards left, set currentBoard to null
    if (filteredBoards.length === 0) {
      setCurrentBoard(null)
      return
    }
    
    // Logic to select the nearest board before the deleted one if possible
    if (boardIndex === 0) {
      // If the first board was deleted, select the new first board
      setCurrentBoard(filteredBoards[0])
    } else {
      // Otherwise, select the board before the one that was deleted
      // This will select boardIndex - 1, which is the previous board
      setCurrentBoard(filteredBoards[boardIndex - 1])
    }
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  function toggleDarkMode() {
    setDarkMode(!darkMode)
  }

  const moveTask = useCallback((taskId, sourceColumnName, targetColumnName, targetIndex) => {
    if (!currentBoard) return
    
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
  }, [currentBoard?.id])

  function updateTask(updatedTask) {
    if (!currentBoard) return
  
    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== currentBoard.id) return board
  
        return {
          ...board,
          columns: board.columns.map(column => {
            // Check if this column contains the task
            const taskExists = column.tasks.some(task => task.id === updatedTask.id)
            if (taskExists) {
              return {
                ...column,
                tasks: column.tasks.map(task =>
                  task.id === updatedTask.id ? updatedTask : task
                )
              }
            }
            return column
          })
        }
      })
    )
  }

  function deleteTask(taskId) {
    if (!currentBoard) return
  
    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== currentBoard.id) return board
  
        return {
          ...board,
          columns: board.columns.map(column => ({
            ...column,
            tasks: column.tasks.filter(task => task.id !== taskId)
          }))
        }
      })
    )
  }

  const contextValue = {
    darkMode,
    boards,
    currentBoard: currentBoard || { id: null, name: "", columns: [] },
    sidebarOpen,
    activeTaskId,
    isTaskModalOpen,
    isAddTaskModalOpen,
    isAddBoardModalOpen,
    isEditBoardModalOpen,
    isEditTaskModalOpen,
    isDeleteBoardModalOpen,
    isDeleteTaskModalOpen,
    setCurrentBoard,
    updateTaskStatus,
    updateSubtask,
    toggleSidebar,
    toggleDarkMode,
    openTaskModal,
    closeTaskModal,
    handleHeaderMenuClick,
    handleTaskMenuClick,
    openAddTaskModal,
    closeAddTaskModal,
    targetColumnName,
    openAddBoardModal,
    closeAddBoardModal,
    openDeleteBoardModal,
    closeDeleteBoardModal,
    openEditBoardModal,
    closeEditBoardModal,
    openEditTaskModal,
    closeEditTaskModal,
    openDeleteTaskModal,
    closeDeleteTaskModal,
    editBoardShouldAddColumn,
    resetEditBoardAddColumnFlag,
    addNewTask,
    addNewBoard,
    updateBoard,
    moveTask,
    isHeaderMenuOpen,
    isTaskMenuOpen,
    deleteBoard,
    updateTask,
    deleteTask,
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
          <Main ref={mainRef} />
          {isAddTaskModalOpen && <AddTask />}
          {isAddBoardModalOpen && <AddBoard />}
          {isEditBoardModalOpen && <EditBoard />}
          {isDeleteBoardModalOpen && <DeleteBoard />}
          {isEditTaskModalOpen && <EditTask />}
          {isDeleteTaskModalOpen && <DeleteTask />}
        </div>
      </BoardContext.Provider>
    </DndProvider>
  )
}

export default App
