import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Home, Login, Register } from './components/views'
import NavbarComponent from './components/layout/NavbarComponent'
import setAuthToken from './utils/setAuthToken'
import { loadUser } from './actions/auth'
import { Provider } from 'react-redux'
import store from './store'
import { LOGOUT } from './actions/types'
import PrivateRoute from './components/routes/PrivateRoute'
import AdminRoute from './components/routes/AdminRoute'
import Landing from './components/views/Landing'
import Dashboard from './components/admin/Dashboard'
import { CreateElection, EditElection } from './components/admin/Elections'
import ConfirmToken from './components/views/ConfirmToken'
import AddCandidate from './components/admin/Candidates/AddCandidate'
import Footer from './components/layout/Footer'
import NotFound from './components/views/NotFound'
import LupaPassword from './components/views/LupaPassword'
import ResetPassword from './components/views/ResetPassword'
import ElectionDetails from './components/admin/Elections/ElectionDetails'

function App() {
  useEffect(() => {
    // Check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    store.dispatch(loadUser())

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT })
    })
  }, [])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavbarComponent />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <PrivateRoute exact path='/home' component={Home} />
          <AdminRoute exact path='/dashboard' component={Dashboard} />
          <AdminRoute
            path='/dashboard/buat-pemilu'
            component={CreateElection}
          />
          <AdminRoute
            path='/dashboard/election/:id'
            component={ElectionDetails}
          />
          <AdminRoute
            path='/dashboard/add-candidate'
            component={AddCandidate}
          />
          <Route path='/confirm-user' component={ConfirmToken} />
          <Route path='/forgot-password' component={LupaPassword} />
          <Route path='/reset-password/:token' component={ResetPassword} />
          <Route path='/*' component={NotFound} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </Provider>
  )
}

export default App
