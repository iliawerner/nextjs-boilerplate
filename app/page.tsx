'use client'; // <-- Это важно! Говорит Next.js, что компонент интерактивный.

import React, { useState, useEffect } from 'react';

// Определяем, как выглядит объект контакта
interface Contact {
  id: string;
  name: string;
  role: string;
  status: 'New' | 'Contacted' | 'Replied' | 'Archived';
  profileText?: string;
  analysis?: string;
  generatedMessage?: string;
  conversation?: { author: 'user' | 'client'; text: string }[];
}

// Начальный список контактов для примера
const initialContacts: Contact[] = [
  { id: '1', name: 'Илья Вернер', role: 'Co-founder at SCULPT AI', status: 'Replied' },
  { id: '2', name: 'Евгений Смирнов', role: 'Head of Product at Awesome Inc.', status: 'Contacted' },
  { id: '3', name: 'Дарья Камышина', role: 'Lead PM at Tech Innovations', status: 'New' },
];

export default function HomePage() {
  // --- СОСТОЯНИЕ (State) ---
  // Список всех контактов
  const [contacts, setContacts] = useState<Contact[]>([]);
  // ID выбранного контакта
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  // Текст в поле поиска
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- ЛОГИКА ---

  // При первой загрузке приложения, пытаемся загрузить контакты из памяти браузера
  useEffect(() => {
    try {
      const savedContacts = localStorage.getItem('sculpt_contacts');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
        setSelectedContactId(JSON.parse(savedContacts)[0]?.id || null);
      } else {
        // Если в памяти ничего нет, используем начальный список
        setContacts(initialContacts);
        setSelectedContactId(initialContacts[0]?.id || null);
      }
    } catch (error) {
      console.error("Failed to load contacts from local storage", error);
      setContacts(initialContacts);
      setSelectedContactId(initialContacts[0]?.id || null);
    }
  }, []); // Пустой массив [] означает, что это выполнится только один раз

  // Когда список контактов меняется, сохраняем его в память браузера
  useEffect(() => {
    if(contacts.length > 0) {
      localStorage.setItem('sculpt_contacts', JSON.stringify(contacts));
    }
  }, [contacts]); // Этот код выполняется каждый раз, когда `contacts` изменяется

  // Функция добавления нового контакта
  const handleAddContact = () => {
    const name = prompt('Введите имя контакта:');
    if (name) {
      const newContact: Contact = {
        id: new Date().toISOString(), // Уникальный ID на основе времени
        name: name,
        role: 'Должность/Компания',
        status: 'New',
      };
      const updatedContacts = [newContact, ...contacts];
      setContacts(updatedContacts);
      setSelectedContactId(newContact.id); // Сразу выбираем новый контакт
    }
  };
  
  // Функция удаления контакта
  const handleDeleteContact = (idToDelete: string) => {
    if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
        const updatedContacts = contacts.filter(c => c.id !== idToDelete);
        setContacts(updatedContacts);
        // Если удалили выбранный контакт, выбираем первый в списке
        if(selectedContactId === idToDelete) {
            setSelectedContactId(updatedContacts[0]?.id || null);
        }
    }
  }

  // Функция смены статуса
  const handleStatusChange = (contactId: string, newStatus: Contact['status']) => {
      setContacts(contacts.map(c => c.id === contactId ? {...c, status: newStatus} : c));
  }

  // Фильтруем контакты на основе текста в поиске
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Находим текущий выбранный контакт
  const selectedContact = contacts.find(c => c.id === selectedContactId);

  // --- ИНТЕРФЕЙС (JSX) ---
  return (
    <div className="container">
      {/* Левая панель: Список контактов */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="title">SCULPT Outreach</h1>
          <input
            type="text"
            placeholder="🔍 Поиск контакта..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="contact-list">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item ${contact.id === selectedContactId ? 'active' : ''}`}
              onClick={() => setSelectedContactId(contact.id)}
            >
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <span className={`status ${contact.status.toLowerCase()}`}>{contact.status}</span>
              </div>
              <p>{contact.role}</p>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <button className="btn btn-primary" onClick={handleAddContact}>
            + Добавить контакт
          </button>
        </div>
      </aside>

      {/* Правая панель: Рабочая область */}
      <main className="main-content">
        {selectedContact ? (
          <>
            <div className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2 className="card-title">Профиль: {selectedContact.name}</h2>
                    <div>
                        <select 
                            value={selectedContact.status} 
                            onChange={(e) => handleStatusChange(selectedContact.id, e.target.value as Contact['status'])}
                            className="status-select"
                        >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Replied">Replied</option>
                            <option value="Archived">Archived</option>
                        </select>
                        <button onClick={() => handleDeleteContact(selectedContact.id)} className="delete-btn">
                            🗑️
                        </button>
                    </div>
                </div>
                <textarea
                    key={selectedContact.id} // Ключ для сброса значения при смене контакта
                    placeholder="Вставьте сюда полный текст со страницы LinkedIn..."
                    className="textarea"
                    style={{ height: '160px' }}
                    defaultValue={selectedContact.profileText || ''}
                />
                <button className="btn btn-primary" style={{ marginTop: '12px' }}>
                    Провести анализ (Этап 1)
                </button>
            </div>

            <div className="card">
                <h2 className="card-title">Сгенерированное сообщение</h2>
                <div className="message-box">
                    <p>Здесь появится результат анализа и первое сообщение...</p>
                </div>
            </div>
            
            <div className="card">
              <h2 className="card-title">Переписка</h2>
              {/* Тут будет история переписки */}
              <textarea
                placeholder="Вставьте сюда ответ клиента..."
                className="textarea"
                style={{ marginTop: '16px', height: '100px' }}
              />
              <button className="btn btn-secondary" style={{ marginTop: '12px' }}>
                Сгенерировать ответ
              </button>
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
        .status-select {
            background-color: #374151;
            color: #e5e7eb;
            border: 1px solid #4b5563;
            border-radius: 6px;
            padding: 4px 8px;
            margin-right: 12px;
        }
        .delete-btn {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 1.2rem;
        }
        .delete-btn:hover {
            color: #ef4444;
        }
      `}</style>
    </div>
  );
}
