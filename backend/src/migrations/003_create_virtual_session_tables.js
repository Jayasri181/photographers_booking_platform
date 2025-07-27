import { Sequelize, DataTypes } from 'sequelize';

export async function up(queryInterface) {
  // Create virtual_sessions table
  await queryInterface.createTable('virtual_sessions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    photographer_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    client_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    session_type: {
      type: DataTypes.STRING
    },
    virtual_background_urls: {
      type: DataTypes.JSONB
    },
    current_background: {
      type: DataTypes.STRING
    },
    props_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'active', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    started_at: DataTypes.DATE,
    ended_at: DataTypes.DATE,
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Create virtual_poses table
  await queryInterface.createTable('virtual_poses', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.UUID,
      references: {
        model: 'virtual_sessions',
        key: 'id'
      }
    },
    pose_data: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Create virtual_photos table
  await queryInterface.createTable('virtual_photos', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.UUID,
      references: {
        model: 'virtual_sessions',
        key: 'id'
      }
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pose_data: {
      type: DataTypes.JSONB
    },
    background_url: {
      type: DataTypes.STRING
    },
    props_used: {
      type: DataTypes.JSONB
    },
    captured_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Create session_chat_messages table
  await queryInterface.createTable('session_chat_messages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.UUID,
      references: {
        model: 'virtual_sessions',
        key: 'id'
      }
    },
    sender_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('text', 'pose', 'background', 'prop'),
      defaultValue: 'text'
    },
    metadata: {
      type: DataTypes.JSONB
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('session_chat_messages');
  await queryInterface.dropTable('virtual_photos');
  await queryInterface.dropTable('virtual_poses');
  await queryInterface.dropTable('virtual_sessions');
}
