import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { UserProvider } from "./context/UserContext"
import { AccessibilityProvider } from "./context/AccessibilityContext"
import Home from "./pages/Home"
import CompanionPage from "./pages/CompanionPage"
import ParentDashboard from "./pages/ParentDashboard"
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import Notifications from "./components/common/Notifications"
import ErrorBoundary from "./components/common/ErrorBoundary"
import SocialHub from "./components/social/SocialHub"
import ContentManager from "./components/cms/ContentManager"
import PersonalizedLearningPath from "./components/learning/PersonalizedLearningPath"

function App() {
  return (
    <UserProvider>
      <AccessibilityProvider>
        <Router>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/companion/:id" component={CompanionPage} />
                  <Route path="/parent-dashboard" component={ParentDashboard} />
                  <Route path="/social-hub" component={SocialHub} />
                  <Route path="/content-manager" component={ContentManager} />
                  <Route path="/learning-path" component={PersonalizedLearningPath} />
                </Switch>
              </main>
              <Footer />
              <Notifications />
            </div>
          </ErrorBoundary>
        </Router>
      </AccessibilityProvider>
    </UserProvider>
  )
}

export default App

