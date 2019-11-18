import * as Yup from 'yup';
import HelpOrder from '../schemas/HelpOrder';
import Student from '../models/Students';

import HelpRequestAnswered from '../jobs/HelpRequestAnswered';
import Queue from '../../lib/Queue';

class AnswerOrderController {
  async index(req, res) {
    const helpOrder = await HelpOrder.find({ answer: null });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { _id } = req.params;

    const helpOrder = await HelpOrder.findById({
      _id,
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order does not exists.' });
    }

    const student = await Student.findOne({
      where: { id: helpOrder.student_id },
    });

    const { answer } = req.body;

    helpOrder.answer = answer;
    helpOrder.answer_at = new Date();
    await helpOrder.save();

    await Queue.add(HelpRequestAnswered.key, {
      helpOrder,
      student,
    });

    return res.json(helpOrder);
  }
}

export default new AnswerOrderController();
