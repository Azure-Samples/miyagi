// ** MUI imports
import { styled } from '@mui/material/styles'

const RechartsWrapper = styled('div')(({ theme }) => ({
  '& .recharts-cartesian-grid-vertical, & .recharts-cartesian-grid-horizontal, & .recharts-polar-grid-angle, & .recharts-polar-radius-axis, & .recharts-cartesian-axis':
    {
      '& line': {
        stroke: theme.palette.divider
      }
    },
  '& .recharts-polar-grid-concentric-polygon': {
    stroke: theme.palette.divider
  },
  '& .recharts-cartesian-axis-tick-value, & .recharts-polar-radius-axis-tick-value': {
    fill: theme.palette.text.primary
  },
  '& .recharts-default-tooltip': {
    border: 'none !important',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`
  },
  '& .recharts-custom-tooltip': {
    padding: theme.spacing(2.5),
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper
  },
  '& .recharts-tooltip-cursor': {
    fill: theme.palette.action.hover
  },
  '& .recharts-yAxis .recharts-cartesian-axis-ticks .recharts-cartesian-axis-tick .recharts-cartesian-axis-tick-value':
    {
      textAnchor: theme.direction === 'rtl' ? 'end' : undefined
    },
  '& .recharts-active-dot .recharts-dot': {
    fill: theme.palette.secondary.main
  },
  '& .recharts-polar-angle-axis-tick-value': {
    fill: theme.palette.text.primary
  },
  '& .recharts-tooltip-item': {
    color: `${theme.palette.text.primary} !important`
  }
}))

export default RechartsWrapper
