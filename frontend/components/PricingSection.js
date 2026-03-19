import { Check } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Basic',
      price: '$10',
      period: '/per month',
      description: 'Basic features for up to 10 users',
      features: [
        'Up to 10 users',
        'Basic analytics',
        'Email support',
        '1GB storage',
      ],
      popular: false,
    },
    {
      name: 'Business plan',
      price: '$20',
      period: '/per month',
      description: 'Growing teams up to 20 users',
      features: [
        'Up to 20 users',
        'Advanced analytics',
        'Priority support',
        '10GB storage',
        'API access',
      ],
      popular: true,
    },
    {
      name: 'Enterprise Plan',
      price: '$40',
      period: '/per month',
      description: 'Basic features for up to 10 users',
      features: [
        'Unlimited users',
        'Custom analytics',
        '24/7 support',
        'Unlimited storage',
        'Full API access',
        'Custom integrations',
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20" data-testid="pricing-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-purple-900/30 border border-purple-500/30 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            A Plan for Every Need
          </h2>
          <p className="text-gray-900 max-w-2xl mx-auto">
            FluxMind unites marketers, designers, and developers to create,
            manage, and optimize impactful web experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              data-testid={`pricing-card-${plan.name.toLowerCase().replace(' ', '-')}`}
              className={`gradient-card rounded-2xl p-8 relative ${
                plan.popular ? 'border-purple-500/50 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-purple text-white text-xs px-4 py-1 rounded-full font-semibold">
                  Popular
                </span>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600 text-sm">{plan.period}</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-gray-900" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'gradient-purple text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50' 
                    : 'border border-purple-500/30 text-gray-900 hover:bg-purple-900/20'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
