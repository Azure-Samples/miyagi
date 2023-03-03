// ** React Imports
// ** Context Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'
import InflightOrderTable from '../../views/table/data-grid/InflightOrderTable'

const VirtualWorkers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item md={12} xs={12}>
        <InflightOrderTable />
      </Grid>
    </Grid>
  )
}

VirtualWorkers.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default VirtualWorkers
