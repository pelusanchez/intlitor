import './MainEditor.scss';
import { AppMenu } from "./AppMenu/AppMenu";
import { EditorTable } from './EditorTable';

export const MainEditor = () => {

  return (<main className="main-editor">
    <AppMenu />
    <div className='container'>
      <EditorTable />
    </div>
  </main>);
}
