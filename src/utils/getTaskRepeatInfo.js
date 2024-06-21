// utils/getTaskRepeatInfo.js

const getPluralForm = (number, forms) => {
  number = Math.abs(number) % 100;
  const num = number % 10;
  if (number > 10 && number < 20) return forms[2];
  if (num > 1 && num < 5) return forms[1];
  if (num === 1) return forms[0];
  return forms[2];
};

const getTaskRepeatInfo = (task) => {
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const formatDateWithoutYear = (datetime) => {
    const date = new Date(datetime);
    const options = {
      month: 'long', day: 'numeric'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const formatDateWithoutDay = (datetime) => {
    const date = new Date(datetime);
    const options = {
      hour: 'numeric', minute: 'numeric'
    };
    return date.toLocaleTimeString('ru-RU', options);
  };

  switch (task.deadline_type_id) {
    case 1:
      return '';
    case 2:
      return task.deadline_date ? `${formatDateTime(task.deadline_date)}` : '';
    case 3:
      return task.repeat_interval > 1
        ? `Каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['день', 'дня', 'дней'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}`
        : `Ежедневно в ${formatDateTime(task.deadline_date).split(' ')[1]}`;
    case 4:
      const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      const selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        .map((day, index) => task[day] ? daysOfWeek[index] : null)
        .filter(day => day !== null);
      return selectedDays.length > 0
        ? (task.repeat_interval > 1
          ? `${selectedDays.join(', ')} каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['неделю', 'недели', 'недель'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}`
          : `${selectedDays.join(', ')} в ${formatDateTime(task.deadline_date).split(' ')[1]}`)
        : '';
    case 5:
      return task.repeat_interval > 1
        ? `Каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['месяц', 'месяца', 'месяцев'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}`
        : `Каждый месяц ${formatDateWithoutYear(task.deadline_date)} в ${formatDateWithoutDay(task.deadline_date)}`;
    case 6:
      return task.repeat_interval > 1
        ? `Каждые ${task.repeat_interval} ${getPluralForm(task.repeat_interval, ['год', 'года', 'лет'])} в ${formatDateTime(task.deadline_date).split(' ')[1]}`
        : `Каждый год ${formatDateWithoutYear(task.deadline_date)} в ${formatDateTime(task.deadline_date).split(' ')[1]}`;
    default:
      return '';
  }
};

export default getTaskRepeatInfo;
