// ** React Imports
import { forwardRef, ReactElement, Ref, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { BookmarkOutline, DeleteOutline, MessageOutline, RobotHappyOutline } from 'mdi-material-ui'
import { Chip, Fab, InputAdornment } from '@mui/material'
import toast from 'react-hot-toast'
import { Alert, AlertTitle } from '@mui/material'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogEditUserInfo = () => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [seed, setSeed] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [openAiResponse, setOpenAiResponse] = useState<string[]>([])

  const handleGetRec = async () => {
    try {
      const response = await fetch(`/api/generate/product-names`, {
        method: 'POST',
        body: JSON.stringify({ product_description: description, seed_words: seed }),
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }
      const result = await response.json()
      setOpenAiResponse(result.output.split(',').slice(1))
      toast.success('Successfully generated product name!')
    } catch ({ message }) {
      // @ts-ignore
      toast.error(message)
    } finally {
      // @ts-ignore
      toast.dismiss()
    }
  }

  function handleDelete(index: number) {
    const temp = [...openAiResponse]
    temp.splice(index, 1)
    setOpenAiResponse(temp)
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <RobotHappyOutline sx={{ mb: 2, fontSize: '2rem' }} />
        <Typography variant='h6' sx={{ mb: 4 }}>
          GPT-3 helper
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Use Azure OpenAI's GPT-3 model (yes, same one that is used to train Dall-E) to generate product tags
        </Typography>
        <Button variant='contained' onClick={() => setShow(true)}>
          Show
        </Button>
      </CardContent>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Close />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Azure OpenAI Service
            </Typography>
            <Typography variant='body2'>GPT-3 model to generate product tags</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Product Description'
                placeholder='Alleviates pain...'
                onChange={e => {
                  setDescription(e.currentTarget.value)
                }}
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MessageOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Seed'
                placeholder='medicine,pills,...'
                onChange={e => {
                  setSeed(e.currentTarget.value)
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <BookmarkOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Fab color='secondary' variant='extended' onClick={() => handleGetRec()}>
                <RobotHappyOutline sx={{ mr: 1 }} />
                Get product tags from generative ai
              </Fab>
            </Grid>
            {openAiResponse.length > 0 && (
              <Grid item xs={12}>
                <Alert severity='success'>
                  <AlertTitle>Response from GPT-3</AlertTitle>
                  {openAiResponse.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      color='primary'
                      onDelete={() => handleDelete(index)}
                      deleteIcon={<DeleteOutline />}
                    />
                  ))}
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => setShow(false)}>
            Use for product tags
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogEditUserInfo
