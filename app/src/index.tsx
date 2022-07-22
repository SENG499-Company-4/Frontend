import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import axios from 'axios';

const config = {
  headers: {
    Accept: 'application/vnd.heroku+json; version=3',
    Authorization: `Bearer ${process.env.REACT_APP_HEROKU}`
  }
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  const a =  {
    headers: {
      ...headers,
      authorization: token ?? "",
    }
  }
  return a;
});

axios.get(`https://api.heroku.com/apps/seng499company4frontend/config-vars`, config).then((res) => {
  const configVars = res.data;
  const httpLink = createHttpLink({
    uri: configVars.REACT_APP_BACKEND_URL,
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
  });

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
