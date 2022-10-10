import { makeStyles } from '@mui/styles'
import CountryTile from '../atoms/CountryTile'

const useStyles = makeStyles({
  mobileBlogCardAndCountryTile: {
    margin: '30px 0 30px 0',
  },
})
const SpotList = ({ data, isShowingAllSpots }) => {
  const classes = useStyles()
  return (
    <>
      {data
        .filter((spot, index) => (isShowingAllSpots ? true : index <= 3))
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
