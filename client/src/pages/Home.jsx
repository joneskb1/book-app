import './Home.css';
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <>
      <div className='home'>
        <div className='cta-container'>
          <h1 className='hero-text-heading'>
            Your personal bookshelf,
            <br />
            anytime, anywhere.
          </h1>
          <button className='cta-btn'>
            <Link to='/signup'>Sign up</Link>
          </button>
        </div>
      </div>
    </>
  );
}
