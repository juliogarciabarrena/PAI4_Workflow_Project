import React, { useState } from 'react';
import './CelestialBodyForm.css';

function CelestialBodyForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Terrestrial',
    diameter: '',
    distance: '',
    moons: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const celestialTypes = [
    'Terrestrial',
    'Gas Giant',
    'Dwarf Planet',
    'Star',
    'Comet',
    'Asteroid'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.diameter) {
      newErrors.diameter = 'Diameter is required';
    } else if (isNaN(formData.diameter) || parseFloat(formData.diameter) <= 0) {
      newErrors.diameter = 'Diameter must be a positive number';
    }

    if (!formData.distance) {
      newErrors.distance = 'Distance is required';
    } else if (isNaN(formData.distance) || parseFloat(formData.distance) < 0) {
      newErrors.distance = 'Distance must be a non-negative number';
    }

    if (!formData.moons) {
      newErrors.moons = 'Moons count is required';
    } else if (isNaN(formData.moons) || parseInt(formData.moons) < 0) {
      newErrors.moons = 'Moons count must be a non-negative integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        type: formData.type,
        diameter: parseFloat(formData.diameter),
        distance: parseFloat(formData.distance),
        moons: parseInt(formData.moons)
      };

      await onSubmit(submitData);

      // Reset form after successful submission
      setFormData({
        name: '',
        type: 'Terrestrial',
        diameter: '',
        distance: '',
        moons: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <h2>🌟 Create New Celestial Body</h2>
        <p>Add a new planet, asteroid, or star to your collection</p>
      </div>

      <form className="celestial-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            <span className="label-text">Name *</span>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Neptune, Proxima Centauri"
              className={errors.name ? 'error' : ''}
              disabled={isSubmitting}
              maxLength="50"
            />
            <span className="char-count">{formData.name.length}/50</span>
          </label>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">
            <span className="label-text">Type *</span>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? 'error' : ''}
              disabled={isSubmitting}
            >
              {celestialTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="diameter">
              <span className="label-text">Diameter (km) *</span>
              <input
                type="number"
                id="diameter"
                name="diameter"
                value={formData.diameter}
                onChange={handleChange}
                placeholder="e.g., 12742"
                className={errors.diameter ? 'error' : ''}
                disabled={isSubmitting}
                step="0.01"
                min="0"
              />
            </label>
            {errors.diameter && <span className="error-message">{errors.diameter}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="distance">
              <span className="label-text">Distance from Sun (M km) *</span>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g., 149.6"
                className={errors.distance ? 'error' : ''}
                disabled={isSubmitting}
                step="0.01"
                min="0"
              />
            </label>
            {errors.distance && <span className="error-message">{errors.distance}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="moons">
            <span className="label-text">Number of Moons *</span>
            <input
              type="number"
              id="moons"
              name="moons"
              value={formData.moons}
              onChange={handleChange}
              placeholder="e.g., 1"
              className={errors.moons ? 'error' : ''}
              disabled={isSubmitting}
              step="1"
              min="0"
            />
          </label>
          {errors.moons && <span className="error-message">{errors.moons}</span>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Creating...' : '✓ Create Celestial Body'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ✕ Cancel
          </button>
        </div>

        <div className="form-info">
          <p>* All fields are required</p>
          <p className="form-types">
            Types: Terrestrial, Gas Giant, Dwarf Planet, Star, Comet, Asteroid
          </p>
        </div>
      </form>
    </div>
  );
}

export default CelestialBodyForm;