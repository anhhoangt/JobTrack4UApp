const FormRowSelect = ({ labelText, name, value, handleChange, list, formatOption }) => {
  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className='form-select'
      >
        {list.map((itemValue, index) => {
          const displayValue = formatOption ? formatOption(itemValue) : itemValue;
          return (
            <option key={index} value={itemValue}>
              {displayValue}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default FormRowSelect
