import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import {ApolloProvider, useMutation} from 'react-apollo';
import './style/index.css';
import reportWebVitals from './reportWebVitals';
import {Home, Listings, NotFound, User, Listing, Host, Login, AppHeader} from "./sections";
import {Affix, Layout, Spin} from "antd";
import {Viewer} from "./lib/types";
import {LogIn as LogInData, LogInVariables} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import {LOG_IN} from "./lib/graphql/mutations/LogIn";
import {AppHeaderSkeleton} from "./lib/components/AppHeaderSkeleton";
import {ErrorBanner} from "./lib/components/ErrorBanner";

const client = new ApolloClient({
        uri: "/api",
        request: async operation => {
            const token = sessionStorage.getItem("token");
            operation.setContext({
                headers: {
                    "X-CSRF-TOKEN": token || ""
                }
            })
        }
    });


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
  const [logIn, {error}] = useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: data => {
          if (data && data.logIn) {
              setViewer(data.logIn);
              if (data.logIn.token) {
                  sessionStorage.setItem("token", data.logIn.token);
              } else {
                  sessionStorage.removeItem("token");
              }
          }
      }
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
      logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
      return (
          <Layout className="app-skeleton">
              <AppHeaderSkeleton />
              <div className="app-skeleton__spin-section">
                  <Spin size={"large"} tip="Tinyhouse" />
              </div>
          </Layout>
      );
  }

  const logInErrorBannerElement = error ? <ErrorBanner description={"Err"} /> : null;

  return (
    <Router>
        <Layout id="app">
            {logInErrorBannerElement}
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
