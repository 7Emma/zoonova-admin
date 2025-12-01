import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../contexts/CartContext';
import { ordersService, countriesService, paymentsService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getSubtotal, getTaxes, getTotal, setCountry, shippingCountry } = useCart();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState('1');

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    voie: '',
    numero_voie: '',
    complement_adresse: '',
    code_postal: '',
    ville: '',
  });

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const response = await countriesService.getCountries();
        setCountries(response.results || []);
        
        // Défini le premier pays par défaut
        if (response.results && response.results.length > 0) {
          setCountry(response.results[0]);
          setSelectedCountryId(response.results[0].id.toString());
        }
      } catch (error) {
        console.error('Erreur lors du chargement des pays:', error);
        setAlert({
          type: 'error',
          message: 'Erreur lors du chargement des pays de livraison',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const countryId = parseInt(e.target.value);
    const selectedCountry = countries.find((c) => c.id === countryId);
    
    if (selectedCountry) {
      setCountry(selectedCountry);
      setSelectedCountryId(countryId.toString());
    }
  };

  const validateForm = () => {
    const required = [
      'email',
      'first_name',
      'last_name',
      'voie',
      'numero_voie',
      'code_postal',
      'ville',
    ];

    for (const field of required) {
      if (!formData[field] || formData[field].trim() === '') {
        setAlert({
          type: 'error',
          message: `Le champ ${field.replace(/_/g, ' ')} est obligatoire`,
        });
        return false;
      }
    }

    // Valide le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlert({
        type: 'error',
        message: 'Veuillez entrer une adresse email valide',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setAlert(null);

    try {
      // Prépare les données de la commande
      const orderPayload = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || '',
        voie: formData.voie,
        numero_voie: formData.numero_voie,
        complement_adresse: formData.complement_adresse || '',
        code_postal: formData.code_postal,
        ville: formData.ville,
        country: selectedCountryId,
        items: cartItems.map((item) => ({
          book_id: item.id,
          quantity: item.quantity,
        })),
      };

      // Crée la commande
      const orderResponse = await ordersService.createOrder(orderPayload);
      
      if (!orderResponse.order) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const orderId = orderResponse.order.id;

      // Crée la session de paiement Stripe
      const paymentResponse = await paymentsService.createCheckoutSession(orderId);

      if (paymentResponse.checkout_url) {
        // Redirige vers Stripe Checkout
        window.location.href = paymentResponse.checkout_url;
      } else {
        throw new Error('Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Erreur checkout:', error);
      
      let errorMessage = 'Erreur lors du traitement de votre commande';
      
      if (error.data?.items) {
        errorMessage = Array.isArray(error.data.items)
          ? error.data.items[0]
          : error.data.items;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getSubtotal();
  const taxes = getTaxes(subtotal);
  const total = getTotal();

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">Votre panier est vide</p>
        </div>
      </MainLayout>
    );
  }

  // Convertit les centimes en euros pour l'affichage
  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Paiement</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Informations de livraison</h2>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Prénom et Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Rue et Numéro */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="voie"
                  value={formData.voie}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Rue de la Paix"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Numéro <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="numero_voie"
                  value={formData.numero_voie}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Complément d'adresse */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Complément d'adresse (optionnel)
              </label>
              <input
                type="text"
                name="complement_adresse"
                value={formData.complement_adresse}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Appartement 5"
              />
            </div>

            {/* Ville, Code postal, Pays */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Code postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Pays <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCountryId}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.id.toString()}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
            >
              {isProcessing ? 'Traitement...' : 'Procéder au paiement Stripe'}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Récapitulatif</h2>

            <div className="mb-6 border-b border-gray-200 pb-6 max-h-64 overflow-y-auto">
              {cartItems.map((item) => {
                const itemPrice = item.price_cents || item.price * 100;
                const itemTotal = itemPrice * item.quantity;
                return (
                  <div key={item.id} className="flex justify-between mb-4">
                    <div>
                      <p className="text-gray-900 font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {formatPrice(itemTotal)}€
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="text-gray-900 font-semibold">{formatPrice(subtotal)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%)</span>
                <span className="text-gray-900 font-semibold">{formatPrice(taxes)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="text-green-600 font-semibold">
                  {shippingCountry ? formatPrice(shippingCountry.shipping_cost) : '0.00'}€
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total TTC</span>
                <span className="text-3xl font-bold text-primary">{formatPrice(total)}€</span>
              </div>
            </div>

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
