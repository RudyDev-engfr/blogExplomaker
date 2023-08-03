import { Box, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import Image from 'next/legacy/image'

const useStyles = makeStyles(theme => ({
  flagContainer: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: theme.palette.secondary.constrastText,
    top: '160px',
    left: '20px',
    zIndex: '300',
    borderRadius: '10px',
  },
  image: {
    borderRadius: '20px',
  },
}))
const CountryAside = ({
  srcImg,
  flagFromDataset,
  countryName,
  countryCode,
  countryCapitalCity,
  countryPeopleNumber,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  return (
    <Box
      sx={{
        position: 'relative',
        height: 'fit-content',
        borderRadius: '20px',
        backgroundColor: theme.palette.primary.ultraLight,
      }}
    >
      <Box sx={{ position: 'relative', width: '280px', height: '185px' }}>
        <Image src={srcImg} layout="fill" className={classes.image} alt="countryAside_image" />
      </Box>
      {flagFromDataset && (
        <Box className={classes.flagContainer}>
          <Box sx={{ position: 'relative', width: '30px', height: '30px' }}>
            <Image
              src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                flagFromDataset
              )}`}
              layout="fill"
              alt="flag_icon"
            />
          </Box>
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.ultraLight,
          padding: '30px 20px 20px 20px',
          borderRadius: '0 0 20px 20px',
        }}
      >
        <Typography
          sx={{ marginBottom: '15px', fontSize: '22px', lineHeight: '26px', fontWeight: '500' }}
        >
          {countryName}({countryCode})
        </Typography>
        {countryCapitalCity !== 'Demacia' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="primary.main">Capitale</Typography>
            <Typography fontWeight={500}>{countryCapitalCity}</Typography>
          </Box>
        )}
        {countryPeopleNumber !== 'un nombre random' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography component="span" color="primary.main">
              Population
            </Typography>
            <Typography component="span" fontWeight={500}>
              {countryPeopleNumber}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
export default CountryAside
