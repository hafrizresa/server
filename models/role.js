'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    data: DataTypes.JSONB,
    deleted_at: DataTypes.DATE
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  Role.associate = function (models) {
    Role.hasMany(models.user);
  };
  return Role;
};