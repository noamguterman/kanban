export const getCustomStyles = (darkMode) => ({
    control: (styles) => ({
        ...styles,
        width: '100%',
        padding: '0.8rem 1rem',
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
        backgroundColor: isSelected 
            ? 'inherit'
            : isFocused 
                ? 'var(--purple)'
                : darkMode 
                    ? 'var(--dark-grey)'
                    : 'var(--white)',
                    color: isSelected 
                    ? 'var(--medium-grey)' 
                    : isFocused
                        ? 'var(--white)'
                        : 'var(--medium-grey)',
        padding: '0.5rem 1.7rem',
        cursor: 'pointer',
        font: 'var(--body-l)',
        '&:hover': {
            backgroundColor: 'var(--purple)',
            color: 'var(--white)'
        }
    }),
    menu: (styles) => ({
        ...styles,
        backgroundColor: darkMode ? 'var(--dark-grey)' : 'var(--white)',
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
    dropdownIndicator: (styles) => ({
        ...styles,
        backgroundImage: 'url("./assets/icon-chevron-down.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '16px',
        height: '16px',
        padding: 0,
        color: 'var(--purple)',
        cursor: 'pointer',
        '&:hover': {
            color: 'var(--purple)'
        }
    }),
    indicatorSeparator: () => ({
        display: 'none'
    })
})