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
import { DynamicWidgets, HierarchicalMenu, RefinementList } from 'react-instantsearch-hooks-web'
import AlgoliaPanel from '../atoms/AlgoliaPanel'

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
  },
  modalTitle: {
    fontFamily: 'Rubik',
  },
  filterCheckbox: {},
  filterList: {
    listStyleType: 'none',
  },
  panelHeader: {
    fontSize: '18px',
    color: theme.palette.primary.main,
    fontWeight: '500',
    lineHeight: '21px',
  },
}))
const SearchFilter = ({ modalState, modalStateSetter, currentArticles }) => {
  const classes = useStyles()

  const handleSubmit = event => {
    event.preventDefault()
  }

  return (
    <Modal open={modalState === 'filter'} disableScrollLock>
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
                <AlgoliaPanel header="Résultats" headerClassName={classes.panelHeader}>
                  <RefinementList
                    attribute="resultats"
                    classNames={{
                      checkbox: classes.filterCheckbox,
                      item: classes.filterItem,
                      list: classes.filterList,
                    }}
                  />
                </AlgoliaPanel>
              </Box>
              <Box className={classes.travelType}>
                <AlgoliaPanel header="Tu es un voyageur" headerClassName={classes.panelHeader}>
                  <RefinementList
                    attribute="tu_es_un_voyageur"
                    classNames={{
                      checkbox: classes.filterCheckbox,
                      item: classes.filterItem,
                      list: classes.filterList,
                    }}
                  />
                </AlgoliaPanel>
              </Box>
            </Box>
            <Box className={classes.articleType}>
              {/* <DynamicWidgets> */}
              <AlgoliaPanel header="Type de séjour" headerClassName={classes.panelHeader}>
                <RefinementList
                  attribute="type_de_sejour"
                  classNames={{
                    checkbox: classes.filterCheckbox,
                    item: classes.filterItem,
                    list: classes.filterList,
                  }}
                />
              </AlgoliaPanel>
              {/* </DynamicWidgets> */}
            </Box>
          </Box>
          <Divider />
          <Box p={4} display="flex" justifyContent="space-between">
            <Button sx={{ textTransform: 'none' }}>Tout effacer</Button>
            <Button
              type="submit"
              onClick={() => modalStateSetter('')}
              variant="contained"
              sx={{ borderRadius: '29px' }}
            >
              Voir les résultats
            </Button>
          </Box>
        </form>
      </Paper>
    </Modal>
  )
}

export default SearchFilter
