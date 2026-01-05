export default function CartDrawer({ cart, setCart, isOpen, onClose }) {
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500">
          ✖
        </button>
      </div>

      {/* Items */}
      <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-4 border-b pb-2"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1 ml-3">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.price}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="p-4 border-t">
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
