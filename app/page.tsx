// app/page.tsx
export default function HomePage() {
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
          />
        </div>
        <div className="contact-list">
          {/* Пример контакта */}
          <div className="contact-item active">
            <div className="contact-info">
              <h3>Илья Вернер</h3>
              <span className="status replied">Replied</span>
            </div>
            <p>Co-founder at SCULPT AI</p>
          </div>
          {/* Другие контакты */}
          <div className="contact-item">
            <div className="contact-info">
              <h3>Евгений Смирнов</h3>
              <span className="status contacted">Contacted</span>
            </div>
            <p>Head of Product at Awesome Inc.</p>
          </div>
          <div className="contact-item">
            <div className="contact-info">
              <h3>Дарья Камышина</h3>
              <span className="status new">New</span>
            </div>
            <p>Lead PM at Tech Innovations</p>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="btn btn-primary">+ Добавить контакт</button>
        </div>
      </aside>

      {/* Правая панель: Рабочая область */}
      <main className="main-content">
          <div className="card">
            <h2 className="card-title">1. Вставьте профиль для анализа</h2>
            <textarea
              placeholder="Вставьте сюда полный текст со страницы LinkedIn..."
              className="textarea"
              style={{ height: '160px' }}
            />
            <button className="btn btn-primary" style={{ marginTop: '12px' }}>
              Провести анализ (Этап 1)
            </button>
          </div>

          <div className="card">
            <h2 className="card-title">2. Сгенерированное сообщение</h2>
            <div className="message-box">
              <p>Привет, Илья!</p>
              <p>Меня зовут Дарья, и у меня с коллегами небольшое агентство SCULPT — мы помогаем компаниям внедрять AI.</p>
              <p>Вижу, вы развиваете SCULPT. Создавая такие продукты, вы наверняка знаете, сколько ресурсов съедают неоптимизированные внутренние процессы.</p>
              <p>Мы как раз помогаем командам внедрять AI в такие процессы — например, в Авито сократили цикл дизайн-ревью с дней до 15 минут.</p>
              <p>Не хочешь созвониться на 40 минут, чтобы обсудить, как это может сработать для ваших задач?</p>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">3. Переписка</h2>
            <div className="chat-bubble">
              <p>Да, Дарья, звучит интересно. Расскажите подробнее про кейс с Авито.</p>
            </div>
            <textarea
              placeholder="Вставьте сюда ответ клиента или напишите свой вопрос для генерации продолжения..."
              className="textarea"
              style={{ marginTop: '16px', height: '100px' }}
            />
            <button className="btn btn-secondary" style={{ marginTop: '12px' }}>
              Сгенерировать ответ
            </button>
          </div>
      </main>
    </div>
  );
}
