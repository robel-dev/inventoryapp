import { useState, useEffect } from 'react'

export default function AddEditExpenseModal({ closeModal, onSubmit, editingExpense }) {
  const [formData, setFormData] = useState({
    expense_type: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        expense_type: editingExpense.expense_type,
        amount: editingExpense.amount.toString(),
        date: editingExpense.date,
        description: editingExpense.description || ''
      })
    }
  }, [editingExpense])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.expense_type) {
      newErrors.expense_type = 'Expense type is required'
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      })
    } else {
      setErrors(validationErrors)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expense Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Expense Type
            </label>
            <select
              name="expense_type"
              value={formData.expense_type}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md bg-primary text-foreground border ${
                errors.expense_type ? 'border-red-500' : 'border-gray-700'
              } focus:border-accent focus:ring-1 focus:ring-accent`}
            >
              <option value="">Select expense type</option>
              <option value="Paper">Paper</option>
              <option value="Ink">Ink</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
            {errors.expense_type && (
              <p className="mt-1 text-sm text-red-500">{errors.expense_type}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                className={`w-full p-2 pl-7 rounded-md bg-primary text-foreground border ${
                  errors.amount ? 'border-red-500' : 'border-gray-700'
                } focus:border-accent focus:ring-1 focus:ring-accent`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md bg-primary text-foreground border ${
                errors.date ? 'border-red-500' : 'border-gray-700'
              } focus:border-accent focus:ring-1 focus:ring-accent`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Add any additional details..."
            />
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition duration-300"
            >
              {editingExpense ? 'Update' : 'Add'} Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}