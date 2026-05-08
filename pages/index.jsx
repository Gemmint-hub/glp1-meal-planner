import React, { useState } from 'react';

export default function GLP1Planner() {
  const [step, setStep] = useState('onboarding');
  const [formData, setFormData] = useState({
    name: '',
    sideEffects: [],
    dietaryRestrictions: [],
    budget: 'moderate',
    cuisinePreferences: []
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sideEffectOptions = [
    { id: 'nausea', label: 'Nausea' },
    { id: 'constipation', label: 'Constipation' },
    { id: 'fatigue', label: 'Low energy' },
    { id: 'none', label: 'None' }
  ];

  const restrictionOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'glutenfree', label: 'Gluten-free' },
    { id: 'dairyfree', label: 'Dairy-free' }
  ];

  const handleCheckbox = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const generatePlan = async () => {
    if (!formData.name) {
      setError('Please enter your name');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setMealPlan(data);
      setStep('results');
    } catch (err) {
      setError('Could not generate plan. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {step === 'onboarding' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 500, margin: '0 0 0.5rem', color: '#1a1a1a' }}>
              GLP-1 Meal Planner
            </h1>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
              Personalized plans for your health goals
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Current side effects
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {sideEffectOptions.map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.sideEffects.includes(opt.id)}
                    onChange={() => handleCheckbox('sideEffects', opt.id)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Dietary restrictions
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {restrictionOptions.map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.dietaryRestrictions.includes(opt.id)}
                    onChange={() => handleCheckbox('dietaryRestrictions', opt.id)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Budget preference
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="budget">Budget-friendly</option>
              <option value="moderate">Moderate</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          {error && (
            <div style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button
            onClick={generatePlan}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#ccc' : '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating your plan...' : 'Generate My Meal Plan'}
          </button>
        </div>
      )}

      {step === 'results' && mealPlan && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 500, margin: '0 0 0.5rem' }}>
              Your Personalized Plan
            </h1>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
              {mealPlan.intro}
            </p>
          </div>

          {mealPlan.days && mealPlan.days.map((day, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '0.75rem' }}>
                Day {day.day}
              </h2>
              {day.meals && day.meals.map((meal, mIdx) => (
                <div
                  key={mIdx}
                  style={{
                    background: '#f5f5f5',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '0.75rem'
                  }}
                >
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.5rem' }}>
                    {meal.name}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '12px', color: '#666', marginBottom: '0.75rem' }}>
                    <div>{meal.calories || meal.portion} cal</div>
                    <div>{meal.protein || 20}g protein</div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                    {meal.tip}
                  </p>
                </div>
              ))}
            </div>
          ))}

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '0.75rem' }}>
              Shopping List
            </h2>
            <div style={{ background: '#f5f5f5', border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {mealPlan.shopping && mealPlan.shopping.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '13px', marginBottom: '0.5rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {mealPlan.tips && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '0.75rem' }}>
                Tips for Success
              </h2>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {mealPlan.tips.map((tip, idx) => (
                  <li key={idx} style={{ fontSize: '13px', marginBottom: '0.5rem' }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setStep('onboarding');
              setMealPlan(null);
            }}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.75rem',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Create Another Plan
          </button>
        </div>
      )}
    </div>
  );
}
