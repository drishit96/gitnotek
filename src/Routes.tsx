import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Snackbar from "src/Components/Snackbar";
import Loader from "src/Components/Loader";
import NavigationBar from "./Components/NavigationBar";
import NetworkStatusIndicator from "./Components/NetworkStatusIndicator";

const Home = lazy(() => import("./pages/Home"));
const NotesView = lazy(() => import("./pages/NotesView"));
const CreateNote = lazy(() => import("./pages/CreateNote"));
const EditNote = lazy(() => import("./pages/EditNote"));

export const Routes = () => {
  const [showBackButton, setShowBackButton] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <NetworkStatusIndicator />
        <NavigationBar showBackButton={showBackButton}></NavigationBar>
        <Switch>
          <Route exact path="/" children={<Home />}></Route>
          <Route
            exact
            path="/workspace/*"
            children={
              <NotesView
                setShowBackButton={setShowBackButton}
                setSnackbarMsg={setSnackbarMsg}
              />
            }
          ></Route>
          <Route
            exact
            path="/create-note/*"
            children={
              <CreateNote
                setShowBackButton={setShowBackButton}
                setSnackbarMsg={setSnackbarMsg}
              />
            }
          ></Route>
          <Route
            path="/notes/*"
            children={
              <EditNote
                setShowBackButton={setShowBackButton}
                setSnackbarMsg={setSnackbarMsg}
              />
            }
          ></Route>
        </Switch>
      </Suspense>
      <Snackbar message={snackbarMsg} />
    </BrowserRouter>
  );
};
