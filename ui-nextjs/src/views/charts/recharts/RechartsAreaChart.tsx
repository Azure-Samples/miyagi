// ** React Imports
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'

// ** Icons Imports
import Circle from 'mdi-material-ui/Circle'

interface Props {
  direction: 'ltr' | 'rtl'
}

const data = [
  {
    name: '7/12',
    Oros: 20,
    Lorath: 60,
    Myr: 100
  },
  {
    name: '8/12',
    Oros: 40,
    Lorath: 80,
    Myr: 120
  },
  {
    name: '9/12',
    Oros: 30,
    Lorath: 70,
    Myr: 90
  },
  {
    name: '10/12',
    Oros: 70,
    Lorath: 110,
    Myr: 170
  },
  {
    name: '11/12',
    Oros: 40,
    Lorath: 80,
    Myr: 130
  },
  {
    name: '12/12',
    Oros: 60,
    Lorath: 80,
    Myr: 160
  },
  {
    name: '13/12',
    Oros: 50,
    Lorath: 100,
    Myr: 140
  },
  {
    name: '14/12',
    Oros: 140,
    Lorath: 90,
    Myr: 240
  },
  {
    name: '15/12',
    Oros: 120,
    Lorath: 180,
    Myr: 220
  },
  {
    name: '16/12',
    Oros: 100,
    Lorath: 160,
    Myr: 180
  },
  {
    name: '17/12',
    Oros: 140,
    Lorath: 140,
    Myr: 270
  },
  {
    name: '18/12',
    Oros: 180,
    Lorath: 200,
    Myr: 280
  },
  {
    name: '19/12',
    Oros: 220,
    Lorath: 220,
    Myr: 375
  }
]

const CustomTooltip = (data: TooltipProps<any, any>) => {
  const { active, payload } = data

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography>{data.label}</Typography>
        <Divider />
        {data &&
          data.payload &&
          data.payload.map((i: any) => {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }} key={i.dataKey}>
                <Circle sx={{ color: i.fill, mr: 2.5, fontSize: '0.6rem' }} />
                <span>
                  {i.dataKey} : {i.payload[i.dataKey]}
                </span>
              </Box>
            )
          })}
      </div>
    )
  }

  return null
}

const RechartsAreaChart = ({ direction }: Props) => {
  return (
    <Card>
      <CardHeader
        title='Order totals from top 3 Stores'
        titleTypographyProps={{ variant: 'h6' }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Box sx={{ mr: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ mr: 1.5, fontSize: '0.75rem', color: 'rgb(255, 77, 73)' }} />
            <Typography>Oros</Typography>
          </Box>
          <Box sx={{ mr: 6, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ mr: 1.5, fontSize: '0.75rem', color: 'rgba(255, 77, 73, .5)' }} />
            <Typography>Lorath</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ mr: 1.5, fontSize: '0.75rem', color: 'rgba(255, 77, 73, .2)' }} />
            <Typography>Myr</Typography>
          </Box>
        </Box>
        <Box sx={{ height: 328 }}>
          <ResponsiveContainer>
            <AreaChart height={350} data={data} style={{ direction }} margin={{ left: -20 }}>
              <CartesianGrid />
              <XAxis dataKey='name' reversed={direction === 'rtl'} />
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />
              <Tooltip content={CustomTooltip} />
              <Area dataKey='Lorath' stackId='Lorath' stroke='0' fill='rgb(255, 77, 73)' />
              <Area dataKey='Oros' stackId='Oros' stroke='0' fill='rgba(255, 77, 73, .5)' />
              <Area dataKey='Myr' stackId='Myr' stroke='0' fill='rgba(255, 77, 73, .2)' />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsAreaChart
