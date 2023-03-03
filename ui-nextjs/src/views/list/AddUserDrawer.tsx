// ** React Imports
// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/user'

// ** Types Imports
import { AppDispatch } from 'src/store'
import Grid from '@mui/material/Grid'
import DialogEditUserInfo from '../pages/dialog/DialogEditUserInfo'

interface SidebarAddProductType {
  open: boolean
  toggle: () => void
}

interface ProductData {
  description: string
  unitCost: number
  unitPrice: number
  contact: number
  productName: string
  categoryId: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  unitCost: yup.number().required(),
  unitPrice: yup.number().required(),
  description: yup.string().required(),
  productName: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  categoryId: yup
    .string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  description: '',
  unitCost: '',
  unitPrice: '',
  productName: '',
  categoryId: ''
}

const SidebarAddProduct = (props: SidebarAddProductType) => {
  // ** Props
  const { open, toggle } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: ProductData) => {
    dispatch(addUser({ ...data }))
    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Product</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mb: '1em' }}>
              <DialogEditUserInfo />
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='productName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Product Name'
                  onChange={onChange}
                  placeholder='Tylenol'
                  error={Boolean(errors.productName)}
                />
              )}
            />
            {errors.productName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.productName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='categoryId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Product Category'
                  onChange={onChange}
                  placeholder='High Blood Pressure'
                  error={Boolean(errors.categoryId)}
                />
              )}
            />
            {errors.categoryId && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.categoryId.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  multiline
                  maxRows={4}
                  variant='filled'
                  type='description'
                  value={value}
                  label='Long Description'
                  onChange={onChange}
                  placeholder='Alleviates pain'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='description'
                  value={value}
                  label='generated tldr'
                  onChange={onChange}
                  placeholder='Alleviates pain'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='unitCost'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Unit Cost'
                  onChange={onChange}
                  placeholder='$8.20'
                  error={Boolean(errors.unitCost)}
                />
              )}
            />
            {errors.unitCost && <FormHelperText sx={{ color: 'error.main' }}>{errors.unitCost.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='unitPrice'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Unit Price'
                  onChange={onChange}
                  placeholder='$10.20'
                  error={Boolean(errors.unitPrice)}
                />
              )}
            />
            {errors.unitPrice && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.unitPrice.message}</FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddProduct
