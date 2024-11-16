// Format currency values
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }
  
  // Format date values
  export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }
  
  // Handle Supabase errors
  export const handleSupabaseError = (error) => {
    console.error('Error:', error)
    return error?.message || 'An unexpected error occurred'
  }
  
  // Validate number input
  export const validateNumber = (value) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= 0
  }

  