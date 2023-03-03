// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Switch = (theme: Theme) => {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-track': {
            borderRadius: theme.shape.borderRadius
          },

          '& .MuiSwitch-switchBase': {
            '&:not(.Mui-checked)': {
              '& .MuiSwitch-thumb': {
                color: theme.palette.grey[50]
              }
            }
          },
          '& .Mui-disabled + .MuiSwitch-track': {
            backgroundColor: `rgb(${theme.palette.customColors.main})`
          }
        }
      }
    }
  }
}

export default Switch
