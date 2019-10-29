import Sequelize, { Model } from 'sequelize';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        height: Sequelize.DOUBLE,
        weight: Sequelize.DOUBLE,
        age: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
  }
}

export default Students;
