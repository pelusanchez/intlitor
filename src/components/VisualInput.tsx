import './VisualInput.scss';

export type VisualInputProps = {
  value: string;
  onChange?(str: string): void;
}

export const VisualInput = ({ value, onChange }: VisualInputProps) => {
  return (<input className='visual-input' value={value} onChange={e => onChange ? onChange(e.target.value) : null} />)
}
