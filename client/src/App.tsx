import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/landing";
import DemographicPage from "@/pages/demographic";
import QuizPage from "@/pages/quiz";
import LoadingPage from "@/pages/loading";
import ResultsPage from "@/pages/results";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/demographic" component={DemographicPage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/loading" component={LoadingPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/results/:sessionId" component={ResultsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
