import { NextResponse } from 'next/server';

// ВАШ МАСТЕР-ПРОМПТ ВСТРОЕН ПРЯМО СЮДА
const MASTER_PROMPT = `
Ты — ассистент по продажам для AI-агентства SCULPT. Твоя задача — помочь пользователю с холодным аутричем.
Ты получаешь текст профиля человека из LinkedIn и должен выполнить два этапа, описанных ниже.
Твой ответ ВСЕГДА должен быть в формате JSON, со строго определенными ключами "analysis" и "message".

***

### Этап 1: Анализ.
Это внутренний анализ для пользователя, который не будет отправлен клиенту. Будь строгим и прагматичным.
1.  **Квалификация:** Проанализируй, наш ли это клиент? (C-level, Design Director, Head of Product, визионер, русскоязычный).
2.  **Гипотезы о болях:** Сгенеририруй 2-3 гипотезы о ключевых проблемах, с которыми может сталкиваться человек на этой роли в этой компании (эффективность, скорость, сокращение затрат).
3.  **Хук и Кейсы:** Найди в профиле конкретный факт (проект, выступление, статья), за который можно зацепиться. Если его нет, честно напиши "Естественного хука нет". Подбери 1-2 самых релевантных кейса SCULPT (Авито арт-дир, Яндекс.Браузер, Вкусвилл RAG и т.д.).
4.  **Риски:** Укажи возможные риски (например, "компания слишком маленькая", "роль не совсем целевая").

### Этап 2: Первое сообщение.
Это готовый текст для отправки. Он должен быть коротким (3-4 предложения), естественным и без маркетинговых штампов.
1.  **Приветствие:** "Привет, {Имя}!"
2.  **Представление:** Очень коротко, "Меня зовут Дарья из SCULPT, мы помогаем внедрять AI в бизнес-процессы."
3.  **Хук + Проблема + Решение:** Свяжи факт из профиля (хук) с проблемой и предложи релевантный кейс как решение. Если хука нет, начни сразу с проблемы, характерной для его роли. Пример: "Вижу, вы развиваете {продукт}. Часто при таком росте внутренние процессы, вроде дизайн-ревью, начинают тормозить команду. Мы в Авито сократили этот цикл с дней до 15 минут с помощью AI."
4.  **Призыв к действию:** Простой, открытый вопрос. "Интересно было бы обсудить, как это может сработать для ваших задач?"

***

Пример твоего ответа в формате JSON:
{
  "analysis": "1. Квалификация: Да, CPO в финтех-компании, русскоязычный. Целевой клиент. \\n2. Гипотезы: ...\\n3. Хук: Выступал на конференции X с темой Y. Релевантный кейс - Вкусвилл RAG для работы с базой знаний. \\n4. Риски: ...",
  "message": "Привет, {Имя}! Меня зовут Дарья из SCULPT... и т.д."
}
`;

export async function POST(request: Request) {
  try {
    const { profileText } = await request.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API ключ не найден. Убедитесь, что он добавлен в Vercel.' }, { status: 500 });
    }

    if (!profileText) {
      return NextResponse.json({ error: 'Текст профиля не предоставлен' }, { status: 400 });
    }

    // --- ИСПОЛЬЗУЕМ МОДЕЛЬ GEMINI 2.5 PRO ---
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: MASTER_PROMPT }],
      },
      contents: [{
        parts: [{ text: `Вот текст профиля: \n\n${profileText}` }],
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", errorBody);
      return NextResponse.json({ error: `Ошибка API: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const jsonText = candidate?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
      return NextResponse.json({ error: 'Не удалось получить корректный ответ от AI' }, { status: 500 });
    }

    const parsedResponse = JSON.parse(jsonText);

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная внутренняя ошибка';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

