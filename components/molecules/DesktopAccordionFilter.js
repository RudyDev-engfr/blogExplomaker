import { ArrowRight } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { set } from 'date-fns'
import { useEffect, useState } from 'react'
import CustomCurrentRefinements from '../Algolia/CustomCurrentRefinements'
import CustomRefinementList from '../Algolia/CustomRefinementList'
import AlgoliaPanel from '../atoms/AlgoliaPanel'

const useStyles = makeStyles(theme => ({
  panelHeader: {
    fontSize: '16px',
    color: theme.palette.grey['33'],
    fontWeight: 600,
    lineHeight: '21px',
    textTransform: 'uppercase',
  },
}))

const DesktopAccordionFilter = ({ category, header, index, expanded, setExpanded }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [expandedArray, setExpandedArray] = useState([])

  // const handleChange = panel => (event, isExpanded) => {
  //   console.log(isExpanded)
  //   let tempExpandedArray = expanded || []
  //   console.log('tempExpandedArray', tempExpandedArray)
  //   if (isExpanded && !tempExpandedArray.includes(panel)) {
  //     tempExpandedArray.push(panel)
  //   }
  //   if (!isExpanded) {
  //     tempExpandedArray = tempExpandedArray.filter(tempPanel => tempPanel !== panel)
  //   }
  //   setExpandedArray(tempExpandedArray)
  // }

  const handleSingleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  useEffect(() => {
    console.log('expanded', expanded)
  }, [expanded])

  useEffect(() => {
    setExpanded(expandedArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedArray, setExpandedArray])

  return (
    <Accordion
      sx={{
        marginBottom: '0',
        '&.Mui-expanded': {
          minHeight: expanded ? 'fit-content' : '48px',
          transition: 'none',
        },
        '&.MuiAccordion-root': {
          maxHeight: expanded ? 'fit-content' : '48px',
        },
        transition: 'none',
      }}
      classes={{ root: classes.rootAccordion }}
      disableGutters
      aria-controls={`panelContent-${index}`}
      id={`panelHeader-${index}`}
      expanded={expanded === `panel${index}`}
      onChange={handleSingleChange(`panel${index}`)}
    >
      <AccordionSummary
        expandIcon={<ArrowRight sx={{ fontSize: '25px', color: 'white' }} />}
        sx={{
          height: '48px',
          color: 'white',
          backgroundColor: theme.palette.primary.main,
          borderRadius: '5px',
          width: 'fit-content',
          paddingX: '8px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <AlgoliaPanel header={header} headerClassName={classes.panelHeader} />
          {/* <CustomCurrentRefinements includedAttributes={[`${category}`]} /> */}
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{ position: 'absolute', zIndex: '10', backgroundColor: 'white', width: 'max-content' }}
      >
        <CustomRefinementList attribute={category} />
      </AccordionDetails>
    </Accordion>
  )
}
export default DesktopAccordionFilter
