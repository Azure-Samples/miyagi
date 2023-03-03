// ** React Imports
import { SyntheticEvent, useState, useEffect, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled, useTheme } from '@mui/material/styles'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Third Party Imports
import clsx from 'clsx'
import { usePopper } from 'react-popper'

// ** Icons Imports
import ChevronDown from 'mdi-material-ui/ChevronDown'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavGroup } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import HorizontalNavItems from './HorizontalNavItems'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavGroup from 'src/layouts/components/acl/CanViewNavGroup'

// ** Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hasActiveChild } from 'src/@core/layouts/utils'

interface Props {
  item: NavGroup
  settings: Settings
  hasParent?: boolean
}

// ** Styled Components
const ListItem = styled(MuiListItem)<ListItemProps>(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(2.25),
  paddingBottom: theme.spacing(2.25),
  '&:hover': {
    background: theme.palette.action.hover
  }
}))

const NavigationMenu = styled(Paper)(({ theme }) => ({
  overflowY: 'auto',
  padding: theme.spacing(2, 0),
  backgroundColor: theme.palette.background.paper,
  ...(themeConfig.menuTextTruncate ? { width: 260 } : { minWidth: 260 }),

  '&::-webkit-scrollbar': {
    width: 6
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 20,
    background: hexToRGBA(theme.palette.mode === 'light' ? '#BFBFD5' : '#57596C', 0.6)
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: 20,
    background: 'transparent'
  },
  '& .MuiList-root': {
    paddingTop: 0,
    paddingBottom: 0
  },
  '& .menu-group.Mui-selected': {
    borderRadius: 0,
    backgroundColor: theme.palette.action.hover
  }
}))

