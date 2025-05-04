'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AddOrEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealId = searchParams.get('id');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calories: '',
    tags: '',
    satisfaction: '',
    image: ''
  });

  // Fetch meal data when editing
  useEffect(() => {
    if (mealId) {
      const fetchMeal = async () => {
        try {
          console.time('mealFetchTime');
          const response = await fetch('/api/meals / ${ mealId }');

          if (!response.ok) {
            throw new Error('HTTP error! status: ${ response.status }');
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Response isn't JSON");
          }

          const data = await response.json();

          setFormData({
            title: data.title,
            description: data.description,
            calories: data.calories.toString(),
            tags: data.tags?.map(t => t.name).join(', ') || '',
            satisfaction: data.satisfaction.toString(),
            image: data.image || ''
          });
        } catch (error) {
          console.error('Fetch error:', error);
          router.push('/');
        }

      };
      fetchMeal();
    }
  }, [mealId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const meal = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      calories: parseInt(formData.calories),
      satisfaction: parseInt(formData.satisfaction),
      userId: 1
    };

    const url = mealId ? '/api/meals / ${ mealId }' : '/api/meals';
    const method = mealId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meal),
    });


    if (response.ok) router.push('/');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <h1>{mealId ? 'Edit Meal' : 'Add New Meal'}</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Meal Title" value={formData.title} onChange={handleChange} required />
        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
        <input type="number" name="calories" placeholder="Calories" value={formData.calories} onChange={handleChange} />
        <textarea name="description" placeholder="Meal Description" value={formData.description} onChange={handleChange} />
        <input type="number" name="satisfaction" placeholder="Satisfaction (1-5)" min="1" max="5"
          value={formData.satisfaction} onChange={handleChange} />
        <input type="url" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
        <button type="submit">
          {mealId ? 'Update Meal' : 'Save Meal'}
        </button>
      </form>
    </div>
  );
}