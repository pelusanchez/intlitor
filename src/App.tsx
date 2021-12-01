import { AppProvider } from "./store/AppProvider";
import { MainEditor } from "./components/MainEditor";
import { AppMenu } from "./components/AppMenu";

import './App.scss';

function App() {
  return (
    <div className="app">
      <AppProvider>
        <AppMenu />
        <MainEditor />
      </AppProvider>
    </div>
  );
}

export default App;
