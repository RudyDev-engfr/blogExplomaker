import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/styles'
import { useContext, useEffect, useState } from 'react'
import { useCurrentRefinements } from 'react-instantsearch-hooks-web'
import { SessionContext } from '../../contexts/session'

const CustomCurrentRefinements = props => {
  const [currentAdvancedRefinements, setCurrentAdvancedRefinements] = useState([])
  const { items, attribute } = useCurrentRefinements(props)
  const { currentActiveFilters } = useContext(SessionContext)

  useEffect(() => {
    const refinementArray = []
    items
      .filter(item => item.attribute !== attribute)
      .forEach((item, index) => {
        item.refinements.forEach(refinement => {
          refinementArray.push(refinement.label)
          console.log('refinement', refinement)
        })
      })
    setCurrentAdvancedRefinements(refinementArray)
  }, [items])

  useEffect(() => {
    console.log('les filtres actifs et son nombre', currentActiveFilters)
  }, [currentActiveFilters])

  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {currentAdvancedRefinements.length > 0 &&
        currentAdvancedRefinements.length <= 3 &&
        currentAdvancedRefinements.map((refinement, index) => (
          <Typography
            sx={{
              color: theme.palette.grey['82'],
              fontWeight: '400',
              fontSize: '14px',
              lineHeight: '16.6px',
            }}
            component="span"
            key={refinement.label}
          >
            {refinement}
            {currentAdvancedRefinements.length > 1 &&
              index < currentAdvancedRefinements.length - 1 &&
              ','}
          </Typography>
        ))}
      {currentAdvancedRefinements.length > 3 && (
        <Typography
          sx={{
            color: theme.palette.grey['82'],
            fontWeight: '400',
            fontSize: '14px',
            lineHeight: '16.6px',
          }}
          component="span"
        >
          {currentAdvancedRefinements.length} sélectionnés
        </Typography>
      )}
    </Box>
  )
}
export default CustomCurrentRefinements
