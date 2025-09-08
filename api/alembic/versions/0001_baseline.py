from alembic import op
import sqlalchemy as sa

revision = '0001_baseline'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('game', schema=None) as batch_op:
        pass  # created by SQLModel on first run if not exists

    with op.batch_alter_table('appsetting', schema=None) as batch_op:
        pass

def downgrade():
    pass
