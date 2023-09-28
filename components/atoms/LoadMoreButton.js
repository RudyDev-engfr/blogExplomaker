import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({}))
const LoadMoreButton = ({ setterMoreItems }) => {
  const classes = useStyles()

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Button
        sx={{
          textTransform: 'none',
          height: '32px',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: '500',
        }}
        variant="contained"
        // eslint-disable-next-line no-return-assign, no-param-reassign
        onClick={() => setterMoreItems(prevState => (prevState += 1))}
      >
        Charger plus
      </Button>
    </Box>
  )
}
export default LoadMoreButton
