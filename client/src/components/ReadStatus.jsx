import readIcon from '../assets/green-check.svg';
import unreadIcon from '../assets/unread-x.svg';
import { useState } from 'react';
export default function ReadStatus({ initialHasRead, googleBooksId }) {
  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState(() =>
    initialHasRead ? readIcon : unreadIcon
  );

  async function handleReadClick(e) {
    e.preventDefault();

    try {
      const url = `/api/v1/users/toggle-read/${googleBooksId}`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        setImgSrc(imgSrc === unreadIcon ? readIcon : unreadIcon);
      } else {
        // maybe throw data.message into catch block
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <img
      onClick={handleReadClick}
      src={imgSrc}
      alt={`${imgSrc === unreadIcon ? 'unread' : 'read'}`}
    />
  );
}