import StateManagedSelect from "react-select";
import Select from "react-select";
import { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";

import './List.scss';

export type Option = { 
    label: string; 
    value: string; 
};

export const List = (props: React.ComponentProps<typeof Select>) => {

    return (
        <Select
            {...props}
            styles={{
                control: (base: any) => ({
                ...base,
                boxShadow: 'none',
                cursor: 'pointer',
            })}}
            components={{
                IndicatorSeparator: () => null
              }}
        />)
}
