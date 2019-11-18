import * as Yup from 'yup';
import HelpOrder from '../schemas/HelpOrder';
import Student from '../models/Students';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student do not found' });
    }

    const helpOrder = await HelpOrder.find({
      student_id: id,
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { question } = req.body;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    const helpOrder = await HelpOrder.create({
      question,
      student_id: id,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
