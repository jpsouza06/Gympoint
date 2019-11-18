import Mail from '../../lib/Mail';

class HelpRequestAnswered {
  get key() {
    return 'HelpRequestAnswered';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pedido de auxílio respondido',
      template: 'helpRequestAnswered',
      context: {
        student_name: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpRequestAnswered();
