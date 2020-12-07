import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import './style/index.css';
import reportWebVitals from './reportWebVitals';
import {Home, Listings, NotFound, User, Listing, Host, Login, AppHeader} from "./sections";
import {Affix, Layout} from "antd";
import {Viewer} from "./lib/types";

const client = new ApolloClient({ uri: "/api" });


const initialViewer: Viewer = {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false
};

const App = () => {
  const [viewer, setViewer] = useState(initialViewer);
  console.log(viewer);
  return (
    <Router>
        <Layout id="app">
            <Affix offsetTop={0} className={"app__affix-header"}>
                <AppHeader viewer={viewer} setViewer={setViewer} />
            </Affix>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/host" component={Host} />
                <Route exact path="/listing/:id" component={Listing} />
                <Route exact path="/listings/:location?" component={Listings} />
                <Route exact path="/user/:id" component={User} />
                <Route exact path="/login" render={props => <Login {...props} setViewer={setViewer} />} />
                <Route component={NotFound} />
            </Switch>
        </Layout>
    </Router>
  )
}


ReactDOM.render(

      <ApolloProvider client={client}>
          <React.StrictMode>
                <App />
            </React.StrictMode>
      </ApolloProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
