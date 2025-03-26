import MenuIcon from '../assets/icon-vertical-ellipsis.svg?react'
import LogoLight from '../assets/logo-light.svg?react'
import LogoDark from '../assets/logo-dark.svg?react'
import LogoMobile from '../assets/logo-mobile.svg?react'
import Chevron from '../assets/icon-chevron-down.svg?react'
import { useContext, useRef, useEffect } from 'react'
import { BoardContext } from '../App'

function Header() {
    const { darkMode, currentBoard, sidebarOpen, toggleSidebar, openAddTaskModal, handleHeaderMenuClick, isHeaderMenuOpen, openEditBoardModal, openDeleteBoardModal } = useContext(BoardContext)
    const menuRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        function handleOutsideClick(e) {
            if (isHeaderMenuOpen && 
                menuRef.current && 
                !menuRef.current.contains(e.target) && 
                buttonRef.current && 
                !buttonRef.current.contains(e.target)
            ) {
                handleHeaderMenuClick()
            }

            if (sidebarOpen) {
                const mobileSidebar = document.querySelector('.header__left--mobile')
                if (mobileSidebar && window.getComputedStyle(mobileSidebar).display !== 'none') {
                    if (mobileSidebar.contains(e.target)) {
                        return
                    }
                    const sidebar = document.querySelector('.sidebar');
                    if (sidebar && !sidebar.contains(e.target)) {
                        toggleSidebar()
                    }
                }
            }
        }
        
        if (isHeaderMenuOpen || sidebarOpen) {
            document.addEventListener('mousedown', handleOutsideClick)
        }
        
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [isHeaderMenuOpen, sidebarOpen, handleHeaderMenuClick, toggleSidebar])

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
                <h1 className='h1--desktop'>{currentBoard.name}</h1>
                <div className='header__left--mobile' onClick={toggleSidebar}>
                    <h1>{currentBoard.name}</h1>
                    <Chevron className={`header__chevron ${sidebarOpen ? 'rotated' : ''}`} alt='Chevron' />
                </div>
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