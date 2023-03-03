// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'

// ** MUI Imports
// ** Custom Components Imports
// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Styled Components
import RechartsWrapper from 'src/@core/styles/libs/recharts'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import RechartsLineChart from 'src/views/charts/recharts/RechartsLineChart'
import RechartsAreaChart from 'src/views/charts/recharts/RechartsAreaChart'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import CardWidgetsProfitPerOrder from '../../views/ui/widgets/CardWidgetsProfitPerOrder'
import CardWidgetsSalesProfit from '../../views/ui/widgets/CardWidgetsSalesProfit'
import CardWidgetsOrdersByDay from '../../views/ui/widgets/CardWidgetsOrdersByDay'

const Home = () => {
  const [stats, setStats] = useState(null)

  const MINUTE_MS = 500000

  const { settings } = useSettings()

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://63594e33ff3d7bddb99ee138.mockapi.io/stats/1')
        .then(res => res.json())
        .then(data => {
          setStats(data.stats)
        })
    }, MINUTE_MS)

    return () => clearInterval(interval) // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [stats])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={4}>
        <CardWidgetsOrdersByDay />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardWidgetsProfitPerOrder />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CardWidgetsSalesProfit />
      </Grid>
      <Grid item xs={12}>
        <RechartsWrapper>
          <DatePickerWrapper>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <RechartsLineChart direction={settings.direction} />
              </Grid>
              <Grid item xs={12} md={6}>
                <RechartsAreaChart direction={settings.direction} />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </RechartsWrapper>
      </Grid>
    </Grid>
  )
}

export default Home
