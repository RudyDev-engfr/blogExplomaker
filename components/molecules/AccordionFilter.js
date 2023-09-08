import { Add } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import CustomCurrentRefinements from '../Algolia/CustomCurrentRefinements'
import CustomRefinementList from '../Algolia/CustomRefinementList'
import AlgoliaPanel from '../atoms/AlgoliaPanel'

const useStyles = makeStyles(theme => ({
  panelHeader: {
    fontSize: '18px',
    color: theme.palette.grey['33'],
    fontWeight: '500',
    lineHeight: '21px',
    marginBottom: '10px',
  },
}))
const AccordionFilter = ({ category, header, isFirstAccordion }) => {
  const classes = useStyles()

  const [items, setItems] = useState([])

  const handleItemsChange = newItems => {
    setItems(newItems)
  }
  return (
    <Accordion
      sx={{
        width: 'calc(100vw - 48px)',
        marginBottom: '0',
        // '&.Mui-expanded': {
        //   marginBottom: '0',
        // },
        '&.MuiAccordion-root:first-of-type': {
          borderTopLeftRadius: isFirstAccordion && '20px',
          borderTopRightRadius: isFirstAccordion && '20px',
        },
        display: items?.length === 0 && 'none',
      }}
    >
      <AccordionSummary
        expandIcon={<Add />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ height: '85px' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <AlgoliaPanel header={header} headerClassName={classes.panelHeader} />
          <CustomCurrentRefinements includedAttributes={[`${category}`]} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <CustomRefinementList attribute={category} onItemsChange={handleItemsChange} />
      </AccordionDetails>
    </Accordion>
  )
}
export default AccordionFilter
