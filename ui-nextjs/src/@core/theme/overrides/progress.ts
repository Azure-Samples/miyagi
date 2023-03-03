// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Progress = (theme: Theme) => {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: theme.shape.borderRadius,
          '&.MuiLinearProgress-colorPrimary': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12)
          },
          '&.MuiLinearProgress-colorSecondary': {
            backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.12)
          },
          '&.MuiLinearProgress-colorSuccess': {
            backgroundColor: hexToRGBA(theme.palette.success.main, 0.12)
          },
          '&.MuiLinearProgress-colorError': {
            backgroundColor: hexToRGBA(theme.palette.error.main, 0.12)
          },
          '&.MuiLinearProgress-colorWarning': {
            backgroundColor: hexToRGBA(theme.palette.warning.main, 0.12)
          },
          '&.MuiLinearProgress-colorInfo': {
            backgroundColor: hexToRGBA(theme.palette.info.main, 0.12)
          }
        },
        bar: {
          borderRadius: theme.shape.borderRadius
        }
      }
    }
  }
}

export default Progress
