import MenuIcon from '../assets/icon-vertical-ellipsis.svg?react'
import LogoLight from '../assets/logo-light.svg?react'
import LogoDark from '../assets/logo-dark.svg?react'
import { useContext } from 'react'
import { BoardContext } from '../App'

function Header() {
    const { darkMode, currentBoard, sidebarOpen, openAddTaskModal } = useContext(BoardContext)

    return (
        <header className={`header ${darkMode ? 'dark' : ''}`}>
            <div className='header__left'>
                {!sidebarOpen && 
                    (<div className={`header__logo ${darkMode ? 'dark' : ''}`}>
                        {darkMode ? <LogoLight alt='Logo' /> : <LogoDark alt='Logo' />}
                    </div>)}
                <h1>{currentBoard.name}</h1>
            </div>
            <div>
                <button 
                    className='btn lg primary' 
                    onClick={openAddTaskModal}>
                        Add New Task
                </button>
                <button className='header__menu'>
                    <MenuIcon alt='Menu icon' />
                </button>
            </div>
        </header>
    )
}

export default Header