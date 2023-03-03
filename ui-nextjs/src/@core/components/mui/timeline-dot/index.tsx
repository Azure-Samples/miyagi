// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import MuiTimelineDot from '@mui/lab/TimelineDot'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Types
import { CustomTimelineDotProps, ColorsType } from './types'

const TimelineDot = (props: CustomTimelineDotProps) => {
  // ** Props
  const { sx, skin, color, variant } = props

  // ** Hook
  const theme = useTheme()

  const colors: ColorsType = {
    primary: {
      boxShadow: 'none',
      color: theme.palette.primary.main,
      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12)
    },
    secondary: {
      boxShadow: 'none',
      color: theme.palette.secondary.main,
      backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.12)
    },
    success: {
      boxShadow: 'none',
      color: theme.palette.success.main,
      backgroundColor: hexToRGBA(theme.palette.success.main, 0.12)
    },
    error: {
      boxShadow: 'none',
      color: theme.palette.error.main,
      backgroundColor: hexToRGBA(theme.palette.error.main, 0.12)
    },
    warning: {
      boxShadow: 'none',
      color: theme.palette.warning.main,
      backgroundColor: hexToRGBA(theme.palette.warning.main, 0.12)
    },
    info: {
      boxShadow: 'none',
      color: theme.palette.info.main,
      backgroundColor: hexToRGBA(theme.palette.info.main, 0.12)
    },
    grey: {
      boxShadow: 'none',
      color: theme.palette.grey[500],
      backgroundColor: hexToRGBA(theme.palette.grey[500], 0.12)
    }
  }

  return (
    <MuiTimelineDot
      {...props}
      sx={color && skin === 'light' && variant === 'filled' ? Object.assign(colors[color], sx) : sx}
    />
  )
}

TimelineDot.defaultProps = {
  color: 'grey',
  variant: 'filled'
}

export default TimelineDot
