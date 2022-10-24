import { makeStyles } from '@mui/styles'
import CountryTile from '../atoms/CountryTile'

const useStyles = makeStyles({
  mobileBlogCardAndCountryTile: {
    margin: '30px 0 30px 0',
  },
})
const SpotList = ({ data, isShowingAllSpots, isAlgolia = false, numberOfSpots = 4 }) => {
  const classes = useStyles()
  return (
    <>
      {isAlgolia
        ? data
            .filter((spot, index) => (isShowingAllSpots ? index <= 15 : index <= numberOfSpots - 1))
            .map(({ country, titre, picture, slug, url_link: urlLink, color }) => (
              <CountryTile
                countryTitle={titre}
                category={country}
                srcImg={picture}
                categoryColor={color}
                altImg=""
                key={`spot/${slug}`}
                link={slug}
                className={classes.mobileBlogCardAndCountryTile}
              />
            ))
        : data
            .filter((spot, index) => (isShowingAllSpots ? true : index <= numberOfSpots - 1))
            .map(({ gps, picture: pictureMain, title, slug, color }) => (
              <CountryTile
                countryTitle={title}
                category={gps.country}
                srcImg={`https://storage.googleapis.com/stateless-www-explomaker-fr/${pictureMain?.src.original}`}
                categoryColor={color}
                altImg=""
                key={`spot/${slug}`}
                link={slug}
                className={classes.mobileBlogCardAndCountryTile}
              />
            ))}
    </>
  )
}
export default SpotList
