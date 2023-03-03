// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import { CartArrowUp } from 'mdi-material-ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { green } from '@mui/material/colors'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

const TriggerNewOrderForm = () => {
  const [data, setData] = useState(null)
  const [numOrders, setnumOrders] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/simulate-orders?numOrders=${numOrders}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result.statusText)
      toast.success('Order placed successfully!')
    } catch ({ message }) {
      // @ts-ignore
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setnumOrders(Number(e.target.value))
  }

  return (
    <Card>
      <CardHeader title='Simulate order creation' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Number of orders to simulate'
                placeholder='0'
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CartArrowUp />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained' size='large' onClick={handleClick}>
                Create orders
              </Button>
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px'
                  }}
                />
              )}
              {data && <Alert severity='success'>{data}</Alert>}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TriggerNewOrderForm
