'use client'; 

import React, { useState, useEffect } from 'react';

// Определяем, как выглядит объект контакта
interface Contact {
  id: string;
  name: string;
  role: string;
  status: 'New' | 'Contacted' | 'Replied' | 'Archived';
  profileText: string;
  analysis: string;
  generatedMessage: string;
  conversation: { author: 'user' | 'client'; text: string }[];
}

// Начальный список контактов для примера
const initialContacts: Contact[] = [
  { id: '1', name: 'Илья Вернер', role: 'Co-founder at SCULPT AI', status: 'Replied', profileText: '', analysis: '', generatedMessage: '', conversation: [] },
  { id: '2', name: 'Евгений Смирнов', role: 'Head of Product at Awesome Inc.', status: 'Contacted', profileText: '', analysis: '', generatedMessage: '', conversation: [] },
  { id: '3', name: 'Дарья Камышина', role: 'Lead PM at Tech Innovations', status: 'New', profileText: '', analysis: '', generatedMessage: '', conversation: [] },
];

export default function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Состояние для индикатора загрузки
  const [error, setError] = useState<string | null>(null); // Состояние для ошибок

  // Загрузка контактов из памяти браузера при первом запуске
  useEffect(() => {
    try {
      const savedContacts = localStorage.getItem('sculpt_contacts');
      if (savedContacts && savedContacts !== '[]') {
        const parsedContacts = JSON.parse(savedContacts);
        setContacts(parsedContacts);
        setSelectedContactId(parsedContacts[0]?.id || null);
      } else {
        setContacts(initialContacts);
        setSelectedContactId(initialContacts[0]?.id || null);
      }
    } catch (error) {
      console.error("Failed to load contacts from local storage", error);
      setContacts(initialContacts);
      setSelectedContactId(initialContacts[0]?.id || null);
    }
  }, []);

  // Сохранение контактов в память при их изменении
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('sculpt_contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  // Функция для обновления любого поля в конкретном контакте
  const updateContactField = (contactId: string, field: keyof Contact, value: any) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, [field]: value } : c));
  };

  // Функция вызова AI для анализа профиля
  const handleAnalysis = async () => {
    if (!selectedContactId) return;
    
    const contact = contacts.find(c => c.id === selectedContactId);
    if (!contact || !contact.profileText) {
        alert('Пожалуйста, вставьте текст профиля для анализа.');
        return;
    }

    setIsLoading(true);
    setError(null);
    updateContactField(selectedContactId, 'analysis', '');
    updateContactField(selectedContactId, 'generatedMessage', '');

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileText: contact.profileText })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Ошибка при генерации ответа');
        }

        const data = await response.json();
        updateContactField(selectedContactId, 'analysis', data.analysis);
        updateContactField(selectedContactId, 'generatedMessage', data.message);

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
        setError(errorMessage);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  // Функция добавления нового контакта
  const handleAddContact = () => {
    const name = prompt('Введите имя нового контакта:');
    if (name) {
      const newContact: Contact = {
        id: new Date().toISOString(),
        name,
        role: 'Должность/Компания',
        status: 'New',
        profileText: '', analysis: '', generatedMessage: '', conversation: []
      };
      setContacts(prev => [newContact, ...prev]);
      setSelectedContactId(newContact.id);
    }
  };
  
  // Функция удаления контакта
  const handleDeleteContact = (idToDelete: string) => {
    if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
        const updatedContacts = contacts.filter(c => c.id !== idToDelete);
        setContacts(updatedContacts);
        if(selectedContactId === idToDelete) {
            setSelectedContactId(updatedContacts[0]?.id || null);
        }
    }
  }

  // Функция смены статуса
  const handleStatusChange = (contactId: string, newStatus: Contact['status']) => {
      updateContactField(contactId, 'status', newStatus);
  }

  // Фильтрация контактов для поиска
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Поиск выбранного контакта в общем списке
  const selectedContact = contacts.find(c => c.id === selectedContactId);

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="title">SCULPT Outreach</h1>
          <input type="text" placeholder="🔍 Поиск контакта..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="contact-list">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className={`contact-item ${contact.id === selectedContactId ? 'active' : ''}`} onClick={() => setSelectedContactId(contact.id)}>
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <span className={`status ${contact.status.toLowerCase()}`}>{contact.status}</span>
              </div>
              <p>{contact.role}</p>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button className="btn btn-primary" onClick={handleAddContact}>+ Добавить контакт</button>
        </div>
      </aside>

      <main className="main-content">
        {selectedContact ? (
          <>
            <div className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                    <h2 className="card-title" style={{ margin: 0 }}>Профиль: {selectedContact.name}</h2>
                    <div>
                        <select value={selectedContact.status} onChange={(e) => handleStatusChange(selectedContact.id, e.target.value as Contact['status'])} className="status-select">
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Replied">Replied</option>
                            <option value="Archived">Archived</option>
                        </select>
                        <button onClick={() => handleDeleteContact(selectedContact.id)} className="delete-btn">🗑️</button>
                    </div>
                </div>
                <textarea
                    key={selectedContact.id} // This forces re-render on contact switch
                    placeholder="Вставьте сюда полный текст со страницы LinkedIn..."
                    className="textarea"
                    style={{ height: '160px' }}
                    defaultValue={selectedContact.profileText}
                    onChange={(e) => updateContactField(selectedContact.id, 'profileText', e.target.value)}
                />
                <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={handleAnalysis} disabled={isLoading}>
                    {isLoading ? 'Анализ...' : 'Провести анализ (Этап 1)'}
                </button>
            </div>
            {error && <div className="error-box"><strong>Ошибка:</strong> {error}</div>}
            
            <div className="card">
                <h2 className="card-title">Результат Анализа (Этап 1)</h2>
                <div className="message-box" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedContact.analysis || 'Здесь появится результат анализа...'}
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Сгенерированное сообщение (Этап 2)</h2>
                <div className="message-box" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedContact.generatedMessage || 'Здесь появится готовое сообщение для отправки...'}
                </div>
            </div>
          </>
        ) : (
          <div className="card">
            <h2 className="card-title">Контакты не найдены</h2>
            <p>Добавьте свой первый контакт, чтобы начать работу.</p>
          </div>
        )}
      </main>
      <style jsx>{`
        .status-select { background-color: #374151; color: #e5e7eb; border: 1px solid #4b5563; border-radius: 6px; padding: 4px 8px; margin-right: 12px; }
        .delete-btn { background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 1.2rem; }
        .delete-btn:hover { color: #ef4444; }
        .error-box { background-color: #4a1d1d; border: 1px solid #ef4444; color: #fecaca; padding: 12px; border-radius: 8px; }
      `}</style>
    </div>
  );
}

