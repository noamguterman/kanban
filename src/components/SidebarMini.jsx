import ShowSidebarIcon from '../assets/icon-show-sidebar.svg?react'
import { useContext } from 'react'
import { BoardContext } from '../App'

function SidebarMini() {
    const { toggleSidebar } = useContext(BoardContext)

    return (
        <button className='sidebar-mini' onClick={toggleSidebar}>
            <ShowSidebarIcon className='sidebar-mini__icon' alt='Show sidebar icon' />
        </button>
    )
}

export default SidebarMini