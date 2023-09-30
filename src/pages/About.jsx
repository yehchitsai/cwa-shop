import { Link } from 'react-router-dom'

const About = () => (
  <h1 className='text-3xl font-bold underline'>
    Hello About!
    <br />
    <Link to='../'>home</Link>
  </h1>
)

export default About
