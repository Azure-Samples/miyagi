// ** React Imports
// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { GridToolbarContainer } from '@mui/x-data-grid'

// ** Icons Imports
import { CheckboxMultipleMarkedOutline } from 'mdi-material-ui'

const StyledGridToolbarContainer = styled(GridToolbarContainer)({
  p: 2,
  pb: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between'
})

const ServerSideToolbar = () => {
  return (
    <StyledGridToolbarContainer>
      <Box sx={{ mb: 2 }}>
        <Button variant='contained' startIcon={<CheckboxMultipleMarkedOutline />}>
          Complete Order
        </Button>
      </Box>
    </StyledGridToolbarContainer>
  )
}

export default ServerSideToolbar
