// ** React Imports
import {forwardRef, ReactElement, Ref, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import IconButton from '@mui/material/IconButton'
import Grid, {GridProps} from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import MuiCardContent, {CardContentProps} from '@mui/material/CardContent'
import Fade, {FadeProps} from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import {styled} from '@mui/material/styles'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import Check from 'mdi-material-ui/Check'
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import ArrowRight from 'mdi-material-ui/ArrowRight'
import ChartDonut from 'mdi-material-ui/ChartDonut'
import StarOutline from 'mdi-material-ui/StarOutline'
import ClipboardOutline from 'mdi-material-ui/ClipboardOutline'

// ** Hook Imports
import {useSettings} from 'src/@core/hooks/useSettings'

// ** Tab Content Imports
import DialogTabSocial from 'src/views/pages/dialog/data-sources/DialogTabSocial'
import DialogTabBrokerage from 'src/views/pages/dialog/data-sources/DialogTabBrokerage'
import DialogTabFinancial from 'src/views/pages/dialog/data-sources/DialogTabFinancial'
import {useAuth} from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import {green} from "@mui/material/colors";

interface TabLabelProps {
  title: string
  active: boolean
  subtitle: string
  icon: ReactElement
}

// Styled CardContent component
const CardContent = styled(MuiCardContent)<CardContentProps>(({ theme }) => ({
  padding: `${theme.spacing(7, 7.5)} !important`,
  [theme.breakpoints.down('sm')]: {
    paddingBottom: '0 !important'
  }
}))

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: 298,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 250,
    position: 'static'
  }
}))

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const TabLabel = (props: TabLabelProps) => {
  const { icon, title, subtitle, active } = props

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3.5,
            ...(active ? { color: 'common.white', backgroundColor: 'primary.main' } : { color: 'text.primary' })
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant='body2'>{title}</Typography>
          <Typography variant='caption' sx={{ color: 'text.disabled', textTransform: 'none' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const tabsArr = ['detailsTab', 'frameworkTab', 'DatabaseTab', 'submitTab']

const DialogConnectDataSources = () => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('detailsTab')
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [userEmbeddings, setUserEmbeddings] = useState(null)

  // ** Hook
  const { settings } = useSettings()

  // ** Var
  const { direction } = settings

  const handleClose = () => {
    setShow(false)
    setActiveTab('detailsTab')
  }

  const fetchFakeData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/generate/fake-customer-profile`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
      console.log(result)
      toast.success('Customer profile fetched successfully!')
    } catch ({ message }) {
      // @ts-ignore
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const persistUserEmbeddings = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/embeddings`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }
      const result = await response.json()
      setUserEmbeddings(result)
      console.log(result)
      toast.success('Vectorized User profile for long term memory!')
    } catch ({ message }) {
      // @ts-ignore
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    fetchFakeData().then(() => {
      console.log("User profile");
      console.dir(data);
      if (data) {
        persistUserEmbeddings().then(() => {
          console.log("User embeddings");
          console.dir(userEmbeddings);
          handleClose();
        });
      } else {
        toast.error("Failed to fetch user profile. Please try again.");
      }
    });
  };

  const NextArrow = direction === 'ltr' ? ArrowRight : ArrowLeft
  const PreviousArrow = direction === 'ltr' ? ArrowLeft : ArrowRight

  const renderTabFooter = () => {
    const prevTab = tabsArr[tabsArr.indexOf(activeTab) - 1]
    const nextTab = tabsArr[tabsArr.indexOf(activeTab) + 1]

    return (
      <Box sx={{ mt: 8.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant='outlined'
          color='secondary'
          startIcon={<PreviousArrow />}
          disabled={activeTab === 'detailsTab'}
          onClick={() => setActiveTab(prevTab)}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          endIcon={activeTab === 'submitTab' ? <Check /> : <NextArrow />}
          color={activeTab === 'submitTab' ? 'success' : 'primary'}
          onClick={() => {
            if (activeTab !== 'submitTab') {
              setActiveTab(nextTab)
            } else {
              handleSubmit()
            }
          }}
        >
          {activeTab === 'submitTab' ? 'Submit' : 'Next'}
        </Button>
        {(isLoading && activeTab === 'submitTab') && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    )
  }

  const auth = useAuth();

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(7, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 4.5 }}>
              Welcome{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {auth.user?.fullName}
              </Box>
              ! 🎉
            </Typography>
            <Typography variant='body2'>Tell me about yourself</Typography>
            <Typography sx={{ mb: 4.5 }} variant='body2'>
              So that I can personalize your experience
            </Typography>
            <Button variant='contained'  onClick={() => setShow(true)}>Link Accounts</Button>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Congratulations Daisy' src={`/images/cards/illustration-daisy-${settings.mode}.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
      <Dialog
        fullWidth
        open={show}
        scroll='body'
        maxWidth='md'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            position: 'relative',
            pr: { xs: 5, sm: 12 },
            pl: { xs: 4, sm: 11 },
            pt: { xs: 8, sm: 12.5 },
            pb: { xs: 5, sm: 12.5 }
          }}
        >
          <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Close />
          </IconButton>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Link Accounts
            </Typography>
            <Typography variant='body2'>Consent to know you and connect your accounts</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <TabContext value={activeTab}>
              <TabList
                orientation='vertical'
                onChange={(e, newValue: string) => setActiveTab(newValue)}
                sx={{
                  border: 0,
                  minWidth: 200,
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'flex-start',
                    '& .MuiTab-root': {
                      width: '100%',
                      alignItems: 'flex-start'
                    }
                  }
                }}
              >
                <Tab
                  disableRipple
                  value='detailsTab'
                  label={
                    <TabLabel
                      title='Social Media'
                      subtitle='For better experience'
                      icon={<ClipboardOutline />}
                      active={activeTab === 'detailsTab'}
                    />
                  }
                />
                <Tab
                  disableRipple
                  value='frameworkTab'
                  label={
                    <TabLabel
                      title='Bank Accounts'
                      icon={<StarOutline />}
                      subtitle='For wealth management'
                      active={activeTab === 'frameworkTab'}
                    />
                  }
                />
                <Tab
                  disableRipple
                  value='DatabaseTab'
                  label={
                    <TabLabel
                      title='Brokerage'
                      active={activeTab === 'DatabaseTab'}
                      subtitle='To trade on your behalf'
                      icon={<ChartDonut />}
                    />
                  }
                />
                <Tab
                  disableRipple
                  value='submitTab'
                  label={
                    <TabLabel title='Submit' subtitle='Submit' active={activeTab === 'submitTab'} icon={<Check />} />
                  }
                />
              </TabList>
              <TabPanel value='detailsTab' sx={{ flexGrow: 1 }}>
                <DialogTabSocial />
                {renderTabFooter()}
              </TabPanel>
              <TabPanel value='frameworkTab' sx={{ flexGrow: 1 }}>
                <DialogTabFinancial />
                {renderTabFooter()}
              </TabPanel>
              <TabPanel value='DatabaseTab' sx={{ flexGrow: 1 }}>
                <DialogTabBrokerage />
                {renderTabFooter()}
              </TabPanel>
              <TabPanel value='submitTab' sx={{ flexGrow: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant='h6'>Submit</Typography>
                  <Typography variant='body2'>Let Miyagi personalize your experience</Typography>

                  <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                    <img alt='submit-img' src={`/images/pages/create-app-dialog-illustration-${settings.mode}.png`} />
                  </Box>
                </Box>
                {renderTabFooter()}
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DialogConnectDataSources
