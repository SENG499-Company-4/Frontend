import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import axios from 'axios';

const config = {
  headers: {
      Accept: "application/vnd.heroku+json; version=3",
      Authorization: `Bearer ${process.env.REACT_APP_HEROKU}`
    }
}
axios.get(`https://api.heroku.com/apps/seng499company4frontend/config-vars`, config)
  .then(res => {
      const configVars = res.data;
      const client = new ApolloClient({
        uri: configVars.REACT_APP_BACKEND_URL,
        cache: new InMemoryCache()
      });
      
      const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
      root.render(
        <React.StrictMode>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </React.StrictMode>
      );
  })

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
