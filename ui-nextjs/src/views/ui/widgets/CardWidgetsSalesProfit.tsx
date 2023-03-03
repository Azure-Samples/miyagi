// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const series = [
  {
    type: 'column',
    name: 'Earning',
    data: [90, 52, 67, 45, 75, 55, 48]
  },
  {
    type: 'column',
    name: 'Expense',
    data: [-53, -29, -67, -84, -60, -40, -77]
  },
  {
    type: 'line',
    name: 'Expense',
    data: [73, 20, 50, -20, 58, 15, 31]
  }
]

const CardWidgetsSalesProfit = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '57%',
        endingShape: 'flat',
        startingShape: 'rounded'
      }
    },
    markers: {
      size: 4,
      strokeWidth: 3,
      fillOpacity: 1,
      strokeOpacity: 1,
      colors: [theme.palette.background.paper],
      strokeColors: hexToRGBA(theme.palette.warning.main, 1)
    },
    stroke: {
      curve: 'smooth',
      width: [0, 0, 3],
      colors: [hexToRGBA(theme.palette.warning.main, 1)]
    },
    colors: [hexToRGBA(theme.palette.primary.main, 1), hexToRGBA(theme.palette.primary.main, 0.12)],
    dataLabels: { enabled: false },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    legend: { show: false },
    grid: {
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -28,
        left: -6,
        right: -8,
        bottom: -5
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    yaxis: {
      max: 100,
      min: -100,
      show: false
    }
  }

  return (
    <Card>
      <CardHeader
        title='Sales and Profit'
        subheader='For all locations'
        subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
        titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
      />
      <CardContent
        sx={{
          '& .apexcharts-series[rel="2"]': { transform: 'translateY(-8px)' },
          '& .apexcharts-canvas .apexcharts-xaxis-label': { letterSpacing: '0.4px', fill: theme.palette.text.secondary }
        }}
      >
        <Grid container sx={{ mb: 5 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' sx={{ mr: 4 }} variant='rounded'>
                <TrendingUp />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Net Income</Typography>
                <Typography sx={{ fontWeight: 600 }}> {`$${(Math.random() * 1000000).toFixed(2)}`}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' sx={{ mr: 4 }} color='warning' variant='rounded'>
                <CurrencyUsd />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Expense</Typography>
                <Typography sx={{ fontWeight: 600 }}>{`$${(Math.random() * 10000).toFixed(2)}`}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <ReactApexcharts type='line' height={225} series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default CardWidgetsSalesProfit
