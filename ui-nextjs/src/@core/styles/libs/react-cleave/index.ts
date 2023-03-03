// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

const CleaveWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  '& input': {
    height: 56,
    width: '100%',
    borderWidth: 1,
    lineHeight: 1.5,
    borderRadius: 8,
    fontSize: '1rem',
    borderStyle: 'solid',
    letterSpacing: '0.15px',
    padding: theme.spacing(4),
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.body1.fontFamily,
    borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`,
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    '&:focus, &:focus-visible': {
      outline: 0,
      borderWidth: 2,
      padding: theme.spacing(3.75),
      borderColor: `${theme.palette.primary.main} !important`
    },
    '&::-webkit-input-placeholder': {
      color: theme.palette.text.secondary
    }
  }
}))

export default CleaveWrapper
