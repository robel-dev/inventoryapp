export default function ErrorAlert({ message, onClose }) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg mb-4 flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-red-100"
          >
            ×
          </button>
        )}
      </div>
    )
  }