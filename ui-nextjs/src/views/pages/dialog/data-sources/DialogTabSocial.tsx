// ** React Imports
import {ChangeEvent, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LicenseIcon from 'mdi-material-ui/LicenseIcon'
import CartOutline from 'mdi-material-ui/CartOutline'
import BriefcaseOutline from 'mdi-material-ui/BriefcaseOutline'

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar'
import Switch from "@mui/material/Switch";
import {label} from "aws-amplify";

const TabDetails = () => {
  const [value, setValue] = useState<string>('ecommerce')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box>
      <Box sx={{ mb: 8 }}>
        <Box
          onClick={() => setValue('crm')}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <BriefcaseOutline />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>LinkedIn</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Your professional network
              </Typography>
            </Box>
          </Box>
          <Switch defaultChecked
                  onChange={handleChange}
                  name="LinkedIn"
                  inputProps={{ 'aria-label': 'LinkedIn' }}  />
        </Box>
        <Box
          onClick={() => setValue('ecommerce')}
          sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <CartOutline />
            </CustomAvatar>
            <Box>
              <Typography sx={{ color: 'text.secondary' }}>Twitter</Typography>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Your social network
              </Typography>
            </Box>
          </Box>
          <Switch defaultChecked
                  onChange={handleChange}
                  name="Twitter"
                  inputProps={{ 'aria-label': 'Twitter' }}  />
        </Box>
      </Box>
    </Box>
  )
}

export default TabDetails
