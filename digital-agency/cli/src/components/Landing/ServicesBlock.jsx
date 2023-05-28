import React from 'react';

function ServicesBlock({ title, icon, description }) {
    return (
        <div className="max-w-[1240px] mx-auto flex flex-col justify-center h-full sm:flex-row gap-4">
            <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full sm:w-1/3">
                <h3 className="text-xl font-semibold mb-4">Разработка</h3>
                <p className="text-gray-700">
                    Наша веб-студия предоставляет услуги по разработке веб-приложений с использованием современных технологий и фреймворков. Мы создаем пользовательские веб-сайты и приложения, которые отвечают потребностям наших клиентов.
                </p>
            </div>
            <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full sm:w-1/3">
                <h3 className="text-xl font-semibold mb-4">Поддержка</h3>
                <p className="text-gray-700">
                    Мы предлагаем полную поддержку веб-приложений, включая исправление ошибок, обновление функциональности и оптимизацию производительности. Наша команда готова помочь вам в любое время и обеспечить стабильную работу вашего веб-приложения.
                </p>
            </div>
            <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-full sm:w-1/3">
                <h3 className="text-xl font-semibold mb-4">Консалтинг</h3>
                <p className="text-gray-700">
                    Наша веб-студия предоставляет консультации по вопросам веб-разработки и создания эффективных веб-приложений. Мы поможем вам определить стратегию разработки, выбрать подходящие технологии и решения, а также проконсультируем вас по текущим тенденциям веб-разработки.
                </p>
            </div>
        </div>
    );
}

export default ServicesBlock;