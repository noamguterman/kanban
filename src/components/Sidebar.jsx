import BoardIcon from '../assets/icon-board.svg?react'
import LogoLight from '../assets/logo-light.svg?react'
import LogoDark from '../assets/logo-dark.svg?react'
import LightThemeIcon from '../assets/icon-light-theme.svg?react'
import DarkThemeIcon from '../assets/icon-dark-theme.svg?react'
import HideSidebarIcon from '../assets/icon-hide-sidebar.svg?react'
import { useContext } from 'react'
import { BoardContext } from '../App'

function Sidebar() {
    const { darkMode, boards, currentBoard, setCurrentBoard, toggleDarkMode, toggleSidebar, openAddBoardModal } = useContext(BoardContext)
    const boardCount = boards.length
    const boardItems = boards.map(board => {
        return (
            <div 
                key={`board-${board.id}`} 
                className={`sidebar__boards--board ${darkMode ? 'dark' : ''} ${board.id === currentBoard.id ? 'active' : ''}`}
                tabIndex='0'
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ')) {
                        setCurrentBoard(board)
                    }
                }}
                onClick={() => setCurrentBoard(board)}
            >
                <BoardIcon className='sidebar__boards--board--icon' alt='Board icon' />
                <span className='sidebar__boards--board--name'>{board.name}</span>
            </div>
        )
    })

    return (
        <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
            <div className='sidebar__logo'>
                {darkMode ? <LogoLight alt='Logo' /> : <LogoDark alt='Logo' />}
            </div>
            <div className='sidebar__content'>
                <div className='sidebar__boards'>
                    <span className='sidebar__boards--all-boards'>All Boards ({boardCount})</span>
                    {boardItems}
                    <div 
                        className={`sidebar__boards--board new ${darkMode ? 'dark' : ''}`}
                        tabIndex='0'
                        onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ')) {
                                openAddBoardModal()
                            }
                        }}
                        onClick={openAddBoardModal}
                    >
                        <BoardIcon className='sidebar__boards--board--icon' alt='Board icon' />
                        <span className='sidebar__boards--board--name'>+ Create New Board</span>
                    </div>
                </div>
                <div className='sidebar__settings'>
                    <div 
                        className={`sidebar__theme ${darkMode ? 'dark' : ''}`} 
                        tabIndex='0'
                        onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ')) {
                                toggleDarkMode()
                            }
                        }}
                        onClick={() => toggleDarkMode()}
                    >
                        <LightThemeIcon alt='Light theme icon' />
                        <input id='theme-checkbox' type='checkbox' checked={darkMode} readOnly />
                        <span className='sidebar__theme--slider'></span>
                        <DarkThemeIcon alt='Dark theme icon' />
                    </div>
                    <button className='sidebar__hide' onClick={toggleSidebar}>
                        <HideSidebarIcon alt='Hide sidebar icon' />
                        Hide Sidebar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar