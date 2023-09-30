import { Link } from 'react-router-dom'
import { times, random } from 'lodash-es'
import Card from '../components/Card'

const Home = () => (
  <>
    <div className='flex flex-wrap'>
      {times(random(5, 15), (index) => (
        <Card key={index} />
      ))}
    </div>
    <br />
    <Link to='/about'>about</Link>
    <br />
    <Link to='/detail'>detail</Link>
  </>
)

export default Home
