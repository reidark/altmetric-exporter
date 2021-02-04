import React, { Fragment, useState } from 'react';
import api from '../services/api';

// Styles
import '../assets/scss/index.scss';

const App = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('news');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState('');
  const [filename, setFilename] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    setDownload('');
    setError('');
    setLoading(true);

    api.post('/export', {
      'url': url,
      'title': title,
      'type': type,
      'page': 1
    }).then(response => {
      setFilename(response.data.filename);
      setDownload(response.data.url);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setError('Error to export!');
    })
  };

  return (
    <Fragment>
      <header className="header">
        <h1>Altmetric Exporter</h1>

        <div>Tool to export data from Altmetric.</div>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label-control" htmlFor="url">Altmetric URL:</label>

            <input className="form-control" id="url" name="url" value={url} type="text" placeholder="Eg: https://www.altmetric.com/details/10629832" onChange={e => setUrl(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="label-control" htmlFor="title">Document title:</label>

            <input className="form-control" id="title" name="title" value={title} type="text" placeholder="Eg: Article news exported" onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="label-control">Type to export:</label>

            <ul className="form-checkbox-control">
              <li>
                <input type="radio" id="type-news" name="type" value="news" checked={type === 'news'} onChange={e => setType(e.target.value)} />

                <label htmlFor="type-news">News</label>
              </li>

              <li>
                <input type="radio" id="type-blogs" name="type" value="blogs" checked={type === 'blogs'} onChange={e => setType(e.target.value)} />

                <label htmlFor="type-blogs">Blogs</label>
              </li>
              
              <li>
                <input type="radio" id="type-twitter" name="type" value="twitter" checked={type === 'twitter'} onChange={e => setType(e.target.value)} />

                <label htmlFor="type-twitter">Twitter</label>
              </li>

              <li>
                <input type="radio" id="type-facebook" name="type" value="facebook" checked={type === 'facebook'} onChange={e => setType(e.target.value)} />

                <label htmlFor="type-facebook">Facebook</label>
              </li>
            </ul>
          </div>

          <div className="form-group">
            <button className="form-submit" type="submit" disabled={loading}>{ loading ? 'Exporting...' : 'Export!' }</button> 

            { download && <a className="btn btn-success" href={download}>Download: {filename}</a> }

            { error && <span className="alert alert-error">{error}</span> }
          </div>
        </form>

        <div>Disclaimer: This tool works fine with Altmetric published in 02/2021. Further updates in his website structure may crash the exporter.</div>
      </main>

      <footer className="footer">
        <div>Help this project on <a href="https://github.com/reidark/altmetric-exporter" target="_blank" rel="noopener noreferrer">Github</a>.</div>
      </footer>
    </Fragment>
  );
}

export default App;
