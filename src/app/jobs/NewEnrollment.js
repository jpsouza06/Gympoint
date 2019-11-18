import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewEnrollment {
  get key() {
    return 'NewEnrollment';
  }

  async handle({ data }) {
    const { student, planChoosed, start_date, endDate, totalPrice } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula criada',
      template: 'newEnrollment',
      context: {
        student: student.name,
        plan: planChoosed.title,
        start_date: format(
          parseISO(start_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(parseISO(endDate), "'dia' dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        monthPrice: planChoosed.price,
        totalPrice,
      },
    });
  }
}

export default new NewEnrollment();
