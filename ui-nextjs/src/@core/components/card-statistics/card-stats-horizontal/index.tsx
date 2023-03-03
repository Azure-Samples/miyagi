// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { AvatarProps } from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'

// ** Types Imports
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(4)
}))

const CardStatsHorizontal = (props: CardStatsHorizontalProps) => {
  // ** Props
  const { title, color, icon, stats, trend, trendNumber } = props

  const TrendIcon = trend === 'positive' ? ChevronUp : ChevronDown

  return (
    <Card>
      <CardContent sx={{ py: theme => `${theme.spacing(4.125)} !important` }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar skin='light' color={color} variant='rounded'>
            {icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h6'>{stats}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendIcon sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }} />
                <Typography variant='caption' sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}>
                  {trendNumber}
                </Typography>
              </Box>
            </Box>
            <Typography variant='caption'>{title}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardStatsHorizontal

CardStatsHorizontal.defaultProps = {
  color: 'primary',
  trend: 'positive'
}
