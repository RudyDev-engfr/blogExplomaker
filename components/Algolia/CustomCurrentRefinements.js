import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useCurrentRefinements } from 'react-instantsearch-hooks-web'

const CustomCurrentRefinements = props => {
  const [currentAdvancedRefinements, setCurrentAdvancedRefinements] = useState([])
  const { items, canRefine, refine } = useCurrentRefinements(props)

  useEffect(() => {
    const refinementArray = []
    items.forEach((item, index) => {
      item.refinements.forEach(refinement => {
        refinementArray.push(refinement.label)
      })
    })
    setCurrentAdvancedRefinements(refinementArray)
  }, [items])

  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {currentAdvancedRefinements.length > 0 &&
        currentAdvancedRefinements.map((refinement, index) => (
          <Typography
            sx={{
              color: theme.palette.grey['82'],
              fontWeight: '400',
              fontSize: '14px',
              lineHeight: '16.6px',
            }}
            component="span"
          >
            {refinement}
            {currentAdvancedRefinements.length > 1 &&
              index < currentAdvancedRefinements.length - 1 &&
              ','}
          </Typography>
        ))}
    </Box>
  )
}
export default CustomCurrentRefinements
