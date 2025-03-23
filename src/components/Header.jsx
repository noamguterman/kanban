import MenuIcon from '../assets/icon-vertical-ellipsis.svg?react'
import LogoLight from '../assets/logo-light.svg?react'
import LogoDark from '../assets/logo-dark.svg?react'
import LogoMobile from '../assets/logo-mobile.svg?react'
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

    useEffect(() => {
        function handleEscape(e) {
          if (e.key === 'Escape') {
            handleHeaderMenuClick()
          }
        }
        if (isHeaderMenuOpen) {
          document.addEventListener('keydown', handleEscape)
        }
        return () => {
          document.removeEventListener('keydown', handleEscape)
        }
      }, [isHeaderMenuOpen, handleHeaderMenuClick])

    return (
        <header className={`header ${!currentBoard.name && sidebarOpen ? 'hidden' : ''} ${darkMode ? 'dark' : ''}`}>
            <div className='header__left'>
                {!sidebarOpen && 
                    (<div className={`header__logo ${!currentBoard.name ? 'empty' : ''} ${darkMode ? 'dark' : ''}`}>
                        {darkMode ? <LogoLight alt='Logo' /> : <LogoDark alt='Logo' />}
                    </div>)}
                <LogoMobile className='header__logo--mobile' alt='Logo' />
                <h1>{currentBoard.name}</h1>
            </div>
            <div className='header__right'>
                <button 
                    className={`btn lg primary ${currentBoard.columns.length === 0 ? 'hidden' : ''}`}
                    onClick={() => openAddTaskModal()}>
                        + Add New Task
                </button>
                <button 
                    className={`btn lg primary alt ${currentBoard.columns.length === 0 ? 'hidden' : ''}`}
                    onClick={() => openAddTaskModal()}>
                        +
                </button>
                <button 
                    className={`header__menu ${!currentBoard.name ? 'hidden' : ''}`} 
                    onClick={handleHeaderMenuClick}
                    ref={buttonRef}
                    aria-label='Open board menu'
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