

export const regexPatterns = {
    onlyNumbers: /^[0-9]+(\.[0-9]{1,2})?$/, // Allows positive numbers with optional decimal
    loanRecommended: /^[0-9]{1,5}$/, // Allows numbers up to 5 digits
    percentage: /^(100|[1-9]?[0-9])$/, // Allows numbers from 0 to 100
    
  };