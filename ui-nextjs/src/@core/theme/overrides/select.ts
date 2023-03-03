// ** MUI Imports
import { Theme } from '@mui/material/styles'

const select = (theme: Theme) => {
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          minWidth: '6rem !important',
          '&.MuiTablePagination-select': {
            minWidth: '1.5rem !important'
          },
          '&.Mui-disabled ~ .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`
          }
        }
      }
    }
  }
}

export default select
