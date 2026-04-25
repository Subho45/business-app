import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contacts', formData);
      setMessage('Thank you! Your message has been sent.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setMessage('Error sending message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="landing">
      <section className="hero">
        <h1>Welcome to BusinessApp</h1>
        <p>Your complete business solution</p>
      </section>

      <section className="about">
        <h2>About Us</h2>
        <p>We provide innovative solutions for modern businesses. Our platform helps you manage contacts, users, and more with ease.</p>
      </section>

      <section className="contact">
        <h2>Get In Touch</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows="5"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>

      <div className="cta">
        <Link to="/register" className="cta-button">Get Started</Link>
      </div>
    </div>
  );
};

export default LandingPage;