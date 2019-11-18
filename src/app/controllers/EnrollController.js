import * as Yup from 'yup';
import { isBefore, parseISO, addMonths } from 'date-fns';
import Enrollments from '../models/Enrollments';
import Students from '../models/Students';
import Plans from '../models/Plans';

import NewEnrollment from '../jobs/NewEnrollment';
import Queue from '../../lib/Queue';

class EnrollController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollments.findAll({
      order: ['start_date'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(enrollments);
  }

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

    const student = await Students.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    const planChoosed = await Plans.findByPk(plan_id);

    if (!planChoosed) {
      return res.status(400).json({ error: 'Plan does not exists.' });
    }

    const enrollExists = await Enrollments.findOne({ where: { student_id } });

    if (enrollExists) {
      return res.status(400).json({ error: 'Student have alredy enroled.' });
    }

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const { price, duration } = planChoosed;

    const totalPrice = price * duration;

    const endDate = addMonths(parseISO(start_date), duration);

    const enrollment = await Enrollments.create({
      student_id,
      plan_id,
      start_date,
      price: totalPrice,
      end_date: endDate,
    });

    await Queue.add(NewEnrollment.key, {
      student,
      planChoosed,
      start_date,
      endDate,
      totalPrice,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      enrollment_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { enrollment_id, plan_id, start_date } = req.body;

    const enrollments = await Enrollments.findByPk(enrollment_id);

    if (!enrollments) {
      return res.status(400).json({ error: 'Enrollment not found.' });
    }

    const planExists = await Enrollments.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plan not found.' });
    }

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const enrollmentsUpdate = await enrollments.update(req.body);

    return res.json(enrollmentsUpdate);
  }

  async destroy(req, res) {
    const enrollment = await Enrollments.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(401).json({
        error: 'Enrollment does not exists.',
      });
    }

    await Enrollments.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json();
  }
}

export default new EnrollController();
