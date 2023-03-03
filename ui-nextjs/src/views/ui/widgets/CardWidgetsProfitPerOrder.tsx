// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const series = [
  {
    name: 'Sales',
    type: 'column',
    data: [83, 68, 56, 65, 65, 50, 39]
  },
  {
    type: 'line',
    name: 'Sales',
    data: [63, 38, 31, 45, 46, 27, 18]
  }
]

const CardWidgetsProfitPerOrder = () => {
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      offsetY: -9,
      offsetX: -16,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        columnWidth: '50%',
        endingShape: 'rounded',
        startingShape: 'rounded',
        colors: {
          ranges: [
            {
              from: 40,
              to: 50,
              color: hexToRGBA(theme.palette.primary.main, 1)
            }
          ]
        }
      }
    },
    markers: {
      size: 3.5,
      strokeWidth: 2,
      fillOpacity: 1,
      strokeOpacity: 1,
      colors: [theme.palette.background.paper],
      strokeColors: hexToRGBA(theme.palette.primary.main, 1)
    },
    stroke: {
      width: [0, 2],
      colors: [theme.palette.background.default, theme.palette.primary.main]
    },
    legend: { show: false },
    grid: { strokeDashArray: 7 },
    dataLabels: { enabled: false },
    colors: [hexToRGBA(theme.palette.background.default, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tickPlacement: 'on',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      min: 0,
      max: 90,
      show: true,
      tickAmount: 3,
      labels: {
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Profit / Order' subheader='Last 7 days' />
      <CardContent
        sx={{
          '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 },
          '& .apexcharts-canvas .apexcharts-yaxis-label': { fontSize: '0.75rem', fill: theme.palette.text.disabled }
        }}
      >
        <ReactApexcharts type='line' height={230} series={series} options={options} />
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 4 }} variant='h4'>
            {`$${(Math.random() * 1000).toFixed(2)}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardWidgetsProfitPerOrder
