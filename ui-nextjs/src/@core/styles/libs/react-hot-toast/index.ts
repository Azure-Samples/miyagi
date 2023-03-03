// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

const ReactHotToast = styled(Box)<BoxProps>(({ theme }) => {
  // ** Hook & Var
  const { settings } = useSettings()
  const { layout, navHidden } = settings

  return {
    '& > div': {
      left: `${theme.spacing(6)} !important`,
      right: `${theme.spacing(6)} !important`,
      bottom: `${theme.spacing(6)} !important`,
      top: layout === 'horizontal' && !navHidden ? '139px !important' : '75px !important'
    },
    '& .react-hot-toast': {
      fontWeight: 400,
      borderRadius: 8,
      fontSize: '1rem',
      letterSpacing: '0.14px',
      boxShadow: theme.shadows[3],
      zIndex: theme.zIndex.snackbar,
      color: theme.palette.text.primary,
      background: theme.palette.background.paper,
      '&>:first-of-type:not([role])>:first-of-type': {
        width: 14,
        height: 14
      }
    }
  }
})

export default ReactHotToast
