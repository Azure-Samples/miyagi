// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Table = (theme: Theme) => {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: theme.shadows[0],
          borderTopColor: theme.palette.divider
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          '& .MuiTableCell-head': {
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: '1.959rem',
            letterSpacing: '0.17px'
          }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-body': {
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: '1.358rem',
            letterSpacing: '0.15px',
            '&:not(.MuiTableCell-sizeSmall):not(.MuiTableCell-paddingCheckbox):not(.MuiTableCell-paddingNone)': {
              paddingTop: theme.spacing(4),
              paddingBottom: theme.spacing(4)
            }
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head:first-child, & .MuiTableCell-root:first-child ': {
            paddingLeft: theme.spacing(5)
          },
          '& .MuiTableCell-head:last-child, & .MuiTableCell-root:last-child': {
            paddingRight: theme.spacing(5)
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiButton-root': {
            textTransform: 'uppercase',
            color: theme.palette.text.secondary
          }
        },
        stickyHeader: {
          backgroundColor: theme.palette.customColors.tableHeaderBg
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          '& .MuiIconButton-root.Mui-disabled': {
            color: theme.palette.action.active
          }
        },
        displayedRows: {
          color: theme.palette.text.primary
        }
      }
    }
  }
}

export default Table
