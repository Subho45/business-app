import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('/api/contacts');
        setContacts(res.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Contact Messages</h1>
      {contacts.length === 0 ? (
        <p className="no-contacts">No contact messages yet.</p>
      ) : (
        <div className="contacts-list">
          {contacts.map(contact => (
            <div key={contact.id} className="contact-item">
              <h3>{contact.name}</h3>
              <p><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
              <p><strong>Message:</strong> {contact.message}</p>
              <small>{new Date(contact.submitted_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;