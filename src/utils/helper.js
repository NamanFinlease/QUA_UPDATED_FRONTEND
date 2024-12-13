export const parseDateString = (dateString) => {
    // Regex for different date formats
    const regexISO = /^\d{4}-\d{2}-\d{2}$/;  // YYYY-MM-DD
    const regexUS = /^\d{2}\/\d{2}\/\d{4}$/; // MM/DD/YYYY
    const regexEU = /^\d{2}\/\d{2}\/\d{4}$/; // DD/MM/YYYY
    const regexDashEU = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY

    let parsedDate = null;

    if (regexISO.test(dateString)) {
        parsedDate = new Date(dateString);
    } else if (regexUS.test(dateString)) {
        const [month, day, year] = dateString.split('/');
        parsedDate = new Date(`${year}-${month}-${day}`);
    } else if (regexEU.test(dateString)) {
        const [day, month, year] = dateString.split('/');
        parsedDate = new Date(`${year}-${month}-${day}`);
    } else if (regexDashEU.test(dateString)) {
        const [day, month, year] = dateString.split('-');
        parsedDate = new Date(`${year}-${month}-${day}`);
    }

    return !isNaN(parsedDate.getTime()) ? parsedDate : null;
};

export const compareDates = (dateString1, dateString2) => {
    const date1 = formatDate(dateString1);
    const date2 = formatDate(dateString2);

    if (!date1 || !date2) {
        return "Invalid date format";
    }

    return date1 === date2
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
    
    // Format as dd/mm/yyyy and time as hh:mm:ss
    const formattedDate = `${day}/${month}/${year}`;

  
    return formattedDate;
  }