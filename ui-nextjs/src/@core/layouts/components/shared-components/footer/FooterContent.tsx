// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` by `}
        <Link target='_blank' href='https://azure.microsoft.com'>
          Digital & App Innovation Global Black Belt (GBB) Team
        </Link>
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 3 } }}>
          <Link target='_blank' href='https://github.com/appdevgbb/miyagi-asa'>
            Source
          </Link>
          <Link target='_blank' href='https://github.com/appdevgbb/miyagi-asa/wiki'>
            Docs
          </Link>
          <Link target='_blank' href='https://github.com/appdevgbb/miyagi-asa/issues'>
            Support
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
