import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/">
        <MainLayout>
          <Home />
        </MainLayout>
      </Route>
      <Route path="/library">
        <MainLayout>
          <Library />
        </MainLayout>
      </Route>
      <Route path="/assistant">
        <MainLayout>
          <Assistant />
        </MainLayout>
      </Route>
      <Route path="/profile">
        <MainLayout>
          <Profile />
        </MainLayout>
      </Route>
      <Route>
        <MainLayout>
          <NotFound />
        </MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PlayerProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
