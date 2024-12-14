import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import AddEditExpenseModal from '../components/modals/AddEditExpenseModal'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Unable to connect to database')
      setLoading(false)
      return
    }

    fetchExpenses()

    const expensesChannel = supabase
      .channel('expenses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        () => fetchExpenses()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(expensesChannel)
    }
  }, [])

  async function fetchExpenses() {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setExpenses(data || [])
    } catch (err) {
      setError('Error fetching expenses: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expenseData) => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()

      if (error) throw error
      
      setIsModalOpen(false)
      await fetchExpenses()
    } catch (err) {
      setError('Error adding expense: ' + err.message)
    }
  }

  const handleUpdateExpense = async (expenseData) => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', editingExpense.id)

      if (error) throw error

      setIsModalOpen(false)
      setEditingExpense(null)
      await fetchExpenses()
    } catch (err) {
      setError('Error updating expense: ' + err.message)
    }
  }

  const handleDeleteExpense = async (id) => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchExpenses()
    } catch (err) {
      setError('Error deleting expense: ' + err.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
            <button
              onClick={() => {
                setEditingExpense(null)
                setIsModalOpen(true)
              }}
              className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Add New Expense
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Expenses Summary */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Summary</h2>
              <div className="bg-primary p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(calculateTotalExpenses())}
                </p>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Expenses</h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="bg-primary p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-foreground">{expense.expense_type}</h3>
                          <p className="text-sm text-gray-400">{formatDate(expense.date)}</p>
                          {expense.description && (
                            <p className="text-sm text-gray-300 mt-1">{expense.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium text-foreground">
                            {formatCurrency(expense.amount)}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => {
                                setEditingExpense(expense)
                                setIsModalOpen(true)
                              }}
                              className="text-sm text-accent hover:text-accent/80"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-sm text-red-500 hover:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
      
      {isModalOpen && (
        <AddEditExpenseModal
          closeModal={() => {
            setIsModalOpen(false)
            setEditingExpense(null)
          }}
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          editingExpense={editingExpense}
        />
      )}
    </div>
  )
}