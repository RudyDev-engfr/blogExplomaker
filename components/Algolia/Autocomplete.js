import React, { useEffect, useRef } from 'react'
import algoliasearch from 'algoliasearch/lite'
import { createAutocomplete } from '@algolia/autocomplete-core'
import { Box, TextField, Typography } from '@mui/material'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import Link from 'next/link'
import { makeStyles, useTheme } from '@mui/styles'
import { Article, FmdGood } from '@mui/icons-material'
import { Highlight } from 'react-instantsearch-hooks-web'

const searchClient = algoliasearch('QFT8LZMQXO', '59e83f8d0cfafe2c0887fe8516f51fec')
const useStyles = makeStyles(theme => ({
  nextLink: {
    textDecoration: 'none',
  },
}))

export default function AlgoliaAutocomplete() {
  const classes = useStyles()
  const theme = useTheme()
  const inputRef = useRef(null)

  const [autocompleteState, setAutocompleteState] = React.useState({})
  const [isHovering, setIsHovering] = React.useState(false)
  const autocomplete = React.useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the React state.
          setAutocompleteState(state)
        },
        getSources() {
          return [
            // (3) Use an Algolia index source.
            {
              sourceId: 'products',
              getItemInputValue({ item }) {
                return item.query
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: 'SearchFront',
                      query,
                      params: {
                        hitsPerPage: 8,
                        highlightPreTag: '<mark>',
                        highlightPostTag: '</mark>',
                      },
                    },
                  ],
                })
              },
              getItemUrl({ item, components }) {
                return item.url_link
              },
            },
          ]
        },
      }),
    []
  )

  return (
    <Box
      sx={{ '.aa-DetachedSearchButton': { display: 'none' }, height: '100%', width: '100%' }}
      {...autocomplete.getRootProps({})}
      className="aa-Autocomplete"
    >
      <form className="aa-Form" {...autocomplete.getFormProps({ inputElement: inputRef.current })}>
        <TextField
          label="Recherche"
          variant="filled"
          type="text"
          className="aa-Input"
          fullWidth
          InputProps={{
            ref: inputRef,
          }}
          sx={{
            '& .MuiFilledInput-root': {
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: 0,
              backgroundColor: 'transparent',
              '&:hover': {
                boxShadow: 'none',
              },
              '&.Mui-focused': {
                boxShadow: 'none',
              },
            },
            '& .MuiFilledInput-underline:before': {
              borderBottomStyle: 'none',
            },
            '& .MuiFilledInput-underline:after': {
              borderBottomStyle: 'none',
            },
          }}
          {...autocomplete.getInputProps({})}
        />
      </form>
      <Box className="aa-Panel" {...autocomplete.getPanelProps({})}>
        {autocompleteState.isOpen &&
          autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection

            return (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item, itemIndex) => (
                      <li
                        key={item.objectID}
                        className="aa-Item"
                        {...autocomplete.getItemProps({
                          item,
                          source,
                        })}
                      >
                        <Link href={item.url_link} className={classes.nextLink}>
                          <Box
                            sx={{
                              width: '100%',
                              paddingLeft: '33px',
                              height: '70px',
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor:
                                isHovering === itemIndex ? theme.palette.primary.main : 'white',
                            }}
                            onMouseEnter={() => setIsHovering(itemIndex)}
                            onMouseLeave={() => setIsHovering(false)}
                          >
                            {item.resultats === 'Destinations' ? (
                              <FmdGood
                                sx={{
                                  fontSize: '30px',
                                  color:
                                    isHovering === itemIndex ? 'white' : theme.palette.primary.main,
                                  marginRight: '24px',
                                }}
                              />
                            ) : (
                              item.resultats === 'Articles' && (
                                <Article
                                  sx={{
                                    fontSize: '30px',
                                    color:
                                      isHovering === itemIndex
                                        ? 'white'
                                        : theme.palette.primary.main,
                                    marginRight: '24px',
                                  }}
                                />
                              )
                            )}
                            <Typography
                              variant="h6"
                              sx={{
                                textDecoration: 'none',
                                fontFamily: 'Vesper Libre',
                                fontWeight: 700,
                                color: isHovering === itemIndex ? 'white' : 'black',
                                lineHeight: '28px',
                                '& mark': {
                                  color:
                                    isHovering === itemIndex
                                      ? 'white'
                                      : `${theme.palette.primary.main} !important`,
                                  backgroundColor: 'unset',
                                },
                              }}
                            >
                              <Highlight hit={item} attribute="titre" />
                            </Typography>
                          </Box>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Box>
            )
          })}
      </Box>
    </Box>
  )
}
