// ** Next Import
// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { GridRowId } from '@mui/x-data-grid'
import toast from 'react-hot-toast'

interface InflightOrderHeaderProps {
  selectedRows: GridRowId[]
  handleCompleteOrder: () => void
  setLoading: (loading: boolean) => void
}

const InflightOrderHeader = (props: InflightOrderHeaderProps) => {
  // ** Props
  const { selectedRows, handleCompleteOrder, setLoading } = props

  const completeSelectedOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/complete`, {
        method: 'POST',
        body: JSON.stringify(selectedRows),
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }
      const result = await response.json()
      toast.success('Successfully completed orders')
      handleCompleteOrder()
    } catch ({ message }) {
      // @ts-ignore
      toast.error(message)
    } finally {
      // @ts-ignore
      toast.dismiss()
    }
  }

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Button
        sx={{ mb: 2 }}
        variant='contained'
        disabled={selectedRows && selectedRows.length === 0}
        onClick={completeSelectedOrders}
      >
        Complete Selected Order(s)
      </Button>
    </Box>
  )
}

export default InflightOrderHeader
