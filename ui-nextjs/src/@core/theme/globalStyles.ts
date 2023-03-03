// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

const GlobalStyles = (theme: Theme, settings: Settings) => {
  // ** Vars
  const { skin } = settings

  const perfectScrollbarThumbBgColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return '#57596C !important'
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return '#BFBFD5 !important'
    } else if (theme.palette.mode === 'light') {
      return '#BFBFD5 !important'
    } else {
      return '#57596C !important'
    }
  }

  return {
    'body[style^="padding-right"] header::after, body[style^="padding-right"] footer::after': {
      content: '""',
      position: 'absolute' as const,
      left: '100%',
      top: 0,
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      width: '30px'
    },
    '.demo-space-x > *': {
      marginTop: '1rem !important',
      marginRight: '1rem !important',
      'body[dir="rtl"] &': {
        marginRight: '0 !important',
        marginLeft: '1rem !important'
      }
    },
    '.demo-space-y > *:not(:last-of-type)': {
      marginBottom: '1rem'
    },
    '.MuiGrid-container.match-height .MuiCard-root': {
      height: '100%'
    },
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: theme.palette.mode === 'light' ? '#F3F3F8 !important' : '#393B51 !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor: theme.palette.mode === 'light' ? '#BFBFD5 !important' : '#57596C !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4,
          backgroundColor: perfectScrollbarThumbBgColor()
        },
        '&:hover, &:focus, &.ps--clicking': {
          backgroundColor: 'transparent !important',
          '& .ps__thumb-y': {
            width: 6
          }
        }
      }
    },

    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        backgroundColor: theme.palette.primary.main
      }
    }
  }
}

export default GlobalStyles
