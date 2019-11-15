import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Enroll from '../models/Enroll';
import Students from '../models/Students';
import Plans from '../models/Plans';

class EnrollController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const studentsExists = await Students.findByPk(student_id);

    if (!studentsExists) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    const planChoosed = await Plans.findByPk(plan_id);

    if (!planChoosed) {
      return res.status(400).json({ error: 'Plan does not exists.' });
    }

    const enrollExists = await Enroll.findOne({ where: { student_id } });

    if (enrollExists) {
      return res.status(400).json({ error: 'Student have alredy enroled.' });
    }

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    return res.json();
  }
}

export default new EnrollController();
