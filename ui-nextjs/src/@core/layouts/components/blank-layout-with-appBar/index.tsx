// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const StyledLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const BlankLayoutAppBar = () => {
  // ** Hooks
  const theme = useTheme()

  return (
    <AppBar elevation={3} color='default' position='sticky'>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          p: theme => `${theme.spacing(0, 6)} !important`,
          minHeight: `${theme.mixins.toolbar.minHeight}px !important`
        }}
      >
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
            <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
              {themeConfig.templateName}
            </Typography>
          </StyledLink>
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default BlankLayoutAppBar
