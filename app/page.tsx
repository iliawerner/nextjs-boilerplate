// app/page.tsx
export default function HomePage() {
  return (
    <>
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
                style={{ marginTop: '16px' }}
              />
              <button className="btn btn-secondary" style={{ marginTop: '12px' }}>
                Сгенерировать ответ
              </button>
            </div>
        </main>
      </div>

      {/* Стили для компонента. Просто скопируйте это как есть. */}
      <style jsx global>{`
        .container { display: flex; height: 100vh; background-color: #111827; color: #e5e7eb; }
        .sidebar { width: 33.33%; min-width: 300px; max-width: 400px; background-color: #1f2937; border-right: 1px solid #374151; display: flex; flex-direction: column; }
        .main-content { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; }

        .sidebar-header { padding: 16px; border-bottom: 1px solid #374151; }
        .title { font-size: 1.25rem; font-weight: bold; margin: 0; }
        .search-input { width: 100%; margin-top: 12px; padding: 8px; background-color: #374151; border-radius: 6px; border: 1px solid #4b5563; color: #e5e7eb; }
        .search-input:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; }

        .contact-list { flex: 1; overflow-y: auto; }
        .contact-item { padding: 16px; border-bottom: 1px solid #374151; cursor: pointer; }
        .contact-item:hover { background-color: #374151; }
        .contact-item.active { background-color: rgba(59, 130, 246, 0.2); }
        .contact-item h3 { margin: 0; font-weight: 600; }
        .contact-item p { margin: 4px 0 0; font-size: 0.875rem; color: #9ca3af; }
        .contact-info { display: flex; justify-content: space-between; align-items: center; }

        .status { font-size: 0.75rem; font-weight: 500; padding: 2px 8px; border-radius: 9999px; }
        .status.replied { background-color: #22c55e; color: #ffffff; }
        .status.contacted { background-color: #eab308; color: #000000; }
        .status.new { background-color: #6b7280; color: #ffffff; }

        .sidebar-footer { padding: 16px; border-top: 1px solid #374151; }

        .btn { width: 100%; font-weight: bold; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
        .btn-primary { background-color: #2563eb; color: white; }
        .btn-primary:hover { background-color: #1d4ed8; }
        .btn-secondary { background-color: #16a34a; color: white; }
        .btn-secondary:hover { background-color: #15803d; }

        .card { background-color: #1f2937; border-radius: 8px; padding: 24px; }
        .card-title { font-size: 1.125rem; font-weight: bold; color: #60a5fa; margin: 0 0 8px 0; }

        .textarea { width: 100%; height: 120px; padding: 12px; background-color: #111827; border-radius: 6px; border: 1px solid #374151; color: #e5e7eb; }
        .textarea:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; }

        .message-box { background-color: #111827; padding: 16px; border-radius: 6px; border: 1px solid #374151; }
        .message-box p { margin: 8px 0; }

        .chat-bubble { background-color: #374151; padding: 12px; border-radius: 8px; max-width: 80%; }
        .chat-bubble p { margin: 0; font-size: 0.875rem; }
      `}</style>
    </>
  );
}
