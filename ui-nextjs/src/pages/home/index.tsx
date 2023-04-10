// ** MUI Imports
import Grid from '@mui/material/Grid'
import {useEffect, useState} from 'react'

// ** MUI Imports
// ** Custom Components Imports
// ** Hooks
import {useSettings} from 'src/@core/hooks/useSettings'

// ** Styled Components

// ** Demo Components Imports

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import DialogConnectDataSources from '../../views/pages/dialog/DialogConnectDataSources'

const Home = () => {
  const [stats, setStats] = useState(null)

  const MINUTE_MS = 50000000

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
      <Grid item xs={12} sm={12}>
        <DialogConnectDataSources />
      </Grid>
    </Grid>
  )
}

export default Home
