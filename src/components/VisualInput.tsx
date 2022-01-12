import './VisualInput.scss';

export type VisualInputProps = {
  value: string;
  onChange?(str: string): void;
  onBlur?(): void;
}

export const VisualInput = ({ value, onChange, onBlur }: VisualInputProps) => {
  return (<input 
    className='visual-input' 
    onBlur={onBlur}
    value={value} 
    onChange={e => onChange ? onChange(e.target.value) : null} />)
}
