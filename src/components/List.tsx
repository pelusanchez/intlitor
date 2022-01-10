import Select from "react-select";

import './List.scss';

export type Option = { 
    label: string; 
    value: string; 
};

export type ListProps = {
    value?: Option;
    options: Option[];
    onChange(option: Option): void;
    isMulti?: boolean;
};

export const List = ({ value, options, onChange, ...other }: ListProps) => {

    return (
        <Select
            {...other}
            styles={{
                control: (base: any) => ({
                ...base,
                border: 0,
                borderRadius: 0,
                boxShadow: 'none',
                marginTop: '-10px',
                cursor: 'pointer',
            })}}
            components={{
                IndicatorSeparator: () => null
              }}
            value={value}
            options={options}
            onChange={v => onChange(v as any)}
        />)
}
