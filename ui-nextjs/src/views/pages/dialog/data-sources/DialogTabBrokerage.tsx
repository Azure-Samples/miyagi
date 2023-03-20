// ** React Imports
import {ChangeEvent, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Aws from 'mdi-material-ui/Aws'
import Firebase from 'mdi-material-ui/Firebase'
import Database from 'mdi-material-ui/DatabaseOutline'

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar'

const TabDatabase = () => {
  const [value, setValue] = useState<string>('firebase')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box>
      <Box sx={{ mb: 8 }}>
        <Box
          onClick={() => setValue('firebase')}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='error' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Firebase />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>Fidelity</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Fidelity Investments
              </Typography>
            </Box>
          </Box>
          <Radio value='firebase' onChange={handleChange} checked={value === 'firebase'} />
        </Box>
        <Box
          onClick={() => setValue('aws')}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='warning' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Aws />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>E-trade</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                From Morgan Stanley
              </Typography>
            </Box>
          </Box>
          <Radio value='aws' onChange={handleChange} checked={value === 'aws'} />
        </Box>
        <Box
          onClick={() => setValue('sql')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Database />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>Robinhood</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Brokerage account
              </Typography>
            </Box>
          </Box>
          <Radio value='sql' onChange={handleChange} checked={value === 'sql'} />
        </Box>
      </Box>
    </Box>
  )
}

export default TabDatabase
