import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  // method === 'get' | 'post' | 'patch'
  const [errors, setErrors] = useState([]);

  const doRequest = async () => {
    try {
      // clear out errors each time users make a request
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Oops...</h4>
          <ul className='my-0'>
            {error.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
