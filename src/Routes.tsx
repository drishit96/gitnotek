import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Snackbar from "src/Components/Snackbar";
import Loader from "src/Components/Loader";

const Home = lazy(() => import("./pages/Home"));
const NotesView = lazy(() => import("./pages/NotesView"));
const CreateNote = lazy(() => import("./pages/CreateNote"));
const EditNote = lazy(() => import("./pages/EditNote"));

export const Routes = () => {
  const [snackbarMsg, setSnackbarMsg] = useState("");
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path="/" children={<Home />}></Route>
          <Route
            exact
            path="/workspace/*"
            children={<NotesView setSnackbarMsg={setSnackbarMsg} />}
          ></Route>
          <Route
            exact
            path="/create-note/*"
            children={<CreateNote setSnackbarMsg={setSnackbarMsg} />}
          ></Route>
          <Route
            path="/notes/*"
            children={<EditNote setSnackbarMsg={setSnackbarMsg} />}
          ></Route>
        </Switch>
      </Suspense>
      <Snackbar message={snackbarMsg} />
    </BrowserRouter>
  );
};
