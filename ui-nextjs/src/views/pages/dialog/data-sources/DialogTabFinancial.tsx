// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import React from 'mdi-material-ui/React'
import Vuejs from 'mdi-material-ui/Vuejs'
import Angular from 'mdi-material-ui/Angular'
import Laravel from 'mdi-material-ui/Laravel'

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar'

const TabFramework = () => {
  const [value, setValue] = useState<string>('react')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box>
      <Typography variant='h6' sx={{ mb: 4 }}>
        Bank Accounts
      </Typography>
      <Box sx={{ mb: 8 }}>
        <Box
          onClick={() => setValue('react')}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <React />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>Plaid</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Multiple accounts
              </Typography>
            </Box>
          </Box>
          <Radio value='react' onChange={handleChange} checked={value === 'react'} />
        </Box>

        <Box
          onClick={() => setValue('angular')}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='error' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Angular />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>JPMC</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Directly link your JP Morgan Chase account
              </Typography>
            </Box>
          </Box>
          <Radio value='angular' onChange={handleChange} checked={value === 'angular'} />
        </Box>
        <Box
          onClick={() => setValue('vuejs')}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Vuejs />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>BoA</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Link your Bank of America account
              </Typography>
            </Box>
          </Box>
          <Radio value='vuejs' onChange={handleChange} checked={value === 'vuejs'} />
        </Box>
        <Box
          onClick={() => setValue('laravel')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='warning' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Laravel />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>Citi</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Link your Citi account
              </Typography>
            </Box>
          </Box>
          <Radio value='laravel' onChange={handleChange} checked={value === 'laravel'} />
        </Box>
      </Box>
    </Box>
  )
}

export default TabFramework
