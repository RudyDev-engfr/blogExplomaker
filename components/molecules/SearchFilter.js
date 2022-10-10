import Close from '@mui/icons-material/Close'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
  },
  filterTitle: {
    fontSize: '18px',
    color: theme.palette.primary.main,
    fontWeight: '500',
    lineHeight: '21px',
  },
  modalTitle: {
    fontFamily: 'Rubik',
  },
}))
const SearchFilter = ({
  modalState,
  modalStateSetter,
  setIsSpotsShowing,
  setIsArticlesShowing,
  isSpotsShowing,
  isArticlesShowing,
  enviesSport,
  currentArticles,
}) => {
  const classes = useStyles()

  const handleSubmit = event => {
    event.preventDefault()
  }

  return (
    <Modal open={modalState === 'login'} disableScrollLock>
      {/* TODO filtrer les articles par meta 
      .filter(currentArticle =>
      currentArticle.meta.some(currentMeta => enviesSport.includes(currentMeta))
      )
      */}
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Box position="absolute" top="2%" right="2%">
            <IconButton onClick={() => modalStateSetter('')} size="large">
              <Close />
            </IconButton>
          </Box>
          <Box my={2}>
            <Typography variant="h3" className={classes.modalTitle} align="center">
              Filtres
            </Typography>
          </Box>
          <Divider />
          <Box p={5} display="flex" justifyContent="space-between">
            <Box>
              <Box className={classes.results}>
                <Typography className={classes.filterTitle} mb={2}>
                  Résulats
                </Typography>
                <Box display="flex" flexDirection="column" justifyContent="space-enenly" mb={7}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Spots"
                    onChange={event => setIsSpotsShowing(event.target.checked)}
                    checked={isSpotsShowing}
                    margin="none"
                    sx={{ height: '27px' }}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Articles"
                    onChange={event => setIsArticlesShowing(event.target.checked)}
                    checked={isArticlesShowing}
                    margin="none"
                    sx={{ height: '27px' }}
                  />
                </Box>
              </Box>
              <Box className={classes.travelType}>
                <Typography className={classes.filterTitle} mb={2}>
                  Type de séjour
                </Typography>
              </Box>
            </Box>
            <Box className={classes.articleType}>
              <Typography className={classes.filterTitle} mb={2}>
                Type d&rsquo;article
              </Typography>
              <Box>
                {enviesSport
                  .filter(({ value }) =>
                    currentArticles.some(({ meta }) => meta.includes(parseInt(value, 10)))
                  )
                  .map(({ label }) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      label={label}
                      onChange={event => setIsArticlesShowing(event.target.checked)}
                      checked={isArticlesShowing}
                      margin="none"
                      sx={{ height: '27px' }}
                    />
                  ))}
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box p={4} display="flex" justifyContent="space-between">
            <Button sx={{ textTransform: 'none' }}>Tout effacer</Button>
            <Button type="submit" onClick={() => modalStateSetter('')} variant="contained">
              Voir les résultats
            </Button>
          </Box>
        </form>
      </Paper>
    </Modal>
  )
}

export default SearchFilter
