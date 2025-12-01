import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getSubtotal, getTaxes, getTotal } = useCart();

  const subtotal = getSubtotal();
  const tax = getTaxes(subtotal);
  const total = getTotal();

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">Commencez à explorer notre catalogue pour ajouter des livres.</p>
          <Link
            to="/books"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Voir le catalogue
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Livre</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-900">Prix</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-900">Quantité</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-900">Total</th>
                  <th className="text-right px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const priceInCents = item.price_cents || (item.price * 100);
                  const itemTotal = priceInCents * item.quantity;
                  return (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.author}</p>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4 text-gray-900">
                        {(priceInCents / 100).toFixed(2)}€
                      </td>
                      <td className="text-center px-6 py-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center"
                        />
                      </td>
                      <td className="text-right px-6 py-4 font-semibold text-gray-900">
                        {(itemTotal / 100).toFixed(2)}€
                      </td>
                      <td className="text-right px-6 py-4">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Continue Shopping */}
          <Link
            to="/books"
            className="inline-block mt-6 text-primary hover:text-secondary font-semibold transition"
          >
            ← Continuer vos achats
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Récapitulatif</h2>

            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold text-gray-900">{(subtotal / 100).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%)</span>
                <span className="font-semibold text-gray-900">{(tax / 100).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-semibold text-green-600">Gratuite</span>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-lg font-bold text-gray-900">Total TTC</span>
              <span className="text-3xl font-bold text-primary">{(total / 100).toFixed(2)}€</span>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Procéder au paiement
            </Link>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">✓ Livraison sécurisée</p>
              <p className="mb-2">✓ Retours gratuits 30 jours</p>
              <p>✓ Paiement sécurisé Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
