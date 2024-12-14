import { useState, useEffect } from 'react'

export default function AddEditItemModal({ closeModal, onSubmit, editingItem }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
    unit_price: '',
    reorder_level: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        quantity: editingItem.quantity.toString(),
        category: editingItem.category,
        unit_price: editingItem.unit_price.toString(),
        reorder_level: editingItem.reorder_level?.toString() || '10'
      })
    }
  }, [editingItem])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      newErrors.unit_price = 'Valid price is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData)
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
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md bg-primary text-foreground border ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              } focus:border-accent focus:ring-1 focus:ring-accent`}
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Quantity Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              className={`w-full p-2 rounded-md bg-primary text-foreground border ${
                errors.quantity ? 'border-red-500' : 'border-gray-700'
              } focus:border-accent focus:ring-1 focus:ring-accent`}
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md bg-primary text-foreground border ${
                errors.category ? 'border-red-500' : 'border-gray-700'
              } focus:border-accent focus:ring-1 focus:ring-accent`}
            >
              <option value="">Select a category</option>
              <option value="Stationery">Stationery</option>
              <option value="Birthday Items">Birthday Items</option>
              <option value="Candy and Sweets">Candy and Sweets</option>
              <option value="Jewelry Items">Jewelry Items</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Unit Price Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Unit Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full p-2 pl-7 rounded-md bg-primary text-foreground border ${
                  errors.unit_price ? 'border-red-500' : 'border-gray-700'
                } focus:border-accent focus:ring-1 focus:ring-accent`}
                placeholder="0.00"
              />
            </div>
            {errors.unit_price && (
              <p className="mt-1 text-sm text-red-500">{errors.unit_price}</p>
            )}
          </div>

          {/* Reorder Level Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Reorder Level
            </label>
            <input
              type="number"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleInputChange}
              min="0"
              className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Enter reorder level"
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
              {editingItem ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}