export const parseDate = (dateString) => {
    const normalizedString = dateString.replace(/-/g, '/'); // Replace "-" with "/"
    const [day, month, year] = normalizedString.split('/'); // Split the string
    return new Date(`${year}-${month}-${day}`); // Convert to yyyy-mm-dd format for Date
  };




// convert Date
export function formatDateTime(dateString) {
    const date = new Date(dateString);
    
    // Extract the date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const year = date.getFullYear();
    
    // Extract the time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Format as dd/mm/yyyy and time as hh:mm:ss
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
  
    return `${formattedDate} ${formattedTime}`;
  }

  export function formatDate(dateString) {
      const date = new Date(dateString);
      
      // Extract the date components
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
      const year = date.getFullYear();
      
      // Format as dd/mm/yyyy 
      const formattedDate = `${day}/${month}/${year}`;
      
  
    return formattedDate;
  }

  export const compareDates = (dateString1, dateString2) => {
    const date1 = parseDate(dateString1);
    const date2 = parseDate(dateString2);
    
    if (!date1 || !date2) {
        return "Invalid date format";
    }

    return date1.getTime() === date2.getTime()
};