// ** MUI Imports
import { Theme } from '@mui/material/styles'
import { lighten, darken } from '@mui/material/styles'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Alert = (theme: Theme) => {
  const getColor = theme.palette.mode === 'light' ? darken : lighten

  return {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiAlertTitle-root': {
            marginBottom: theme.spacing(1)
          },
          '& a': {
            fontWeight: 500,
            color: 'inherit'
          }
        },
        standardSuccess: {
          color: getColor(theme.palette.success.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.success.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.success.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.success.main, 0.1)
          }
        },
        standardInfo: {
          color: getColor(theme.palette.info.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.info.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.info.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.info.main, 0.1)
          }
        },
        standardWarning: {
          color: getColor(theme.palette.warning.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.warning.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.warning.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.warning.main, 0.1)
          }
        },
        standardError: {
          color: getColor(theme.palette.error.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.error.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.error.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.error.main, 0.1)
          }
        },
        outlinedSuccess: {
          borderColor: theme.palette.success.main,
          color: getColor(theme.palette.success.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.success.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: theme.palette.success.main
          }
        },
        outlinedInfo: {
          borderColor: theme.palette.info.main,
          color: getColor(theme.palette.info.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.info.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: theme.palette.info.main
          }
        },
        outlinedWarning: {
          borderColor: theme.palette.warning.main,
          color: getColor(theme.palette.warning.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.warning.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main
          }
        },
        outlinedError: {
          borderColor: theme.palette.error.main,
          color: getColor(theme.palette.error.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.error.main, 0.1)
          },
          '& .MuiAlert-icon': {
            color: theme.palette.error.main
          }
        },
        filled: {
          fontWeight: 400
        }
      }
    }
  }
}

export default Alert
