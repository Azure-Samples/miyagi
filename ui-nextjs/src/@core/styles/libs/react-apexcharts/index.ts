// ** MUI imports
import { styled } from '@mui/material/styles'

const ApexChartWrapper = styled('div')(({ theme }) => ({
  '& .apexcharts-canvas': {
    "& line[stroke='transparent']": {
      display: 'none'
    },
    '& .apexcharts-xaxis > line, & .apexcharts-yaxis > line': {
      stroke: theme.palette.divider
    },
    '& .apexcharts-xaxis-tick, & .apexcharts-yaxis-tick': {
      stroke: theme.palette.divider
    },
    '& .apexcharts-tooltip': {
      boxShadow: theme.shadows[3],
      borderColor: theme.palette.divider,
      background: theme.palette.background.paper,
      '& .apexcharts-tooltip-title': {
        fontWeight: 600,
        borderColor: theme.palette.divider,
        background: theme.palette.background.paper
      },
      '&.apexcharts-theme-dark': {
        '& .apexcharts-tooltip-text-label, & .apexcharts-tooltip-text-value': {
          color: theme.palette.common.white
        }
      },
      '& .bar-chart': {
        padding: theme.spacing(2, 2.5)
      }
    },
    '& .apexcharts-xaxistooltip': {
      borderColor: theme.palette.divider,
      background: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.customColors.bodyBg,
      '& .apexcharts-xaxistooltip-text': {
        color: theme.palette.text.primary
      },
      '&:after': {
        borderBottomColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.customColors.bodyBg
      },
      '&:before': {
        borderBottomColor: theme.palette.divider
      }
    },
    '& .apexcharts-yaxistooltip': {
      borderColor: theme.palette.divider,
      background: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.customColors.bodyBg,
      '& .apexcharts-yaxistooltip-text': {
        color: theme.palette.text.primary
      },
      '&:after': {
        borderLeftColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.customColors.bodyBg
      },
      '&:before': {
        borderLeftColor: theme.palette.divider
      }
    },
    '& .apexcharts-yaxis .apexcharts-yaxis-texts-g .apexcharts-yaxis-label': {
      textAnchor: theme.direction === 'rtl' ? 'start' : undefined
    },
    '& .apexcharts-text, & .apexcharts-tooltip-text, & .apexcharts-datalabel-label, & .apexcharts-datalabel': {
      filter: 'none',
      fontWeight: 400,
      fill: theme.palette.text.primary,
      fontFamily: `${theme.typography.fontFamily} !important`
    },
    '& .apexcharts-pie-label': {
      filter: 'none',
      fill: theme.palette.common.white
    },
    '& .apexcharts-pie': {
      '& .apexcharts-datalabel-label, .apexcharts-datalabel-value': {
        fontSize: '1.5rem'
      }
    },
    '& .apexcharts-marker': {
      boxShadow: 'none'
    },
    '& .apexcharts-legend-series': {
      margin: `${theme.spacing(0.75, 2)} !important`,
      '& .apexcharts-legend-text': {
        marginLeft: theme.spacing(0.75),
        color: `${theme.palette.text.primary} !important`,
        fontFamily: `${theme.typography.fontFamily} !important`
      }
    },
    '& .apexcharts-xcrosshairs, & .apexcharts-ycrosshairs, & .apexcharts-gridline': {
      stroke: theme.palette.divider
    },
    '& .apexcharts-heatmap-rect': {
      stroke: theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.customColors.bodyBg
    },
    '& .apexcharts-radialbar > g > g:first-of-type .apexcharts-radialbar-area': {
      stroke: theme.palette.customColors.bodyBg
    },
    '& .apexcharts-radar-series polygon': {
      stroke: theme.palette.divider,
      fill: theme.palette.background.paper
    },
    '& .apexcharts-radar-series line': {
      stroke: theme.palette.divider
    }
  }
}))

export default ApexChartWrapper
