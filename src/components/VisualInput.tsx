import React from 'react';
import './VisualInput.scss';
import { onKeyDownVisualInput } from './VisualInputEvents';

export type VisualInputProps = {
  value: string;
  id?: string;
  onChange?(str: string): void;
  onBlur?(): void;
}

export const VisualInput = ({ value, id, onChange, onBlur }: VisualInputProps) => {
  return (<input 
    id={id}
    onKeyDown={(e) => onKeyDownVisualInput(e)}
    className='visual-input' 
    onBlur={onBlur}
    value={value} 
    onChange={e => onChange ? onChange(e.target.value) : null} />)
}
