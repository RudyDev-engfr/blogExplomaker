import { useRouter } from 'next/router'
import { useContext } from 'react'
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
import {
  ClearRefinements,
  DynamicWidgets,
  HierarchicalMenu,
  RefinementList,
} from 'react-instantsearch-hooks-web'
import AlgoliaPanel from '../atoms/AlgoliaPanel'
import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1000px',
    maxHeight: '98vh',
  },
  modalTitle: {
    fontFamily: 'Rubik',
  },
  filterCheckbox: {},
  filterList: {
    listStyleType: 'none',
    padding: '0',
    marginTop: '17px',
  },
  panelHeader: {
    fontSize: '18px',
    color: theme.palette.primary.main,
    fontWeight: '500',
    lineHeight: '21px',
  },
  gridContent: {
    display: 'grid',
    gridTemplate: '140px 140px 100px / 190px 190px 230px 250px',
    columnGap: '20px',
    padding: '20px 40px',
  },
  enviesFilterList: {
    maxHeight: '360px',
    overflowY: 'auto',
    padding: '5px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  clearRefinementsButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    cursor: 'pointer',
    outline: 'inherit',
    textDecoration: 'underline',
    color: theme.palette.grey['4f'],
  },
}))
const SearchFilter = ({ modalState, modalStateSetter, hits }) => {
  const classes = useStyles()
  const { currentHitsArray } = useContext(SessionContext)
  const router = useRouter()

  const handleSubmit = event => {
    event.preventDefault()
  }

  return (
    <Modal open={modalState === 'filter'} disableScrollLock keepMounted>
      <Paper className={classes.paper}>
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
        <Box p={5} className={classes.gridContent}>
          <Box
            sx={{
              gridColumn: '4 / 5',
              gridRow: '1 / 3',
            }}
          >
            <AlgoliaPanel header="Envies" headerClassName={classes.panelHeader}>
              <RefinementList
                attribute="envies"
                classNames={{
                  checkbox: classes.filterCheckbox,
                  item: classes.filterItem,
                  list: classes.enviesFilterList,
                }}
                limit={40}
              />
            </AlgoliaPanel>
          </Box>
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
          <Box sx={{ gridRow: '1 / 3', gridColumn: '3 / 4' }}>
            <AlgoliaPanel header="En direction de" headerClassName={classes.panelHeader}>
              <RefinementList
                attribute="en_direction_de"
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
          <Box>
            <AlgoliaPanel header="Durée du séjour" headerClassName={classes.panelHeader}>
              <RefinementList
                attribute="duree_du_sejour"
                classNames={{
                  checkbox: classes.filterCheckbox,
                  item: classes.filterItem,
                  list: classes.filterList,
                }}
              />
            </AlgoliaPanel>
            <AlgoliaPanel header="Type d'articles" headerClassName={classes.panelHeader}>
              <RefinementList
                attribute="type_d_article"
                classNames={{
                  checkbox: classes.filterCheckbox,
                  item: classes.filterItem,
                  list: classes.filterList,
                }}
              />
            </AlgoliaPanel>
          </Box>
          <Box sx={{ gridRow: '3 / 4', gridColumn: '3 / 4', paddingTop: '15px' }}>
            <AlgoliaPanel header="Avis Explomaker" headerClassName={classes.panelHeader}>
              <RefinementList
                attribute="avis_explomaker"
                classNames={{
                  checkbox: classes.filterCheckbox,
                  item: classes.filterItem,
                  list: classes.filterList,
                }}
              />
            </AlgoliaPanel>
          </Box>
        </Box>
        <Divider />
        <Box p={3} display="flex" justifyContent="space-between">
          <ClearRefinements
            translations={{
              resetButtonText: 'Tout effacer',
            }}
            classNames={{ button: classes.clearRefinementsButton }}
          />
          {currentHitsArray && (
            <Button
              onClick={() => {
                modalStateSetter('')
              }}
              variant="contained"
              sx={{
                borderRadius: '29px',
                textTransform: 'none',
                fontSize: '17px',
                lineHeight: '25px',
              }}
            >
              Voir les résultats ({currentHitsArray.length})
            </Button>
          )}
        </Box>
      </Paper>
    </Modal>
  )
}

export default SearchFilter
