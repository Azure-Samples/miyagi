// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import BingMapsReact from 'bingmaps-react'

const Locations = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Store Locations'></CardHeader>
          <CardContent>
            <BingMapsReact
              bingMapsKey={process.env.NEXT_PUBLIC_BING_MAPS_KEY}
              height='800px'
              mapOptions={{
                navigationBarMode: 'square'
              }}
              width='100%'
              viewOptions={{
                mapTypeId: 'road'
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Locations
