import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const interestsList = [
  "Технологии", "Искусственный интеллект", "Нейросети", "ИИ-инструменты",
  "Data Science", "Машинное обучение", "Кибербезопасность", "Web",
  "Frontend", "Backend", "Fullstack", "UX/UI дизайн", "Мобильные приложения",
  "Геймдев", "AR/VR", "3D-графика", "DevOps", "Linux", "GitHub", "Open Source",
  "Автоматизация", "Системное администрирование", "Олимпиадное программирование",
  "Алгоритмы", "Базы данных", "Облачные технологии", "Криптовалюта", "Блокчейн",
  "Фреймворки", "API", "Архитектура ПО", "Тестирование", "Low-code / No-code",
  "Продакт-менеджмент", "Стартапы", "IoT", "Робототехника", "Математика",
  "Аналитика данных", "Компьютерное зрение", "Квантовые вычисления",
  "Образование и курсы", "Хакатоны", "IT-сообщества", "Фриланс", "Карьера в IT", "Другое"
];

const borderColors = [
  "#ff5f5f", "#ffae42", "#ffea00", "#7ed957", "#5ce1e6",
  "#38b6ff", "#5b5bff", "#b15fff", "#ff66c4", "#ff914d"
];

const Moda = ({ onClose }) => {
  const [page, setPage] = useState(1);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const scrollRef = useRef(null);

  // ✅ Проверяем, показывать ли модалку
  const [shouldShow, setShouldShow] = useState(() => {
    return !localStorage.getItem("atomglideBetaAccepted");
  });

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setIsScrolledToBottom(isBottom);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && page === 1) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [page]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else if (prev.length < 5) {
        return [...prev, interest];
      } else {
        return prev;
      }
    });
  };

  const handleFinish = () => {
    // ✅ сохраняем отметку, что пользователь уже прошёл модалку
    localStorage.setItem("atomglideBetaAccepted", "true");

    // можно сохранить дополнительные данные, если нужно
    localStorage.setItem(
      "atomglideUserData",
      JSON.stringify({ birthDate, email, interests: selectedInterests })
    );

    // вызываем закрытие модалки
    onClose?.();
    setShouldShow(false);
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.96, y: -10, transition: { duration: 0.25, ease: "easeIn" } },
  };

  // ✅ если модалку не нужно показывать — ничего не рендерим
  if (!shouldShow) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <AnimatePresence mode="wait">
          {page === 1 && (
            <motion.div key="page1" {...pageVariants}>
              <center><img src="1.png" className="log-mod" alt="logo" /></center>
              <h2 className="title-mod">AtomGlide 12 Beta 1</h2>
              <div className="win-mod" ref={scrollRef}>
             <p className="win-mod-text"> <strong>СОГЛАШЕНИЕ О БЕТА-ТЕСТИРОВАНИИ ПРОДУКТА ATOMGLIDE 12</strong><br /><br /> Настоящий документ регулирует условия участия пользователей в закрытом бета-тестировании программного обеспечения <strong>AtomGlide 12</strong> (далее — «Продукт»). Участвуя в тестировании, вы подтверждаете, что ознакомлены, понимаете и принимаете условия данного соглашения.<br /><br /> <strong>1. ЦЕЛЬ ТЕСТИРОВАНИЯ</strong><br /> 1.1. Основной целью бета-тестирования является проведение предварительной оценки работоспособности, стабильности и производительности Продукта.<br /> 1.2. В рамках тестирования проводится проверка:<br /> — корректной работы системы чатов и обмена сообщениями;<br /> — устойчивости сокет-подключений и сетевых взаимодействий;<br /> — стабильности пользовательского интерфейса и взаимодействия с серверами;<br /> — общей отзывчивости, скорости загрузки и обработки данных.<br /><br /> <strong>2. СТАТУС ВЕРСИИ</strong><br /> 2.1. Бета-версия AtomGlide 12 не является финальным продуктом.<br /> 2.2. Продукт может содержать ошибки, недоработки, сбои и ограничения функциональности.<br /> 2.3. Разработчик не несёт ответственности за возможные сбои, потерю данных, некорректную работу функций или невозможность доступа к системе.<br /><br /> <strong>3. КОНФИДЕНЦИАЛЬНОСТЬ</strong><br /> 3.1. Вся информация, связанная с бета-версией AtomGlide 12, включая интерфейс, функциональные элементы, внутренние механизмы, логи, отчёты об ошибках, а также технические и визуальные особенности, является <strong>конфиденциальной</strong>.<br /> 3.2. Участник обязуется не разглашать, не копировать, не публиковать и не передавать третьим лицам любую информацию, полученную в ходе тестирования.<br /> 3.3. Любое распространение материалов бета-теста (видео, скриншоты, описания, коды, документация и т.п.) без письменного согласия разработчиков AtomGlide строго запрещено.<br /><br /> <strong>4. ОБЯЗАННОСТИ УЧАСТНИКА</strong><br /> 4.1. Участник обязуется использовать Продукт исключительно в целях тестирования.<br /> 4.2. Участник должен предоставлять корректную и объективную обратную связь о работе системы, возникающих ошибках и нестабильности.<br /> 4.3. Участнику запрещено:<br /> — использовать Продукт для коммерческих, публичных или иных целей, не связанных с тестированием;<br /> — осуществлять модификацию, декомпиляцию или реверс-инжиниринг Продукта;<br /> — передавать доступ к Продукту третьим лицам;<br /> — использовать уязвимости, намеренно вызывать сбои или иные действия, наносящие вред системе.<br /><br /> <strong>5. СБОР И ИСПОЛЬЗОВАНИЕ ДАННЫХ</strong><br /> 5.1. В процессе тестирования система может автоматически собирать технические данные: тип устройства, версия ОС, сетевые параметры, время отклика, сведения о сбоях и т.д.<br /> 5.2. Эти данные используются исключительно в аналитических целях для улучшения стабильности и функциональности Продукта.<br /> 5.3. Персональные данные участников (если предоставлены) обрабатываются в соответствии с политикой конфиденциальности AtomGlide.<br /><br /> <strong>6. ОТВЕТСТВЕННОСТЬ</strong><br /> 6.1. Продукт предоставляется на условиях «как есть» («as is»), без каких-либо гарантий.<br /> 6.2. Разработчик не несёт ответственности за любые прямые или косвенные убытки, возникшие в результате использования бета-версии.<br /> 6.3. Используя Продукт, участник соглашается с возможностью возникновения ошибок, непредвиденного поведения или потери данных.<br /><br /> <strong>7. ЗАВЕРШЕНИЕ ТЕСТИРОВАНИЯ</strong><br /> 7.1. Разработчик имеет право прекратить доступ к бета-версии в любой момент без предварительного уведомления.<br /> 7.2. После завершения тестирования все данные и материалы, связанные с Продуктом, подлежат удалению участником.<br /><br /> <strong>8. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</strong><br /> 8.1. Участие в бета-тестировании является добровольным и может быть прекращено по желанию пользователя в любой момент.<br /> 8.2. Продолжая использование Продукта после прочтения данного текста, вы подтверждаете своё согласие со всеми вышеуказанными условиями.<br /><br /> Пролистайте текст до конца, чтобы подтвердить ознакомление и перейти к следующему этапу. </p>
              </div>
              <center>
                <button
                  onClick={() => setPage(2)}
                  className="bth-mod"
                  disabled={!isScrolledToBottom}
                >
                  Продолжить
                </button>
                {!isScrolledToBottom && (
                  <p className="scroll-hint">Дочитайте до конца, чтобы продолжить</p>
                )}
              </center>
            </motion.div>
          )}

          {page === 2 && (
            <motion.div key="page2" {...pageVariants}>
              <h2 className="title-mod">Введите дату рождения 🎂</h2>
              <p style={{ textAlign: "center", color: "#bbb", marginBottom: "15px" }}>
                Это поможет нам подбирать контент, подходящий вашему возрасту.
              </p>
              <center>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="input-mod"
                  style={{
                    borderRadius: "10px",
                    padding: "8px",
                    background: "#2a2a2a",
                    color: "white",
                    border: "1px solid #555",
                  }}
                />
                <br />
                <button
                  onClick={() => setPage(3)}
                  className="bth-mod"
                  disabled={!birthDate}
                >
                  Далее
                </button>
              </center>
            </motion.div>
          )}

          {page === 3 && (
            <motion.div key="page3" {...pageVariants}>
              <h2 className="title-mod">Введите ваш Email 📧</h2>
              <p style={{ textAlign: "center", color: "#bbb", marginBottom: "15px" }}>
                Мы используем почту только для подтверждения и уведомлений о важных событиях.
              </p>
              <center>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-mod"
                  placeholder="you@example.com"
                  style={{
                    borderRadius: "10px",
                    padding: "8px",
                    background: "#2a2a2a",
                    color: "white",
                    border: "1px solid #555",
                  }}
                />
                <br />
                <button
                  onClick={() => setPage(4)}
                  className="bth-mod"
                  disabled={!email}
                >
                  Далее
                </button>
              </center>
            </motion.div>
          )}

          {page === 4 && (
            <motion.div key="page4" {...pageVariants}>
              <h2 className="title-mod">Выберите ваши интересы 🎯</h2>
              <p style={{ textAlign: "center", color: "#bbb", marginBottom: "15px", marginTop: "-20px" }}>
                Можно выбрать до 5 интересов.
              </p>

              <div
                className="bubble-container"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "8px",
                  maxHeight: "375px",
                  overflowY: "auto",
                  padding: "10px 6px",
                  width: "100%",
                  position: "relative",
                  boxShadow:
                    "inset 0 20px 20px -20px rgba(0, 0, 0, 0.6), inset 0 -20px 20px -20px rgba(0, 0, 0, 0.6)",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#555 transparent",
                }}
              >
                {interestsList.map((interest, index) => {
                  const isSelected = selectedInterests.includes(interest);
                  const color = borderColors[index % borderColors.length];
                  return (
                    <div
                      key={interest}
                      className="bubble"
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "50px",
                        border: `2px solid ${color}`,
                        cursor: "pointer",
                        background: isSelected ? color : "transparent",
                        color: isSelected ? "#000" : "#ddd",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                        userSelect: "none",
                      }}
                    >
                      {interest}
                    </div>
                  );
                })}
              </div>

              <center>
                <button onClick={handleFinish} className="bth-mod">
                  Завершить
                </button>
              </center>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Moda;
