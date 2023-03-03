// ** React Imports
// ** MUI Imports
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { GridToolbarContainer } from '@mui/x-data-grid'

// ** Icons Imports
import { MenuDown } from 'mdi-material-ui'
import { ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Popper } from '@mui/material'
import { SyntheticEvent, useRef, useState } from 'react'
import Paper from '@mui/material/Paper'

const options = ['Add Product', 'Generate Product Description', 'Translate to French']

const StyledGridToolbarContainer = styled(GridToolbarContainer)({
  p: 2,
  pb: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '1rem'
})

const ProductsToolbar = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(1)

  // ** Ref
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const handleClick = () => {
    console.info(`You clicked '${options[selectedIndex]}'`)
  }

  const handleMenuItemClick = (event: SyntheticEvent, index: number) => {
    setSelectedIndex(index)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <StyledGridToolbarContainer>
      <ButtonGroup variant='contained' ref={anchorRef} aria-label='split button'>
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size='small'
          aria-haspopup='menu'
          onClick={handleToggle}
          aria-label='select merge strategy'
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'split-button-menu' : undefined}
        >
          <MenuDown />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement={'top'}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu'>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={event => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </StyledGridToolbarContainer>
  )
}

export default ProductsToolbar
