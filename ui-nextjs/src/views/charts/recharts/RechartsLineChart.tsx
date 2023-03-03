// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { useEffect, useState } from 'react'

interface Props {
  direction: 'ltr' | 'rtl'
}

const CustomTooltip = (props: TooltipProps<any, any>) => {
  // ** Props
  const { active, payload } = props

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <span>{`${payload[0].value}`}</span>
      </div>
    )
  }

  return null
}

const RechartsLineChart = ({ direction }: Props) => {
  const [data, setData] = useState([])

  const MINUTE_MS = 50000

  useEffect(() => {
    function fetchOrdersPerDay() {
      fetch('/api/orders/day')
        .then(response => response.json())
        .then(data => {
          setData(data)
        })
        .catch(error => {
          console.log(error)
        })
    }
    fetchOrdersPerDay()
    const interval = setInterval(() => {
      fetchOrdersPerDay()
    }, MINUTE_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader
        title='Orders over time'
        titleTypographyProps={{ variant: 'h6' }}
        subheader='daily order count for all stores'
        subheaderTypographyProps={{ variant: 'caption', sx: { color: 'text.disabled' } }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ mr: 5 }}>
              {data.reduce<number>((accumulator, obj) => {
                // @ts-ignore
                return accumulator + obj.pv
              }, 0)}
            </Typography>
            <CustomChip
              skin='light'
              color='success'
              sx={{ fontWeight: 500, borderRadius: 1, fontSize: '0.875rem' }}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUp sx={{ fontSize: '1rem', mr: 1 }} />
                  <span>22%</span>
                </Box>
              }
            />
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <LineChart height={350} data={data} style={{ direction }} margin={{ left: -20 }}>
              <CartesianGrid />
              <XAxis dataKey='label' reversed={direction === 'rtl'} />
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />
              <Tooltip content={CustomTooltip} />
              <Line dataKey='pv' stroke='#ff4d49' strokeWidth={3} animationEasing={'linear'} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsLineChart
