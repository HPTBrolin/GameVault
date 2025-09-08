from alembic import op
import sqlalchemy as sa

revision = '0002_quality_constraints'
down_revision = '0001_baseline'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('game') as batch:
        batch.create_index('ix_game_slug', ['slug'], unique=False)
        batch.create_index('ix_game_barcode', ['barcode'], unique=False)
        # unique constraint for (slug, platform)
        batch.create_unique_constraint('uq_game_slug_platform', ['slug','platform'])

def downgrade():
    with op.batch_alter_table('game') as batch:
        batch.drop_constraint('uq_game_slug_platform', type_='unique')
        batch.drop_index('ix_game_barcode')
        batch.drop_index('ix_game_slug')
