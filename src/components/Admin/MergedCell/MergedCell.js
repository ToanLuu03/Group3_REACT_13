const calculateRowSpan = (data, index, fieldName) => {
    const previousRecord = index > 0 ? data[index - 1][fieldName] : null;
    const currentValue = data[index][fieldName];
  
    let rowSpan = 1;
    if (currentValue === previousRecord) {
      rowSpan = 0;
    } else {
      let count = 1;
      while (index + count < data.length && currentValue === data[index + count][fieldName]) {
        count++;
      }
      rowSpan = count;
    }
    return rowSpan;
  };
  
  const MergedCell = ({ value, data, index, fieldName, className = "" }) => {
    const rowSpan = calculateRowSpan(data, index, fieldName);
  
    return {
      children: <span className={className}>{value}</span>,
      props: { rowSpan },
    };
  };
  
  export default MergedCell;