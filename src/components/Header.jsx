import MenuIcon from '../assets/icon-vertical-ellipsis.svg?react'
import LogoLight from '../assets/logo-light.svg?react'
import LogoDark from '../assets/logo-dark.svg?react'
import { useContext, useRef, useEffect } from 'react'
import { BoardContext } from '../App'

function Header() {
    const { darkMode, currentBoard, sidebarOpen, openAddTaskModal, handleHeaderMenuClick, isHeaderMenuOpen, openEditBoardModal, openDeleteBoardModal } = useContext(BoardContext)
    const menuRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        // Function to handle clicks outside menu
        function handleOutsideClick(e) {
            // If menu is open and click is outside both the menu and the button
            if (isHeaderMenuOpen && 
                menuRef.current && 
                !menuRef.current.contains(e.target) && 
                buttonRef.current && 
                !buttonRef.current.contains(e.target)) {
                handleHeaderMenuClick()
            }
        }
        
        // Add event listener when menu is open
        if (isHeaderMenuOpen) {
            document.addEventListener('mousedown', handleOutsideClick)
        }
        
        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [isHeaderMenuOpen, handleHeaderMenuClick])

    return (
        <header className={`header ${darkMode ? 'dark' : ''}`}>
            <div className='header__left'>
                {!sidebarOpen && 
                    (<div className={`header__logo ${darkMode ? 'dark' : ''}`}>
                        {darkMode ? <LogoLight alt='Logo' /> : <LogoDark alt='Logo' />}
                    </div>)}
                <h1>{currentBoard.name}</h1>
            </div>
            <div className='header__right'>
                <button 
                    className='btn lg primary' 
                    onClick={openAddTaskModal}>
                        Add New Task
                </button>
                <button 
                    className='header__menu' 
                    onClick={handleHeaderMenuClick}
                    ref={buttonRef}
                >
                    <MenuIcon alt='Menu icon' />
                </button>
                {isHeaderMenuOpen && (
                    <div
                        className={`header__menu--dropdown ${darkMode ? 'dark' : ''}`}
                        ref={menuRef}
                    >
                        <button className={`btn-edit ${darkMode ? 'dark' : ''}`} onClick={() => openEditBoardModal(false)}>Edit Board</button>
                        <button className={`btn-delete ${darkMode ? 'dark' : ''}`} onClick={openDeleteBoardModal}>Delete Board</button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header