const HorizontalNavGroup = (props: Props) => {
  // ** Props
  const { item, hasParent, settings } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()
  const currentURL = router.pathname
  const { skin, direction } = settings
  const { navSubItemIcon, menuTextTruncate, horizontalMenuToggle, horizontalMenuAnimation } = themeConfig

  const popperOffsetHorizontal = direction === 'rtl' ? 16 : -16
  const popperPlacement = direction === 'rtl' ? 'bottom-end' : 'bottom-start'
  const popperPlacementSubMenu = direction === 'rtl' ? 'left-start' : 'right-start'

  // ** States
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [popperElement, setPopperElement] = useState(null)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [referenceElement, setReferenceElement] = useState(null)

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: hasParent ? popperPlacementSubMenu : popperPlacement,
    modifiers: [
      {
        enabled: true,
        name: 'offset',
        options: {
          offset: hasParent ? [-8, 15] : [popperOffsetHorizontal, 5]
        }
      }
    ]
  })

  const handleGroupOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    setMenuOpen(true)
    update ? update() : null
  }

  const handleGroupClose = () => {
    setAnchorEl(null)
    setMenuOpen(false)
  }

  const handleMenuToggleOnClick = (event: SyntheticEvent) => {
    if (anchorEl) {
      handleGroupClose()
    } else {
      handleGroupOpen(event)
    }
  }

  useEffect(() => {
    handleGroupClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  const IconTag = item.icon ? item.icon : navSubItemIcon
  const ToggleIcon = direction === 'rtl' ? ChevronLeft : ChevronRight

  const WrapperCondition = horizontalMenuToggle === 'click'
  const MainWrapper = WrapperCondition ? ClickAwayListener : 'div'
  const ChildWrapper = WrapperCondition ? 'div' : Fragment
  const AnimationWrapper = horizontalMenuAnimation ? Fade : Fragment

  const childMenuGroupStyles = () => {
    if (attributes && attributes.popper) {
      if (direction === 'ltr') {
        if (attributes.popper['data-popper-placement'] === 'right-start') {
          return 'left'
        }
        if (attributes.popper['data-popper-placement'] === 'left-start') {
          return 'right'
        }
      } else {
        if (attributes.popper['data-popper-placement'] === 'right-start') {
          return 'right'
        }
        if (attributes.popper['data-popper-placement'] === 'left-start') {
          return 'left'
        }
      }
    }
  }

  return (
    <CanViewNavGroup navGroup={item}>
      {/* @ts-ignore */}
      <MainWrapper {...(WrapperCondition ? { onClickAway: handleGroupClose } : { onMouseLeave: handleGroupClose })}>
        <ChildWrapper>
          <List component='div' sx={{ py: skin === 'bordered' ? 2.625 : 2.75 }}>
            <ListItem
              aria-haspopup='true'
              {...(WrapperCondition ? {} : { onMouseEnter: handleGroupOpen })}
              className={clsx('menu-group', { 'Mui-selected': hasActiveChild(item, currentURL) })}
              {...(horizontalMenuToggle === 'click' ? { onClick: handleMenuToggleOnClick } : {})}
              sx={{
                ...(menuOpen ? { backgroundColor: theme.palette.action.hover } : {}),
                ...(!hasParent
                  ? {
                      borderRadius: '8px',
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        '& .MuiTypography-root, & .MuiListItemIcon-root, & .MuiSvgIcon-root': {
                          color: 'common.white'
                        }
                      }
                    }
                  : {})
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                ref={setReferenceElement}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    ...(menuTextTruncate && { overflow: 'hidden' })
                  }}
                >
                  <ListItemIcon sx={{ mr: hasParent ? 3 : 2.5, color: 'text.primary' }}>
                    <UserIcon
                      icon={IconTag}
                      componentType='horizontal-menu'
                      iconProps={{ sx: IconTag === navSubItemIcon ? { fontSize: '0.5rem' } : {} }}
                    />
                  </ListItemIcon>
                  <Typography {...(menuTextTruncate && { noWrap: true })}>
                    <Translations text={item.title} />
                  </Typography>
                </Box>
                <Box sx={{ ml: 1.5, display: 'flex', alignItems: 'center' }}>
                  {item.badgeContent ? (
                    <Chip
                      size='small'
                      label={item.badgeContent}
                      color={item.badgeColor || 'primary'}
                      sx={{ mr: 0.75, '& .MuiChip-label': { px: 2.5, lineHeight: 1.385, textTransform: 'capitalize' } }}
                    />
                  ) : null}
                  {hasParent ? (
                    <ToggleIcon sx={{ color: 'text.secondary' }} />
                  ) : (
                    <ChevronDown sx={{ color: 'text.secondary' }} />
                  )}
                </Box>
              </Box>
            </ListItem>
            <AnimationWrapper {...(horizontalMenuAnimation && { in: menuOpen, timeout: { exit: 300, enter: 400 } })}>
              <Box
                style={styles.popper}
                ref={setPopperElement}
                {...attributes.popper}
                sx={{
                  zIndex: theme.zIndex.appBar,
                  ...(!horizontalMenuAnimation && { display: menuOpen ? 'block' : 'none' }),
                  pl: childMenuGroupStyles() === 'left' ? (skin === 'bordered' ? 1.5 : 1.25) : 0,
                  pr: childMenuGroupStyles() === 'right' ? (skin === 'bordered' ? 1.5 : 1.25) : 0,
                  ...(hasParent ? { position: 'fixed !important' } : { pt: skin === 'bordered' ? 5.25 : 5.5 })
                }}
              >
                <NavigationMenu
                  sx={{
                    ...(hasParent
                      ? { overflowX: 'visible', maxHeight: 'calc(100vh - 21rem)' }
                      : { maxHeight: 'calc(100vh - 13rem)' }),
                    ...(skin === 'bordered'
                      ? { boxShadow: theme.shadows[0], border: `1px solid ${theme.palette.divider}` }
                      : { boxShadow: theme.shadows[4] })
                  }}
                >
                  <HorizontalNavItems {...props} hasParent horizontalNavItems={item.children} />
                </NavigationMenu>
              </Box>
            </AnimationWrapper>
          </List>
        </ChildWrapper>
      </MainWrapper>
    </CanViewNavGroup>
  )
}

export default HorizontalNavGroup
