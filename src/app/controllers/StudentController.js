import * as Yup from 'yup';
import Student from '../models/Students';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, height, weight, age } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      height,
      weight,
      age,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldEmail: Yup.string()
        .email()
        .required(),
      email: Yup.string().email(),
      height: Yup.number().positive(),
      weight: Yup.number().positive(),
      age: Yup.number()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const student = await Student.findOne({
      where: { email: req.body.oldEmail },
    });
    if (!student) {
      return res.status(401).json({ error: 'Student not found.' });
    }

    const { id, name, email, height, weight, age } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      height,
      weight,
      age,
    });
  }
}

export default new StudentController();
