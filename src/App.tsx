import { AppProvider } from "./store/AppProvider";
import { MainEditor } from "./components/MainEditor";
import { AppMenu } from "./components/AppMenu";

import './App.scss';
import { TopHeader } from "./components/TopHeader";

function App() {
  return (
    <div className="app">
      <AppProvider>
        <TopHeader />
        <MainEditor />
      </AppProvider>
    </div>
  );
}

export default App;
