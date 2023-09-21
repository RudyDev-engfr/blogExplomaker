import { ArrowRight } from '@mui/icons-material'
import { makeStyles, useTheme } from '@mui/styles'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import { set } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import CustomCurrentRefinements from '../Algolia/CustomCurrentRefinements'
import CustomRefinementList from '../Algolia/CustomRefinementList'
import DesktopCustomRefinementList from '../Algolia/DesktopCustomRefinementList'
import AlgoliaPanel from '../atoms/AlgoliaPanel'

const useStyles = makeStyles(theme => ({
  panelHeader: {
    fontSize: '14px',
    color: theme.palette.grey['33'],
    fontWeight: 500,
    lineHeight: '21px',
    textTransform: 'uppercase',
  },
  rootAccordionDetails: {
    marginTop: '9px',
    borderRadius: '4px',
    boxShadow: '0 3px 15px 0 #009D8C33',
  },
  badgeRoot: { right: '2px', top: '2px' },
}))

const DesktopAccordionFilter = ({ category, header, index, expanded, setExpanded }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [items, setItems] = useState([])

  const handleItemsChange = newItems => {
    setItems(newItems)
  }
  const accordionRef = useRef(null)

  const handleClickOutside = event => {
    if (expanded && accordionRef.current && !accordionRef.current.contains(event.target)) {
      setExpanded(false)
    }
  }

  const handleClickInside = event => {
    event.stopPropagation() // Empêche la propagation au document
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    // Nettoyez l'écouteur d'événements lors du démontage
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [expanded])

  const handleSingleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
    if (expanded && accordionRef.current && !accordionRef.current.contains(event.target)) {
      setExpanded(false)
    }
  }

  useEffect(() => {
    console.log('expanded', expanded)
  }, [expanded])

  return (
    <Accordion
      sx={{
        marginBottom: '0',
        '&.Mui-expanded': {
          minHeight: expanded && 'fit-content',
          transition: 'none',
        },
        '&.MuiAccordion-root': {
          maxHeight: expanded && 'fit-content',
          '&::before': {
            display: 'none',
          },
        },
        transition: 'none',
        display: items?.length === 0 && 'none',
      }}
      classes={{ root: classes.rootAccordion }}
      disableGutters
      ref={accordionRef}
      aria-controls={`panelContent-${index}`}
      id={`panelHeader-${index}`}
      expanded={expanded === `panel${index}`}
      onClick={handleClickInside}
      onChange={handleSingleChange(`panel${index}`)}
    >
      <Badge
        badgeContent={items?.filter(item => item?.isRefined).length}
        color="secondary"
        classes={{ badge: classes.badgeRoot }}
      >
        <AccordionSummary
          expandIcon={
            <ArrowRight
              sx={{
                fontSize: '25px',
                color: 'white',
                transform: 'rotate(-90deg)',
                transition: 'none !important',
              }}
            />
          }
          sx={{
            maxHeight: '33px',
            minHeight: '33px',
            color: 'white',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '5px',
            width: 'fit-content',
            paddingX: '8px',
            paddingY: '8px',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <AlgoliaPanel header={header} headerClassName={classes.panelHeader} />
            {/* <CustomCurrentRefinements includedAttributes={[`${category}`]} /> */}
          </Box>
        </AccordionSummary>
      </Badge>
      <AccordionDetails
        sx={{
          position: 'absolute',
          zIndex: '10',
          backgroundColor: 'white',
          width: 'max-content',
          maxHeight: '540px',
          overflowY: 'auto',
          borderRadius: '4px',
        }}
        classes={{ root: classes.rootAccordionDetails }}
      >
        <DesktopCustomRefinementList
          attribute={category}
          limit={100}
          onItemsChange={handleItemsChange}
        />
      </AccordionDetails>
    </Accordion>
  )
}
export default DesktopAccordionFilter
