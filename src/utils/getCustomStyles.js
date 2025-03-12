export const getCustomStyles = (darkMode) => ({
    control: (styles) => ({
        ...styles,
        width: '100%',
        padding: '0.5rem',
        marginTop: '.5rem',
        border: '1px solid rgba(130, 143, 163, 0.25)',
        borderRadius: '4px',
        backgroundColor: darkMode ? 'var(--dark-grey)' : 'var(--white)',
        color: darkMode ? 'var(--white)' : 'var(--black)',
        font: 'var(--body-l)',
        cursor: 'pointer',
        '&:hover': {
            borderColor: 'var(--purple)'
        }
    }),
    option: (styles, { isSelected, isFocused }) => ({
        ...styles,
        backgroundColor: isFocused 
            ? 'var(--purple)'
            : isSelected 
                ? 'inherit'
                : darkMode 
                    ? 'var(--bg-dark)'
                    : 'var(--white)',
        color: isFocused 
            ? 'var(--white)'
            : isSelected 
                ? 'var(--medium-grey)'
                : 'var(--medium-grey)', 
        padding: '0.5rem 1.2rem',
        cursor: 'pointer',
        font: 'var(--body-l)',
        '&:hover': {
            backgroundColor: 'var(--purple)',
            color: 'var(--white)'
        }
    }),
    menu: (styles) => ({
        ...styles,
        backgroundColor: darkMode ? 'var(--bg-dark)' : 'var(--white)',
        marginTop: '0.5rem',
        padding: 0,
        borderRadius: '8px',
        overflow: 'hidden',
    }),
    menuList: (styles) => ({
        ...styles,
        padding: 0
    }),
    singleValue: (styles) => ({
        ...styles,
        color: darkMode ? 'var(--white)' : 'var(--black)',
        font: 'var(--body-l)'
    }),
    dropdownIndicator: (styles, { selectProps }) => ({
        ...styles,
        backgroundImage: 'url("./assets/icon-chevron-down.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '16px',
        height: '16px',
        padding: 0,
        marginTop: selectProps.menuIsOpen ? '3px' : '-3px',
        color: 'var(--purple)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        transform: selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)', // Rotate 180 degrees when open
        '&:hover': {
            color: 'var(--purple)'
        }
    }),
    indicatorSeparator: () => ({
        display: 'none'
    })
})