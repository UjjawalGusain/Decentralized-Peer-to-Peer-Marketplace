import React from "react";

const CartSummary = ({ cart, removeFromCart, total }) => (
  <div>
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold">Cart summary</h3>
      {cart.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">Your cart is empty.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {cart.map((i) => (
            <div key={i._id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-gray-500">Qty: {i.qty}</div>
              </div>
              <div className="text-right">
                <div>{i.currency} {(i.price * i.qty).toLocaleString()}</div>
                <button onClick={() => removeFromCart(i._id)} className="text-xs text-red-500 mt-1">Remove</button>
              </div>
            </div>
          ))}

          <div className="border-t pt-3 flex justify-between font-semibold">
            <div>Total</div>
            <div>₹{total().toLocaleString()}</div>
          </div>

          <button className="w-full mt-3 bg-green-600 text-white py-2 rounded">Checkout</button>
        </div>
      )}
    </div>

    <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
      <h4 className="font-semibold">Need help?</h4>
      <p className="text-sm text-gray-500 mt-2">Call us: <strong>+91 98765 43210</strong></p>
      <p className="text-sm text-gray-500">Email: support@gocartshop.in</p>
    </div>
  </div>
);

export default CartSummary;
