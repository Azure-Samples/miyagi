// ** React Import
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons
import Close from 'mdi-material-ui/Close'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

interface Props {
  hidden: boolean
  navHover: boolean
  settings: Settings
  collapsedNavWidth: number
  menuLockedIcon?: ReactNode
  menuUnlockedIcon?: ReactNode
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalNavMenuBranding?: (props?: any) => ReactNode
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(4),
  justifyContent: 'space-between',
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>({
  fontWeight: 700,
  lineHeight: 1.2,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
})

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    menuUnlockedIcon: userMenuUnlockedIcon,
    verticalNavMenuBranding: userVerticalNavMenuBranding
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { skin, direction, navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const svgFillSecondary = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return `rgba(${theme.palette.customColors.dark}, 0.68)`
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return `rgba(${theme.palette.customColors.light}, 0.68)`
    } else {
      return theme.palette.text.secondary
    }
  }
  const svgFillDisabled = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return `rgba(${theme.palette.customColors.dark}, 0.38)`
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return `rgba(${theme.palette.customColors.light}, 0.38)`
    } else {
      return theme.palette.text.disabled
    }
  }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userVerticalNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 40) / 8
      }
    } else {
      return 5.5
    }
  }

  const svgRotationDeg = () => {
    if (navCollapsed) {
      if (direction === 'rtl') {
        if (navHover) {
          return 0
        } else {
          return 180
        }
      } else {
        if (navHover) {
          return 180
        } else {
          return 0
        }
      }
    } else {
      if (direction === 'rtl') {
        return 180
      } else {
        return 0
      }
    }
  }

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href='/' passHref>
          <StyledLink>
            <svg width='28' height='25'>
              <metadata id='metadata1655'>image/svg+xml</metadata>
              <g>
                <title>Layer 1</title>
                <g stroke='null' id='layer1'>
                  <path
                    stroke='null'
                    fill='#bf0000'
                    id='path1575'
                    d='m18.91548,0.0002c-0.05925,0.00069 -0.12003,0.00335 -0.18041,0.00768c-2.4048,0.3797 -3.72705,2.70578 -3.91865,4.75698c-0.27997,1.86128 0.61672,4.25357 2.85088,4.67063c0.32407,0.05644 0.66079,0.03064 0.97756,-0.04797c2.69032,-0.82519 3.89426,-3.73976 3.50539,-6.15395c-0.11304,-1.55922 -1.398,-3.25479 -3.23477,-3.23337zm-10.1952,0.09978c-1.49529,0.03358 -2.66009,1.42082 -2.89703,2.72485c-0.4995,2.58358 0.7853,5.79369 3.72775,6.61065c0.27561,0.05483 0.56069,0.06047 0.83911,0.02111c1.98879,-0.30319 2.83129,-2.34284 2.74809,-3.98942c-0.05986,-2.17205 -1.2933,-4.68357 -3.75922,-5.29428c-0.2254,-0.05468 -0.44509,-0.07771 -0.6587,-0.07292zm16.7109,7.33792c-2.58676,0.14156 -4.3602,2.50249 -4.61301,4.70709c-0.34233,1.59001 0.58435,3.71664 2.56768,3.84358c2.76549,-0.03118 4.6521,-2.73428 4.73049,-5.06017c0.17492,-1.53828 -0.81568,-3.40556 -2.68516,-3.4905zm-22.64131,0.52386c-1.10051,-0.00866 -2.18287,0.59433 -2.54251,1.61764c-0.95945,2.73738 0.96725,6.20426 4.13682,6.77951c1.32281,0.20706 2.48513,-0.72218 2.81312,-1.84024c0.69509,-2.39141 -0.7326,-5.16818 -3.14876,-6.25373c-0.39364,-0.20208 -0.82803,-0.2998 -1.25867,-0.30319zm11.59651,4.90858c-2.15748,0.00421 -4.34879,1.0057 -5.74581,2.4965c-1.50888,1.73759 -2.74492,3.75962 -3.22848,5.95246c-0.58747,1.57851 0.74402,3.39512 2.58866,3.40607c2.21921,0.05639 4.12646,-1.33759 6.33319,-1.4411c1.87223,-0.26108 3.54864,0.62972 5.23186,1.21275c1.43315,0.56071 3.41352,0.34583 4.14521,-1.065c0.57554,-1.43803 -0.2716,-2.9714 -0.97337,-4.24847c-1.43134,-2.07285 -2.96475,-4.25144 -5.31157,-5.54565c-0.94067,-0.53335 -1.98603,-0.76962 -3.03968,-0.76756z'
                  />
                </g>
              </g>
            </svg>
            <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 2 }) }}>
              {themeConfig.templateName}
            </HeaderTitle>
          </StyledLink>
        </Link>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Close fontSize='small' />
        </IconButton>
      ) : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{ p: 0, color: 'text.primary', backgroundColor: 'transparent !important' }}
        >
          {userMenuLockedIcon && userMenuUnlockedIcon ? (
            navCollapsed ? (
              userMenuUnlockedIcon
            ) : (
              userMenuLockedIcon
            )
          ) : (
            <Box
              width={22}
              fill='none'
              height={22}
              component='svg'
              viewBox='0 0 22 22'
              xmlns='http://www.w3.org/2000/svg'
              sx={{
                transform: `rotate(${svgRotationDeg()}deg)`,
                transition: 'transform .25s ease-in-out .35s'
              }}
            >
              <path
                fill={svgFillSecondary()}
                d='M11.4854 4.88844C11.0082 4.41121 10.2344 4.41121 9.75716 4.88844L4.51029 10.1353C4.03299 10.6126 4.03299 11.3865 4.51029 11.8638L9.75716 17.1107C10.2344 17.5879 11.0082 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96674 11.8638C7.48943 11.3865 7.48943 10.6126 7.96674 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z'
              />
              <path
                fill={svgFillDisabled()}
                d='M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1193 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0779 11.8638C13.6005 11.3865 13.6005 10.6126 14.0779 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1193 4.41121 16.3455 4.41121 15.8683 4.88844Z'
              />
            </Box>
          )}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
