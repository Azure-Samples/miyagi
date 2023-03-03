// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TriggerNewOrderForm from '../../views/forms/TriggerNewOrderForm'
import SimulatedOrdersTable from '../../views/table/data-grid/SimulatedOrdersTable'

const VirtualCustomers = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)

  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <TriggerNewOrderForm />
      </Grid>
      {ability?.can('read', 'analytics') ? (
        <Grid item md={6} xs={12}>
          <SimulatedOrdersTable />
        </Grid>
      ) : null}
    </Grid>
  )
}

VirtualCustomers.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default VirtualCustomers
