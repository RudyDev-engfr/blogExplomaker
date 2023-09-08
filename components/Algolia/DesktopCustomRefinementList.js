import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/styles'
import { useEffect } from 'react'
import { useRefinementList } from 'react-instantsearch-hooks-web'

const currentRefinement = new Set()

const DesktopCustomRefinementList = ({ onItemsChange, ...props }) => {
  const {
    items,
    // attribute,
    // hasExhaustiveItems,
    // createURL,
    refine,
    // sendEvent,
    // searchForItems,
    // isFromSearch,
    // canRefine,
    // canToggleShowMore,
    // isShowingMore,
    // toggleShowMore,
  } = useRefinementList(props)
  const theme = useTheme()

  function toggle(item) {
    currentRefinement.clear()
    // item.value.forEach(value => currentRefinement.add(value))
    currentRefinement.add(item.value)
    // didn't use new Set([...]) because IE 11 doesn't support it.
    // ref: http://kangax.github.io/compat-table/es6/#test-Set
    refine(item.value)
  }

  // Informer le parent de la mise à jour des items
  useEffect(() => {
    onItemsChange(items)
  }, [items, onItemsChange])

  return (
    <List component="ul" sx={{ padding: '0', overflowY: 'visible' }}>
      {items.map((item, index) => (
        <ListItem
          component="li"
          key={item.label}
          sx={{
            display: 'flex',
            padding: '0',
            paddingTop: '7px',
          }}
        >
          <Checkbox
            color="primary"
            checked={item.isRefined}
            onChange={() => toggle(item)}
            sx={{
              width: '30px',
              height: '30px',
              '& .MuiSvgIcon-root': { fontSize: 30 },
              paddingLeft: '10px',
              marginRight: '7px',
            }}
          />
          <Typography
            sx={{
              fontWeight: '400',
              fontSize: '1rem',
              lineHeight: '19px',
              color: theme.palette.grey['33'],
            }}
          >
            {item.label}
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '1rem',
                lineHeight: '19px',
                color: theme.palette.grey['82'],
                paddingLeft: '4px',
              }}
              component="span"
            >
              ({item.count})
            </Typography>
          </Typography>
        </ListItem>
      ))}
    </List>
  )
}
export default DesktopCustomRefinementList
