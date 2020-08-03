'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    role_id: DataTypes.UUID,
    deleted_at: DataTypes.DATE
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  User.associate = function (models) {
    User.belongsTo(models.role, { foreignKey: 'role_id' });
  };
  return User;
};