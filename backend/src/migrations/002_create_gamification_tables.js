import { Sequelize, DataTypes } from 'sequelize';

export async function up(queryInterface) {
  // Create user_points table
  await queryInterface.createTable('user_points', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Create achievements table
  await queryInterface.createTable('achievements', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    points_reward: {
      type: DataTypes.INTEGER
    },
    icon_url: {
      type: DataTypes.STRING
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });

  // Create user_achievements table
  await queryInterface.createTable('user_achievements', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    achievement_id: {
      type: DataTypes.UUID,
      references: {
        model: 'achievements',
        key: 'id'
      }
    },
    awarded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Create photo_contests table
  await queryInterface.createTable('photo_contests', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    categories: {
      type: DataTypes.JSONB
    },
    prizes: {
      type: DataTypes.JSONB
    },
    rules: {
      type: DataTypes.JSONB
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'completed', 'cancelled'),
      defaultValue: 'draft'
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });

  // Create contest_entries table
  await queryInterface.createTable('contest_entries', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contest_id: {
      type: DataTypes.UUID,
      references: {
        model: 'photo_contests',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    submission_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('contest_entries');
  await queryInterface.dropTable('photo_contests');
  await queryInterface.dropTable('user_achievements');
  await queryInterface.dropTable('achievements');
  await queryInterface.dropTable('user_points');
}
