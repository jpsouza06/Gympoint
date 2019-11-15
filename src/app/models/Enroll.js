import Sequelize, { Model } from 'sequelize';

class Enroll extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.REAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'students',
    });
    this.belongsTo(models.Plans, { foreignKey: 'plan_id', as: 'plans' });

    return this;
  }
}

export default Enroll;
