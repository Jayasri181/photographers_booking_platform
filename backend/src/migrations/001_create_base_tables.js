import { Sequelize, DataTypes } from 'sequelize';

export async function up(queryInterface) {
  // Create translations table
  await queryInterface.createTable('translations', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    language_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    namespace: {
      type: DataTypes.STRING,
      allowNull: false
    },
    translations: {
      type: DataTypes.JSONB,
      allowNull: false
    },
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

  // Create cultural_events table
  await queryInterface.createTable('cultural_events', {
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
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    cultural_significance: {
      type: DataTypes.TEXT
    },
    photography_opportunities: {
      type: DataTypes.JSONB
    },
    translations: {
      type: DataTypes.JSONB
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });

  // Create photography_packages table
  await queryInterface.createTable('photography_packages', {
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER // in minutes
    },
    features: {
      type: DataTypes.JSONB
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    location: {
      type: DataTypes.JSONB
    },
    cultural_event_id: {
      type: DataTypes.UUID,
      references: {
        model: 'cultural_events',
        key: 'id'
      }
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });

  // Create package_translations table
  await queryInterface.createTable('package_translations', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    package_id: {
      type: DataTypes.UUID,
      references: {
        model: 'photography_packages',
        key: 'id'
      }
    },
    language_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    name: {
      type: DataTypes.JSONB
    },
    description: {
      type: DataTypes.JSONB
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('package_translations');
  await queryInterface.dropTable('photography_packages');
  await queryInterface.dropTable('cultural_events');
  await queryInterface.dropTable('translations');
}
