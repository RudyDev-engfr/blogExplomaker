import React, { useEffect, useRef } from 'react'
import algoliasearch from 'algoliasearch/lite'
import { createAutocomplete } from '@algolia/autocomplete-core'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import Link from 'next/link'
import { makeStyles, useTheme } from '@mui/styles'
import { Article, Close, FmdGood, Tag } from '@mui/icons-material'
import { Highlight } from 'react-instantsearch-hooks-web'
import { IconButton, useMediaQuery } from '@mui/material'

const searchClient = algoliasearch('QFT8LZMQXO', '59e83f8d0cfafe2c0887fe8516f51fec')
const useStyles = makeStyles(theme => ({
  nextLink: {
    textDecoration: 'none',
  },
}))

export default function AlgoliaAutocomplete({ setSearchModal }) {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const inputRef = useRef(null)
  const formRef = React.useRef(null)
  const panelRef = React.useRef(null)

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
                      indexName: 'SearchFrontIntuitiveSearch',
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
        openOnFocus: true,
      }),
    []
  )

  React.useEffect(() => {
    if (matchesXs) {
      if (!(formRef.current && panelRef.current && inputRef.current)) {
        return
      }

      const { onTouchStart, onTouchMove, onMouseDown } = autocomplete.getEnvironmentProps({
        formElement: formRef.current,
        panelElement: panelRef.current,
        inputElement: inputRef.current,
      })

      window.addEventListener('touchstart', onTouchStart)
      window.addEventListener('touchmove', onTouchMove)
      window.addEventListener('mousedown', onMouseDown)

      return () => {
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('mousedown', onMouseDown)
      }
    }
  }, [autocomplete, autocomplete.getEnvironmentProps, autocompleteState.isOpen, matchesXs])

  return (
    <Box
      sx={{
        '.aa-DetachedSearchButton': { display: 'none' },
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
      {...autocomplete.getRootProps({})}
      className="aa-Autocomplete"
    >
      {matchesXs && (
        <IconButton
          sx={{ position: 'absolute', top: '0', right: '0', zIndex: 1001 }}
          onClick={() => setSearchModal(false)}
        >
          <Close sx={{ fontSize: '25px' }} />
        </IconButton>
      )}
      <form
        ref={formRef}
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <TextField
          label="Destinations, articles, passion"
          variant="filled"
          type="text"
          className="aa-Input"
          id="autocomplete-input"
          fullWidth
          inputRef={input => {
            if (input != null) {
              input.focus()
            }
          }}
          InputProps={{
            ref: inputRef,
          }}
          sx={{
            '& .MuiFilledInput-root': {
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: '10px 10px 0 0 ',
              backgroundColor: 'transparent',
              [theme.breakpoints.down('sm')]: {
                borderRadius: 'unset',
              },
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
      <Box className="aa-Panel" {...autocomplete.getPanelProps({})} ref={panelRef}>
        {autocompleteState.isOpen ? (
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
                        <Link
                          href={item.url_link}
                          className={classes.nextLink}
                          onClick={() => setSearchModal(false)}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              paddingLeft: '33px',
                              height: '70px',
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor:
                                isHovering === itemIndex ? theme.palette.primary.main : 'white',
                              [theme.breakpoints.down('sm')]: {
                                height: '12vh',
                              },
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
                            ) : item.resultats === 'Articles' ? (
                              <Article
                                sx={{
                                  fontSize: '30px',
                                  color:
                                    isHovering === itemIndex ? 'white' : theme.palette.primary.main,
                                  marginRight: '24px',
                                }}
                              />
                            ) : (
                              item.resultats === 'Tag' && (
                                <Tag
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
                                paddingRight: '33px',
                                '& mark': {
                                  color:
                                    isHovering === itemIndex
                                      ? 'white'
                                      : `${theme.palette.primary.main} !important`,
                                  backgroundColor: 'unset',
                                },
                                [theme.breakpoints.down('sm')]: {
                                  fontSize: '18px',
                                  fontWeight: 500,
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
          })
        ) : (
          <Typography
            sx={{
              textAlign: 'center',
              paddingTop: '15px',
              fontSize: '18px',
              [theme.breakpoints.down('sm')]: { height: '10vh', backgroundColor: 'white' },
            }}
          >
            Pas de résultat
          </Typography>
        )}
      </Box>
    </Box>
  )
}
