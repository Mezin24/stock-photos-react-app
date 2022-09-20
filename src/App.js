import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photo from './Photo';
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [newImages, setNewImages] = useState(false);
  const mount = useRef(false);

  const fetchPhotos = async () => {
    setLoading(true);
    let url;
    if (query) {
      url = `${searchUrl}${clientID}&page=${page}&query=${query}`;
    } else {
      url = `${mainUrl}${clientID}&page=${page}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setPhotos((prevImages) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...prevImages, ...data.results];
        } else {
          return [...prevImages, ...data];
        }
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setNewImages(false);
      setLoading(false);
    }
    // eslint-disable-next-line
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((prev) => prev + 1);
  }, [newImages]);

  const event = () => {
    if (window.innerHeight + window.scrollY > document.body.scrollHeight - 3) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchPhotos();
      return;
    }
    setPage(1);
  };

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            className='form-input'
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((photo) => {
            return <Photo key={photo.id} {...photo} />;
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
