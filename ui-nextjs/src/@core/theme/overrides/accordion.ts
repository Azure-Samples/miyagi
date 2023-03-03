// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Accordion = (theme: Theme) => {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:first-of-type': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          },
          '&:last-of-type': {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          },
          '&.Mui-disabled': {
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.12)`
          },
          '&.Mui-expanded': {
            boxShadow: theme.shadows[3]
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: `0 ${theme.spacing(5)}`,
          '& + .MuiCollapse-root': {
            '& .MuiAccordionDetails-root:first-child': {
              paddingTop: 0
            }
          }
        },
        content: {
          margin: `${theme.spacing(3.25)} 0`
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: theme.spacing(5),
          '& + .MuiAccordionDetails-root': {
            paddingTop: 0
          }
        }
      }
    }
  }
}

export default Accordion
