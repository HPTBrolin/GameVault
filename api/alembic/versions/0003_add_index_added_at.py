from alembic import op
import sqlalchemy as sa

revision = '0003_add_index_added_at'
down_revision = '0002_quality_constraints'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('game') as b:
        b.create_index('ix_game_added_at', ['added_at'], unique=False)

def downgrade():
    with op.batch_alter_table('game') as b:
        b.drop_index('ix_game_added_at')
