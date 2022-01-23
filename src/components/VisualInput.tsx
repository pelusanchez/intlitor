import React from 'react';
import './VisualInput.scss';

export type VisualInputProps = {
  value: string;
  id?: string;
  onChange?(str: string): void;
  onBlur?(): void;
}

const onKeyDownVisualInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  let dX = 0,
      dY = 0;

  switch (e.key) {
    case 'ArrowLeft':
      dX = -1;
      break;
    case 'ArrowRight':
      dX = 1;
      break;
    case 'ArrowUp':
      dY = -1;
      break;
    case 'ArrowDown':
      dY = 1;
      break;
    default:
      return; 
  }

  const [ name, xString, yString ] = (e.target as HTMLInputElement).getAttribute('id')!.split('-');
  const x = parseInt(xString);
  const y = parseInt(yString);
  const nextX = (x + dX) % 3;
  const nextY = y + dY;
  const elementExists = document.getElementById(`input-${nextX}-${nextY}`);
  if (elementExists) {
    elementExists.focus();
    e.stopPropagation();
    e.preventDefault();
  }

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
