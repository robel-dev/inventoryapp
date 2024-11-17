import { useState, useEffect } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AddEditSaleModal({ closeModal, onSubmit, editingSale, inventoryItems, isSubmitting }) {
  const [formData, setFormData] = useState({
    service_type: '',
    items_sold: [],
    payment_type: '',
    total_amount: '0',
    selectedItem: '',
    selectedQuantity: '1'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingSale) {
      setFormData({
        service_type: editingSale.service_type,
        items_sold: editingSale.items_sold,
        payment_type: editingSale.payment_type,
        total_amount: editingSale.total_amount.toString(),
        selectedItem: '',
        selectedQuantity: '1'
      })
    }
  }, [editingSale])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.service_type) {
      newErrors.service_type = 'Service type is required'
    }
    if (formData.items_sold.length === 0) {
      newErrors.items_sold = 'At least one item must be added'
    }
    if (!formData.payment_type) {
      newErrors.payment_type = 'Payment type is required'
    }
    return newErrors
  }

  const handleAddItem = () => {
    if (!formData.selectedItem || !formData.selectedQuantity) return

    const selectedInventoryItem = inventoryItems.find(item => item.id === formData.selectedItem)
    if (!selectedInventoryItem) return

    const newItem = {
      id: selectedInventoryItem.id,
      name: selectedInventoryItem.name,
      quantity: parseInt(formData.selectedQuantity),
      unit_price: selectedInventoryItem.unit_price,
      subtotal: selectedInventoryItem.unit_price * parseInt(formData.selectedQuantity)
    }

    setFormData(prev => ({
      ...prev,
      items_sold: [...prev.items_sold, newItem],
      total_amount: (parseFloat(prev.total_amount) + newItem.subtotal).toString(),
      selectedItem: '',
      selectedQuantity: '1'
    }))
  }

  const removeItem = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      items_sold: prev.items_sold.filter((_, index) => index !== indexToRemove),
      total_amount: prev.items_sold
        .filter((_, index) => index !== indexToRemove)
        .reduce((sum, item) => sum + item.subtotal, 0)
        .toString()
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        service_type: formData.service_type,
        items_sold: formData.items_sold,
        payment_type: formData.payment_type,
        total_amount: parseFloat(formData.total_amount)
      })
    } else {
      setErrors(validationErrors)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {editingSale ? 'Edit Sale' : 'New Sale'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Service Type
            </label>
            <select
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700"
            >
              <option value="">Select service type</option>
              <option value="Printing">Printing</option>
              <option value="Copying">Copying</option>
              <option value="Stationery Sale">Stationery Sale</option>
            </select>
            {errors.service_type && (
              <p className="mt-1 text-sm text-red-500">{errors.service_type}</p>
            )}
          </div>

          {/* Add Items Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Add Items</label>
            <div className="flex gap-2">
              <select
                value={formData.selectedItem}
                onChange={(e) => setFormData({ ...formData, selectedItem: e.target.value })}
                className="flex-1 p-2 rounded-md bg-primary text-foreground border border-gray-700"
              >
                <option value="">Select item</option>
                {inventoryItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} (${item.unit_price})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={formData.selectedQuantity}
                onChange={(e) => setFormData({ ...formData, selectedQuantity: e.target.value })}
                min="1"
                className="w-24 p-2 rounded-md bg-primary text-foreground border border-gray-700"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80"
              >
                Add
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="border border-gray-700 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-primary">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-foreground">Item</th>
                  <th className="px-4 py-2 text-left text-sm text-foreground">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm text-foreground">Price</th>
                  <th className="px-4 py-2 text-left text-sm text-foreground">Subtotal</th>
                  <th className="px-4 py-2 text-sm text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {formData.items_sold.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-foreground">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-foreground">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-foreground">${item.unit_price}</td>
                    <td className="px-4 py-2 text-sm text-foreground">${item.subtotal}</td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Payment Type
            </label>
            <select
              value={formData.payment_type}
              onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
              className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700"
            >
              <option value="">Select payment type</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            {errors.payment_type && (
              <p className="mt-1 text-sm text-red-500">{errors.payment_type}</p>
            )}
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Total Amount
            </label>
            <input
              type="text"
              value={`$${formData.total_amount}`}
              readOnly
              className="w-full p-2 rounded-md bg-gray-700 text-foreground border border-gray-600"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 
                flex items-center space-x-2
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{editingSale ? 'Update' : 'Complete'} Sale</span>
              )}
            </button>
          </div>

          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
              <LoadingSpinner />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}