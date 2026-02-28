import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { mockCars } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

export function PaymentScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const car = mockCars.find(c => c.id === id);

  const { totalPrice } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  if (!car) {
    return <div>Car not found</div>;
  }

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      navigate('/booking-confirmed', {
        state: location.state,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-28 font-sans">
      {/* Header */}
      <div className="bg-background sticky top-0 z-10 px-6 pt-safe-top pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Payment</h1>
      </div>

      <div className="p-4 space-y-5">
        {/* Amount to Pay */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-xs text-gray-600 mb-1">Amount to Pay</p>
          <p className="text-3xl font-bold text-gray-900">₦{totalPrice?.toLocaleString()}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-gray-900">Payment Method</h3>

          <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
            <div className="flex items-center space-x-3 border border-gray-200 rounded-xl p-4">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Card Payment</p>
                    <p className="text-xs text-gray-600">Pay with debit or credit card</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 border border-gray-200 rounded-xl p-4">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">RideNaira Wallet</p>
                    <p className="text-xs text-gray-600">Balance: ₦0</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-gray-900">Card Details</h3>

            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium mb-2 block text-gray-900">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="h-12 rounded-xl border-gray-200"
                maxLength={19}
              />
            </div>

            <div>
              <Label htmlFor="cardName" className="text-sm font-medium mb-2 block text-gray-900">
                Cardholder Name
              </Label>
              <Input
                id="cardName"
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                className="h-12 rounded-xl border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiry" className="text-sm font-medium mb-2 block text-gray-900">
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  className="h-12 rounded-xl border-gray-200"
                  maxLength={5}
                />
              </div>

              <div>
                <Label htmlFor="cvv" className="text-sm font-medium mb-2 block text-gray-900">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  className="h-12 rounded-xl border-gray-200"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900 leading-relaxed">
            🔒 Your payment information is secure and encrypted. We use industry-standard security measures to protect your data.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <Button
          onClick={handlePayment}
          className="w-full bg-brand hover:brightness-90 text-white h-14 rounded-xl font-semibold text-base"
        >
          Pay ₦{totalPrice?.toLocaleString()}
        </Button>
      </div>
    </div>
  );
}