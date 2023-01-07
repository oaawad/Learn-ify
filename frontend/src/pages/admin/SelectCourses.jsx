import React from 'react';
import Select from 'react-select';
// react - select / dist / react - select.css;
const fruitsList = [
  { label: 'Mango', value: 'mg' },
  { label: 'Guava', value: 'gv' },
  { label: 'Peach', value: 'pc' },
  { label: 'Apple', value: 'ap' },
];

const statesList = [
  { label: 'MN', value: 'MN' },
  { label: 'CA', value: 'CA' },
  { label: 'CT', value: 'CT' },
  { label: 'MI', value: 'MI' },
];

const DropDown = (props) => {
  const options = props.multi
    ? [{ label: 'Select All', value: 'all' }, ...props.options]
    : props.options;
  console.log(options);
  return (
    <div className={`react-select-wrapper ${props.multi ? 'multi' : ''}`}>
      <Select
        name="example"
        options={options}
        multi={props.multi}
        value={props.value ? props.value : null}
        onChange={(selected) => {
          props.multi && selected.length && selected.find((option) => option.value === 'all')
            ? props.handleChange(options.slice(1))
            : !props.multi
            ? props.handleChange((selected && selected.value) || null)
            : props.handleChange(selected);
        }}
      />
    </div>
  );
};

function SelectCourses() {
  const [fruits, setFruits] = React.useState(fruitsList);
  const [states, setStates] = React.useState(statesList);

  const handleChange = (value) => setFruits({ fruits: value });
  const updateState = (value) => setStates({ states: value });

  return (
    <div>
      <DropDown value={fruits} options={fruits} handleChange={handleChange} multi={true} />
      {fruits && <p>{JSON.stringify(fruits)}</p>}
      <br />
      <DropDown value={states} options={states} handleChange={updateState} />
      {states && <p>{JSON.stringify(states)}</p>}
    </div>
  );
}

export default SelectCourses;
