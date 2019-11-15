import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlanController {
  async index(req, res) {
    const plans = await Plans.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['duration'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .integer()
        .positive(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const planExists = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const { id, title, duration, price } = await Plans.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const plans = await Plans.findByPk(req.params.id);

    if (!(plans.title === req.body.title)) {
      const plansExists = await Plans.findOne({
        where: { title: req.body.title },
      });

      if (plansExists) {
        return res.status(400).json({ error: 'Plan already exists.' });
      }
    }

    const { title, duration, price } = await plans.update(req.body);

    return res.json({ title, duration, price });
  }

  async destroy(req, res) {
    const plans = await Plans.findByPk(req.params.id);

    if (!plans) {
      return res.status(401).json({ error: 'Plan does not exists.' });
    }

    await plans.destroy();

    return res.json();
  }
}

export default new PlanController();
