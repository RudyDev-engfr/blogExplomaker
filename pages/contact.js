/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/iframe-has-title */
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { database } from '../lib/firebase'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '1140px',
    padding: '60px 0',
    paddingTop: '120px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      padding: '30px',
      width: '100vw',
    },
  },
}))

const Contact = () => {
  const classes = useStyles()
  return (
    <Box className={classes.mainContainer}>
      <iframe
        className="clickup-embed clickup-dynamic-height"
        src=""
        onwheel=""
        width="100%"
        height="100%"
        style="background: transparent; border: 1px solid #ccc;"
      />
      <script async src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js" />
    </Box>
  )
}
export default Contact
