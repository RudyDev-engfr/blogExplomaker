import { useContext } from 'react'
import { Add, Close } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import { Button, Divider, IconButton, Typography } from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import { makeStyles, useTheme } from '@mui/styles'
import { CurrentRefinements, RefinementList } from 'react-instantsearch-hooks-web'

import AlgoliaPanel from '../atoms/AlgoliaPanel'
import CustomRefinementList from '../Algolia/CustomRefinementList'
import { SessionContext } from '../../contexts/session'
import CustomCurrentRefinements from '../Algolia/CustomCurrentRefinements'
import AccordionFilter from './AccordionFilter'

const useStyles = makeStyles(theme => ({
  panelHeader: {
    fontSize: '18px',
    color: theme.palette.grey['33'],
    fontWeight: '500',
    lineHeight: '21px',
  },
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    maxHeight: '100vh',
  },
  filterCheckbox: {},
  enviesFilterList: {
    // padding: '5px',
    marginTop: '10px',
    marginBottom: '10px',
    listStyleType: 'none',
  },
  headerModal: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '20px',
    paddingTop: '55px',
    paddingBottom: '22px',
  },
  footerModal: {
    padding: '16px 20px 30px 30px',
  },
}))
const MobileSearchFilter = ({ modalState, modalStateSetter }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { currentHitsArray } = useContext(SessionContext)
  const currentFilters = [
    {
      header: 'Type de résultats',
      category: 'resultats',
    },
    {
      header: 'Type de séjours',
      category: 'type_de_sejour',
    },
    {
      header: "Type d'article",
      category: 'type_d_article',
    },
    { header: 'Envies', category: 'envies' },
  ]

  return (
    <Modal open={modalState === 'filter'} disableScrollLock keepMounted>
      <Paper className={classes.paper}>
        <Box className={classes.headerModal}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '60%',
            }}
          >
            <IconButton onClick={() => modalStateSetter('')} size="large" sx={{ padding: '0' }}>
              <Close sx={{ width: '32px', height: '32px' }} />
            </IconButton>
            <Typography sx={{ fontSize: '22px', fontWeight: '500' }}>Filtres</Typography>
          </Box>
        </Box>
        <Divider />
        <Paper
          sx={{
            overflowY: 'auto',
            maxHeight: '65vh',
            backgroundColor: theme.palette.grey.f2,
            padding: '20px',
            borderRadius: '0',
          }}
        >
          {currentFilters.map(({ header, category }, index) => (
            <AccordionFilter isFirstAccordion={index === 0} header={header} category={category} />
          ))}
        </Paper>
        <Divider />
        <Box className={classes.footerModal}>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              padding: '30px 20px',
              height: '58px',
              fontSize: '16px',
              lineHeight: '18px',
              borderRadius: '10px',
            }}
            onClick={() => modalStateSetter('')}
          >
            Voir {currentHitsArray.length} résultats
          </Button>
        </Box>
      </Paper>
    </Modal>
  )
}
export default MobileSearchFilter
