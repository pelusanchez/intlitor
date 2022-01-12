import React from 'react';
import { useLocales } from '../services/locale.service';
import { AppContext } from '../store/AppProvider';
import { List, Option } from './List';

import './Modal.scss';

export type LanguageModalProps = {
  onSave(): void;
}

export const LanguageModal = ({ onSave }: LanguageModalProps) => {

  const { state, dispatch } = React.useContext(AppContext);

  const { locales } = useLocales();
  const localesMap = React.useMemo(() => Object.fromEntries(locales.map(l => [l.value, l])), [locales]);
  const currentLanguages = state.editor.languages?.filter(l => !!l) || [];
  
  const updateLanguage = (language: string[]) => {
    const nextState = { 
      ...state, 
      editor: {
        ...state.editor,
        languages: language,
      } 
    };
    dispatch(nextState);
  }

  const onAddLocale = (selected: Option) => {
    const nextLanguage = [ ...currentLanguages ];
    if (!nextLanguage.includes(selected.value)) {
      nextLanguage.push(selected.value);
    }

    updateLanguage(nextLanguage);
  };

  const onDeleteLanguage = (selected: Option) => {
    const nextLanguage = currentLanguages.filter(l => l !== selected.value);
    updateLanguage(nextLanguage);
  };

  return (<div className='modal-wrapper language-modal'>
      <div className='modal-window language-modal'>
        <div className='modal-title'>
          <span className='modal-title-value'>Project languages</span>
        </div>
        <div className='modal-content'>
          <div className='list-container'>
            <List
              value={{}}              
              onChange={(opt) => onAddLocale(opt as any)}
              options={locales} />
          </div>
          <div className='locales-container'>
            { currentLanguages.map(s => localesMap[s])
              .map(s => (
                <div className='locale'>
                  <div className='locale-text'>{ s.label }</div>
                  <div className='locale-action' onClick={() => onDeleteLanguage(s)}>&times;</div>
                </div>))
            }
          </div>
        </div>
        <div className='modal-buttons'>
          <button onClick={onSave}>Save</button>
        </div>
      </div>
    </div>)
}
