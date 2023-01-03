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

export async function getStaticProps() {
  const doc = await database.ref().child(`page_structure/CGU`).get()
  let dataset
  if (doc.exists()) {
    dataset = doc.val()
  }

  return {
    props: { dataset },
    revalidate: 1,
  }
}

const Cgu = ({ dataset }) => {
  const classes = useStyles()
  return <Box className={classes.mainContainer}>{dataset.contant}</Box>
}
export default Cgu
